/**
 * Simple error monitoring utility that can work with or without external services
 */

export interface ErrorDetails {
  message: string;
  stack?: string;
  componentStack?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

class ErrorMonitor {
  private static instance: ErrorMonitor;
  private isInitialized = false;
  private errors: ErrorDetails[] = [];
  private maxErrors = 50;

  private constructor() {}

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  initialize() {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    this.isInitialized = true;
    
    // Global error handler
    window.addEventListener('error', (event) => {
      // Skip if there's no meaningful error
      if (!event.error && !event.message) {
        return;
      }
      
      const error = event.error || new Error(event.message || 'Unknown error');
      
      // Skip empty or meaningless errors
      if (!error.message || error.message === '{}' || error.message === 'undefined') {
        return;
      }
      
      this.captureError(error, {
        level: 'error',
        tags: { source: 'global-error-handler' },
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      // Skip if there's no meaningful rejection reason
      if (!event.reason) {
        return;
      }
      
      let error: Error;
      if (event.reason instanceof Error) {
        error = event.reason;
      } else if (typeof event.reason === 'string' && event.reason.trim()) {
        error = new Error(event.reason);
      } else {
        error = new Error('Unhandled promise rejection');
      }
      
      // Skip empty or meaningless errors
      if (!error.message || error.message === '{}' || error.message === 'undefined') {
        return;
      }
      
      this.captureError(error, {
        level: 'error',
        tags: { source: 'unhandled-promise-rejection' }
      });
    });

    console.log('Error monitoring initialized');
  }

  captureError(error: Error, options: Partial<ErrorDetails> = {}) {
    // Prevent recursive loops by checking if this is our own error log
    if (error.message === 'Error captured: {}' || 
        error.message?.includes('Error captured:') ||
        error.stack?.includes('ErrorMonitor.captureError')) {
      return; // Don't capture our own logging errors
    }

    const errorDetails: ErrorDetails = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      level: options.level || 'error',
      tags: options.tags || {},
      extra: options.extra || {},
      ...options
    };

    // Add browser context if available
    if (typeof window !== 'undefined') {
      errorDetails.url = window.location.href;
      errorDetails.userAgent = window.navigator.userAgent;
    }

    // Store in memory
    this.errors.push(errorDetails);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Use a safe logging method that won't trigger Next.js error interception
    const originalConsoleError = console.error;
    try {
      // Temporarily disable console.error to prevent recursion
      console.error = () => {};
      
      // Log using a different method in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('🚨 Error Monitor:', {
          message: errorDetails.message,
          level: errorDetails.level,
          tags: errorDetails.tags
        });
      }
    } finally {
      // Restore original console.error
      console.error = originalConsoleError;
    }

    // Try to store in sessionStorage
    try {
      const stored = sessionStorage.getItem('error-monitor-logs');
      const existingErrors = stored ? JSON.parse(stored) : [];
      existingErrors.push(errorDetails);
      sessionStorage.setItem('error-monitor-logs', JSON.stringify(existingErrors.slice(-20)));
    } catch (e) {
      // Silently fail for sessionStorage issues
    }

    // Try to send to external service if available
    this.sendToExternalService(errorDetails);
  }

  private async sendToExternalService(error: ErrorDetails) {
    // Check if custom error endpoint is available
    if (process.env.NEXT_PUBLIC_ERROR_ENDPOINT) {
      try {
        await fetch(process.env.NEXT_PUBLIC_ERROR_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(error),
        });
      } catch (e) {
        console.warn('Failed to send to error endpoint:', e);
      }
    }
  }

  getErrors(): ErrorDetails[] {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    try {
      sessionStorage.removeItem('error-monitor-logs');
    } catch (e) {
      console.warn('Failed to clear sessionStorage:', e);
    }
  }

  // Helper method for Server Action errors
  captureServerActionError(actionId: string, error: Error) {
    this.captureError(error, {
      level: 'warning',
      tags: {
        type: 'server-action-error',
        actionId: actionId,
        recoverable: 'true'
      },
      extra: {
        suggestion: 'This might be due to a deployment mismatch. Try refreshing the page.'
      }
    });
  }

  // Helper method for clientModules errors
  captureClientModulesError(error: Error) {
    this.captureError(error, {
      level: 'error',
      tags: {
        type: 'client-modules-error',
        framework: 'nextjs'
      },
      extra: {
        suggestion: 'This is likely a Next.js internal issue. Consider refreshing the page.'
      }
    });
  }

  // Helper method for API connection errors
  captureApiConnectionError(endpoint: string, error: Error, context?: Record<string, any>) {
    this.captureError(error, {
      level: 'error',
      tags: {
        type: 'api-connection-error',
        endpoint: endpoint,
        error_code: (error as any)?.cause?.code || 'unknown',
      },
      extra: {
        endpoint,
        nodeEnv: process.env.NODE_ENV,
        apiUrl: process.env.NEXT_PUBLIC_URL,
        suggestion: 'Check if the API server is running and accessible',
        ...context,
      }
    });
  }

  // Helper method for timeout errors
  captureTimeoutError(operation: string, timeout: number, context?: Record<string, any>) {
    this.captureError(new Error(`Operation '${operation}' timed out after ${timeout}ms`), {
      level: 'warning',
      tags: {
        type: 'timeout-error',
        operation: operation,
      },
      extra: {
        timeout,
        suggestion: 'The operation took too long. This might be due to network issues or server load.',
        ...context,
      }
    });
  }
}

// Export singleton instance
export const errorMonitor = ErrorMonitor.getInstance();

// Initialize on client-side only and with a delay to prevent SSR issues
if (typeof window !== 'undefined') {
  // Use setTimeout to defer initialization until after React hydration
  setTimeout(() => {
    try {
      errorMonitor.initialize();
    } catch (e) {
      // Silently fail if initialization fails
      console.warn('Error monitor initialization failed:', e);
    }
  }, 1000);
}

// Export convenience functions
export const captureError = (error: Error, options?: Partial<ErrorDetails>) => {
  errorMonitor.captureError(error, options);
};

export const captureServerActionError = (actionId: string, error: Error) => {
  errorMonitor.captureServerActionError(actionId, error);
};

export const captureClientModulesError = (error: Error) => {
  errorMonitor.captureClientModulesError(error);
};

export const captureApiConnectionError = (endpoint: string, error: Error, context?: Record<string, any>) => {
  errorMonitor.captureApiConnectionError(endpoint, error, context);
};

export const captureTimeoutError = (operation: string, timeout: number, context?: Record<string, any>) => {
  errorMonitor.captureTimeoutError(operation, timeout, context);
};
