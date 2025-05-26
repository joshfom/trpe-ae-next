"use client";
import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            const resetErrorBoundary = () => {
                this.setState({ hasError: false, error: undefined });
            };

            if (this.props.FallbackComponent && this.state.error) {
                return <this.props.FallbackComponent 
                    error={this.state.error} 
                    resetErrorBoundary={resetErrorBoundary} 
                />;
            }

            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                        <h2 className="text-lg font-semibold text-red-800 mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-red-600 mb-4">
                            We apologize for the inconvenience. Please try refreshing the page.
                        </p>
                        <button
                            onClick={resetErrorBoundary}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
