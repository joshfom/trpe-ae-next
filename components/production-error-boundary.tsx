"use client";

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { errorMonitor } from '@/lib/error-monitor';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
  errorId: string;
}

/**
 * Enhanced Error Boundary for handling various production errors including:
 * - Server Action failures (Failed to find Server Action)
 * - Client Module resolution errors (clientModules undefined)
 * - React hydration mismatches
 * - Component rendering errors
 */
export class ProductionErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      retryCount: 0,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Check for specific error types
    const isServerActionError = error.message?.includes('Failed to find Server Action');
    const isClientModulesError = error.message?.includes('clientModules') || 
                                 error.message?.includes('Cannot read properties of undefined');
    const isHydrationError = error.message?.includes('hydration') || 
                            error.message?.includes('did not match');

    // Use our error monitor for comprehensive tracking
    if (isServerActionError) {
      const actionIdMatch = error.message.match(/Failed to find Server Action "([^"]+)"/);
      const actionId = actionIdMatch ? actionIdMatch[1] : 'unknown';
      errorMonitor.captureServerActionError(actionId, error);
    } else if (isClientModulesError) {
      errorMonitor.captureClientModulesError(error);
    } else {
      errorMonitor.captureError(error, {
        level: 'error',
        tags: {
          component: 'ErrorBoundary',
          errorType: isHydrationError ? 'hydration' : 'unknown'
        },
        extra: {
          componentStack: errorInfo.componentStack
        }
      });
    }

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;
    
    if (hasError && resetOnPropsChange && prevProps.resetKeys !== resetKeys) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
    
    this.setState({
      hasError: false,
      error: null,
      retryCount: 0,
      errorId: ''
    });
  };

  handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;
    
    // Limit retries to prevent infinite loops
    if (newRetryCount >= 3) {
      console.warn('Maximum retry attempts reached');
      return;
    }

    this.setState({ retryCount: newRetryCount });
    
    // Reset error boundary after a short delay
    this.resetTimeoutId = window.setTimeout(() => {
      this.resetErrorBoundary();
    }, 500);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI based on error type
      const error = this.state.error;
      const isServerActionError = error?.message?.includes('Failed to find Server Action');
      const isClientModulesError = error?.message?.includes('clientModules');

      if (isServerActionError) {
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-600 text-lg font-semibold mb-2">
              Server Action Error
            </div>
            <div className="text-red-700 text-sm mb-4 text-center max-w-md">
              There was an issue connecting to the server. This might be due to a recent deployment.
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={this.handleRetry}
                disabled={this.state.retryCount >= 3}
                variant="outline"
                size="sm"
              >
                {this.state.retryCount >= 3 ? 'Max Retries Reached' : `Retry (${this.state.retryCount}/3)`}
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="default"
                size="sm"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        );
      }

      if (isClientModulesError) {
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-600 text-lg font-semibold mb-2">
              Module Loading Error
            </div>
            <div className="text-yellow-700 text-sm mb-4 text-center max-w-md">
              There was an issue loading application modules. Please refresh the page.
            </div>
            <Button 
              onClick={() => window.location.reload()}
              variant="default"
              size="sm"
            >
              Refresh Page
            </Button>
          </div>
        );
      }

      // Generic error fallback
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-gray-600 text-lg font-semibold mb-2">
            Something went wrong
          </div>
          <div className="text-gray-700 text-sm mb-4 text-center max-w-md">
            An unexpected error occurred. Please try again.
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={this.handleRetry}
              disabled={this.state.retryCount >= 3}
              variant="outline"
              size="sm"
            >
              {this.state.retryCount >= 3 ? 'Max Retries Reached' : `Retry (${this.state.retryCount}/3)`}
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="default"
              size="sm"
            >
              Refresh Page
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-4 bg-gray-100 rounded text-xs max-w-lg">
              <summary className="cursor-pointer font-medium">Error Details (Development)</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {error?.message}
                {'\n\n'}
                {error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple wrapper component for easier usage
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  return (
    <ProductionErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ProductionErrorBoundary>
  );
}

export default ProductionErrorBoundary;
