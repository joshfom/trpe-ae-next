'use server'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { propertyTable } from '@/db/schema/property-table';
import { propertyImagesTable } from '@/db/schema/property-images-table';
import { luxePropertyFormSchema } from '@/features/admin/luxe/properties/form-schema/luxe-property-form-schema';
import { getCurrentUser } from '@/actions/auth-session';
import { nanoid } from 'nanoid';

type FormValues = z.infer<typeof luxePropertyFormSchema>;

export async function createLuxePropertyAction(values: FormValues) {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    try {
        // Validate the input
        const validatedData = luxePropertyFormSchema.parse(values);

        // Start a transaction for property and images
        await db.transaction(async (tx) => {
            // Generate property ID
            const propertyId = nanoid();

            // Insert the property
            const [property] = await tx.insert(propertyTable).values({
                id: propertyId,
                name: validatedData.name,
                description: validatedData.description,
                slug: validatedData.slug,
                bedrooms: validatedData.bedrooms,
                bathrooms: validatedData.bathrooms,
                price: validatedData.price,
                size: validatedData.size,
                plotSize: validatedData.plotSize,
                floor: validatedData.floor,
                buildYear: validatedData.buildYear,
                communityId: validatedData.communityId || null,
                subCommunityId: validatedData.subCommunityId || null,
                cityId: validatedData.cityId || null,
                latitude: validatedData.latitude || null,
                longitude: validatedData.longitude || null,
                typeId: validatedData.typeId || null,
                offeringTypeId: validatedData.offeringTypeId || null,
                unitTypeId: validatedData.unitTypeId || null,
                availability: validatedData.availability,
                status: validatedData.status,
                availabilityDate: validatedData.availabilityDate ? new Date(validatedData.availabilityDate) : null,
                offplanCompletionStatus: validatedData.offplanCompletionStatus || null,
                furnished: validatedData.furnished || null,
                parking: validatedData.parking || null,
                serviceCharge: validatedData.serviceCharge || null,
                cheques: validatedData.cheques || null,
                agentId: validatedData.agentId || null,
                developerId: validatedData.developerId || null,
                isFeatured: validatedData.isFeatured,
                isExclusive: validatedData.isExclusive,
                isLuxe: true, // Always true for luxe properties
                referenceNumber: validatedData.referenceNumber || null,
                permitNumber: validatedData.permitNumber || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }).returning();

            // Insert property images if provided
            if (validatedData.images && validatedData.images.length > 0) {
                const imageInserts = validatedData.images.map((image) => ({
                    id: nanoid(),
                    propertyId: propertyId,
                    s3Url: image.url,
                    order: image.order,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }));

                await tx.insert(propertyImagesTable).values(imageInserts);
            }
        });

        // Revalidate the luxe properties page
        revalidatePath('/admin/luxe/properties');
        
        return { success: true, message: 'Luxe property created successfully' };
    } catch (error) {
        console.error('Error creating luxe property:', error);
        if (error instanceof z.ZodError) {
            return { 
                success: false, 
                message: 'Validation error', 
                errors: error.errors 
            };
        }
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Failed to create luxe property' 
        };
    }
}

export async function updateLuxePropertyAction(propertyId: string, values: FormValues) {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    try {
        // Validate the input
        const validatedData = luxePropertyFormSchema.parse(values);

        // Start a transaction for property and images
        await db.transaction(async (tx) => {
            // Update the property
            await tx.update(propertyTable)
                .set({
                    name: validatedData.name,
                    description: validatedData.description,
                    slug: validatedData.slug,
                    bedrooms: validatedData.bedrooms,
                    bathrooms: validatedData.bathrooms,
                    price: validatedData.price,
                    size: validatedData.size,
                    plotSize: validatedData.plotSize,
                    floor: validatedData.floor,
                    buildYear: validatedData.buildYear,
                    communityId: validatedData.communityId || null,
                    subCommunityId: validatedData.subCommunityId || null,
                    cityId: validatedData.cityId || null,
                    latitude: validatedData.latitude || null,
                    longitude: validatedData.longitude || null,
                    typeId: validatedData.typeId || null,
                    offeringTypeId: validatedData.offeringTypeId || null,
                    unitTypeId: validatedData.unitTypeId || null,
                    availability: validatedData.availability,
                    status: validatedData.status,
                    availabilityDate: validatedData.availabilityDate ? new Date(validatedData.availabilityDate) : null,
                    offplanCompletionStatus: validatedData.offplanCompletionStatus || null,
                    furnished: validatedData.furnished || null,
                    parking: validatedData.parking || null,
                    serviceCharge: validatedData.serviceCharge || null,
                    cheques: validatedData.cheques || null,
                    agentId: validatedData.agentId || null,
                    developerId: validatedData.developerId || null,
                    isFeatured: validatedData.isFeatured,
                    isExclusive: validatedData.isExclusive,
                    isLuxe: true, // Always true for luxe properties
                    referenceNumber: validatedData.referenceNumber || null,
                    permitNumber: validatedData.permitNumber || null,
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(propertyTable.id, propertyId));

            // Handle images update - for now, we'll replace all images
            // TODO: Implement more sophisticated image management (add/remove individual images)
            if (validatedData.images && validatedData.images.length > 0) {
                // Delete existing images
                await tx.delete(propertyImagesTable)
                    .where(eq(propertyImagesTable.propertyId, propertyId));

                // Insert new images
                const imageInserts = validatedData.images.map((image) => ({
                    id: nanoid(),
                    propertyId: propertyId,
                    s3Url: image.url,
                    order: image.order,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }));

                await tx.insert(propertyImagesTable).values(imageInserts);
            }
        });

        // Revalidate the luxe properties page
        revalidatePath('/admin/luxe/properties');
        revalidatePath(`/admin/luxe/properties/edit/${propertyId}`);
        
        return { success: true, message: 'Luxe property updated successfully' };
    } catch (error) {
        console.error('Error updating luxe property:', error);
        if (error instanceof z.ZodError) {
            return { 
                success: false, 
                message: 'Validation error', 
                errors: error.errors 
            };
        }
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Failed to update luxe property' 
        };
    }
}

export async function deleteLuxePropertyAction(propertyId: string) {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    try {
        await db.transaction(async (tx) => {
            // Delete property images first (foreign key constraint)
            await tx.delete(propertyImagesTable)
                .where(eq(propertyImagesTable.propertyId, propertyId));

            // Delete the property
            await tx.delete(propertyTable)
                .where(eq(propertyTable.id, propertyId));
        });

        // Revalidate the luxe properties page
        revalidatePath('/admin/luxe/properties');
        
        return { success: true, message: 'Luxe property deleted successfully' };
    } catch (error) {
        console.error('Error deleting luxe property:', error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Failed to delete luxe property' 
        };
    }
}
