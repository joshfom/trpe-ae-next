import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { propertyTable } from '@/db/schema/property-table';
import LuxePropertyForm from '@/features/admin/luxe/properties/components';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EditLuxePropertyPageProps {
    params: Promise<{
        id: string;
    }>;
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

async function EditLuxePropertyPage({ params }: EditLuxePropertyPageProps) {
    // Await params before using its properties (Next.js 15 requirement)
    const { id } = await params;
    
    // Fetch the property
    const property = await db.query.propertyTable.findFirst({
        where: eq(propertyTable.id, id),
        with: {
            images: true,
            community: true,
            subCommunity: true,
            city: true,
            agent: true,
            developer: true,
            offeringType: true,
            type: true,
        },
    });

    if (!property || !property.isLuxe) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Edit Luxe Property</h1>
                    <p className="text-muted-foreground">
                        Update the luxury property details
                    </p>
                </div>
                
                <ErrorBoundary
                    FallbackComponent={({ error, resetErrorBoundary }) => (
                        <ImageManagementErrorFallback 
                            error={error} 
                            resetErrorBoundary={resetErrorBoundary}
                            propertyId={id}
                        />
                    )}
                    onError={(error, errorInfo) => {
                        console.error('Luxe Property Edit Error:', error, errorInfo);
                        // Could add error reporting service here
                    }}
                >
                    <LuxePropertyForm 
                        property={property} 
                    />
                </ErrorBoundary>
            </div>
        </div>
    );
}

export default EditLuxePropertyPage;
