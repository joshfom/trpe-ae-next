import React from 'react';
import {notFound} from "next/navigation";
import {db} from '@/db/drizzle';
import {eq} from 'drizzle-orm';
import {propertyTypeTable} from '@/db/schema-index';
import PropertyTypeEditor from "@/features/admin/property-types/components/PropertyTypeEditor";

interface EditPropertyTypePageProps {
    params: Promise<{ id: string }>
}

async function EditPropertyTypePage({params}: EditPropertyTypePageProps) {
    const typeId = (await params).id;

    const propertyType = await db.query.propertyTypeTable.findFirst({
        where: eq(propertyTypeTable.id, typeId),
    }) as unknown as UnitType;

    if (!propertyType) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center py-8 px-8">
                <h2 className="text-2xl">Edit Property Type - {propertyType.name}</h2>
            </div>

            <PropertyTypeEditor propertyType={propertyType} />
        </div>
    );
}

export default EditPropertyTypePage;