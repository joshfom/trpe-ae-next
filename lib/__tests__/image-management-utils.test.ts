/**
 * Test suite for image management utilities
 */

import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { describe } from 'node:test';
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

// Mock data for testing
const createMockImage = (
  id: string,
  order: number,
  isExisting: boolean = false,
  isDeleted: boolean = false
): EnhancedFileState => ({
  file: isExisting ? `https://example.com/image-${id}.jpg` : new File([''], `image-${id}.jpg`),
  key: `key-${id}`,
  progress: 'COMPLETE',
  id: id, // Always include ID for testing purposes
  isExisting,
  isDeleted,
  order
});

describe('Image Management Utils', () => {
  describe('reorderImages', () => {
    it('should reorder images correctly', () => {
      const images = [
        createMockImage('1', 0),
        createMockImage('2', 1),
        createMockImage('3', 2)
      ];

      const result = reorderImages(images, 0, 2);
      
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('3');
      expect(result[2].id).toBe('1');
      expect(result[0].order).toBe(0);
      expect(result[1].order).toBe(1);
      expect(result[2].order).toBe(2);
    });

    it('should return original array for invalid indices', () => {
      const images = [createMockImage('1', 0)];
      const result = reorderImages(images, 0, 5);
      expect(result).toEqual(images);
    });

    it('should return original array when fromIndex equals toIndex', () => {
      const images = [createMockImage('1', 0), createMockImage('2', 1)];
      const result = reorderImages(images, 1, 1);
      expect(result).toEqual(images);
    });
  });

  describe('markImageForDeletion', () => {
    it('should mark image for deletion', () => {
      const images = [
        createMockImage('1', 0, true),
        createMockImage('2', 1, true)
      ];

      const result = markImageForDeletion(images, 0);
      
      expect(result.success).toBe(true);
      expect(result.updatedImages![0].isDeleted).toBe(true);
      expect(result.updatedImages![1].isDeleted).toBe(false);
    });

    it('should return error for invalid index', () => {
      const images = [createMockImage('1', 0)];
      const result = markImageForDeletion(images, 5);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid image index');
    });
  });

  describe('removeImage', () => {
    it('should remove image and update order numbers', () => {
      const images = [
        createMockImage('1', 0),
        createMockImage('2', 1),
        createMockImage('3', 2)
      ];

      const result = removeImage(images, 1);
      
      expect(result.success).toBe(true);
      expect(result.updatedImages!.length).toBe(2);
      expect(result.updatedImages![0].id).toBe('1');
      expect(result.updatedImages![1].id).toBe('3');
      expect(result.updatedImages![0].order).toBe(0);
      expect(result.updatedImages![1].order).toBe(1);
    });

    it('should return error for invalid index', () => {
      const images = [createMockImage('1', 0)];
      const result = removeImage(images, -1);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid image index');
    });
  });

  describe('addImages', () => {
    it('should add new images with correct order', () => {
      const existingImages = [
        createMockImage('1', 0, true),
        createMockImage('2', 1, true)
      ];
      
      const newImages = [
        createMockImage('3', 0),
        createMockImage('4', 0)
      ];

      const result = addImages(existingImages, newImages);
      
      expect(result.length).toBe(4);
      expect(result[2].order).toBe(2);
      expect(result[3].order).toBe(3);
      expect(result[2].isExisting).toBe(false);
      expect(result[3].isExisting).toBe(false);
    });
  });

  describe('convertPropertyImagesToFileState', () => {
    it('should convert property images to FileState format', () => {
      const propertyImages = [
        { id: '1', s3Url: 'https://example.com/1.jpg', order: 1 },
        { id: '2', url: 'https://example.com/2.jpg', order: 0 }
      ];

      const result = convertPropertyImagesToFileState(propertyImages);
      
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('2'); // Should be sorted by order
      expect(result[1].id).toBe('1');
      expect(result[0].isExisting).toBe(true);
      expect(result[0].progress).toBe('COMPLETE');
    });
  });

  describe('getVisibleImages', () => {
    it('should filter out deleted images', () => {
      const images = [
        createMockImage('1', 0, true, false),
        createMockImage('2', 1, true, true),
        createMockImage('3', 2, true, false)
      ];

      const result = getVisibleImages(images);
      
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
    });
  });

  describe('getImagesToDelete', () => {
    it('should return IDs of existing images marked for deletion', () => {
      const images = [
        createMockImage('1', 0, true, true),
        createMockImage('2', 1, false, true), // New image, should not be included
        createMockImage('3', 2, true, false)
      ];

      const result = getImagesToDelete(images);
      
      expect(result).toEqual(['1']);
    });
  });

  describe('getNewImagesToUpload', () => {
    it('should return new images pending upload', () => {
      const images = [
        { ...createMockImage('1', 0, false), progress: 'PENDING' as const },
        { ...createMockImage('2', 1, true), progress: 'COMPLETE' as const },
        { ...createMockImage('3', 2, false), progress: 'COMPLETE' as const }
      ];

      const result = getNewImagesToUpload(images);
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('validateImageCollection', () => {
    it('should validate minimum image requirement', () => {
      const images = [
        createMockImage('1', 0),
        createMockImage('2', 1)
      ];

      const result = validateImageCollection(images, 6, 20);
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Minimum 6 images required');
    });

    it('should validate maximum image requirement', () => {
      const images = Array.from({ length: 25 }, (_, i) => createMockImage(i.toString(), i));

      const result = validateImageCollection(images, 6, 20);
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Maximum 20 images allowed');
    });

    it('should pass validation for valid image count', () => {
      const images = Array.from({ length: 10 }, (_, i) => createMockImage(i.toString(), i));

      const result = validateImageCollection(images, 6, 20);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });

  describe('mergeImageOperations', () => {
    it('should merge all image operations correctly', () => {
      const images = [
        createMockImage('1', 0, true, true), // Existing, deleted
        { 
          file: 'https://example.com/new-image.jpg', // New uploaded image (URL string)
          key: 'new-1',
          progress: 'COMPLETE' as const,
          isExisting: false,
          isDeleted: false,
          order: 1
        },
        createMockImage('3', 2, true, false) // Existing, kept
      ];

      const result = mergeImageOperations(images);
      
      expect(result.imagesToDelete).toEqual(['1']);
      expect(result.newImages.length).toBe(1);
      expect(result.newImages[0].file).toBe('https://example.com/new-image.jpg');
      expect(result.newImages[0].order).toBe(1);
      expect(result.existingImages.length).toBe(1);
      expect(result.existingImages[0].id).toBe('3');
    });
  });

  describe('handleKeyboardNavigation', () => {
    it('should handle arrow key navigation', () => {
      const mockEvent = { key: 'ArrowRight', preventDefault: jest.fn() } as any;
      
      const result = handleKeyboardNavigation(mockEvent, 0, 5, 3);
      
      expect(result).toBe(1);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should wrap around at boundaries', () => {
      const mockEvent = { key: 'ArrowLeft', preventDefault: jest.fn() } as any;
      
      const result = handleKeyboardNavigation(mockEvent, 0, 5, 3);
      
      expect(result).toBe(4); // Should wrap to last item
    });

    it('should handle Home and End keys', () => {
      const homeEvent = { key: 'Home', preventDefault: jest.fn() } as any;
      const endEvent = { key: 'End', preventDefault: jest.fn() } as any;
      
      expect(handleKeyboardNavigation(homeEvent, 3, 5, 3)).toBe(0);
      expect(handleKeyboardNavigation(endEvent, 1, 5, 3)).toBe(4);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 50);

      debouncedFn('test1');
      debouncedFn('test2');
      debouncedFn('test3');

      expect(mockFn).not.toHaveBeenCalled();

      // Wait for debounce delay
      await new Promise(resolve => setTimeout(resolve, 60));

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test3');
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 50);

      throttledFn('test1');
      throttledFn('test2');
      throttledFn('test3');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test1');

      // Wait for throttle delay
      await new Promise(resolve => setTimeout(resolve, 60));

      throttledFn('test4');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('test4');
    });
  });

  describe('createImageErrorMessage', () => {
    it('should create user-friendly error messages', () => {
      const error = new Error('Network timeout');
      const result = createImageErrorMessage(error, 'upload');
      
      expect(result).toBe('Failed to upload image: Network timeout');
    });

    it('should handle string errors', () => {
      const result = createImageErrorMessage('File too large', 'validation');
      
      expect(result).toBe('Image validation failed: File too large');
    });
  });
});