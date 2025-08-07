/**
 * Integration test suite for complete image management workflow
 * Tests the entire system from utilities to components to server actions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiImageDropzone } from '@/components/multi-image-dropzone';
import { SortableImageGrid } from '@/components/ui/sortable-image-grid';
import LuxePropertyForm from '@/features/admin/luxe/properties/components/LuxePropertyForm';
import {
  EnhancedFileState,
  reorderImages,
  markImageForDeletion,
  validateImageCollection,
  mergeImageOperations,
  convertPropertyImagesToFileState
} from '@/lib/image-management-utils';

// Mock all external dependencies
jest.mock('@/db/edgestore', () => ({
  useEdgeStore: () => ({
    edgestore: {
      publicFiles: {
        upload: jest.fn().mockResolvedValue({ url: 'https://example.com/uploaded.jpg' })
      }
    }
  })
}), { virtual: true });

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

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn()
  }
}));

describe('Image Management - Complete Integration Tests', () => {
  const createMockImage = (id: string, isExisting = false, isDeleted = false): EnhancedFileState => ({
    file: isExisting ? `https://example.com/image-${id}.jpg` : new File([''], `image-${id}.jpg`, { type: 'image/jpeg' }),
    key: `key-${id}`,
    progress: 'COMPLETE' as const,
    id: isExisting ? id : undefined,
    isExisting,
    isDeleted,
    order: parseInt(id)
  });

  const mockProperty = {
    id: '1',
    name: 'Test Luxury Property',
    slug: 'test-luxury-property',
    description: 'A beautiful luxury property',
    bedrooms: 4,
    bathrooms: 3,
    price: 2000000,
    size: 3500,
    communityId: '1',
    typeId: '1',
    offeringTypeId: '1',
    agentId: '1',
    permitNumber: 'TEST-123',
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

  describe('Utility Functions Integration', () => {
    it('should integrate all utility functions in a complete workflow', () => {
      // 1. Convert property images to file state
      const fileStates = convertPropertyImagesToFileState(mockProperty.images);
      expect(fileStates).toHaveLength(8);
      expect(fileStates.every(img => img.isExisting)).toBe(true);

      // 2. Mark some images for deletion
      const deleteResult1 = markImageForDeletion(fileStates, 1);
      expect(deleteResult1.success).toBe(true);
      
      const deleteResult2 = markImageForDeletion(deleteResult1.updatedImages!, 2);
      expect(deleteResult2.success).toBe(true);

      let updatedImages = deleteResult2.updatedImages!;
      expect(updatedImages.filter(img => img.isDeleted)).toHaveLength(2);

      // 3. Add new images
      const newImages = [
        createMockImage('new1', 0, false),
        createMockImage('new2', 0, false)
      ];
      
      updatedImages = [...updatedImages, ...newImages.map((img, index) => ({
        ...img,
        order: updatedImages.length + index
      }))];

      // 4. Reorder images
      const reorderedImages = reorderImages(updatedImages, 0, 3);
      expect(reorderedImages[3].id).toBe('1'); // First image moved to position 3

      // 5. Validate the collection
      const visibleImages = reorderedImages.filter(img => !img.isDeleted);
      const validation = validateImageCollection(visibleImages, 6, 20);
      expect(validation.isValid).toBe(true);
      expect(visibleImages).toHaveLength(8); // 8 original - 2 deleted + 2 new = 8

      // 6. Merge operations for server submission
      const operations = mergeImageOperations(reorderedImages);
      expect(operations.imagesToDelete).toHaveLength(2);
      expect(operations.newImages).toHaveLength(2);
      expect(operations.existingImages).toHaveLength(6);
      expect(operations.orderUpdates.length).toBeGreaterThan(0);
    });

    it('should handle edge cases in integrated workflow', () => {
      // Start with minimum images
      const minimalProperty = {
        ...mockProperty,
        images: mockProperty.images.slice(0, 6)
      };

      const fileStates = convertPropertyImagesToFileState(minimalProperty.images);
      
      // Try to delete too many images
      let currentImages = fileStates;
      for (let i = 0; i < 3; i++) {
        const result = markImageForDeletion(currentImages, 0);
        if (result.success) {
          currentImages = result.updatedImages!;
        }
      }

      // Should have 3 deleted images
      expect(currentImages.filter(img => img.isDeleted)).toHaveLength(3);

      // Validation should fail (6 - 3 = 3 images, below minimum of 6)
      const visibleImages = currentImages.filter(img => !img.isDeleted);
      const validation = validateImageCollection(visibleImages, 6, 20);
      expect(validation.isValid).toBe(false);
      expect(validation.errors[0]).toContain('Minimum 6 images required');
    });
  });

  describe('Component Integration', () => {
    it('should integrate SortableImageGrid with MultiImageDropzone', () => {
      const mockImages = Array.from({ length: 6 }, (_, i) => createMockImage(i.toString(), true));
      const onReorder = jest.fn();
      const onDelete = jest.fn();

      render(
        <MultiImageDropzone
          value={mockImages}
          onChange={jest.fn()}
          onImageReorder={onReorder}
          onImageDelete={onDelete}
          allowReorder={true}
          allowDelete={true}
        />
      );

      // Should render all images
      expect(screen.getAllByRole('button')).toHaveLength(6);

      // Should support drag and drop
      const firstImage = screen.getAllByRole('button')[0];
      const secondImage = screen.getAllByRole('button')[1];

      fireEvent.dragStart(firstImage, {
        dataTransfer: {
          setData: jest.fn(),
          setDragImage: jest.fn(),
        },
      });

      fireEvent.drop(secondImage, {
        dataTransfer: {
          getData: () => '0',
        },
      });

      expect(onReorder).toHaveBeenCalledWith(0, 1);
    });

    it('should integrate components with validation feedback', () => {
      const mockImages = Array.from({ length: 3 }, (_, i) => createMockImage(i.toString(), true));

      render(
        <MultiImageDropzone
          value={mockImages}
          onChange={jest.fn()}
          minImages={6}
          maxImages={40}
        />
      );

      // Should show validation error for insufficient images
      expect(screen.getByText('3 of 20 images')).toBeInTheDocument();
      expect(screen.getByText('Need more')).toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('should integrate image management with LuxePropertyForm', async () => {
      const user = userEvent.setup();
      render(<LuxePropertyForm property={mockProperty} />);

      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Luxury Property')).toBeInTheDocument();
      });

      // Should show current image count
      expect(screen.getByText('8 of 20 images')).toBeInTheDocument();
      expect(screen.getByText('Valid')).toBeInTheDocument();

      // Should be able to submit form
      const submitButton = screen.getByRole('button', { name: /update|save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateAction).toHaveBeenCalledWith(
          mockProperty.id,
          expect.objectContaining({
            name: 'Test Luxury Property',
            images: expect.any(Array)
          })
        );
      });
    });

    it('should prevent form submission with invalid image count', async () => {
      const user = userEvent.setup();
      const propertyWithFewImages = {
        ...mockProperty,
        images: mockProperty.images.slice(0, 3)
      };

      render(<LuxePropertyForm property={propertyWithFewImages} />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Luxury Property')).toBeInTheDocument();
      });

      // Should show validation error
      expect(screen.getByText('3 of 20 images')).toBeInTheDocument();
      expect(screen.getByText('Need more')).toBeInTheDocument();

      // Try to submit
      const submitButton = screen.getByRole('button', { name: /update|save/i });
      await user.click(submitButton);

      // Should show error and not call update action
      await waitFor(() => {
        expect(require('sonner').toast.error).toHaveBeenCalledWith(
          expect.stringContaining('Minimum 6 images required')
        );
        expect(mockUpdateAction).not.toHaveBeenCalled();
      });
    });
  });

  describe('Server Action Integration', () => {
    it('should integrate with server actions for complex operations', async () => {
      const user = userEvent.setup();
      render(<LuxePropertyForm property={mockProperty} />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Luxury Property')).toBeInTheDocument();
      });

      // Simulate complex image operations
      const images = screen.getAllByRole('button');
      
      // Reorder images
      if (images.length >= 2) {
        fireEvent.dragStart(images[0]);
        fireEvent.drop(images[1], {
          dataTransfer: { getData: () => '0' },
        });
      }

      // Submit form
      const submitButton = screen.getByRole('button', { name: /update|save/i });
      await user.click(submitButton);

      // Should call server action with image operations
      await waitFor(() => {
        expect(mockUpdateAction).toHaveBeenCalledWith(
          mockProperty.id,
          expect.objectContaining({
            imageOperations: expect.objectContaining({
              orderUpdates: expect.any(Array),
              existingImages: expect.any(Array)
            })
          })
        );
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle errors gracefully across the entire system', async () => {
      const user = userEvent.setup();
      
      // Mock server action failure
      mockUpdateAction.mockRejectedValueOnce(new Error('Server error'));

      render(<LuxePropertyForm property={mockProperty} />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Luxury Property')).toBeInTheDocument();
      });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /update|save/i });
      await user.click(submitButton);

      // Should handle error gracefully
      await waitFor(() => {
        expect(require('sonner').toast.error).toHaveBeenCalledWith(
          expect.stringContaining('Server error')
        );
      });
    });

    it('should handle upload errors in integrated workflow', async () => {
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
        expect(screen.getByDisplayValue('Test Luxury Property')).toBeInTheDocument();
      });

      // Try to upload new images
      const fileInput = screen.getByLabelText(/upload/i) || screen.getByRole('button', { name: /upload/i });
      if (fileInput) {
        const newFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        await user.upload(fileInput, newFile);
      }

      // Should show error state but not crash
      await waitFor(() => {
        expect(screen.getByText(/Property Images/)).toBeInTheDocument();
      });
    });
  });

  describe('Performance Integration', () => {
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
        expect(screen.getByDisplayValue('Test Luxury Property')).toBeInTheDocument();
      });
      
      const endTime = performance.now();

      // Should render efficiently even with many images
      expect(endTime - startTime).toBeLessThan(1000);
      expect(screen.getByText('20 of 20 images')).toBeInTheDocument();
    });

    it('should debounce rapid operations across components', async () => {
      const onReorder = jest.fn();
      const mockImages = Array.from({ length: 6 }, (_, i) => createMockImage(i.toString(), true));

      render(
        <MultiImageDropzone
          value={mockImages}
          onChange={jest.fn()}
          onImageReorder={onReorder}
        />
      );

      const firstImage = screen.getAllByRole('button')[0];
      const secondImage = screen.getAllByRole('button')[1];

      // Rapid reorder operations
      for (let i = 0; i < 5; i++) {
        fireEvent.dragStart(firstImage);
        fireEvent.drop(secondImage, {
          dataTransfer: { getData: () => '0' },
        });
      }

      // Should debounce the operations
      await waitFor(() => {
        expect(onReorder.mock.calls.length).toBeLessThan(5);
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain accessibility across all components', async () => {
      const user = userEvent.setup();
      render(<LuxePropertyForm property={mockProperty} />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Luxury Property')).toBeInTheDocument();
      });

      // Should have proper ARIA labels
      const images = screen.getAllByRole('button');
      images.forEach((image, index) => {
        expect(image).toHaveAttribute('aria-label', expect.stringContaining(`Property image ${index + 1}`));
      });

      // Should support keyboard navigation
      if (images.length > 0) {
        await user.click(images[0]);
        await user.keyboard('{ArrowRight}');
        
        if (images[1]) {
          expect(images[1]).toHaveFocus();
        }
      }

      // Should have live regions for announcements
      expect(document.querySelector('[aria-live]')).toBeInTheDocument();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle typical property editing workflow', async () => {
      const user = userEvent.setup();
      render(<LuxePropertyForm property={mockProperty} />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Luxury Property')).toBeInTheDocument();
      });

      // 1. User views existing images
      expect(screen.getByText('8 of 20 images')).toBeInTheDocument();

      // 2. User deletes a few images
      const deleteButtons = screen.queryAllByLabelText(/delete/i);
      if (deleteButtons.length >= 2) {
        await user.click(deleteButtons[0]);
        await user.click(deleteButtons[1]);
      }

      // 3. User reorders remaining images
      const images = screen.getAllByRole('button');
      if (images.length >= 2) {
        fireEvent.dragStart(images[0]);
        fireEvent.drop(images[1], {
          dataTransfer: { getData: () => '0' },
        });
      }

      // 4. User saves changes
      const submitButton = screen.getByRole('button', { name: /update|save/i });
      await user.click(submitButton);

      // 5. System processes all changes
      await waitFor(() => {
        expect(mockUpdateAction).toHaveBeenCalledWith(
          mockProperty.id,
          expect.objectContaining({
            imageOperations: expect.any(Object)
          })
        );
      });
    });

    it('should handle new property creation workflow', async () => {
      const user = userEvent.setup();
      render(<LuxePropertyForm />);

      // 1. User fills basic information
      await user.type(screen.getByLabelText(/Property Title/), 'New Property');
      await user.type(screen.getByLabelText(/Description/), 'A new property');

      // 2. User uploads required images
      const fileInput = screen.getByLabelText(/upload/i) || screen.getByRole('button', { name: /upload/i });
      if (fileInput) {
        const files = Array.from({ length: 6 }, (_, i) => 
          new File([''], `image${i + 1}.jpg`, { type: 'image/jpeg' })
        );
        await user.upload(fileInput, files);
      }

      // 3. User submits form
      const submitButton = screen.getByRole('button', { name: /create|save/i });
      await user.click(submitButton);

      // 4. System creates property with images
      await waitFor(() => {
        expect(mockCreateAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Property',
            images: expect.any(Array)
          })
        );
      });
    });
  });
});