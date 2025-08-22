/**
 * Health check utility to monitor API status and provide status information
 */

import { captureApiConnectionError } from "./error-monitor";

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  apiUrl: string;
  responseTime?: number;
  error?: string;
  checks: {
    api: boolean;
    database?: boolean;
  };
}

class HealthMonitor {
  private lastCheck?: HealthCheckResult;
  private checkInterval?: NodeJS.Timeout;
  private isChecking = false;

  /**
   * Perform a health check on the API
   */
  async checkHealth(): Promise<HealthCheckResult> {
    if (this.isChecking) {
      return this.lastCheck || this.createUnhealthyResult('Health check already in progress');
    }

    this.isChecking = true;
    const startTime = Date.now();
    const apiUrl = process.env.NEXT_PUBLIC_URL || '';

    try {
      // Simple ping to the API health endpoint
      const response = await fetch(`${apiUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Short timeout for health checks
        signal: AbortSignal.timeout(5000),
      });

      const responseTime = Date.now() - startTime;
      const isHealthy = response.ok;

      const result: HealthCheckResult = {
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        apiUrl,
        responseTime,
        checks: {
          api: isHealthy,
        },
      };

      if (!isHealthy) {
        result.error = `API returned ${response.status}: ${response.statusText}`;
      }

      this.lastCheck = result;
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      const result: HealthCheckResult = {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        apiUrl,
        responseTime,
        error: errorMessage,
        checks: {
          api: false,
        },
      };

      // Log unhealthy service
      captureApiConnectionError('health-check', error instanceof Error ? error : new Error(errorMessage), {
        responseTime,
        checkType: 'health-monitor',
      });

      this.lastCheck = result;
      return result;
    } finally {
      this.isChecking = false;
    }
  }

  /**
   * Start periodic health checks
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.checkInterval) {
      this.stopMonitoring();
    }

    // Perform initial check
    this.checkHealth().catch(error => {
      console.warn('Initial health check failed:', error);
    });

    // Set up periodic checks
    this.checkInterval = setInterval(() => {
      this.checkHealth().catch(error => {
        console.warn('Periodic health check failed:', error);
      });
    }, intervalMs);

    console.log(`Health monitoring started with ${intervalMs}ms interval`);
  }

  /**
   * Stop periodic health checks
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
      console.log('Health monitoring stopped');
    }
  }

  /**
   * Get the last health check result
   */
  getLastResult(): HealthCheckResult | undefined {
    return this.lastCheck;
  }

  /**
   * Check if API is currently healthy based on last check
   */
  isApiHealthy(): boolean {
    return this.lastCheck?.status === 'healthy';
  }

  /**
   * Get API status for display
   */
  getApiStatus(): string {
    if (!this.lastCheck) return 'Unknown';
    
    switch (this.lastCheck.status) {
      case 'healthy':
        return 'Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'unhealthy':
        return 'Service Unavailable';
      default:
        return 'Unknown';
    }
  }

  private createUnhealthyResult(error: string): HealthCheckResult {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      apiUrl: process.env.NEXT_PUBLIC_URL || '',
      error,
      checks: {
        api: false,
      },
    };
  }
}

// Export singleton instance
export const healthMonitor = new HealthMonitor();

// Convenience functions
export const checkApiHealth = () => healthMonitor.checkHealth();
export const isApiHealthy = () => healthMonitor.isApiHealthy();
export const getApiStatus = () => healthMonitor.getApiStatus();

// Auto-start monitoring in browser environment
if (typeof window !== 'undefined') {
  // Start monitoring after a delay to avoid impacting initial page load
  setTimeout(() => {
    healthMonitor.startMonitoring(60000); // Check every minute
  }, 5000);
}
