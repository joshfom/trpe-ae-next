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
      this.captureError(event.error || new Error(event.message), {
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
      this.captureError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          level: 'error',
          tags: { source: 'unhandled-promise-rejection' }
        }
      );
    });

    console.log('Error monitoring initialized');
  }

  captureError(error: Error, options: Partial<ErrorDetails> = {}) {
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

    // Log to console
    console.error('Error captured:', errorDetails);

    // Try to store in sessionStorage
    try {
      const stored = sessionStorage.getItem('error-monitor-logs');
      const existingErrors = stored ? JSON.parse(stored) : [];
      existingErrors.push(errorDetails);
      sessionStorage.setItem('error-monitor-logs', JSON.stringify(existingErrors.slice(-20)));
    } catch (e) {
      console.warn('Failed to store error in sessionStorage:', e);
    }

    // Try to send to external service if available
    this.sendToExternalService(errorDetails);
  }

  private async sendToExternalService(error: ErrorDetails) {
    // Check if Sentry is available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      try {
        (window as any).Sentry.captureException(new Error(error.message), {
          tags: error.tags,
          extra: error.extra,
          level: error.level
        });
        return;
      } catch (e) {
        console.warn('Failed to send to Sentry:', e);
      }
    }

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
}

// Export singleton instance
export const errorMonitor = ErrorMonitor.getInstance();

// Initialize on client-side
if (typeof window !== 'undefined') {
  errorMonitor.initialize();
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
