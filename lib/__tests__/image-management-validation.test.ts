/**
 * Tests for enhanced image validation utilities
 * Tests the comprehensive validation functions for image management
 */

import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { describe } from 'node:test';
import {
    EnhancedFileState,
    validateImageCollection,
    validateImageOperationRealTime,
    validateImagesForSubmission
} from '../image-management-utils';

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

describe('Enhanced Image Validation Utilities', () => {
    describe('validateImageCollection', () => {
        it('should return comprehensive validation result for valid images', () => {
            const images = createMockImages(8);
            const result = validateImageCollection(images, 6, 20);

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.warnings).toHaveLength(0);
            expect(result.counts.visible).toBe(8);
            expect(result.counts.total).toBe(8);
            expect(result.counts.existing).toBe(0);
            expect(result.counts.new).toBe(8);
            expect(result.counts.deleted).toBe(0);
        });

        it('should detect minimum image violations', () => {
            const images = createMockImages(3);
            const result = validateImageCollection(images, 6, 20);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Minimum 6 images required. Add 3 more images.');
            expect(result.counts.visible).toBe(3);
        });

        it('should detect maximum image violations', () => {
            const images = createMockImages(25);
            const result = validateImageCollection(images, 6, 20);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Maximum 20 images allowed. Remove 5 images.');
            expect(result.counts.visible).toBe(25);
        });

        it('should handle mixed existing and new images', () => {
            const existingImages = createMockImages(4, { isExisting: true });
            const newImages = createMockImages(3, { isExisting: false });
            const allImages = [...existingImages, ...newImages];

            const result = validateImageCollection(allImages, 6, 20);

            expect(result.isValid).toBe(true);
            expect(result.counts.existing).toBe(4);
            expect(result.counts.new).toBe(3);
            expect(result.counts.visible).toBe(7);
        });

        it('should exclude deleted images from visible count', () => {
            const visibleImages = createMockImages(5);
            const deletedImages = createMockImages(3, { isDeleted: true });
            const allImages = [...visibleImages, ...deletedImages];

            const result = validateImageCollection(allImages, 6, 20);

            expect(result.isValid).toBe(false); // 5 < 6 minimum
            expect(result.counts.visible).toBe(5);
            expect(result.counts.deleted).toBe(3);
            expect(result.counts.total).toBe(8);
        });

        it('should detect pending uploads', () => {
            const completedImages = createMockImages(6, { progress: 'COMPLETE' });
            const pendingImages = createMockImages(2, { progress: 'PENDING' });
            const allImages = [...completedImages, ...pendingImages];

            const result = validateImageCollection(allImages, 6, 20);

            expect(result.isValid).toBe(true);
            expect(result.warnings).toContain('2 images still uploading. Please wait for completion.');
        });

        it('should detect failed uploads', () => {
            const completedImages = createMockImages(6, { progress: 'COMPLETE' });
            const failedImages = createMockImages(2, { progress: 'ERROR' });
            const allImages = [...completedImages, ...failedImages];

            const result = validateImageCollection(allImages, 6, 20);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('2 images failed to upload. Please retry or remove them.');
        });

        it('should allow incomplete images in basic validation', () => {
            const completedImages = createMockImages(6, { progress: 'COMPLETE' });
            const incompleteImages = createMockImages(2, { progress: 50 });
            const allImages = [...completedImages, ...incompleteImages];

            const result = validateImageCollection(allImages, 6, 20);

            expect(result.isValid).toBe(true); // Basic validation passes, submission validation will catch incomplete images
            expect(result.counts.visible).toBe(8);
        });
    });

    describe('validateImageOperationRealTime', () => {
        it('should validate add operation near maximum', () => {
            const images = createMockImages(19);
            const result = validateImageOperationRealTime(images, 'add', 6, 20);

            expect(result.isValid).toBe(true);
            expect(result.warnings).toContain('Adding this image will reach the maximum limit of 20 images.');
        });

        it('should prevent add operation at maximum', () => {
            const images = createMockImages(20);
            const result = validateImageOperationRealTime(images, 'add', 6, 20);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Cannot add more images. Maximum 20 images allowed.');
        });

        it('should validate delete operation near minimum', () => {
            const images = createMockImages(7);
            const result = validateImageOperationRealTime(images, 'delete', 6, 20);

            expect(result.isValid).toBe(true);
            expect(result.warnings).toContain('Deleting this image will reach the minimum limit of 6 images.');
        });

        it('should prevent delete operation at minimum', () => {
            const images = createMockImages(6);
            const result = validateImageOperationRealTime(images, 'delete', 6, 20);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Cannot delete image. Minimum 6 images required.');
        });

        it('should detect uploading images during upload operation', () => {
            const completedImages = createMockImages(5, { progress: 'COMPLETE' });
            const uploadingImages = createMockImages(2, { progress: 75 });
            const allImages = [...completedImages, ...uploadingImages];

            const result = validateImageOperationRealTime(allImages, 'upload', 6, 20);

            expect(result.warnings).toContain('2 images currently uploading...');
        });
    });

    describe('validateImagesForSubmission', () => {
        it('should validate complete images for submission', () => {
            const images = createMockImages(8, { progress: 'COMPLETE' });
            const result = validateImagesForSubmission(images, 6, 20);

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should fail validation with pending uploads', () => {
            const completedImages = createMockImages(6, { progress: 'COMPLETE' });
            const pendingImages = createMockImages(2, { progress: 'PENDING' });
            const allImages = [...completedImages, ...pendingImages];

            const result = validateImagesForSubmission(allImages, 6, 20);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('2 images not uploaded yet. Please wait for upload to complete.');
        });

        it('should fail validation with uploading images', () => {
            const completedImages = createMockImages(6, { progress: 'COMPLETE' });
            const uploadingImages = createMockImages(2, { progress: 50 });
            const allImages = [...completedImages, ...uploadingImages];

            const result = validateImagesForSubmission(allImages, 6, 20);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('2 images are still uploading. Please wait for completion.');
        });

        it('should fail validation with error images', () => {
            const completedImages = createMockImages(6, { progress: 'COMPLETE' });
            const errorImages = createMockImages(2, { progress: 'ERROR' });
            const allImages = [...completedImages, ...errorImages];

            const result = validateImagesForSubmission(allImages, 6, 20);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('2 images failed to upload. Please retry or remove them.');
        });

        it('should fail validation with invalid URLs', () => {
            const validImages = createMockImages(6, { 
                progress: 'COMPLETE',
                file: 'https://example.com/valid.jpg'
            });
            const invalidImages = createMockImages(2, { 
                progress: 'COMPLETE',
                file: '' // Invalid URL
            });
            const allImages = [...validImages, ...invalidImages];

            const result = validateImagesForSubmission(allImages, 6, 20);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('2 images have invalid URL. Please re-upload.');
        });

        it('should handle mixed existing and new images for submission', () => {
            const existingImages = createMockImages(4, { 
                isExisting: true,
                progress: 'COMPLETE'
            });
            const newImages = createMockImages(3, { 
                isExisting: false,
                progress: 'COMPLETE'
            });
            const allImages = [...existingImages, ...newImages];

            const result = validateImagesForSubmission(allImages, 6, 20);

            expect(result.isValid).toBe(true);
            expect(result.counts.existing).toBe(4);
            expect(result.counts.new).toBe(3);
            expect(result.counts.visible).toBe(7);
        });

        it('should handle complex submission scenario', () => {
            const existingImages = createMockImages(3, { 
                isExisting: true,
                progress: 'COMPLETE'
            });
            const deletedExistingImages = createMockImages(1, { 
                isExisting: true,
                isDeleted: true,
                progress: 'COMPLETE'
            });
            const newCompletedImages = createMockImages(4, { 
                isExisting: false,
                progress: 'COMPLETE'
            });
            const newPendingImages = createMockImages(1, { 
                isExisting: false,
                progress: 'PENDING'
            });

            const allImages = [
                ...existingImages,
                ...deletedExistingImages,
                ...newCompletedImages,
                ...newPendingImages
            ];

            const result = validateImagesForSubmission(allImages, 6, 20);

            expect(result.isValid).toBe(false); // Due to pending upload
            expect(result.counts.visible).toBe(8); // 3 existing + 4 new completed + 1 new pending (still visible until deleted)
            expect(result.counts.deleted).toBe(1);
            expect(result.errors.some(error => error.includes('not uploaded yet'))).toBe(true);
        });
    });

    describe('Edge cases', () => {
        it('should handle empty image array', () => {
            const result = validateImageCollection([], 6, 20);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Minimum 6 images required. Add 6 more images.');
            expect(result.counts.visible).toBe(0);
        });

        it('should handle all deleted images', () => {
            const deletedImages = createMockImages(8, { isDeleted: true });
            const result = validateImageCollection(deletedImages, 6, 20);

            expect(result.isValid).toBe(false);
            expect(result.counts.visible).toBe(0);
            expect(result.counts.deleted).toBe(8);
        });

        it('should handle custom min/max values', () => {
            const images = createMockImages(3);
            const result = validateImageCollection(images, 2, 5);

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    });
});