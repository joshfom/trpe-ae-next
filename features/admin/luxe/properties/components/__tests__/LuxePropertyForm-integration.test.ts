/**
 * Integration test for LuxePropertyForm enhanced image management
 * Tests the core functionality without complex mocking
 */

import { 
    convertPropertyImagesToFileState,
    getVisibleImages,
    validateImageCollection,
    mergeImageOperations,
    reorderImages,
    markImageForDeletion
} from '@/lib/image-management-utils';

describe('LuxePropertyForm Enhanced Image Management Integration', () => {
    const mockPropertyImages = [
        { id: '1', s3Url: 'https://example.com/image1.jpg', order: 0 },
        { id: '2', s3Url: 'https://example.com/image2.jpg', order: 1 },
        { id: '3', s3Url: 'https://example.com/image3.jpg', order: 2 },
        { id: '4', s3Url: 'https://example.com/image4.jpg', order: 3 },
        { id: '5', s3Url: 'https://example.com/image5.jpg', order: 4 },
        { id: '6', s3Url: 'https://example.com/image6.jpg', order: 5 }
    ];

    test('should convert property images to enhanced file state correctly', () => {
        const fileStates = convertPropertyImagesToFileState(mockPropertyImages);
        
        expect(fileStates).toHaveLength(6);
        expect(fileStates[0]).toMatchObject({
            file: 'https://example.com/image1.jpg',
            key: 'existing-1',
            progress: 'COMPLETE',
            id: '1',
            isExisting: true,
            isDeleted: false,
            order: 0
        });
    });

    test('should track existing vs new images separately', () => {
        const existingImages = convertPropertyImagesToFileState(mockPropertyImages);
        const newImage = {
            file: 'https://example.com/new-image.jpg',
            key: 'new-1',
            progress: 'COMPLETE' as const,
            isExisting: false,
            isDeleted: false,
            order: 6
        };

        const allImages = [...existingImages, newImage];
        const visibleImages = getVisibleImages(allImages);
        
        expect(visibleImages).toHaveLength(7);
        expect(visibleImages.filter(img => img.isExisting)).toHaveLength(6);
        expect(visibleImages.filter(img => !img.isExisting)).toHaveLength(1);
    });

    test('should handle image deletion correctly', () => {
        const images = convertPropertyImagesToFileState(mockPropertyImages);
        const result = markImageForDeletion(images, 1);
        
        expect(result.success).toBe(true);
        expect(result.updatedImages![1].isDeleted).toBe(true);
        
        const visibleImages = getVisibleImages(result.updatedImages!);
        expect(visibleImages).toHaveLength(5); // 6 - 1 deleted
    });

    test('should handle image reordering correctly', () => {
        const images = convertPropertyImagesToFileState(mockPropertyImages);
        const reorderedImages = reorderImages(images, 0, 2);
        
        expect(reorderedImages[0].id).toBe('2'); // Original second image
        expect(reorderedImages[1].id).toBe('3'); // Original third image  
        expect(reorderedImages[2].id).toBe('1'); // Original first image moved to position 2
        
        // Check that order numbers are updated correctly
        expect(reorderedImages[0].order).toBe(0);
        expect(reorderedImages[1].order).toBe(1);
        expect(reorderedImages[2].order).toBe(2);
    });

    test('should validate image collection correctly', () => {
        // Test minimum validation
        const tooFewImages = convertPropertyImagesToFileState(mockPropertyImages.slice(0, 3));
        const minValidation = validateImageCollection(tooFewImages, 6, 20);
        expect(minValidation.isValid).toBe(false);
        expect(minValidation.errors[0]).toContain('Minimum 6 images required');

        // Test valid collection
        const validImages = convertPropertyImagesToFileState(mockPropertyImages);
        const validValidation = validateImageCollection(validImages, 6, 20);
        expect(validValidation.isValid).toBe(true);
        expect(validValidation.errors).toHaveLength(0);
    });

    test('should merge image operations for form submission', () => {
        const images = convertPropertyImagesToFileState(mockPropertyImages);
        
        // Mark one image for deletion
        images[1].isDeleted = true;
        
        // Add a new uploaded image
        images.push({
            file: 'https://example.com/new-image.jpg',
            key: 'new-1',
            progress: 'COMPLETE',
            isExisting: false,
            isDeleted: false,
            order: 6
        });

        const operations = mergeImageOperations(images);
        
        expect(operations.imagesToDelete).toContain('2');
        expect(operations.newImages).toHaveLength(1);
        expect(operations.newImages[0].file).toBe('https://example.com/new-image.jpg');
        expect(operations.existingImages).toHaveLength(5); // 6 original - 1 deleted
        expect(operations.orderUpdates).toHaveLength(5);
    });

    test('should handle mixed operations correctly', () => {
        const images = convertPropertyImagesToFileState(mockPropertyImages);
        
        // Delete first image
        images[0].isDeleted = true;
        
        // Reorder remaining images
        const reorderedImages = reorderImages(images.filter(img => !img.isDeleted), 0, 2);
        
        // Add new image
        reorderedImages.push({
            file: 'https://example.com/new-image.jpg',
            key: 'new-1',
            progress: 'COMPLETE',
            isExisting: false,
            isDeleted: false,
            order: reorderedImages.length
        });

        // Combine deleted image back for operations
        const finalImages = [images[0], ...reorderedImages];
        const operations = mergeImageOperations(finalImages);
        
        expect(operations.imagesToDelete).toContain('1');
        expect(operations.newImages).toHaveLength(1);
        expect(operations.existingImages).toHaveLength(5);
        
        // Verify the form can handle this complex scenario
        const visibleImages = getVisibleImages(finalImages);
        const validation = validateImageCollection(visibleImages, 6, 20);
        expect(validation.isValid).toBe(true);
    });
});