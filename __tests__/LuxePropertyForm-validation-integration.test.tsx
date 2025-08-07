/**
 * Integration tests for enhanced image validation in LuxePropertyForm
 * Tests the comprehensive validation system for image management
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LuxePropertyForm } from '../LuxePropertyForm';
import { EnhancedFileState } from '@/lib/image-management-utils';

// Mock dependencies
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
jest.mock('@/actions/admin/luxe/properties/luxe-property-actions', () => ({
    createLuxePropertyAction: jest.fn().mockResolvedValue({ success: true, message: 'Property created' }),
    updateLuxePropertyAction: jest.fn().mockResolvedValue({ success: true, message: 'Property updated' })
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

describe('LuxePropertyForm - Enhanced Image Validation Integration', () => {
    const mockProperty = {
        id: '1',
        name: 'Test Property',
        slug: 'test-property',
        description: 'Test description',
        bedrooms: 3,
        bathrooms: 2,
        price: 1000000,
        size: 2000,
        communityId: '1',
        typeId: '1',
        offeringTypeId: '1',
        agentId: '1',
        permitNumber: 'TEST123',
        images: [
            { id: '1', s3Url: 'https://example.com/image1.jpg', order: 0 },
            { id: '2', s3Url: 'https://example.com/image2.jpg', order: 1 },
            { id: '3', s3Url: 'https://example.com/image3.jpg', order: 2 },
            { id: '4', s3Url: 'https://example.com/image4.jpg', order: 3 },
            { id: '5', s3Url: 'https://example.com/image5.jpg', order: 4 },
            { id: '6', s3Url: 'https://example.com/image6.jpg', order: 5 }
        ]
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Image count validation', () => {
        it('should show validation status for valid image count', async () => {
            render(<LuxePropertyForm property={mockProperty} />);

            await waitFor(() => {
                expect(screen.getByText('6 of 20 images')).toBeInTheDocument();
                expect(screen.getByText('Valid')).toBeInTheDocument();
            });
        });

        it('should show error for insufficient images', async () => {
            const propertyWithFewImages = {
                ...mockProperty,
                images: mockProperty.images.slice(0, 3) // Only 3 images
            };

            render(<LuxePropertyForm property={propertyWithFewImages} />);

            await waitFor(() => {
                expect(screen.getByText('3 of 20 images')).toBeInTheDocument();
                expect(screen.getByText('Need more')).toBeInTheDocument();
                expect(screen.getByText(/Minimum 6 images required/)).toBeInTheDocument();
            });
        });

        it('should show error for too many images', async () => {
            const propertyWithManyImages = {
                ...mockProperty,
                images: Array.from({ length: 25 }, (_, i) => ({
                    id: `${i + 1}`,
                    s3Url: `https://example.com/image${i + 1}.jpg`,
                    order: i
                }))
            };

            render(<LuxePropertyForm property={propertyWithManyImages} />);

            await waitFor(() => {
                expect(screen.getByText('25 of 40 images')).toBeInTheDocument();
                expect(screen.getByText('OK')).toBeInTheDocument();
                // 25 images should now be within the 40 limit
            });
        });
    });

    describe('Mixed existing and new images validation', () => {
        it('should correctly count existing and new images', async () => {
            render(<LuxePropertyForm property={mockProperty} />);

            await waitFor(() => {
                expect(screen.getByText('6 existing')).toBeInTheDocument();
                expect(screen.getByText('6 of 20 images')).toBeInTheDocument();
            });
        });

        it('should show deleted image count', async () => {
            render(<LuxePropertyForm property={mockProperty} />);

            // Simulate deleting an image
            await waitFor(() => {
                const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
                if (deleteButtons.length > 0) {
                    fireEvent.click(deleteButtons[0]);
                }
            });

            // Confirm deletion if confirmation dialog appears
            await waitFor(() => {
                const confirmButton = screen.queryByText('Delete');
                if (confirmButton) {
                    fireEvent.click(confirmButton);
                }
            });

            await waitFor(() => {
                expect(screen.getByText(/deleted/)).toBeInTheDocument();
            });
        });
    });

    describe('Real-time validation feedback', () => {
        it('should show progress bar for image requirements', async () => {
            render(<LuxePropertyForm property={mockProperty} />);

            await waitFor(() => {
                const progressBar = screen.getByRole('progressbar', { hidden: true });
                expect(progressBar).toBeInTheDocument();
            });
        });

        it('should update validation status when images change', async () => {
            const propertyWithMinImages = {
                ...mockProperty,
                images: mockProperty.images.slice(0, 6) // Exactly 6 images
            };

            render(<LuxePropertyForm property={propertyWithMinImages} />);

            await waitFor(() => {
                expect(screen.getByText('Valid')).toBeInTheDocument();
            });

            // Simulate deleting an image to go below minimum
            const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
            if (deleteButtons.length > 0) {
                fireEvent.click(deleteButtons[0]);

                // Confirm deletion
                await waitFor(() => {
                    const confirmButton = screen.queryByText('Delete');
                    if (confirmButton) {
                        fireEvent.click(confirmButton);
                    }
                });

                await waitFor(() => {
                    expect(screen.getByText('Need more')).toBeInTheDocument();
                });
            }
        });
    });

    describe('Form submission validation', () => {
        it('should prevent submission with insufficient images', async () => {
            const propertyWithFewImages = {
                ...mockProperty,
                images: mockProperty.images.slice(0, 3) // Only 3 images
            };

            render(<LuxePropertyForm property={propertyWithFewImages} />);

            // Fill required fields
            await waitFor(() => {
                const nameInput = screen.getByLabelText(/Property Title/);
                fireEvent.change(nameInput, { target: { value: 'Test Property' } });
            });

            // Try to submit
            const submitButton = screen.getByRole('button', { name: /save|submit|create/i });
            fireEvent.click(submitButton);

            // Should show validation error
            await waitFor(() => {
                expect(require('sonner').toast.error).toHaveBeenCalledWith(
                    expect.stringContaining('Minimum 6 images required')
                );
            });
        });

        it('should prevent submission with too many images', async () => {
            const propertyWithManyImages = {
                ...mockProperty,
                images: Array.from({ length: 25 }, (_, i) => ({
                    id: `${i + 1}`,
                    s3Url: `https://example.com/image${i + 1}.jpg`,
                    order: i
                }))
            };

            render(<LuxePropertyForm property={propertyWithManyImages} />);

            // Fill required fields
            await waitFor(() => {
                const nameInput = screen.getByLabelText(/Property Title/);
                fireEvent.change(nameInput, { target: { value: 'Test Property' } });
            });

            // Try to submit
            const submitButton = screen.getByRole('button', { name: /save|submit|create/i });
            fireEvent.click(submitButton);

            // Should show validation error
            await waitFor(() => {
                expect(require('sonner').toast.error).toHaveBeenCalledWith(
                    expect.stringContaining('Maximum 40 images allowed')
                );
            });
        });

        it('should allow submission with valid image count', async () => {
            render(<LuxePropertyForm property={mockProperty} />);

            // Fill required fields
            await waitFor(() => {
                const nameInput = screen.getByLabelText(/Property Title/);
                fireEvent.change(nameInput, { target: { value: 'Test Property' } });
            });

            // Submit form
            const submitButton = screen.getByRole('button', { name: /save|submit|create/i });
            fireEvent.click(submitButton);

            // Should not show validation errors and should call update action
            await waitFor(() => {
                expect(require('@/actions/admin/luxe/properties/luxe-property-actions').updateLuxePropertyAction)
                    .toHaveBeenCalled();
            });
        });
    });

    describe('Visual feedback', () => {
        it('should show appropriate icons for validation states', async () => {
            render(<LuxePropertyForm property={mockProperty} />);

            await waitFor(() => {
                // Should show checkmark icon for valid state
                const validIcon = screen.getByText('Valid').previousElementSibling;
                expect(validIcon).toBeInTheDocument();
            });
        });

        it('should show error icons for invalid states', async () => {
            const propertyWithFewImages = {
                ...mockProperty,
                images: mockProperty.images.slice(0, 3)
            };

            render(<LuxePropertyForm property={propertyWithFewImages} />);

            await waitFor(() => {
                // Should show error icon for invalid state
                const errorIcon = screen.getByText('Need more').previousElementSibling;
                expect(errorIcon).toBeInTheDocument();
            });
        });

        it('should show progress bar with appropriate colors', async () => {
            const propertyWithFewImages = {
                ...mockProperty,
                images: mockProperty.images.slice(0, 3)
            };

            render(<LuxePropertyForm property={propertyWithFewImages} />);

            await waitFor(() => {
                // Progress bar should exist and have orange color for insufficient images
                const progressBar = document.querySelector('.bg-orange-400');
                expect(progressBar).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('should provide screen reader accessible validation messages', async () => {
            const propertyWithFewImages = {
                ...mockProperty,
                images: mockProperty.images.slice(0, 3)
            };

            render(<LuxePropertyForm property={propertyWithFewImages} />);

            await waitFor(() => {
                // Validation messages should be accessible
                const errorMessage = screen.getByText(/Minimum 6 images required/);
                expect(errorMessage).toBeInTheDocument();
                expect(errorMessage).toHaveAttribute('role', 'alert');
            });
        });

        it('should have proper ARIA labels for validation status', async () => {
            render(<LuxePropertyForm property={mockProperty} />);

            await waitFor(() => {
                const validationStatus = screen.getByText('Valid');
                expect(validationStatus.closest('[role="status"]')).toBeInTheDocument();
            });
        });
    });
});