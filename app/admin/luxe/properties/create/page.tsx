import React from 'react';
import LuxePropertyForm from '@/features/admin/luxe/properties/components';

function CreateLuxePropertyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Create Luxe Property</h1>
                    <p className="text-muted-foreground">
                        Add a new luxury property to the portfolio
                    </p>
                </div>
                
                <LuxePropertyForm />
            </div>
        </div>
    );
}

export default CreateLuxePropertyPage;
