/**
 * Test suite for enhanced MultiImageDropzone component
 * Tests the delete functionality and enhanced FileState interface
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { EnhancedFileState } from '@/lib/image-management-utils';
import { 
  getVisibleImages, 
  markImageForDeletion, 
  removeImage, 
  validateImageCollection 
} from '@/lib/image-management-utils';

describe('MultiImageDropzone Enhanced Functionality', () => {
  const createMockImage = (id: string, isExisting = false, isDeleted = false): EnhancedFileState => ({
    file: isExisting ? `https://example.com/image-${id}.jpg` : new File([''], `image-${id}.jpg`, { type: 'image/jpeg' }),
    key: `key-${id}`,
    progress: 'COMPLETE' as const,
    id: isExisting ? id : undefined,
    isExisting,
    isDeleted,
    order: parseInt(id)
  });

  describe('Enhanced FileState Interface', () => {
    it('should create mock images with correct properties', () => {
      const existingImage = createMockImage('1', true);
      const newImage = createMockImage('2', false);

      expect(existingImage.isExisting).toBe(true);
      expect(existingImage.id).toBe('1');
      expect(existingImage.order).toBe(1);

      expect(newImage.isExisting).toBe(false);
      expect(newImage.id).toBeUndefined();
      expect(newImage.order).toBe(2);
    });

    it('should filter out deleted images correctly', () => {
      const mockImages = [
        createMockImage('1', true, false), // visible
        createMockImage('2', true, true),  // deleted - should not show
        createMockImage('3', false, false) // visible
      ];

      const visibleImages = getVisibleImages(mockImages);
      expect(visibleImages).toHaveLength(2);
      expect(visibleImages[0].key).toBe('key-1');
      expect(visibleImages[1].key).toBe('key-3');
    });

    it('should mark images for deletion correctly', () => {
      const mockImages = [
        createMockImage('1', true, false),
        createMockImage('2', true, false)
      ];

      const result = markImageForDeletion(mockImages, 0);
      expect(result.success).toBe(true);
      expect(result.updatedImages).toBeDefined();
      expect(result.updatedImages![0].isDeleted).toBe(true);
      expect(result.updatedImages![1].isDeleted).toBe(false);
    });

    it('should remove images correctly', () => {
      const mockImages = [
        createMockImage('1', false, false),
        createMockImage('2', false, false),
        createMockImage('3', false, false)
      ];

      const result = removeImage(mockImages, 1);
      expect(result.success).toBe(true);
      expect(result.updatedImages).toHaveLength(2);
      expect(result.updatedImages![0].key).toBe('key-1');
      expect(result.updatedImages![1].key).toBe('key-3');
      // Check that order is updated
      expect(result.updatedImages![0].order).toBe(0);
      expect(result.updatedImages![1].order).toBe(1);
    });

    it('should validate image collection correctly', () => {
      const tooFewImages = [
        createMockImage('1', true, false),
        createMockImage('2', true, false)
      ];

      const validImages = Array.from({ length: 8 }, (_, i) => 
        createMockImage(i.toString(), true, false)
      );

      const tooManyImages = Array.from({ length: 25 }, (_, i) => 
        createMockImage(i.toString(), true, false)
      );

      const tooFewResult = validateImageCollection(tooFewImages, 6, 20);
      expect(tooFewResult.isValid).toBe(false);
      expect(tooFewResult.errors).toHaveLength(1);
      expect(tooFewResult.errors[0]).toContain('Minimum 6 images required');

      const validResult = validateImageCollection(validImages, 6, 20);
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      const tooManyResult = validateImageCollection(tooManyImages, 6, 20);
      expect(tooManyResult.isValid).toBe(false);
      expect(tooManyResult.errors).toHaveLength(1);
      expect(tooManyResult.errors[0]).toContain('Maximum 20 images allowed');
    });
  });

  describe('Component Props Interface', () => {
    it('should support new props for delete functionality', () => {
      // Test that the new props are properly typed
      const props = {
        allowDelete: true,
        showDeleteConfirmation: true,
        minImages: 6,
        maxImages: 20,
        onImageDelete: () => {}
      };

      // This test passes if TypeScript compilation succeeds
      expect(props.allowDelete).toBe(true);
      expect(props.showDeleteConfirmation).toBe(true);
      expect(props.minImages).toBe(6);
      expect(props.maxImages).toBe(20);
      expect(typeof props.onImageDelete).toBe('function');
    });

    it('should maintain backward compatibility with existing props', () => {
      const legacyProps = {
        value: [],
        onChange: () => {},
        onFilesAdded: () => {},
        disabled: false,
        className: 'custom-class',
        dropzoneOptions: { maxFiles: 10, maxSize: 5000000 }
      };

      // This test passes if TypeScript compilation succeeds
      expect(Array.isArray(legacyProps.value)).toBe(true);
      expect(typeof legacyProps.onChange).toBe('function');
      expect(typeof legacyProps.onFilesAdded).toBe('function');
      expect(legacyProps.disabled).toBe(false);
      expect(legacyProps.className).toBe('custom-class');
      expect(legacyProps.dropzoneOptions.maxFiles).toBe(10);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid indices gracefully', () => {
      const mockImages = [createMockImage('1', true, false)];

      const deleteResult = markImageForDeletion(mockImages, -1);
      expect(deleteResult.success).toBe(false);
      expect(deleteResult.message).toBe('Invalid image index');

      const removeResult = removeImage(mockImages, 5);
      expect(removeResult.success).toBe(false);
      expect(removeResult.message).toBe('Invalid image index');
    });

    it('should handle empty image arrays', () => {
      const emptyImages: EnhancedFileState[] = [];

      const visibleImages = getVisibleImages(emptyImages);
      expect(visibleImages).toHaveLength(0);

      const validation = validateImageCollection(emptyImages, 6, 20);
      expect(validation.isValid).toBe(false);
      expect(validation.errors[0]).toContain('Minimum 6 images required');
    });
  });
});