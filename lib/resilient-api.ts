/**
 * Resilient API wrapper with retry logic and circuit breaker pattern
 * Helps handle temporary connection issues and provides fallback mechanisms
 */

import { captureApiConnectionError, captureTimeoutError } from "./error-monitor";

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryCondition?: (error: any) => boolean;
}

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'closed' | 'open' | 'half-open';
}

class ResilientApiClient {
  private circuitBreakers = new Map<string, CircuitBreakerState>();
  private readonly failureThreshold = 8; // Increase failure threshold
  private readonly recoveryTimeout = 60000; // 60 seconds recovery timeout

  /**
   * Execute an API call with retry logic and circuit breaker protection
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      baseDelay = 2000, // Increase base delay
      maxDelay = 20000, // Increase max delay
      backoffMultiplier = 2,
      retryCondition = this.defaultRetryCondition,
    } = options;

    // Check circuit breaker
    if (this.isCircuitOpen(operationName)) {
      const error = new Error(`Circuit breaker is open for operation: ${operationName}`);
      captureApiConnectionError(operationName, error, {
        circuitBreakerState: 'open',
        suggestion: 'Service is temporarily unavailable due to repeated failures',
      });
      throw error;
    }

    let lastError: any;
    let delay = baseDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        
        // Reset circuit breaker on success
        this.recordSuccess(operationName);
        
        return result;
      } catch (error) {
        lastError = error;
        
        // Record failure for circuit breaker
        this.recordFailure(operationName);
        
        // Check if we should retry
        if (attempt === maxRetries || !retryCondition(error)) {
          break;
        }

        // Log retry attempt
        console.warn(`Retrying ${operationName} (attempt ${attempt + 1}/${maxRetries + 1}) after ${delay}ms`, {
          error: error instanceof Error ? error.message : String(error),
          attempt: attempt + 1,
        });

        // Wait before retry with exponential backoff
        await this.sleep(delay);
        delay = Math.min(delay * backoffMultiplier, maxDelay);
      }
    }

    // All retries failed, capture error with context
    captureApiConnectionError(operationName, lastError, {
      maxRetries,
      finalAttempt: true,
      circuitBreakerFailures: this.circuitBreakers.get(operationName)?.failures || 0,
    });

    throw lastError;
  }

  /**
   * Execute with timeout protection
   */
  async executeWithTimeout<T>(
    operation: () => Promise<T>,
    operationName: string,
    timeoutMs: number = process.env.NODE_ENV === 'production' ? 30000 : 15000 // Dynamic timeout
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      captureTimeoutError(operationName, timeoutMs, {
        suggestion: 'Operation timed out. This might be due to network issues or server overload.',
      });
    }, timeoutMs);

    try {
      const result = await operation();
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Operation '${operationName}' timed out after ${timeoutMs}ms`);
      }
      throw error;
    }
  }

  /**
   * Execute with both retry and timeout protection
   */
  async executeResilient<T>(
    operation: () => Promise<T>,
    operationName: string,
    options: RetryOptions & { timeoutMs?: number } = {}
  ): Promise<T> {
    const { timeoutMs = process.env.NODE_ENV === 'production' ? 30000 : 15000, ...retryOptions } = options;
    
    return this.executeWithRetry(
      () => this.executeWithTimeout(operation, operationName, timeoutMs),
      operationName,
      retryOptions
    );
  }

  private defaultRetryCondition(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    const retryableErrorCodes = ['ECONNREFUSED', 'ENOTFOUND', 'ECONNRESET', 'ETIMEDOUT'];
    const retryableHttpCodes = [500, 502, 503, 504, 408, 429];
    
    // Check error codes
    if (error?.cause?.code && retryableErrorCodes.includes(error.cause.code)) {
      return true;
    }
    
    // Check HTTP status codes
    if (error?.status && retryableHttpCodes.includes(error.status)) {
      return true;
    }
    
    // Check error names
    if (error?.name === 'AbortError' || error?.name === 'TimeoutError') {
      return true;
    }
    
    return false;
  }

  private isCircuitOpen(operationName: string): boolean {
    const breaker = this.circuitBreakers.get(operationName);
    if (!breaker) return false;

    switch (breaker.state) {
      case 'open':
        // Check if recovery timeout has passed
        if (Date.now() - breaker.lastFailureTime > this.recoveryTimeout) {
          breaker.state = 'half-open';
          return false;
        }
        return true;
      case 'half-open':
        return false;
      case 'closed':
        return false;
      default:
        return false;
    }
  }

  private recordSuccess(operationName: string): void {
    const breaker = this.circuitBreakers.get(operationName);
    if (breaker) {
      breaker.failures = 0;
      breaker.state = 'closed';
    }
  }

  private recordFailure(operationName: string): void {
    const breaker = this.circuitBreakers.get(operationName) || {
      failures: 0,
      lastFailureTime: 0,
      state: 'closed' as const,
    };

    breaker.failures++;
    breaker.lastFailureTime = Date.now();

    if (breaker.failures >= this.failureThreshold) {
      breaker.state = 'open';
      console.warn(`Circuit breaker opened for ${operationName} after ${breaker.failures} failures`);
    }

    this.circuitBreakers.set(operationName, breaker);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get circuit breaker status for monitoring
   */
  getCircuitBreakerStatus(): Record<string, CircuitBreakerState> {
    return Object.fromEntries(this.circuitBreakers.entries());
  }

  /**
   * Reset circuit breaker for a specific operation
   */
  resetCircuitBreaker(operationName: string): void {
    this.circuitBreakers.delete(operationName);
  }

  /**
   * Reset all circuit breakers
   */
  resetAllCircuitBreakers(): void {
    this.circuitBreakers.clear();
  }
}

// Export singleton instance
export const resilientApi = new ResilientApiClient();

// Convenience function for common API calls
export const withResilience = <T>(
  operation: () => Promise<T>,
  operationName: string,
  options?: RetryOptions & { timeoutMs?: number }
): Promise<T> => {
  return resilientApi.executeResilient(operation, operationName, options);
};
