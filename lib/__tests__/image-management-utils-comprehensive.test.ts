/**
 * Comprehensive test suite for image management utilities
 * Tests all utility functions with edge cases and performance scenarios
 */

import {
  EnhancedFileState,
  reorderImages,
  markImageForDeletion,
  removeImage,
  addImages,
  convertPropertyImagesToFileState,
  getVisibleImages,
  getImagesToDelete,
  getNewImagesToUpload,
  getImagesWithOrderUpdates,
  validateImageCollection,
  mergeImageOperations,
  handleKeyboardNavigation,
  handleKeyboardReorder,
  debounce,
  throttle,
  createImageErrorMessage
} from '../image-management-utils';

describe('Image Management Utils - Comprehensive Tests', () => {
  const createMockImage = (
    id: string,
    order: number,
    isExisting: boolean = false,
    isDeleted: boolean = false
  ): EnhancedFileState => ({
    file: isExisting ? `https://example.com/image-${id}.jpg` : new File([''], `image-${id}.jpg`),
    key: `key-${id}`,
    progress: 'COMPLETE',
    id: isExisting ? id : undefined,
    isExisting,
    isDeleted,
    order
  });

  describe('Core Image Operations', () => {
    describe('reorderImages', () => {
      it('should handle complex reordering scenarios', () => {
        const images = [
          createMockImage('1', 0, true),
          createMockImage('2', 1, false),
          createMockImage('3', 2, true),
          createMockImage('4', 3, false),
          createMockImage('5', 4, true)
        ];

        // Move first image to last position
        const result = reorderImages(images, 0, 4);
        
        expect(result[0].id).toBe('2');
        expect(result[4].id).toBe('1');
        expect(result.every((img, index) => img.order === index)).toBe(true);
      });

      it('should handle edge cases gracefully', () => {
        const images = [createMockImage('1', 0)];
        
        // Same position
        expect(reorderImages(images, 0, 0)).toEqual(images);
        
        // Invalid indices
        expect(reorderImages(images, -1, 0)).toEqual(images);
        expect(reorderImages(images, 0, 10)).toEqual(images);
        
        // Empty array
        expect(reorderImages([], 0, 1)).toEqual([]);
      });

      it('should preserve image properties during reordering', () => {
        const images = [
          createMockImage('1', 0, true, false),
          createMockImage('2', 1, false, false),
          createMockImage('3', 2, true, true) // deleted
        ];

        const result = reorderImages(images, 0, 1);
        
        expect(result[1].isExisting).toBe(true);
        expect(result[1].isDeleted).toBe(false);
        expect(result[0].isExisting).toBe(false);
        expect(result[2].isDeleted).toBe(true);
      });
    });

    describe('markImageForDeletion', () => {
      it('should handle batch deletion marking', () => {
        const images = Array.from({ length: 10 }, (_, i) => createMockImage(i.toString(), i, true));
        const indicesToDelete = [1, 3, 5, 7];

        let updatedImages = images;
        indicesToDelete.forEach(index => {
          const result = markImageForDeletion(updatedImages, index);
          if (result.success) {
            updatedImages = result.updatedImages!;
          }
        });

        const deletedCount = updatedImages.filter(img => img.isDeleted).length;
        expect(deletedCount).toBe(4);
      });

      it('should mark images for deletion correctly', () => {
        const images = Array.from({ length: 6 }, (_, i) => createMockImage(i.toString(), i, true));
        
        const result = markImageForDeletion(images, 0);
        expect(result.success).toBe(true);
        expect(result.updatedImages![0].isDeleted).toBe(true);
      });
    });

    describe('addImages', () => {
      it('should handle large batch additions', () => {
        const existingImages = Array.from({ length: 5 }, (_, i) => createMockImage(i.toString(), i, true));
        const newImages = Array.from({ length: 15 }, (_, i) => createMockImage((i + 5).toString(), 0));

        const result = addImages(existingImages, newImages);
        
        expect(result.length).toBe(20);
        expect(result.slice(5).every(img => !img.isExisting)).toBe(true);
        expect(result.every((img, index) => img.order === index)).toBe(true);
      });

      it('should add images with correct ordering', () => {
        const existingImages = Array.from({ length: 5 }, (_, i) => createMockImage(i.toString(), i, true));
        const newImages = Array.from({ length: 3 }, (_, i) => createMockImage((i + 5).toString(), 0));

        const result = addImages(existingImages, newImages);
        
        expect(result.length).toBe(8);
        expect(result.slice(5).every(img => !img.isExisting)).toBe(true);
      });
    });
  });

  describe('Advanced Utility Functions', () => {
    describe('Image Collection Management', () => {
      it('should handle large batch additions efficiently', () => {
        const existingImages = Array.from({ length: 5 }, (_, i) => createMockImage(i.toString(), i, true));
        const newImages = Array.from({ length: 15 }, (_, i) => createMockImage((i + 5).toString(), 0));

        const result = addImages(existingImages, newImages);
        
        expect(result.length).toBe(20);
        expect(result.slice(5).every(img => !img.isExisting)).toBe(true);
        expect(result.every((img, index) => img.order === index)).toBe(true);
      });

      it('should handle complex reordering scenarios', () => {
        const images = [
          createMockImage('1', 0, true),
          createMockImage('2', 1, false),
          createMockImage('3', 2, true),
          createMockImage('4', 3, false),
          createMockImage('5', 4, true)
        ];

        // Move first image to last position
        const result = reorderImages(images, 0, 4);
        
        expect(result[4].id).toBe('1');
        expect(result.every((img, index) => img.order === index)).toBe(true);
      });
    });
  });

  describe('State Management', () => {
    describe('Image State Tracking', () => {
      it('should track image states correctly', () => {
        const images = Array.from({ length: 5 }, (_, i) => createMockImage(i.toString(), i, true));
        
        // Mark some for deletion
        const result1 = markImageForDeletion(images, 1);
        expect(result1.success).toBe(true);
        
        const result2 = markImageForDeletion(result1.updatedImages!, 2);
        expect(result2.success).toBe(true);
        
        const finalImages = result2.updatedImages!;
        const visibleImages = getVisibleImages(finalImages);
        
        expect(visibleImages.length).toBe(3); // 5 - 2 deleted
        expect(finalImages.filter(img => img.isDeleted).length).toBe(2);
      });
    });
  });

  describe('Performance Utilities', () => {
    describe('debounce', () => {
      it('should handle rapid successive calls', async () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 100);

        // Rapid calls
        for (let i = 0; i < 10; i++) {
          debouncedFn(`call-${i}`);
        }

        expect(mockFn).not.toHaveBeenCalled();

        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 150));

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('call-9'); // Last call
      });
    });

    describe('throttle', () => {
      it('should limit function execution rate', async () => {
        const mockFn = jest.fn();
        const throttledFn = throttle(mockFn, 100);

        // Rapid calls
        for (let i = 0; i < 5; i++) {
          throttledFn(`call-${i}`);
          await new Promise(resolve => setTimeout(resolve, 20));
        }

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('call-0'); // First call

        // Wait for throttle period
        await new Promise(resolve => setTimeout(resolve, 120));

        throttledFn('final-call');
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toHaveBeenCalledWith('final-call');
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    describe('createImageErrorMessage', () => {
      it('should create contextual error messages', () => {
        const testCases = [
          { error: new Error('Network timeout'), operation: 'upload', expected: 'Failed to upload image: Network timeout' },
          { error: 'File too large', operation: 'validation', expected: 'Image validation failed: File too large' },
          { error: { message: 'Custom error' }, operation: 'delete', expected: 'Failed to delete image: Custom error' }
        ];

        testCases.forEach(({ error, operation, expected }) => {
          const result = createImageErrorMessage(error, operation);
          expect(result).toBe(expected);
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty arrays gracefully', () => {
        expect(getVisibleImages([])).toEqual([]);
        expect(validateImageCollection([], 6, 20).isValid).toBe(false);
      });

      it('should handle circular references in image objects', () => {
        const image = createMockImage('1', 0, true);
        (image as any).circular = image; // Create circular reference

        const images = [image];
        const result = getVisibleImages(images);
        
        expect(result.length).toBe(1);
        expect(result[0].id).toBe('1');
      });

      it('should handle very large datasets efficiently', () => {
        const largeImageSet = Array.from({ length: 1000 }, (_, i) => createMockImage(i.toString(), i, true));
        
        const startTime = performance.now();
        const visible = getVisibleImages(largeImageSet);
        const endTime = performance.now();
        
        expect(visible.length).toBe(1000);
        expect(endTime - startTime).toBeLessThan(100); // Should be fast
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete workflow integration', () => {
      // Start with existing images
      let images = Array.from({ length: 8 }, (_, i) => createMockImage(i.toString(), i, true));
      
      // Delete some images
      const deleteResult = markImageForDeletion(images, 2);
      expect(deleteResult.success).toBe(true);
      images = deleteResult.updatedImages!;
      
      // Add new images
      const newImages = Array.from({ length: 3 }, (_, i) => createMockImage(`new-${i}`, 0));
      images = addImages(images, newImages);
      
      // Reorder
      images = reorderImages(images, 0, 5);
      
      // Validate final state
      const validation = validateImageCollection(images, 6, 20);
      expect(validation.isValid).toBe(true);
      
      // Merge operations
      const operations = mergeImageOperations(images);
      expect(operations.imagesToDelete.length).toBe(1);
      expect(operations.newImages.length).toBe(3);
      expect(operations.existingImages.length).toBe(7);
    });

    it('should maintain data consistency across operations', () => {
      const images = Array.from({ length: 10 }, (_, i) => createMockImage(i.toString(), i, true));
      
      // Perform multiple operations
      let currentImages = images;
      
      // Delete every other image
      for (let i = 1; i < 10; i += 2) {
        const result = markImageForDeletion(currentImages, i);
        if (result.success) {
          currentImages = result.updatedImages!;
        }
      }
      
      // Add new images
      const newImages = Array.from({ length: 5 }, (_, i) => createMockImage(`new-${i}`, 0));
      currentImages = addImages(currentImages, newImages);
      
      // Verify consistency
      const visible = getVisibleImages(currentImages);
      const operations = mergeImageOperations(currentImages);
      
      expect(visible.length).toBe(10); // 5 existing (not deleted) + 5 new
      expect(operations.imagesToDelete.length).toBe(5);
      expect(operations.newImages.length).toBe(5);
      expect(operations.existingImages.length).toBe(5);
    });
  });
});