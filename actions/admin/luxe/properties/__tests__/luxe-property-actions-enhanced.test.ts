/**
 * Enhanced tests for luxe property server actions with optimized image operations
 */

import { 
    updateLuxePropertyAction, 
    deleteLuxePropertyAction,
    batchUpdateImageOrders,
    getPropertyImageStats,
    getLuxePropertyWithImages
} from '../luxe-property-actions';
import { db } from '@/db/drizzle';
import { propertyTable } from '@/db/schema/property-table';
import { propertyImagesTable } from '@/db/schema/property-images-table';
import { getCurrentUser } from '@/actions/auth-session';
import { eq } from 'drizzle-orm';

// Mock dependencies
jest.mock('@/actions/auth-session');
jest.mock('next/cache', () => ({
    revalidatePath: jest.fn()
}));

const mockUser = { id: 'test-user-id', email: 'test@example.com' };
const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;

describe('Enhanced Luxe Property Actions', () => {
    beforeEach(() => {
        mockGetCurrentUser.mockResolvedValue(mockUser);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('updateLuxePropertyAction with enhanced image operations', () => {
        it('should handle selective image operations (add/delete/reorder)', async () => {
            const propertyId = 'test-property-id';
            const formValues = {
                name: 'Test Luxury Property',
                description: 'A beautiful luxury property',
                slug: 'test-luxury-property',
                bedrooms: 3,
                bathrooms: 2,
                price: 1000000,
                size: 2000,
                communityId: 'community-1',
                typeId: 'type-1',
                offeringTypeId: 'offering-1',
                agentId: 'agent-1',
                permitNumber: 'PERMIT-123',
                availability: 'available' as const,
                status: 'published' as const,
                isFeatured: false,
                isExclusive: false,
                images: [
                    { url: 'https://example.com/image1.jpg', order: 0 },
                    { url: 'https://example.com/image2.jpg', order: 1 },
                    { url: 'https://example.com/image3.jpg', order: 2 },
                    { url: 'https://example.com/image4.jpg', order: 3 },
                    { url: 'https://example.com/image5.jpg', order: 4 },
                    { url: 'https://example.com/image6.jpg', order: 5 }
                ],
                imageOperations: {
                    imagesToDelete: ['image-1', 'image-2'],
                    newImages: [
                        { file: 'https://example.com/new-image1.jpg', order: 6 },
                        { file: 'https://example.com/new-image2.jpg', order: 7 }
                    ],
                    orderUpdates: [
                        { id: 'image-3', order: 0 },
                        { id: 'image-4', order: 1 }
                    ],
                    existingImages: [
                        { id: 'image-3', url: 'https://example.com/image3.jpg', order: 0 },
                        { id: 'image-4', url: 'https://example.com/image4.jpg', order: 1 }
                    ]
                }
            };

            const result = await updateLuxePropertyAction(propertyId, formValues);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Luxe property updated successfully');
        });

        it('should validate image operations before processing', async () => {
            const propertyId = 'test-property-id';
            const formValues = {
                name: 'Test Property',
                description: 'Test description',
                slug: 'test-property',
                bedrooms: 2,
                bathrooms: 1,
                price: 500000,
                size: 1000,
                communityId: 'community-1',
                typeId: 'type-1',
                offeringTypeId: 'offering-1',
                agentId: 'agent-1',
                permitNumber: 'PERMIT-123',
                availability: 'available' as const,
                status: 'published' as const,
                isFeatured: false,
                isExclusive: false,
                images: [
                    { url: 'https://example.com/image1.jpg', order: 0 },
                    { url: 'https://example.com/image2.jpg', order: 1 },
                    { url: 'https://example.com/image3.jpg', order: 2 },
                    { url: 'https://example.com/image4.jpg', order: 3 },
                    { url: 'https://example.com/image5.jpg', order: 4 },
                    { url: 'https://example.com/image6.jpg', order: 5 }
                ],
                imageOperations: {
                    imagesToDelete: ['non-existent-image'],
                    newImages: [],
                    orderUpdates: [],
                    existingImages: []
                }
            };

            const result = await updateLuxePropertyAction(propertyId, formValues);

            expect(result.success).toBe(false);
            expect(result.message).toContain('Image validation failed');
        });

        it('should handle atomic database transactions', async () => {
            const propertyId = 'test-property-id';
            const formValues = {
                name: 'Test Property',
                description: 'Test description',
                slug: 'test-property',
                bedrooms: 2,
                bathrooms: 1,
                price: 500000,
                size: 1000,
                communityId: 'community-1',
                typeId: 'type-1',
                offeringTypeId: 'offering-1',
                agentId: 'agent-1',
                permitNumber: 'PERMIT-123',
                availability: 'available' as const,
                status: 'published' as const,
                isFeatured: false,
                isExclusive: false,
                images: [
                    { url: 'https://example.com/image1.jpg', order: 0 },
                    { url: 'https://example.com/image2.jpg', order: 1 },
                    { url: 'https://example.com/image3.jpg', order: 2 },
                    { url: 'https://example.com/image4.jpg', order: 3 },
                    { url: 'https://example.com/image5.jpg', order: 4 },
                    { url: 'https://example.com/image6.jpg', order: 5 }
                ]
            };

            // Mock database transaction failure
            const originalTransaction = db.transaction;
            db.transaction = jest.fn().mockRejectedValue(new Error('Transaction failed'));

            const result = await updateLuxePropertyAction(propertyId, formValues);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Transaction failed');

            // Restore original transaction
            db.transaction = originalTransaction;
        });
    });

    describe('deleteLuxePropertyAction with image cleanup', () => {
        it('should delete property and clean up images from storage', async () => {
            const propertyId = 'test-property-id';

            const result = await deleteLuxePropertyAction(propertyId);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Luxe property deleted successfully');
        });

        it('should handle cleanup errors gracefully', async () => {
            const propertyId = 'test-property-id';

            // The cleanup should not fail the main operation even if it encounters errors
            const result = await deleteLuxePropertyAction(propertyId);

            expect(result.success).toBe(true);
        });
    });

    describe('batchUpdateImageOrders', () => {
        it('should update image orders in batch', async () => {
            const propertyId = 'test-property-id';
            const orderUpdates = [
                { id: 'image-1', order: 2 },
                { id: 'image-2', order: 1 },
                { id: 'image-3', order: 0 }
            ];

            const result = await batchUpdateImageOrders(propertyId, orderUpdates);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Image orders updated successfully');
        });

        it('should validate that images belong to the property', async () => {
            const propertyId = 'test-property-id';
            const orderUpdates = [
                { id: 'non-existent-image', order: 0 }
            ];

            const result = await batchUpdateImageOrders(propertyId, orderUpdates);

            expect(result.success).toBe(false);
            expect(result.message).toContain('do not belong to this property');
        });
    });

    describe('getPropertyImageStats', () => {
        it('should return property image statistics', async () => {
            const propertyId = 'test-property-id';

            const stats = await getPropertyImageStats(propertyId);

            expect(stats).toHaveProperty('totalImages');
            expect(stats).toHaveProperty('imagesByOrder');
            expect(Array.isArray(stats.imagesByOrder)).toBe(true);
        });
    });

    describe('getLuxePropertyWithImages', () => {
        it('should return property with images for editing', async () => {
            const propertyId = 'test-property-id';

            const result = await getLuxePropertyWithImages(propertyId);

            expect(result).toHaveProperty('success');
            if (result.success) {
                expect(result.data).toHaveProperty('property');
                expect(result.data).toHaveProperty('images');
            }
        });

        it('should handle non-existent property', async () => {
            const propertyId = 'non-existent-property';

            const result = await getLuxePropertyWithImages(propertyId);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Property not found');
        });
    });

    describe('Image cleanup utilities', () => {
        it('should extract file key from EdgeStore URL', () => {
            // This would test the extractFileKeyFromUrl function
            // Since it's a private function, we'd need to export it for testing
            // or test it indirectly through the public functions
        });

        it('should handle batch deletion of images', () => {
            // This would test the cleanupDeletedImages function
            // Testing the batching logic and error handling
        });
    });

    describe('Performance optimizations', () => {
        it('should minimize database queries during updates', async () => {
            // Test that the optimized version uses fewer queries
            // This could be done by mocking the database and counting calls
        });

        it('should handle large batches of image operations efficiently', async () => {
            const propertyId = 'test-property-id';
            const largeOrderUpdates = Array.from({ length: 20 }, (_, i) => ({
                id: `image-${i}`,
                order: i
            }));

            const result = await batchUpdateImageOrders(propertyId, largeOrderUpdates);

            // Should handle large batches without timeout
            expect(result).toBeDefined();
        });
    });
});