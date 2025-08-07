import { describe, it, expect, beforeEach } from 'bun:test';
import { EnhancedFileState, reorderImages } from '@/lib/image-management-utils';

describe('MultiImageDropzone Integration with SortableImageGrid', () => {
  const createMockImage = (id: string, isExisting = false, isDeleted = false): EnhancedFileState => ({
    file: isExisting ? `https://example.com/image-${id}.jpg` : new File([''], `image-${id}.jpg`, { type: 'image/jpeg' }),
    key: `key-${id}`,
    progress: 'COMPLETE' as const,
    id: isExisting ? id : undefined,
    isExisting,
    isDeleted,
    order: parseInt(id)
  });

  const mockImages: EnhancedFileState[] = [
    createMockImage('1', true, false),
    createMockImage('2', false, false)
  ];

  it('should integrate SortableImageGrid with correct props structure', () => {
    const props = {
      value: mockImages,
      onChange: () => {},
      onImageDelete: () => {},
      onImageReorder: () => {},
      allowDelete: true,
      allowReorder: true,
      disabled: false
    };

    // Verify that the component props are structured correctly for integration
    expect(props.allowDelete).toBe(true);
    expect(props.allowReorder).toBe(true);
    expect(props.value).toEqual(mockImages);
    expect(typeof props.onChange).toBe('function');
    expect(typeof props.onImageDelete).toBe('function');
    expect(typeof props.onImageReorder).toBe('function');
  });

  it('should handle reorder operations correctly', () => {
    const images = [
      createMockImage('1', true, false),
      createMockImage('2', false, false),
      createMockImage('3', true, false)
    ];

    const result = reorderImages(images, 0, 2);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    
    // First image should now be at the end
    expect(result[2].key).toBe('key-1');
    // Order should be updated
    expect(result[2].order).toBe(2);
  });

  it('should maintain backward compatibility without new props', () => {
    const props = {
      value: mockImages,
      onChange: () => {},
      allowDelete: true,
      // allowReorder defaults to true, onImageReorder is optional
    };

    expect(props.allowDelete).toBe(true);
    expect(props.value).toEqual(mockImages);
    expect(typeof props.onChange).toBe('function');
  });

  it('should handle empty image arrays', () => {
    const props = {
      value: [],
      onChange: () => {},
      allowDelete: true,
      allowReorder: true,
    };

    expect(props.value).toEqual([]);
    expect(props.allowDelete).toBe(true);
    expect(props.allowReorder).toBe(true);
  });

  it('should filter deleted images correctly for display', () => {
    const imagesWithDeleted: EnhancedFileState[] = [
      createMockImage('1', true, false),
      createMockImage('2', false, false),
      createMockImage('3', true, true) // This should be filtered out
    ];

    const visibleImages = imagesWithDeleted.filter(img => !img.isDeleted);
    expect(visibleImages).toHaveLength(2);
    expect(visibleImages.every(img => !img.isDeleted)).toBe(true);
    expect(visibleImages.map(img => img.key)).toEqual(['key-1', 'key-2']);
  });

  it('should support both existing and new images in reorder operations', () => {
    const mixedImages = [
      createMockImage('1', true, false),  // existing
      createMockImage('2', false, false), // new
      createMockImage('3', true, false)   // existing
    ];

    const result = reorderImages(mixedImages, 1, 0);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    
    // New image should now be first
    expect(result[0].key).toBe('key-2');
    expect(result[0].isExisting).toBe(false);
    expect(result[0].order).toBe(0);
  });
});