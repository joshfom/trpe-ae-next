/**
 * Integration tests for the Luxe Property Edit Page
 * Tests the complete workflow: load → edit → reorder → delete → save
 */

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import EditLuxePropertyPage from '../page';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock dependencies
vi.mock('@/db/drizzle', () => ({
    db: {
        query: {
            propertyTable: {
                findFirst: vi.fn()
            }
        }
    }
}));

vi.mock('@/db/edgestore', () => ({
    useEdgeStore: () => ({
        edgestore: {
            publicFiles: {
                upload: vi.fn().mockResolvedValue({ url: 'https://example.com/test-image.webp' })
            }
        }
    })
}));

vi.mock('@/hooks/use-image-upload', () => ({
    useImageUpload: () => ({
        convertToWebP: vi.fn().mockResolvedValue(new File([''], 'test.webp', { type: 'image/webp' }))
    })
}));

vi.mock('@/actions/admin/luxe/properties/luxe-property-actions', () => ({
    updateLuxePropertyAction: vi.fn().mockResolvedValue({ 
        success: true, 
        message: 'Property updated successfully' 
    })
}));

vi.mock('next/navigation', () => ({
    notFound: vi.fn(),
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn()
    })
}));

// Mock API hooks
vi.mock('@/features/admin/luxe/agents/api/use-get-luxe-agents', () => ({
    useGetLuxeAgents: () => ({
        data: [{ id: '1', name: 'Test Agent' }],
        isLoading: false,
        isError: false
    })
}));

vi.mock('@/features/admin/community/api/use-get-admin-communities', () => ({
    useGetAdminCommunities: () => ({
        data: [{ id: '1', name: 'Test Community' }],
        isLoading: false,
        isError: false
    })
}));

vi.mock('@/features/admin/property-types/api/use-get-admin-property-types', () => ({
    useGetAdminPropertyTypes: () => ({
        data: [{ id: '1', name: 'Villa' }],
        isLoading: false,
        isError: false
    })
}));

vi.mock('@/features/admin/offering/api/use-get-admin-offering-types', () => ({
    useGetAdminOfferingTypes: () => ({
        data: [{ id: '1', name: 'Sale' }],
        isLoading: false,
        isError: false
    })
}));

// Mock toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn()
    }
}));

const mockProperty = {
    id: 'test-property-id',
    name: 'Test Luxe Property',
    description: 'A beautiful luxury property',
    slug: 'test-luxe-property',
    bedrooms: 4,
    bathrooms: 3,
    price: 5000000,
    size: 3500,
    isLuxe: true,
    status: 'published',
    availability: 'available',
    images: [
        {
            id: 'img-1',
            s3Url: 'https://example.com/image1.jpg',
            order: 1,
            propertyId: 'test-property-id'
        },
        {
            id: 'img-2',
            s3Url: 'https://example.com/image2.jpg',
            order: 2,
            propertyId: 'test-property-id'
        },
        {
            id: 'img-3',
            s3Url: 'https://example.com/image3.jpg',
            order: 3,
            propertyId: 'test-property-id'
        },
        {
            id: 'img-4',
            s3Url: 'https://example.com/image4.jpg',
            order: 4,
            propertyId: 'test-property-id'
        },
        {
            id: 'img-5',
            s3Url: 'https://example.com/image5.jpg',
            order: 5,
            propertyId: 'test-property-id'
        },
        {
            id: 'img-6',
            s3Url: 'https://example.com/image6.jpg',
            order: 6,
            propertyId: 'test-property-id'
        }
    ],
    community: { id: '1', name: 'Test Community' },
    subCommunity: null,
    city: { id: '1', name: 'Dubai' },
    agent: { id: '1', name: 'Test Agent' },
    developer: null,
    offeringType: { id: '1', name: 'Sale' },
    type: { id: '1', name: 'Villa' }
};

describe('EditLuxePropertyPage Integration Tests', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        const { db } = await import('@/db/drizzle');
        (db.query.propertyTable.findFirst as any).mockResolvedValue(mockProperty);
    });

    it('should load existing property with correct image state', async () => {
        const params = Promise.resolve({ id: 'test-property-id' });
        
        await act(async () => {
            render(<EditLuxePropertyPage params={params} />);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Luxe Property')).toBeInTheDocument();
        });

        // Verify that existing images are loaded
        await waitFor(() => {
            const images = screen.getAllByRole('img');
            expect(images).toHaveLength(6); // Should show all 6 existing images
        });

        // Verify database query was called correctly
        const { db } = await import('@/db/drizzle');
        expect(db.query.propertyTable.findFirst).toHaveBeenCalledWith({
            where: expect.any(Function),
            with: {
                images: true,
                community: true,
                subCommunity: true,
                city: true,
                agent: true,
                developer: true,
                offeringType: true,
                type: true,
            }
        });
    });

    it('should handle image reordering correctly', async () => {
        const params = Promise.resolve({ id: 'test-property-id' });
        const user = userEvent.setup();
        
        await act(async () => {
            render(<EditLuxePropertyPage params={params} />);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Luxe Property')).toBeInTheDocument();
        });

        // Wait for images to load
        await waitFor(() => {
            const images = screen.getAllByRole('img');
            expect(images).toHaveLength(6);
        });

        // Find drag handles (assuming they have a specific test id or class)
        const dragHandles = screen.getAllByTestId('drag-handle');
        expect(dragHandles).toHaveLength(6);

        // Simulate drag and drop operation
        const firstImage = dragHandles[0];
        const thirdImage = dragHandles[2];

        // Simulate drag start
        fireEvent.dragStart(firstImage, {
            dataTransfer: {
                setData: jest.fn(),
                getData: jest.fn().mockReturnValue('0')
            }
        });

        // Simulate drop
        fireEvent.drop(thirdImage, {
            dataTransfer: {
                getData: jest.fn().mockReturnValue('0')
            }
        });

        // Verify reordering occurred (this would depend on the actual implementation)
        await waitFor(() => {
            // The exact assertion would depend on how the reordering is visually represented
            expect(screen.getByTestId('image-grid')).toBeInTheDocument();
        });
    });

    it('should handle image deletion correctly', async () => {
        const params = Promise.resolve({ id: 'test-property-id' });
        const user = userEvent.setup();
        
        await act(async () => {
            render(<EditLuxePropertyPage params={params} />);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Luxe Property')).toBeInTheDocument();
        });

        // Wait for images to load
        await waitFor(() => {
            const images = screen.getAllByRole('img');
            expect(images).toHaveLength(6);
        });

        // Find delete buttons
        const deleteButtons = screen.getAllByTestId('delete-image-button');
        expect(deleteButtons).toHaveLength(6);

        // Click delete button on first image
        await user.click(deleteButtons[0]);

        // Confirm deletion if there's a confirmation dialog
        const confirmButton = screen.queryByText('Delete');
        if (confirmButton) {
            await user.click(confirmButton);
        }

        // Verify image was removed
        await waitFor(() => {
            const images = screen.getAllByRole('img');
            expect(images).toHaveLength(5); // Should now have 5 images
        });
    });

    it('should validate minimum image requirement', async () => {
        // Create a property with exactly 6 images (minimum)
        const minimalProperty = {
            ...mockProperty,
            images: mockProperty.images.slice(0, 6) // Exactly 6 images
        };
        
        const { db } = await import('@/db/drizzle');
        (db.query.propertyTable.findFirst as any).mockResolvedValue(minimalProperty);
        
        const params = Promise.resolve({ id: 'test-property-id' });
        const user = userEvent.setup();
        
        await act(async () => {
            render(<EditLuxePropertyPage params={params} />);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Luxe Property')).toBeInTheDocument();
        });

        // Wait for images to load
        await waitFor(() => {
            const images = screen.getAllByRole('img');
            expect(images).toHaveLength(6);
        });

        // Try to delete an image (should show validation error)
        const deleteButtons = screen.getAllByTestId('delete-image-button');
        await user.click(deleteButtons[0]);

        // Confirm deletion
        const confirmButton = screen.queryByText('Delete');
        if (confirmButton) {
            await user.click(confirmButton);
        }

        // Should show validation error about minimum images
        await waitFor(() => {
            expect(screen.getByText(/minimum.*6.*images/i)).toBeInTheDocument();
        });
    });

    it('should handle form submission with image operations', async () => {
        const params = Promise.resolve({ id: 'test-property-id' });
        const user = userEvent.setup();
        
        await act(async () => {
            render(<EditLuxePropertyPage params={params} />);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Luxe Property')).toBeInTheDocument();
        });

        // Make some changes to the form
        const nameInput = screen.getByDisplayValue('Test Luxe Property');
        await user.clear(nameInput);
        await user.type(nameInput, 'Updated Luxe Property');

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /save|update/i });
        await user.click(submitButton);

        // Verify the update action was called
        await waitFor(async () => {
            const { updateLuxePropertyAction } = await import('@/actions/admin/luxe/properties/luxe-property-actions');
            expect(updateLuxePropertyAction).toHaveBeenCalledWith(
                'test-property-id',
                expect.objectContaining({
                    name: 'Updated Luxe Property',
                    imageOperations: expect.any(Object)
                })
            );
        });
    });

    it('should handle error boundary for image management errors', async () => {
        // Mock an error in the EdgeStore upload
        vi.doMock('@/db/edgestore', () => ({
            useEdgeStore: () => ({
                edgestore: {
                    publicFiles: {
                        upload: vi.fn().mockRejectedValue(new Error('EdgeStore upload failed'))
                    }
                }
            })
        }));

        const params = Promise.resolve({ id: 'test-property-id' });
        
        await act(async () => {
            render(<EditLuxePropertyPage params={params} />);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Luxe Property')).toBeInTheDocument();
        });

        // Try to upload a new image (this should trigger the error)
        const fileInput = screen.getByTestId('file-input');
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        
        await act(async () => {
            fireEvent.change(fileInput, { target: { files: [file] } });
        });

        // Should show error boundary fallback
        await waitFor(() => {
            expect(screen.getByText(/Image Management Error/i)).toBeInTheDocument();
            expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
        });
    });

    it('should show not found for non-luxe properties', async () => {
        const nonLuxeProperty = { ...mockProperty, isLuxe: false };
        const { db } = await import('@/db/drizzle');
        (db.query.propertyTable.findFirst as any).mockResolvedValue(nonLuxeProperty);
        
        const params = Promise.resolve({ id: 'test-property-id' });
        
        await act(async () => {
            render(<EditLuxePropertyPage params={params} />);
        });

        // Should call notFound()
        const { notFound } = await import('next/navigation');
        expect(notFound).toHaveBeenCalled();
    });

    it('should show not found for non-existent properties', async () => {
        const { db } = await import('@/db/drizzle');
        (db.query.propertyTable.findFirst as any).mockResolvedValue(null);
        
        const params = Promise.resolve({ id: 'non-existent-id' });
        
        await act(async () => {
            render(<EditLuxePropertyPage params={params} />);
        });

        // Should call notFound()
        const { notFound } = await import('next/navigation');
        expect(notFound).toHaveBeenCalled();
    });
});