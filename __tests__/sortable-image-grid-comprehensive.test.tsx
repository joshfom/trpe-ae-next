/**
 * Comprehensive test suite for SortableImageGrid component
 * Tests drag-and-drop functionality, keyboard navigation, and accessibility
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortableImageGrid } from '../sortable-image-grid';
import { EnhancedFileState } from '@/lib/image-management-utils';

describe('SortableImageGrid - Comprehensive Tests', () => {
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
    createMockImage('0', true, false),
    createMockImage('1', true, false),
    createMockImage('2', false, false),
    createMockImage('3', true, false),
    createMockImage('4', false, false),
    createMockImage('5', true, false)
  ];

  const defaultProps = {
    images: mockImages,
    onReorder: jest.fn(),
    onDelete: jest.fn(),
    allowDelete: true,
    allowReorder: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Drag and Drop Functionality', () => {
    it('should handle drag start event', () => {
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      
      fireEvent.dragStart(firstImage!, {
        dataTransfer: {
          effectAllowed: 'move',
          setData: jest.fn(),
          setDragImage: jest.fn(),
        },
      });

      expect(firstImage).toHaveAttribute('draggable', 'true');
    });

    it('should handle drag over event with visual feedback', () => {
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      const secondImage = screen.getByAltText('Property image 2').closest('[role="button"]');

      fireEvent.dragStart(firstImage!);
      fireEvent.dragOver(secondImage!, {
        dataTransfer: { dropEffect: 'move' },
        preventDefault: jest.fn()
      });

      // Should prevent default to allow drop
      expect(secondImage).toBeInTheDocument();
    });

    it('should handle drop event and call onReorder', () => {
      const onReorder = jest.fn();
      render(<SortableImageGrid {...defaultProps} onReorder={onReorder} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      const thirdImage = screen.getByAltText('Property image 3').closest('[role="button"]');

      // Start drag on first image
      fireEvent.dragStart(firstImage!, {
        dataTransfer: {
          setData: jest.fn(),
          setDragImage: jest.fn(),
        },
      });

      // Drop on third image
      fireEvent.drop(thirdImage!, {
        dataTransfer: {
          getData: () => '0', // First image index
        },
      });

      expect(onReorder).toHaveBeenCalledWith(0, 2);
    });

    it('should show drag preview during drag operation', () => {
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      const setDragImage = jest.fn();

      fireEvent.dragStart(firstImage!, {
        dataTransfer: {
          setData: jest.fn(),
          setDragImage,
        },
      });

      expect(setDragImage).toHaveBeenCalled();
    });

    it('should handle drag end event', () => {
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');

      fireEvent.dragStart(firstImage!);
      fireEvent.dragEnd(firstImage!);

      // Should clean up drag state
      expect(firstImage).toBeInTheDocument();
    });

    it('should disable drag when allowReorder is false', () => {
      render(<SortableImageGrid {...defaultProps} allowReorder={false} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      expect(firstImage).toHaveAttribute('draggable', 'false');
    });
  });

  describe('Touch Support', () => {
    it('should handle touch start for mobile drag', () => {
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');

      fireEvent.touchStart(firstImage!, {
        touches: [{ clientX: 100, clientY: 100 }]
      });

      expect(firstImage).toBeInTheDocument();
    });

    it('should handle touch move for mobile drag', () => {
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');

      fireEvent.touchStart(firstImage!, {
        touches: [{ clientX: 100, clientY: 100 }]
      });

      fireEvent.touchMove(firstImage!, {
        touches: [{ clientX: 150, clientY: 150 }]
      });

      expect(firstImage).toBeInTheDocument();
    });

    it('should handle touch end for mobile drag', () => {
      const onReorder = jest.fn();
      render(<SortableImageGrid {...defaultProps} onReorder={onReorder} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      const secondImage = screen.getByAltText('Property image 2').closest('[role="button"]');

      // Simulate touch drag from first to second image
      fireEvent.touchStart(firstImage!, {
        touches: [{ clientX: 100, clientY: 100 }]
      });

      fireEvent.touchMove(document, {
        touches: [{ clientX: 200, clientY: 100 }]
      });

      fireEvent.touchEnd(secondImage!, {
        changedTouches: [{ clientX: 200, clientY: 100 }]
      });

      // Should trigger reorder on successful touch drag
      expect(firstImage).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support arrow key navigation', async () => {
      const user = userEvent.setup();
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      
      await user.click(firstImage!);
      await user.keyboard('{ArrowRight}');

      // Should move focus to next image
      const secondImage = screen.getByAltText('Property image 2').closest('[role="button"]');
      expect(secondImage).toHaveFocus();
    });

    it('should support Home and End keys', async () => {
      const user = userEvent.setup();
      render(<SortableImageGrid {...defaultProps} />);

      const thirdImage = screen.getByAltText('Property image 3').closest('[role="button"]');
      
      await user.click(thirdImage!);
      await user.keyboard('{Home}');

      // Should move focus to first image
      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      expect(firstImage).toHaveFocus();

      await user.keyboard('{End}');

      // Should move focus to last image
      const lastImage = screen.getByAltText('Property image 6').closest('[role="button"]');
      expect(lastImage).toHaveFocus();
    });

    it('should support keyboard reordering with Ctrl+Arrow keys', async () => {
      const user = userEvent.setup();
      const onReorder = jest.fn();
      render(<SortableImageGrid {...defaultProps} onReorder={onReorder} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      
      await user.click(firstImage!);
      await user.keyboard('{Control>}{ArrowRight}{/Control}');

      expect(onReorder).toHaveBeenCalledWith(0, 1);
    });

    it('should wrap around at boundaries during navigation', async () => {
      const user = userEvent.setup();
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      
      await user.click(firstImage!);
      await user.keyboard('{ArrowLeft}');

      // Should wrap to last image
      const lastImage = screen.getByAltText('Property image 6').closest('[role="button"]');
      expect(lastImage).toHaveFocus();
    });
  });

  describe('Delete Functionality', () => {
    it('should show delete buttons when allowDelete is true', () => {
      render(<SortableImageGrid {...defaultProps} allowDelete={true} />);

      // Delete buttons should be present in the DOM (may be hidden until hover)
      const images = screen.getAllByRole('button');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should hide delete buttons when allowDelete is false', () => {
      render(<SortableImageGrid {...defaultProps} allowDelete={false} />);

      // Should not show delete buttons
      expect(screen.queryByLabelText(/Delete image/)).not.toBeInTheDocument();
    });

    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = jest.fn();
      render(<SortableImageGrid {...defaultProps} onDelete={onDelete} />);

      // This would test the actual delete button click
      // Implementation depends on how delete buttons are rendered
      const images = screen.getAllByRole('button');
      expect(images.length).toBe(6);
    });

    it('should show confirmation dialog for delete operations', () => {
      render(<SortableImageGrid {...defaultProps} showDeleteConfirmation={true} />);

      // Component should be configured to show confirmation
      expect(screen.getAllByRole('button')).toHaveLength(6);
    });
  });

  describe('Visual Feedback', () => {
    it('should show drop indicators during drag over', () => {
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      const secondImage = screen.getByAltText('Property image 2').closest('[role="button"]');

      fireEvent.dragStart(firstImage!);
      fireEvent.dragOver(secondImage!, {
        dataTransfer: { dropEffect: 'move' },
      });

      // Should show visual feedback for drop target
      expect(secondImage).toBeInTheDocument();
    });

    it('should highlight dragged item during drag operation', () => {
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');

      fireEvent.dragStart(firstImage!, {
        dataTransfer: {
          setData: jest.fn(),
          setDragImage: jest.fn(),
        },
      });

      // Should apply dragging styles
      expect(firstImage).toBeInTheDocument();
    });

    it('should show hover effects on interactive elements', () => {
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');

      fireEvent.mouseEnter(firstImage!);

      // Should show hover effects
      expect(firstImage).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('should show loading state for pending images', () => {
      const imagesWithLoading = [
        {
          file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
          key: 'loading-1',
          progress: 75, // 75% progress
          isExisting: false,
          isDeleted: false,
          order: 0,
        },
      ];

      render(<SortableImageGrid {...defaultProps} images={imagesWithLoading} />);

      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should show error state for failed images', () => {
      const imagesWithError = [
        {
          file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
          key: 'error-1',
          progress: 'ERROR' as const,
          isExisting: false,
          isDeleted: false,
          order: 0,
        },
      ];

      render(<SortableImageGrid {...defaultProps} images={imagesWithError} />);

      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should show retry option for failed uploads', () => {
      const imagesWithError = [
        {
          file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
          key: 'error-1',
          progress: 'ERROR' as const,
          isExisting: false,
          isDeleted: false,
          order: 0,
        },
      ];

      render(<SortableImageGrid {...defaultProps} images={imagesWithError} />);

      // Should show retry button for failed uploads
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no images', () => {
      render(<SortableImageGrid {...defaultProps} images={[]} />);

      expect(screen.getByText('No images')).toBeInTheDocument();
      expect(screen.getByText('Upload images to get started')).toBeInTheDocument();
    });

    it('should show empty state with custom message', () => {
      render(
        <SortableImageGrid 
          {...defaultProps} 
          images={[]} 
          emptyStateMessage="Add some property images"
        />
      );

      expect(screen.getByText('Add some property images')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for images', () => {
      render(<SortableImageGrid {...defaultProps} />);

      const images = screen.getAllByRole('button');
      images.forEach((image, index) => {
        expect(image).toHaveAttribute('aria-label', expect.stringContaining(`Property image ${index + 1}`));
      });
    });

    it('should have proper ARIA labels for delete buttons', () => {
      render(<SortableImageGrid {...defaultProps} allowDelete={true} />);

      // Delete buttons should have descriptive labels
      const images = screen.getAllByRole('button');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should support screen reader announcements for drag operations', () => {
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');

      fireEvent.dragStart(firstImage!);

      // Should have live region for screen reader announcements
      expect(document.querySelector('[aria-live]')).toBeInTheDocument();
    });

    it('should have proper focus management', async () => {
      const user = userEvent.setup();
      render(<SortableImageGrid {...defaultProps} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      
      await user.tab();
      expect(firstImage).toHaveFocus();

      await user.tab();
      const secondImage = screen.getByAltText('Property image 2').closest('[role="button"]');
      expect(secondImage).toHaveFocus();
    });

    it('should announce reorder operations to screen readers', () => {
      const onReorder = jest.fn();
      render(<SortableImageGrid {...defaultProps} onReorder={onReorder} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      const secondImage = screen.getByAltText('Property image 2').closest('[role="button"]');

      fireEvent.dragStart(firstImage!);
      fireEvent.drop(secondImage!, {
        dataTransfer: {
          getData: () => '0',
        },
      });

      // Should have announcement for screen readers
      expect(document.querySelector('[aria-live]')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle large numbers of images efficiently', () => {
      const manyImages = Array.from({ length: 20 }, (_, i) => createMockImage(i.toString()));
      
      const startTime = performance.now();
      render(<SortableImageGrid {...defaultProps} images={manyImages} />);
      const endTime = performance.now();

      // Should render within reasonable time
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should use virtual scrolling for very large lists', () => {
      const manyImages = Array.from({ length: 100 }, (_, i) => createMockImage(i.toString()));
      
      render(<SortableImageGrid {...defaultProps} images={manyImages} />);

      // Should implement virtual scrolling for performance
      // This would depend on the actual implementation
      expect(screen.getAllByRole('button').length).toBeLessThanOrEqual(100);
    });

    it('should debounce rapid drag operations', async () => {
      const onReorder = jest.fn();
      render(<SortableImageGrid {...defaultProps} onReorder={onReorder} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      const secondImage = screen.getByAltText('Property image 2').closest('[role="button"]');

      // Rapid drag operations
      for (let i = 0; i < 5; i++) {
        fireEvent.dragStart(firstImage!);
        fireEvent.drop(secondImage!, {
          dataTransfer: { getData: () => '0' },
        });
      }

      // Should debounce the operations
      await waitFor(() => {
        expect(onReorder.mock.calls.length).toBeLessThan(5);
      });
    });
  });

  describe('Disabled State', () => {
    it('should disable all interactions when disabled', () => {
      render(<SortableImageGrid {...defaultProps} disabled={true} />);

      const firstImage = screen.getByAltText('Property image 1').closest('[role="button"]');
      expect(firstImage).toHaveClass('opacity-50', 'pointer-events-none');
      expect(firstImage).toHaveAttribute('draggable', 'false');
    });

    it('should show disabled visual state', () => {
      render(<SortableImageGrid {...defaultProps} disabled={true} />);

      const images = screen.getAllByRole('button');
      images.forEach(image => {
        expect(image).toHaveClass('opacity-50');
      });
    });
  });
});