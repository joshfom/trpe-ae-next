"use client";

import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EditPropertyErrorBoundaryProps {
    children: React.ReactNode;
    propertyId: string;
}

// Specialized error fallback for image management operations
function ImageManagementErrorFallback({ 
    error, 
    resetErrorBoundary, 
    propertyId 
}: { 
    error: Error; 
    resetErrorBoundary: () => void;
    propertyId: string;
}) {
    const isImageError = error.message.includes('image') || 
                        error.message.includes('upload') || 
                        error.message.includes('EdgeStore') ||
                        error.message.includes('file');

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    {isImageError ? 'Image Management Error' : 'Property Edit Error'}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium mb-2">
                        {isImageError 
                            ? 'There was an issue with the image management system.'
                            : 'An error occurred while editing the property.'
                        }
                    </p>
                    <p className="text-red-600 text-sm mb-4">
                        {isImageError 
                            ? 'This could be due to network issues, file upload problems, or image processing errors.'
                            : 'Please try refreshing the page or contact support if the issue persists.'
                        }
                    </p>
                    <details className="text-xs text-red-500">
                        <summary className="cursor-pointer font-medium">Technical Details</summary>
                        <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                            {error.message}
                        </pre>
                    </details>
                </div>
                
                <div className="flex gap-3">
                    <Button 
                        onClick={resetErrorBoundary}
                        variant="default"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                    
                    <Button 
                        onClick={() => window.location.reload()}
                        variant="outline"
                    >
                        Refresh Page
                    </Button>
                    
                    <Button 
                        onClick={() => window.history.back()}
                        variant="outline"
                    >
                        Go Back
                    </Button>
                </div>
                
                {isImageError && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-blue-800 font-medium mb-2">Troubleshooting Tips:</h4>
                        <ul className="text-blue-700 text-sm space-y-1">
                            <li>• Check your internet connection</li>
                            <li>• Ensure images are under 10MB and in supported formats (JPG, PNG, WebP)</li>
                            <li>• Try uploading fewer images at once</li>
                            <li>• Clear your browser cache and try again</li>
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function EditPropertyErrorBoundary({ children, propertyId }: EditPropertyErrorBoundaryProps) {
    const FallbackComponent = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
        <ImageManagementErrorFallback 
            error={error} 
            resetErrorBoundary={resetErrorBoundary}
            propertyId={propertyId}
        />
    );

    return (
        <ErrorBoundary
            FallbackComponent={FallbackComponent}
        >
            {children}
        </ErrorBoundary>
    );
}

export default EditPropertyErrorBoundary;