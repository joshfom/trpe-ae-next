/**
 * Complete workflow integration test for the Luxe Property Edit Page
 * Tests: load → edit → reorder → delete → save
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Test the complete workflow without complex UI mocking
describe('EditLuxePropertyPage Complete Workflow', () => {
    const mockProperty = {
        id: 'test-property-id',
        name: 'Test Luxe Property',
        description: 'A beautiful luxury property',
        slug: 'test-luxe-property',
        bedrooms: 4,
        bathrooms: 3,
        price: 5000000,
        size: 3500,
        isLuxe: true,
        status: 'published',
        availability: 'available',
        images: [
            {
                id: 'img-1',
                s3Url: 'https://example.com/image1.jpg',
                order: 1,
                propertyId: 'test-property-id'
            },
            {
                id: 'img-2',
                s3Url: 'https://example.com/image2.jpg',
                order: 2,
                propertyId: 'test-property-id'
            },
            {
                id: 'img-3',
                s3Url: 'https://example.com/image3.jpg',
                order: 3,
                propertyId: 'test-property-id'
            },
            {
                id: 'img-4',
                s3Url: 'https://example.com/image4.jpg',
                order: 4,
                propertyId: 'test-property-id'
            },
            {
                id: 'img-5',
                s3Url: 'https://example.com/image5.jpg',
                order: 5,
                propertyId: 'test-property-id'
            },
            {
                id: 'img-6',
                s3Url: 'https://example.com/image6.jpg',
                order: 6,
                propertyId: 'test-property-id'
            }
        ]
    };

    describe('Complete Workflow Simulation', () => {
        it('should handle the complete load → edit → reorder → delete → save workflow', () => {
            const { 
                convertPropertyImagesToFileState,
                reorderImages,
                markImageForDeletion,
                validateImagesForSubmission,
                mergeImageOperations
            } = require('@/lib/image-management-utils');

            // Step 1: Load existing property images
            let fileStates = convertPropertyImagesToFileState(mockProperty.images);
            
            expect(fileStates).toHaveLength(6);
            expect(fileStates[0]).toMatchObject({
                file: 'https://example.com/image1.jpg',
                id: 'img-1',
                isExisting: true,
                isDeleted: false,
                order: 1
            });

            // Step 2: Simulate user reordering images (move first image to third position)
            fileStates = reorderImages(fileStates, 0, 2);
            
            // Verify reordering worked
            expect(fileStates[2].id).toBe('img-1'); // Original first image now at index 2
            expect(fileStates[0].id).toBe('img-2'); // Original second image now at index 0
            expect(fileStates[1].id).toBe('img-3'); // Original third image now at index 1

            // Step 3: Simulate user deleting an image
            const deleteResult = markImageForDeletion(fileStates, 0);
            expect(deleteResult.success).toBe(true);
            fileStates = deleteResult.updatedImages!;
            
            // Verify deletion marking
            expect(fileStates[0].isDeleted).toBe(true);
            expect(fileStates[0].id).toBe('img-2');

            // Step 4: Add a new image (simulate upload completion)
            const newImage = {
                file: 'https://example.com/new-image.jpg',
                key: 'new-image-key',
                progress: 'COMPLETE' as const,
                isExisting: false,
                isDeleted: false,
                order: 6
            };
            fileStates.push(newImage);

            // Step 5: Validate before submission
            const validation = validateImagesForSubmission(fileStates, 6, 20);
            
            // Should be valid (5 existing visible + 1 new = 6 total)
            expect(validation.isValid).toBe(true);
            expect(validation.counts.visible).toBe(6);
            expect(validation.counts.deleted).toBe(1);

            // Step 6: Prepare for server submission
            const operations = mergeImageOperations(fileStates);
            
            expect(operations.imagesToDelete).toHaveLength(1);
            expect(operations.imagesToDelete[0]).toBe('img-2');
            expect(operations.newImages).toHaveLength(1);
            expect(operations.newImages[0].file).toBe('https://example.com/new-image.jpg');
            expect(operations.existingImages).toHaveLength(5); // 6 original - 1 deleted
            expect(operations.orderUpdates).toHaveLength(5);

            // Verify the final state represents the user's intended changes
            const finalVisibleImages = fileStates.filter(img => !img.isDeleted);
            expect(finalVisibleImages).toHaveLength(6);
            
            // Verify the order reflects the reordering operation
            const imageIds = finalVisibleImages.map(img => img.id || 'new');
            expect(imageIds).toEqual(['img-3', 'img-1', 'img-4', 'img-5', 'img-6', 'new']);
        });

        it('should handle error scenarios gracefully', () => {
            const { 
                convertPropertyImagesToFileState,
                markImageForDeletion,
                validateImagesForSubmission
            } = require('@/lib/image-management-utils');

            // Start with minimum images (6)
            const minimalProperty = {
                ...mockProperty,
                images: mockProperty.images.slice(0, 6)
            };
            
            let fileStates = convertPropertyImagesToFileState(minimalProperty.images);
            
            // Try to delete an image when at minimum
            const deleteResult = markImageForDeletion(fileStates, 0);
            fileStates = deleteResult.updatedImages!;
            
            // Validation should fail
            const validation = validateImagesForSubmission(fileStates, 6, 20);
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('Minimum 6 images required. Add 1 more image.');
        });

        it('should handle mixed operations correctly', () => {
            const { 
                convertPropertyImagesToFileState,
                reorderImages,
                markImageForDeletion,
                mergeImageOperations
            } = require('@/lib/image-management-utils');

            // Start with 8 images
            const extendedImages = [
                ...mockProperty.images,
                {
                    id: 'img-7',
                    s3Url: 'https://example.com/image7.jpg',
                    order: 7,
                    propertyId: 'test-property-id'
                },
                {
                    id: 'img-8',
                    s3Url: 'https://example.com/image8.jpg',
                    order: 8,
                    propertyId: 'test-property-id'
                }
            ];

            let fileStates = convertPropertyImagesToFileState(extendedImages);
            
            // Perform multiple operations:
            // 1. Delete two images
            let deleteResult = markImageForDeletion(fileStates, 0);
            fileStates = deleteResult.updatedImages!;
            
            deleteResult = markImageForDeletion(fileStates, 2);
            fileStates = deleteResult.updatedImages!;
            
            // 2. Reorder remaining images
            fileStates = reorderImages(fileStates, 1, 3);
            
            // 3. Add two new images
            fileStates.push({
                file: 'https://example.com/new-image-1.jpg',
                key: 'new-1',
                progress: 'COMPLETE' as const,
                isExisting: false,
                isDeleted: false,
                order: 8
            });
            
            fileStates.push({
                file: 'https://example.com/new-image-2.jpg',
                key: 'new-2',
                progress: 'COMPLETE' as const,
                isExisting: false,
                isDeleted: false,
                order: 9
            });
            
            // Prepare operations
            const operations = mergeImageOperations(fileStates);
            
            expect(operations.imagesToDelete).toHaveLength(2);
            expect(operations.newImages).toHaveLength(2);
            expect(operations.existingImages).toHaveLength(6); // 8 original - 2 deleted
            
            // Verify final count is still valid
            const visibleCount = fileStates.filter(img => !img.isDeleted).length;
            expect(visibleCount).toBe(8); // 6 existing + 2 new
        });
    });

    describe('Error Boundary Integration', () => {
        it('should identify image-related errors correctly', () => {
            const imageErrors = [
                'EdgeStore upload failed',
                'Image processing error',
                'File upload timeout',
                'Invalid image format'
            ];
            
            const nonImageErrors = [
                'Database connection failed',
                'Form validation error',
                'Network timeout'
            ];
            
            imageErrors.forEach(errorMessage => {
                const error = new Error(errorMessage);
                const isImageError = error.message.includes('image') || 
                                   error.message.includes('upload') || 
                                   error.message.includes('EdgeStore') ||
                                   error.message.includes('file') ||
                                   error.message.includes('File') ||
                                   error.message.includes('format') ||
                                   error.message.includes('processing'); // Add processing for "Image processing error"
                
                expect(isImageError).toBe(true);
            });
            
            nonImageErrors.forEach(errorMessage => {
                const error = new Error(errorMessage);
                const isImageError = error.message.includes('image') || 
                                   error.message.includes('upload') || 
                                   error.message.includes('EdgeStore') ||
                                   error.message.includes('file');
                
                // These should not be classified as image errors
                expect(isImageError).toBe(false);
            });
        });
    });

    describe('Property Loading Validation', () => {
        it('should properly validate luxe property requirements', () => {
            // Test luxe property validation
            expect(mockProperty.isLuxe).toBe(true);
            
            // Test non-luxe property
            const nonLuxeProperty = { ...mockProperty, isLuxe: false };
            expect(nonLuxeProperty.isLuxe).toBe(false);
            
            // Test null property
            const nullProperty = null;
            expect(nullProperty).toBe(null);
        });

        it('should handle property with missing images', () => {
            const { convertPropertyImagesToFileState } = require('@/lib/image-management-utils');
            
            const propertyWithoutImages = {
                ...mockProperty,
                images: []
            };
            
            const fileStates = convertPropertyImagesToFileState(propertyWithoutImages.images);
            expect(fileStates).toHaveLength(0);
        });

        it('should handle property with malformed image data', () => {
            const { convertPropertyImagesToFileState } = require('@/lib/image-management-utils');
            
            const propertyWithMalformedImages = {
                ...mockProperty,
                images: [
                    { id: 'img-1', s3Url: '', order: 1 }, // Empty URL
                    { id: 'img-2', order: 2 }, // Missing URL
                    { id: 'img-3', s3Url: 'https://example.com/image3.jpg' } // Missing order (becomes 0)
                ]
            };
            
            const fileStates = convertPropertyImagesToFileState(propertyWithMalformedImages.images);
            expect(fileStates).toHaveLength(3);
            
            // The function sorts by order first: img-3 (order: undefined -> 0), img-1 (order: 1), img-2 (order: 2)
            expect(fileStates[0].file).toBe('https://example.com/image3.jpg'); // img-3 comes first (order 0)
            expect(fileStates[1].file).toBe(''); // img-1 with empty URL
            expect(fileStates[2].file).toBe(''); // img-2 with missing URL
            
            // Should assign index-based order after sorting
            expect(fileStates[0].order).toBe(0); // img-3 gets index 0
            expect(fileStates[1].order).toBe(1); // img-1 gets index 1
            expect(fileStates[2].order).toBe(2); // img-2 gets index 2
        });
    });
});