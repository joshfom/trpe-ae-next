import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { propertyTable } from '@/db/schema/property-table';
import LuxePropertyForm from '@/features/admin/luxe/properties/components';

interface EditLuxePropertyPageProps {
    params: {
        id: string;
    };
}

async function EditLuxePropertyPage({ params }: EditLuxePropertyPageProps) {
    // Fetch the property
    const property = await db.query.propertyTable.findFirst({
        where: eq(propertyTable.id, params.id),
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
                
                <LuxePropertyForm 
                    property={property} 
                    propertySlug={params.id} 
                />
            </div>
        </div>
    );
}

export default EditLuxePropertyPage;
