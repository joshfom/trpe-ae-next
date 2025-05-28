"use client";

import React, { Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PropertyType } from '@/types/property';

// Optimized loading component for Suspense boundary
function ListingsLoading() {
    return (
        <div className='pb-8'>
            <div className={'max-w-7xl lg:px-0 mx-auto grid px-4 pb-6 lg:pb-12'}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-300 aspect-4/3 rounded-lg mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Enhanced error component with retry functionality
function ListingsError({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <h2 className="text-lg font-semibold text-red-800 mb-2">
                    Unable to load properties
                </h2>
                <p className="text-red-600 mb-4">
                    We're having trouble loading the property listings. Please try again.
                </p>
                <div className="space-y-2">
                    <button
                        onClick={resetErrorBoundary}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-4 text-left">
                        <summary className="cursor-pointer text-sm text-red-700">
                            Error Details (Development)
                        </summary>
                        <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                            {error.message}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}

interface ListingsWrapperProps {
    children: React.ReactNode;
}

export default function ListingsWrapper({ children }: ListingsWrapperProps) {
    return (
        <ErrorBoundary
            FallbackComponent={({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
                <ListingsError error={error} resetErrorBoundary={resetErrorBoundary} />
            )}
            onError={(error: Error, errorInfo: React.ErrorInfo) => {
                console.error('Listings error:', error, errorInfo);
            }}
        >
            <Suspense fallback={<ListingsLoading />}>
                {children}
            </Suspense>
        </ErrorBoundary>
    );
}
