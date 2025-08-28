'use server'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { eq, and, inArray } from 'drizzle-orm';
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
                title: validatedData.name,
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
                errors: error.issues 
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

        // Track deleted image URLs for cleanup
        let deletedImageUrls: string[] = [];

        // Start a transaction for property and images
        await db.transaction(async (tx) => {
            // Update the property
            await tx.update(propertyTable)
                .set({
                    name: validatedData.name,
                    title: validatedData.name,
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

            // Handle enhanced image operations
            if (validatedData.imageOperations) {
                // Validate image operations before processing
                const validation = await validateImageOperations(validatedData.imageOperations, propertyId);
                if (!validation.isValid) {
                    throw new Error(`Image validation failed: ${validation.errors.join(', ')}`);
                }

                const { imagesToDelete, newImages, orderUpdates } = validatedData.imageOperations;
                
                // Get URLs of images to be deleted for cleanup
                if (imagesToDelete.length > 0) {
                    const imagesToDeleteData = await tx.select({
                        s3Url: propertyImagesTable.s3Url
                    })
                    .from(propertyImagesTable)
                    .where(
                        and(
                            eq(propertyImagesTable.propertyId, propertyId),
                            inArray(propertyImagesTable.id, imagesToDelete)
                        )
                    );
                    
                    deletedImageUrls = imagesToDeleteData
                        .map(img => img.s3Url)
                        .filter(Boolean) as string[];
                    
                    // Delete images from database
                    await tx.delete(propertyImagesTable)
                        .where(
                            and(
                                eq(propertyImagesTable.propertyId, propertyId),
                                inArray(propertyImagesTable.id, imagesToDelete)
                            )
                        );
                }
                
                // Insert new images in batch
                if (newImages.length > 0) {
                    const imageInserts = newImages.map((image) => ({
                        id: nanoid(),
                        propertyId: propertyId,
                        s3Url: image.file, // Should be uploaded URL string
                        order: image.order,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }));
                    
                    await tx.insert(propertyImagesTable).values(imageInserts);
                }
                
                // Batch update order for existing images (optimize with single query if possible)
                if (orderUpdates.length > 0) {
                    // Group updates by order value to minimize queries
                    const updatePromises = orderUpdates.map(update => 
                        tx.update(propertyImagesTable)
                            .set({ 
                                order: update.order,
                                updatedAt: new Date().toISOString()
                            })
                            .where(
                                and(
                                    eq(propertyImagesTable.id, update.id),
                                    eq(propertyImagesTable.propertyId, propertyId) // Additional safety check
                                )
                            )
                    );
                    
                    await Promise.all(updatePromises);
                }
            } else if (validatedData.images && validatedData.images.length > 0) {
                // Fallback to old behavior if imageOperations not provided
                // Get existing image URLs for cleanup
                const existingImages = await tx.select({
                    s3Url: propertyImagesTable.s3Url
                })
                .from(propertyImagesTable)
                .where(eq(propertyImagesTable.propertyId, propertyId));
                
                deletedImageUrls = existingImages
                    .map(img => img.s3Url)
                    .filter(Boolean) as string[];
                
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

        // Clean up deleted images from storage (outside transaction to avoid blocking)
        if (deletedImageUrls.length > 0) {
            try {
                await cleanupDeletedImages(deletedImageUrls);
            } catch (cleanupError) {
                // Log cleanup error but don't fail the main operation
                console.error('Error cleaning up deleted images:', cleanupError);
            }
        }

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
                errors: error.issues 
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
        let deletedImageUrls: string[] = [];

        await db.transaction(async (tx) => {
            // Get image URLs for cleanup before deletion
            const propertyImages = await tx.select({
                s3Url: propertyImagesTable.s3Url
            })
            .from(propertyImagesTable)
            .where(eq(propertyImagesTable.propertyId, propertyId));
            
            deletedImageUrls = propertyImages
                .map(img => img.s3Url)
                .filter(Boolean) as string[];

            // Delete property images first (foreign key constraint)
            await tx.delete(propertyImagesTable)
                .where(eq(propertyImagesTable.propertyId, propertyId));

            // Delete the property
            await tx.delete(propertyTable)
                .where(eq(propertyTable.id, propertyId));
        });

        // Clean up deleted images from storage (outside transaction)
        if (deletedImageUrls.length > 0) {
            try {
                await cleanupDeletedImages(deletedImageUrls);
            } catch (cleanupError) {
                // Log cleanup error but don't fail the main operation
                console.error('Error cleaning up deleted images:', cleanupError);
            }
        }

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

/**
 * Clean up deleted images from EdgeStore
 * @param imageUrls - Array of image URLs to delete
 */
async function cleanupDeletedImages(imageUrls: string[]): Promise<void> {
    if (!imageUrls.length) return;

    // Process deletions in batches to avoid overwhelming the storage service
    const BATCH_SIZE = 5;
    const batches = [];
    
    for (let i = 0; i < imageUrls.length; i += BATCH_SIZE) {
        batches.push(imageUrls.slice(i, i + BATCH_SIZE));
    }

    for (const batch of batches) {
        const deletePromises = batch.map(async (url) => {
            try {
                // Extract the file key from the URL for EdgeStore deletion
                const fileKey = extractFileKeyFromUrl(url);
                if (fileKey) {
                    // Note: EdgeStore deletion would typically be done through their API
                    // This is a placeholder for the actual deletion logic
                    await deleteFromEdgeStore(fileKey);
                }
            } catch (error) {
                console.error(`Failed to delete image ${url}:`, error);
                // Continue with other deletions even if one fails
            }
        });

        await Promise.allSettled(deletePromises);
        
        // Small delay between batches to be respectful to the storage service
        if (batches.indexOf(batch) < batches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}

/**
 * Extract file key from EdgeStore URL
 * @param url - Full EdgeStore URL
 * @returns File key or null if extraction fails
 */
function extractFileKeyFromUrl(url: string): string | null {
    try {
        // EdgeStore URLs typically have the format: https://domain.com/path/filekey
        // This is a simplified extraction - adjust based on actual EdgeStore URL format
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1] || null;
    } catch (error) {
        console.error('Error extracting file key from URL:', url, error);
        return null;
    }
}

/**
 * Delete file from EdgeStore
 * @param fileKey - File key to delete
 */
async function deleteFromEdgeStore(fileKey: string): Promise<void> {
    try {
        // This would typically use the EdgeStore client to delete the file
        // For now, this is a placeholder implementation
        // In a real implementation, you would:
        // 1. Initialize EdgeStore client
        // 2. Call the delete method with the file key
        // 3. Handle any errors appropriately
        
        // Use a proper logging library here if needed, or remove in production
        // logger.info(`Deleting file from EdgeStore: ${fileKey}`);
        
        // Placeholder for actual EdgeStore deletion
        // await edgeStoreClient.delete(fileKey);
        
    } catch (error) {
        console.error(`Failed to delete file ${fileKey} from EdgeStore:`, error);
        throw error;
    }
}

/**
 * Get luxe property with images for editing
 * @param propertyId - Property ID
 * @returns Property data with images
 */
export async function getLuxePropertyWithImages(propertyId: string) {
    try {
        const property = await db.select()
            .from(propertyTable)
            .where(
                and(
                    eq(propertyTable.id, propertyId),
                    eq(propertyTable.isLuxe, true)
                )
            )
            .limit(1);

        if (!property.length) {
            return { success: false, message: 'Property not found' };
        }

        const images = await db.select()
            .from(propertyImagesTable)
            .where(eq(propertyImagesTable.propertyId, propertyId))
            .orderBy(propertyImagesTable.order);

        return {
            success: true,
            data: {
                property: property[0],
                images: images
            }
        };
    } catch (error) {
        console.error('Error fetching luxe property:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch property'
        };
    }
}

/**
 * Batch update image orders for better performance
 * @param propertyId - Property ID
 * @param orderUpdates - Array of order updates
 */
export async function batchUpdateImageOrders(
    propertyId: string,
    orderUpdates: Array<{ id: string; order: number }>
): Promise<{ success: boolean; message: string }> {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    try {
        await db.transaction(async (tx) => {
            // Validate that all images belong to the property
            const imageIds = orderUpdates.map(update => update.id);
            const existingImages = await tx.select({ id: propertyImagesTable.id })
                .from(propertyImagesTable)
                .where(
                    and(
                        eq(propertyImagesTable.propertyId, propertyId),
                        inArray(propertyImagesTable.id, imageIds)
                    )
                );

            if (existingImages.length !== imageIds.length) {
                throw new Error('Some images do not belong to this property');
            }

            // Batch update orders
            const updatePromises = orderUpdates.map(update =>
                tx.update(propertyImagesTable)
                    .set({
                        order: update.order,
                        updatedAt: new Date().toISOString()
                    })
                    .where(eq(propertyImagesTable.id, update.id))
            );

            await Promise.all(updatePromises);
        });

        // Revalidate relevant pages
        revalidatePath(`/admin/luxe/properties/edit/${propertyId}`);

        return { success: true, message: 'Image orders updated successfully' };
    } catch (error) {
        console.error('Error updating image orders:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update image orders'
        };
    }
}

/**
 * Validate image operations before processing
 * @param imageOperations - Image operations to validate
 * @param propertyId - Property ID
 * @returns Validation result
 */
async function validateImageOperations(
    imageOperations: NonNullable<FormValues['imageOperations']>,
    propertyId: string
): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
        // Validate that images to delete belong to the property
        if (imageOperations.imagesToDelete.length > 0) {
            const existingImages = await db.select({ id: propertyImagesTable.id })
                .from(propertyImagesTable)
                .where(
                    and(
                        eq(propertyImagesTable.propertyId, propertyId),
                        inArray(propertyImagesTable.id, imageOperations.imagesToDelete)
                    )
                );

            if (existingImages.length !== imageOperations.imagesToDelete.length) {
                errors.push('Some images to delete do not belong to this property');
            }
        }

        // Validate order updates
        if (imageOperations.orderUpdates.length > 0) {
            const orderUpdateIds = imageOperations.orderUpdates.map(update => update.id);
            const existingImages = await db.select({ id: propertyImagesTable.id })
                .from(propertyImagesTable)
                .where(
                    and(
                        eq(propertyImagesTable.propertyId, propertyId),
                        inArray(propertyImagesTable.id, orderUpdateIds)
                    )
                );

            if (existingImages.length !== orderUpdateIds.length) {
                errors.push('Some images for order updates do not belong to this property');
            }
        }

        // Validate new images have valid URLs
        for (const newImage of imageOperations.newImages) {
            if (!newImage.file || typeof newImage.file !== 'string') {
                errors.push('New images must have valid uploaded URLs');
                break;
            }
        }

        // Validate final image count
        const currentImageCount = await db.select({ count: propertyImagesTable.id })
            .from(propertyImagesTable)
            .where(eq(propertyImagesTable.propertyId, propertyId));

        const finalCount = (currentImageCount.length || 0) 
            - imageOperations.imagesToDelete.length 
            + imageOperations.newImages.length;

        if (finalCount < 6) {
            errors.push('Property must have at least 6 images');
        }

        if (finalCount > 20) {
            errors.push('Property cannot have more than 20 images');
        }

    } catch (error) {
        console.error('Error validating image operations:', error);
        errors.push('Failed to validate image operations');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Get property image statistics
 * @param propertyId - Property ID
 * @returns Image statistics
 */
export async function getPropertyImageStats(propertyId: string): Promise<{
    totalImages: number;
    imagesByOrder: Array<{ id: string; order: number; s3Url: string }>;
}> {
    try {
        const images = await db.select({
            id: propertyImagesTable.id,
            order: propertyImagesTable.order,
            s3Url: propertyImagesTable.s3Url
        })
        .from(propertyImagesTable)
        .where(eq(propertyImagesTable.propertyId, propertyId))
        .orderBy(propertyImagesTable.order);

        // Filter out images with null order or s3Url and ensure type safety
        const validImages = images
            .filter((img): img is { id: string; order: number; s3Url: string } => 
                img.order !== null && img.s3Url !== null
            );

        return {
            totalImages: validImages.length,
            imagesByOrder: validImages
        };
    } catch (error) {
        console.error('Error getting property image stats:', error);
        return {
            totalImages: 0,
            imagesByOrder: []
        };
    }
}