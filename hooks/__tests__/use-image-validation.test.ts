/**
 * Tests for useImageValidation hook
 * Comprehensive validation testing for image management
 */

import { renderHook } from '@testing-library/react';
import { useImageValidation } from '../use-image-validation';
import { EnhancedFileState } from '@/lib/image-management-utils';

// Mock data helpers
const createMockImage = (overrides: Partial<EnhancedFileState> = {}): EnhancedFileState => ({
    file: 'https://example.com/image.jpg',
    key: `mock-${Math.random()}`,
    progress: 'COMPLETE',
    order: 0,
    isExisting: false,
    isDeleted: false,
    ...overrides
});

const createMockImages = (count: number, overrides: Partial<EnhancedFileState> = {}): EnhancedFileState[] => {
    return Array.from({ length: count }, (_, index) => 
        createMockImage({ 
            order: index, 
            key: `mock-${index}`,
            ...overrides 
        })
    );
};

describe('useImageValidation', () => {
    describe('Basic validation', () => {
        it('should validate minimum image requirements', () => {
            const images = createMockImages(3); // Less than minimum 6
            const { result } = renderHook(() => useImageValidation(images));

            expect(result.current.isValid).toBe(false);
            expect(result.current.hasErrors).toBe(true);
            expect(result.current.errorMessage).toContain('Minimum 6 images required');
            expect(result.current.counts.visible).toBe(3);
        });

        it('should validate maximum image requirements', () => {
            const images = createMockImages(25); // More than maximum 20
            const { result } = renderHook(() => useImageValidation(images));

            expect(result.current.isValid).toBe(false);
            expect(result.current.hasErrors).toBe(true);
            expect(result.current.errorMessage).toContain('Maximum 20 images allowed');
            expect(result.current.counts.visible).toBe(25);
        });

        it('should validate valid image count', () => {
            const images = createMockImages(10); // Valid count
            const { result } = renderHook(() => useImageValidation(images));

            expect(result.current.isValid).toBe(true);
            expect(result.current.hasErrors).toBe(false);
            expect(result.current.errorMessage).toBeNull();
            expect(result.current.counts.visible).toBe(10);
        });
    });

    describe('Mixed existing and new images', () => {
        it('should correctly count existing and new images', () => {
            const existingImages = createMockImages(4, { isExisting: true });
            const newImages = createMockImages(3, { isExisting: false });
            const allImages = [...existingImages, ...newImages];

            const { result } = renderHook(() => useImageValidation(allImages));

            expect(result.current.counts.existing).toBe(4);
            expect(result.current.counts.new).toBe(3);
            expect(result.current.counts.visible).toBe(7);
            expect(result.current.isValid).toBe(true);
        });

        it('should handle deleted images correctly', () => {
            const existingImages = createMockImages(5, { isExisting: true });
            const deletedImages = createMockImages(2, { isExisting: true, isDeleted: true });
            const newImages = createMockImages(3, { isExisting: false });
            const allImages = [...existingImages, ...deletedImages, ...newImages];

            const { result } = renderHook(() => useImageValidation(allImages));

            expect(result.current.counts.existing).toBe(5); // Only non-deleted existing
            expect(result.current.counts.new).toBe(3);
            expect(result.current.counts.deleted).toBe(2);
            expect(result.current.counts.visible).toBe(8); // 5 existing + 3 new
            expect(result.current.isValid).toBe(true);
        });
    });

    describe('Upload progress validation', () => {
        it('should show warnings for pending uploads', () => {
            const completedImages = createMockImages(5, { progress: 'COMPLETE' });
            const pendingImages = createMockImages(2, { progress: 'PENDING' });
            const allImages = [...completedImages, ...pendingImages];

            const { result } = renderHook(() => useImageValidation(allImages));

            expect(result.current.hasWarnings).toBe(true);
            expect(result.current.warningMessage).toContain('still uploading');
        });

        it('should show errors for failed uploads', () => {
            const completedImages = createMockImages(5, { progress: 'COMPLETE' });
            const failedImages = createMockImages(2, { progress: 'ERROR' });
            const allImages = [...completedImages, ...failedImages];

            const { result } = renderHook(() => useImageValidation(allImages));

            expect(result.current.hasErrors).toBe(true);
            expect(result.current.errorMessage).toContain('failed to upload');
        });

        it('should handle uploading images with progress numbers', () => {
            const completedImages = createMockImages(5, { progress: 'COMPLETE' });
            const uploadingImages = createMockImages(2, { progress: 50 });
            const allImages = [...completedImages, ...uploadingImages];

            const { result } = renderHook(() => useImageValidation(allImages));

            expect(result.current.hasWarnings).toBe(true);
            expect(result.current.warningMessage).toContain('uploading');
        });
    });

    describe('Operation-specific validation', () => {
        it('should validate add operation', () => {
            const images = createMockImages(19); // Near maximum
            const { result } = renderHook(() => useImageValidation(images));

            const addValidation = result.current.validateOperation('add');
            expect(addValidation.warnings).toContain(
                expect.stringContaining('reach the maximum limit')
            );
        });

        it('should validate delete operation', () => {
            const images = createMockImages(7); // Near minimum
            const { result } = renderHook(() => useImageValidation(images));

            const deleteValidation = result.current.validateOperation('delete');
            expect(deleteValidation.warnings).toContain(
                expect.stringContaining('reach the minimum limit')
            );
        });

        it('should prevent delete when at minimum', () => {
            const images = createMockImages(6); // At minimum
            const { result } = renderHook(() => useImageValidation(images));

            const deleteValidation = result.current.validateOperation('delete');
            expect(deleteValidation.isValid).toBe(false);
            expect(deleteValidation.errors).toContain(
                expect.stringContaining('Cannot delete image')
            );
        });

        it('should prevent add when at maximum', () => {
            const images = createMockImages(20); // At maximum
            const { result } = renderHook(() => useImageValidation(images));

            const addValidation = result.current.validateOperation('add');
            expect(addValidation.isValid).toBe(false);
            expect(addValidation.errors).toContain(
                expect.stringContaining('Cannot add more images')
            );
        });
    });

    describe('Submission validation', () => {
        it('should validate for submission with complete images', () => {
            const images = createMockImages(8, { progress: 'COMPLETE' });
            const { result } = renderHook(() => useImageValidation(images));

            const submissionValidation = result.current.validateForSubmission();
            expect(submissionValidation.isValid).toBe(true);
            expect(submissionValidation.errors).toHaveLength(0);
        });

        it('should fail submission validation with pending uploads', () => {
            const completedImages = createMockImages(6, { progress: 'COMPLETE' });
            const pendingImages = createMockImages(2, { progress: 'PENDING' });
            const allImages = [...completedImages, ...pendingImages];

            const { result } = renderHook(() => useImageValidation(allImages));

            const submissionValidation = result.current.validateForSubmission();
            expect(submissionValidation.isValid).toBe(false);
            expect(submissionValidation.errors).toContain(
                expect.stringContaining('not uploaded yet')
            );
        });

        it('should fail submission validation with invalid URLs', () => {
            const validImages = createMockImages(5, { progress: 'COMPLETE' });
            const invalidImages = createMockImages(2, { 
                progress: 'COMPLETE', 
                file: '' // Invalid URL
            });
            const allImages = [...validImages, ...invalidImages];

            const { result } = renderHook(() => useImageValidation(allImages));

            const submissionValidation = result.current.validateForSubmission();
            expect(submissionValidation.isValid).toBe(false);
            expect(submissionValidation.errors).toContain(
                expect.stringContaining('invalid URL')
            );
        });
    });

    describe('Custom validation options', () => {
        it('should use custom min/max values', () => {
            const images = createMockImages(3);
            const { result } = renderHook(() => 
                useImageValidation(images, { minImages: 2, maxImages: 5 })
            );

            expect(result.current.isValid).toBe(true);
            expect(result.current.hasErrors).toBe(false);
        });

        it('should disable real-time validation when requested', () => {
            const images = createMockImages(3); // Less than default minimum
            const { result } = renderHook(() => 
                useImageValidation(images, { enableRealTimeValidation: false })
            );

            expect(result.current.isValid).toBe(true); // Should not validate in real-time
            expect(result.current.hasErrors).toBe(false);
        });
    });

    describe('Validation counts', () => {
        it('should provide accurate counts for complex scenarios', () => {
            const existingImages = createMockImages(3, { isExisting: true });
            const deletedExistingImages = createMockImages(2, { 
                isExisting: true, 
                isDeleted: true 
            });
            const newImages = createMockImages(4, { isExisting: false });
            const deletedNewImages = createMockImages(1, { 
                isExisting: false, 
                isDeleted: true 
            });
            
            const allImages = [
                ...existingImages,
                ...deletedExistingImages,
                ...newImages,
                ...deletedNewImages
            ];

            const { result } = renderHook(() => useImageValidation(allImages));

            expect(result.current.counts.total).toBe(10);
            expect(result.current.counts.existing).toBe(3);
            expect(result.current.counts.new).toBe(4);
            expect(result.current.counts.deleted).toBe(3); // 2 existing + 1 new
            expect(result.current.counts.visible).toBe(7); // 3 existing + 4 new
        });
    });
});