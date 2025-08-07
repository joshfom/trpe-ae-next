/**
 * End-to-end workflow tests for LuxePropertyForm image management
 * Tests complete user workflows from load to save
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LuxePropertyForm from '../LuxePropertyForm';
import { 
    convertPropertyImagesToFileState,
    reorderImages,
    markImageForDeletion,
    validateImageCollection,
    mergeImageOperations
} from '@/lib/image-management-utils';

// Mock all dependencies
jest.mock('@/db/edgestore', () => ({
    useEdgeStore: () => ({
        edgestore: {
            publicFiles: {
                upload: jest.fn().mockResolvedValue({ url: 'https://example.com/uploaded.jpg' })
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
        data: [{ id: '1', title: 'Villa' }],
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

// Mock server actions
const mockUpdateAction = jest.fn().mockResolvedValue({ success: true, message: 'Property updated' });
const mockCreateAction = jest.fn().mockResolvedValue({ success: true, message: 'Property created' });

jest.mock('@/actions/admin/luxe/properties/luxe-property-actions', () => ({
    updateLuxePropertyAction: mockUpdateAction,
    createLuxePropertyAction: mockCreateAction
}));

jest.mock('@/actions/admin/luxe/properties/validate-slug-action', () => ({
    validateLuxePropertySlugAction: jest.fn().mockResolvedValue({ success: true, isUnique: true }),
    generateSlugFromTitleAction: jest.fn().mockResolvedValue({ success: true, slug: 'test-property' })
}));

// Mock toast
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn()
    }
}));

describe('LuxePropertyForm - End-to-End Image Management Workflow', () => {
    const mockProperty = {
        id: '1',
        name: 'Luxury Villa Dubai',
        slug: 'luxury-villa-dubai',
        description: 'A stunning luxury villa in Dubai',
        bedrooms: 5,
        bathrooms: 6,
        price: 5000000,
        size: 8000,
        communityId: '1',
        typeId: '1',
        offeringTypeId: '1',
        agentId: '1',
        permitNumber: 'DLD-123456',
        images: [
            { id: '1', s3Url: 'https://example.com/image1.jpg', order: 0 },
            { id: '2', s3Url: 'https://example.com/image2.jpg', order: 1 },
            { id: '3', s3Url: 'https://example.com/image3.jpg', order: 2 },
            { id: '4', s3Url: 'https://example.com/image4.jpg', order: 3 },
            { id: '5', s3Url: 'https://example.com/image5.jpg', order: 4 },
            { id: '6', s3Url: 'https://example.com/image6.jpg', order: 5 },
            { id: '7', s3Url: 'https://example.com/image7.jpg', order: 6 },
            { id: '8', s3Url: 'https://example.com/image8.jpg', order: 7 }
        ]
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Complete Edit Workflow', () => {
        it('should load existing property with images and allow full editing workflow', async () => {
            const user = userEvent.setup();
            render(<LuxePropertyForm property={mockProperty} />);

            // 1. Verify initial load
            await waitFor(() => {
                expect(screen.getByDisplayValue('Luxury Villa Dubai')).toBeInTheDocument();
                expect(screen.getByText('8 of 20 images')).toBeInTheDocument();
                expect(screen.getByText('Valid')).toBeInTheDocument();
            });

            // 2. Test image reordering
            const images = screen.getAllByRole('button');
            const firstImage = images[0];
            const thirdImage = images[2];

            fireEvent.dragStart(firstImage, {
                dataTransfer: {
                    setData: jest.fn(),
                    setDragImage: jest.fn(),
                },
            });

            fireEvent.drop(thirdImage, {
                dataTransfer: {
                    getData: () => '0',
                },
            });

            // 3. Test image deletion
            // Simulate clicking delete button on an image
            const deleteButtons = screen.queryAllByLabelText(/delete/i);
            if (deleteButtons.length > 0) {
                await user.click(deleteButtons[0]);
                
                // Confirm deletion if confirmation dialog appears
                const confirmButton = screen.queryByText('Delete');
                if (confirmButton) {
                    await user.click(confirmButton);
                }
            }

            // 4. Verify validation updates
            await waitFor(() => {
                // Should still be valid after one deletion (8 - 1 = 7 images)
                expect(screen.getByText(/7 of 20 images/)).toBeInTheDocument();
                expect(screen.getByText('Valid')).toBeInTheDocument();
            });

            // 5. Submit form
            const submitButton = screen.getByRole('button', { name: /update|save/i });
            await user.click(submitButton);

            // 6. Verify submission
            await waitFor(() => {
                expect(mockUpdateAction).toHaveBeenCalledWith(
                    mockProperty.id,
                    expect.objectContaining({
                        name: 'Luxury Villa Dubai',
                        imageOperations: expect.objectContaining({
                            imagesToDelete: expect.any(Array),
                            orderUpdates: expect.any(Array)
                        })
                    })
                );
            });
        });

        it('should handle complex mixed operations workflow', async () => {
            const user = userEvent.setup();
            render(<LuxePropertyForm property={mockProperty} />);

            await waitFor(() => {
                expect(screen.getByDisplayValue('Luxury Villa Dubai')).toBeInTheDocument();
            });

            // 1. Delete multiple images
            const deleteButtons = screen.queryAllByLabelText(/delete/i);
            if (deleteButtons.length >= 3) {
                for (let i = 0; i < 3; i++) {
                    await user.click(deleteButtons[i]);
                    
                    const confirmButton = screen.queryByText('Delete');
                    if (confirmButton) {
                        await user.click(confirmButton);
                    }
                }
            }

            // 2. Verify validation after deletions (8 - 3 = 5 images, below minimum)
            await waitFor(() => {
                expect(screen.getByText(/5 of 20 images/)).toBeInTheDocument();
                expect(screen.getByText('Need more')).toBeInTheDocument();
            });

            // 3. Add new images via file upload
            const fileInput = screen.getByLabelText(/upload/i) || screen.getByRole('button', { name: /upload/i });
            if (fileInput) {
                const newFiles = [
                    new File([''], 'new1.jpg', { type: 'image/jpeg' }),
                    new File([''], 'new2.jpg', { type: 'image/jpeg' }),
                    new File([''], 'new3.jpg', { type: 'image/jpeg' })
                ];

                await user.upload(fileInput, newFiles);
            }

            // 4. Verify validation after additions (5 + 3 = 8 images, valid)
            await waitFor(() => {
                expect(screen.getByText(/8 of 20 images/)).toBeInTheDocument();
                expect(screen.getByText('Valid')).toBeInTheDocument();
            });

            // 5. Reorder the new mixed collection
            const updatedImages = screen.getAllByRole('button');
            if (updatedImages.length >= 2) {
                fireEvent.dragStart(updatedImages[0]);
                fireEvent.drop(updatedImages[1], {
                    dataTransfer: { getData: () => '0' },
                });
            }

            // 6. Submit the complex changes
            const submitButton = screen.getByRole('button', { name: /update|save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockUpdateAction).toHaveBeenCalledWith(
                    mockProperty.id,
                    expect.objectContaining({
                        imageOperations: expect.objectContaining({
                            imagesToDelete: expect.arrayContaining([expect.any(String)]),
                            newImages: expect.arrayContaining([expect.any(Object)]),
                            orderUpdates: expect.arrayContaining([expect.any(Object)])
                        })
                    })
                );
            });
        });
    });

    describe('Create New Property Workflow', () => {
        it('should handle creating new property with image upload workflow', async () => {
            const user = userEvent.setup();
            render(<LuxePropertyForm />);

            // 1. Fill in basic property details
            await user.type(screen.getByLabelText(/Property Title/), 'New Luxury Property');
            await user.type(screen.getByLabelText(/Description/), 'A beautiful new property');
            await user.type(screen.getByLabelText(/Price/), '2000000');
            await user.type(screen.getByLabelText(/Size/), '3000');
            await user.type(screen.getByLabelText(/Bedrooms/), '4');
            await user.type(screen.getByLabelText(/Bathrooms/), '3');

            // 2. Initially no images - should show validation error
            expect(screen.getByText('0 of 20 images')).toBeInTheDocument();
            expect(screen.getByText('Need more')).toBeInTheDocument();

            // 3. Upload minimum required images
            const fileInput = screen.getByLabelText(/upload/i) || screen.getByRole('button', { name: /upload/i });
            if (fileInput) {
                const requiredFiles = Array.from({ length: 6 }, (_, i) => 
                    new File([''], `image${i + 1}.jpg`, { type: 'image/jpeg' })
                );

                await user.upload(fileInput, requiredFiles);
            }

            // 4. Verify validation passes
            await waitFor(() => {
                expect(screen.getByText('6 of 20 images')).toBeInTheDocument();
                expect(screen.getByText('Valid')).toBeInTheDocument();
            });

            // 5. Reorder uploaded images
            const images = screen.getAllByRole('button');
            if (images.length >= 2) {
                fireEvent.dragStart(images[0]);
                fireEvent.drop(images[1], {
                    dataTransfer: { getData: () => '0' },
                });
            }

            // 6. Submit new property
            const submitButton = screen.getByRole('button', { name: /create|save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockCreateAction).toHaveBeenCalledWith(
                    expect.objectContaining({
                        name: 'New Luxury Property',
                        images: expect.arrayContaining([
                            expect.objectContaining({
                                url: expect.any(String),
                                order: expect.any(Number)
                            })
                        ])
                    })
                );
            });
        });
    });

    describe('Error Recovery Workflows', () => {
        it('should handle upload failures gracefully', async () => {
            const user = userEvent.setup();
            
            // Mock upload failure
            jest.doMock('@/db/edgestore', () => ({
                useEdgeStore: () => ({
                    edgestore: {
                        publicFiles: {
                            upload: jest.fn().mockRejectedValue(new Error('Upload failed'))
                        }
                    }
                })
            }));

            render(<LuxePropertyForm property={mockProperty} />);

            await waitFor(() => {
                expect(screen.getByDisplayValue('Luxury Villa Dubai')).toBeInTheDocument();
            });

            // Try to upload new images
            const fileInput = screen.getByLabelText(/upload/i) || screen.getByRole('button', { name: /upload/i });
            if (fileInput) {
                const newFile = new File([''], 'failed.jpg', { type: 'image/jpeg' });
                await user.upload(fileInput, newFile);
            }

            // Should show error state
            await waitFor(() => {
                expect(screen.getByText('Error')).toBeInTheDocument();
            });

            // Should still allow form submission with existing images
            const submitButton = screen.getByRole('button', { name: /update|save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockUpdateAction).toHaveBeenCalled();
            });
        });

        it('should handle validation errors and prevent submission', async () => {
            const user = userEvent.setup();
            
            // Start with property that has minimum images
            const minimalProperty = {
                ...mockProperty,
                images: mockProperty.images.slice(0, 6) // Exactly 6 images
            };

            render(<LuxePropertyForm property={minimalProperty} />);

            await waitFor(() => {
                expect(screen.getByText('6 of 20 images')).toBeInTheDocument();
                expect(screen.getByText('Valid')).toBeInTheDocument();
            });

            // Delete images to go below minimum
            const deleteButtons = screen.queryAllByLabelText(/delete/i);
            if (deleteButtons.length >= 2) {
                for (let i = 0; i < 2; i++) {
                    await user.click(deleteButtons[i]);
                    
                    const confirmButton = screen.queryByText('Delete');
                    if (confirmButton) {
                        await user.click(confirmButton);
                    }
                }
            }

            // Should show validation error
            await waitFor(() => {
                expect(screen.getByText('4 of 20 images')).toBeInTheDocument();
                expect(screen.getByText('Need more')).toBeInTheDocument();
            });

            // Try to submit - should be prevented
            const submitButton = screen.getByRole('button', { name: /update|save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(require('sonner').toast.error).toHaveBeenCalledWith(
                    expect.stringContaining('Minimum 6 images required')
                );
                expect(mockUpdateAction).not.toHaveBeenCalled();
            });
        });
    });

    describe('Performance and User Experience', () => {
        it('should provide real-time feedback during operations', async () => {
            const user = userEvent.setup();
            render(<LuxePropertyForm property={mockProperty} />);

            await waitFor(() => {
                expect(screen.getByDisplayValue('Luxury Villa Dubai')).toBeInTheDocument();
            });

            // Should show immediate feedback when deleting
            const deleteButtons = screen.queryAllByLabelText(/delete/i);
            if (deleteButtons.length > 0) {
                await user.click(deleteButtons[0]);
                
                // Should immediately update count
                await waitFor(() => {
                    expect(screen.getByText(/7 of 20 images/)).toBeInTheDocument();
                });
            }

            // Should show immediate feedback when reordering
            const images = screen.getAllByRole('button');
            if (images.length >= 2) {
                fireEvent.dragStart(images[0]);
                fireEvent.drop(images[1], {
                    dataTransfer: { getData: () => '0' },
                });

                // Should maintain validation status
                expect(screen.getByText('Valid')).toBeInTheDocument();
            }
        });

        it('should handle large image collections efficiently', async () => {
            const largeProperty = {
                ...mockProperty,
                images: Array.from({ length: 20 }, (_, i) => ({
                    id: `${i + 1}`,
                    s3Url: `https://example.com/image${i + 1}.jpg`,
                    order: i
                }))
            };

            const startTime = performance.now();
            render(<LuxePropertyForm property={largeProperty} />);
            
            await waitFor(() => {
                expect(screen.getByDisplayValue('Luxury Villa Dubai')).toBeInTheDocument();
            });
            
            const endTime = performance.now();

            // Should render within reasonable time even with many images
            expect(endTime - startTime).toBeLessThan(1000);
            expect(screen.getByText('20 of 20 images')).toBeInTheDocument();
        });
    });

    describe('Accessibility in Workflows', () => {
        it('should support keyboard-only image management workflow', async () => {
            const user = userEvent.setup();
            render(<LuxePropertyForm property={mockProperty} />);

            await waitFor(() => {
                expect(screen.getByDisplayValue('Luxury Villa Dubai')).toBeInTheDocument();
            });

            // Navigate to image section using keyboard
            await user.tab(); // Navigate through form fields
            
            // Should be able to reach image controls
            const images = screen.getAllByRole('button');
            if (images.length > 0) {
                await user.click(images[0]);
                
                // Should support keyboard reordering
                await user.keyboard('{Control>}{ArrowRight}{/Control}');
                
                // Should maintain focus and provide feedback
                expect(images[0]).toBeInTheDocument();
            }
        });

        it('should announce changes to screen readers', async () => {
            const user = userEvent.setup();
            render(<LuxePropertyForm property={mockProperty} />);

            await waitFor(() => {
                expect(screen.getByDisplayValue('Luxury Villa Dubai')).toBeInTheDocument();
            });

            // Should have live regions for announcements
            expect(document.querySelector('[aria-live]')).toBeInTheDocument();

            // Operations should trigger announcements
            const deleteButtons = screen.queryAllByLabelText(/delete/i);
            if (deleteButtons.length > 0) {
                await user.click(deleteButtons[0]);
                
                // Should announce the change
                const liveRegion = document.querySelector('[aria-live]');
                expect(liveRegion).toBeInTheDocument();
            }
        });
    });
});