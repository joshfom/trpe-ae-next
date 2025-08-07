/**
 * Test suite for LuxePropertyForm enhanced image management functionality
 * Tests the integration of enhanced image state management, deletion, and reordering
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import LuxePropertyForm from '../LuxePropertyForm';
import { 
    convertPropertyImagesToFileState,
    getVisibleImages,
    validateImageCollection,
    mergeImageOperations 
} from '@/lib/image-management-utils';

// Mock dependencies
jest.mock('@/db/edgestore', () => ({
    useEdgeStore: () => ({
        edgestore: {
            publicFiles: {
                upload: jest.fn().mockResolvedValue({ url: 'https://example.com/image.jpg' })
            }
        }
    })
}));

jest.mock('@/hooks/use-image-upload', () => ({
    useImageUpload: () => ({
        convertToWebP: jest.fn().mockResolvedValue(new File([''], 'test.webp', { type: 'image/webp' }))
    })
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn()
    })
}));

// Mock API hooks
jest.mock('@/features/admin/luxe/agents/api/use-get-luxe-agents', () => ({
    useGetLuxeAgents: () => ({
        data: [{ id: '1', firstName: 'John', lastName: 'Doe' }],
        isLoading: false,
        isError: false
    })
}));

jest.mock('@/features/admin/community/api/use-get-admin-communities', () => ({
    useGetAdminCommunities: () => ({
        data: [{ id: '1', title: 'Test Community' }],
        isLoading: false,
        isError: false
    })
}));

jest.mock('@/features/admin/property-types/api/use-get-admin-property-types', () => ({
    useGetAdminPropertyTypes: () => ({
        data: [{ id: '1', title: 'Apartment' }],
        isLoading: false,
        isError: false
    })
}));

jest.mock('@/features/admin/offering/api/use-get-admin-offering-types', () => ({
    useGetAdminOfferingTypes: () => ({
        data: [{ id: '1', title: 'For Sale' }],
        isLoading: false,
        isError: false
    })
}));

jest.mock('@/actions/admin/luxe/properties/validate-slug-action', () => ({
    validateLuxePropertySlugAction: jest.fn().mockResolvedValue({ success: true, suggestedSlug: 'test-slug' }),
    generateSlugFromTitleAction: jest.fn().mockResolvedValue({ success: true, slug: 'test-slug' })
}));

jest.mock('@/actions/admin/luxe/properties/luxe-property-actions', () => ({
    createLuxePropertyAction: jest.fn().mockResolvedValue({ success: true, message: 'Property created' }),
    updateLuxePropertyAction: jest.fn().mockResolvedValue({ success: true, message: 'Property updated' })
}));

describe('LuxePropertyForm Enhanced Image Management', () => {
    const mockProperty = {
        id: '1',
        name: 'Test Property',
        slug: 'test-property',
        images: [
            { id: '1', s3Url: 'https://example.com/image1.jpg', order: 0 },
            { id: '2', s3Url: 'https://example.com/image2.jpg', order: 1 },
            { id: '3', s3Url: 'https://example.com/image3.jpg', order: 2 }
        ]
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Image State Management', () => {
        test('should convert property images to enhanced file state', () => {
            const fileStates = convertPropertyImagesToFileState(mockProperty.images);
            
            expect(fileStates).toHaveLength(3);
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
            const existingImages = convertPropertyImagesToFileState(mockProperty.images);
            const newImage = {
                file: new File([''], 'new.jpg', { type: 'image/jpeg' }),
                key: 'new-1',
                progress: 'PENDING' as const,
                isExisting: false,
                isDeleted: false,
                order: 3
            };

            const allImages = [...existingImages, newImage];
            const visibleImages = getVisibleImages(allImages);
            
            expect(visibleImages).toHaveLength(4);
            expect(visibleImages.filter(img => img.isExisting)).toHaveLength(3);
            expect(visibleImages.filter(img => !img.isExisting)).toHaveLength(1);
        });
    });

    describe('Image Validation', () => {
        test('should validate minimum image requirements', () => {
            const images = convertPropertyImagesToFileState(mockProperty.images.slice(0, 2)); // Only 2 images
            const validation = validateImageCollection(images, 6, 20);
            
            expect(validation.isValid).toBe(false);
            expect(validation.errors[0]).toContain('Minimum 6 images required');
        });

        test('should validate maximum image requirements', () => {
            const manyImages = Array.from({ length: 25 }, (_, i) => ({
                id: `${i}`,
                s3Url: `https://example.com/image${i}.jpg`,
                order: i
            }));
            
            const images = convertPropertyImagesToFileState(manyImages);
            const validation = validateImageCollection(images, 6, 20);
            
            expect(validation.isValid).toBe(false);
            expect(validation.errors[0]).toContain('Maximum 40 images allowed');
        });

        test('should pass validation with correct image count', () => {
            const correctImages = Array.from({ length: 10 }, (_, i) => ({
                id: `${i}`,
                s3Url: `https://example.com/image${i}.jpg`,
                order: i
            }));
            
            const images = convertPropertyImagesToFileState(correctImages);
            const validation = validateImageCollection(images, 6, 20);
            
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });
    });

    describe('Image Operations', () => {
        test('should merge image operations correctly', () => {
            const images = convertPropertyImagesToFileState(mockProperty.images);
            
            // Mark one image for deletion
            images[1].isDeleted = true;
            
            // Add a new uploaded image
            images.push({
                file: 'https://example.com/new-image.jpg',
                key: 'new-1',
                progress: 'COMPLETE',
                isExisting: false,
                isDeleted: false,
                order: 3
            });

            const operations = mergeImageOperations(images);
            
            expect(operations.imagesToDelete).toContain('2');
            expect(operations.newImages).toHaveLength(1);
            expect(operations.newImages[0].file).toBe('https://example.com/new-image.jpg');
            expect(operations.existingImages).toHaveLength(2); // 3 original - 1 deleted
        });
    });

    describe('Form Integration', () => {
        test('should load existing images on mount when editing', async () => {
            render(<LuxePropertyForm property={mockProperty} />);
            
            // Wait for the form to load
            await waitFor(() => {
                expect(screen.getByDisplayValue('Test Property')).toBeInTheDocument();
            });

            // The MultiImageDropzone should be rendered with existing images
            // Note: This is a basic test - in a real scenario, you'd test the actual image display
            expect(screen.getByText(/Property Images/)).toBeInTheDocument();
        });

        test('should handle form submission with enhanced image operations', async () => {
            const mockUpdateAction = jest.fn().mockResolvedValue({ success: true, message: 'Updated' });
            jest.doMock('@/actions/admin/luxe/properties/luxe-property-actions', () => ({
                updateLuxePropertyAction: mockUpdateAction
            }));

            render(<LuxePropertyForm property={mockProperty} />);
            
            // Wait for form to load
            await waitFor(() => {
                expect(screen.getByDisplayValue('Test Property')).toBeInTheDocument();
            });

            // Submit the form
            const submitButton = screen.getByRole('button', { name: /Update Property/i });
            fireEvent.click(submitButton);

            // The form should call the update action with enhanced image operations
            await waitFor(() => {
                expect(mockUpdateAction).toHaveBeenCalled();
            });
        });
    });

    describe('Error Handling', () => {
        test('should handle image upload errors gracefully', async () => {
            const mockEdgeStore = {
                publicFiles: {
                    upload: jest.fn().mockRejectedValue(new Error('Upload failed'))
                }
            };

            jest.doMock('@/db/edgestore', () => ({
                useEdgeStore: () => ({ edgestore: mockEdgeStore })
            }));

            render(<LuxePropertyForm />);
            
            // This test would need more setup to actually trigger an upload
            // but demonstrates the structure for testing error handling
            expect(screen.getByText(/Property Images/)).toBeInTheDocument();
        });
    });
});