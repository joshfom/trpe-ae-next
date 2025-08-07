'use client';

import * as React from 'react';
import { X, GripVertical, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  EnhancedFileState,
  reorderImages,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleKeyboardNavigation,
  handleKeyboardReorder,
  getTouchPosition,
  findImageAtPosition,
  debounce,
  logImageOperation
} from '@/lib/image-management-utils';

interface SortableImageGridProps {
  images: EnhancedFileState[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onDelete: (index: number) => void;
  allowDelete?: boolean;
  allowReorder?: boolean;
  disabled?: boolean;
  className?: string;
  gridColumns?: number;
  isProcessing?: boolean;
}

interface DragState {
  isDragging: boolean;
  dragIndex: number | null;
  dragOverIndex: number | null;
  dragPreview?: HTMLElement;
}

interface TouchState {
  isActive: boolean;
  startIndex: number | null;
  currentIndex: number | null;
  startPosition: { x: number; y: number } | null;
  dragThreshold: number;
}

const SortableImageGrid = React.forwardRef<HTMLDivElement, SortableImageGridProps>(
  (
    {
      images,
      onReorder,
      onDelete,
      allowDelete = true,
      allowReorder = true,
      disabled = false,
      className,
      gridColumns = 4,
      isProcessing = false,
    },
    ref
  ) => {
    const [dragState, setDragState] = React.useState<DragState>({
      isDragging: false,
      dragIndex: null,
      dragOverIndex: null,
    });

    const [touchState, setTouchState] = React.useState<TouchState>({
      isActive: false,
      startIndex: null,
      currentIndex: null,
      startPosition: null,
      dragThreshold: 10,
    });

    const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
    const [deleteConfirmIndex, setDeleteConfirmIndex] = React.useState<number | null>(null);

    const gridRef = React.useRef<HTMLDivElement>(null);
    const imageRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const dragPreviewRef = React.useRef<HTMLDivElement | null>(null);

    // Debounced reorder function to prevent excessive calls
    const debouncedReorder = React.useMemo(
      () => debounce((fromIndex: number, toIndex: number) => {
        onReorder(fromIndex, toIndex);
        logImageOperation('reorder', { fromIndex, toIndex });
      }, 100),
      [onReorder]
    );

    // Filter out deleted images for display
    const visibleImages = React.useMemo(
      () => images.filter(image => !image.isDeleted),
      [images]
    );

    // Create image URLs for display
    const imageUrls = React.useMemo(() => {
      return visibleImages.map((fileState) => {
        if (typeof fileState.file === 'string') {
          return fileState.file;
        } else {
          return URL.createObjectURL(fileState.file);
        }
      });
    }, [visibleImages]);

    // Cleanup object URLs on unmount
    React.useEffect(() => {
      return () => {
        imageUrls.forEach(url => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      };
    }, [imageUrls]);

    // Update image refs array when images change
    React.useEffect(() => {
      imageRefs.current = imageRefs.current.slice(0, visibleImages.length);
    }, [visibleImages.length]);

    // HTML5 Drag and Drop handlers
    const handleDragStartEvent = React.useCallback((event: React.DragEvent, index: number) => {
      if (!allowReorder || disabled || isProcessing) {
        event.preventDefault();
        return;
      }

      handleDragStart(index, event.dataTransfer);
      setDragState({
        isDragging: true,
        dragIndex: index,
        dragOverIndex: null,
      });

      // Create drag preview
      const dragImage = event.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.transform = 'rotate(5deg)';
      dragImage.style.opacity = '0.8';
      event.dataTransfer.setDragImage(dragImage, 50, 50);

      logImageOperation('drag_start', { index });
    }, [allowReorder, disabled]);

    const handleDragOverEvent = React.useCallback((event: React.DragEvent, index: number) => {
      if (!allowReorder || disabled || isProcessing) return;

      if (handleDragOver(event)) {
        setDragState(prev => ({
          ...prev,
          dragOverIndex: index,
        }));
      }
    }, [allowReorder, disabled]);

    const handleDropEvent = React.useCallback((event: React.DragEvent, dropIndex: number) => {
      if (!allowReorder || disabled || isProcessing) return;

      const sourceIndex = handleDrop(event);
      if (sourceIndex !== null && sourceIndex !== dropIndex) {
        debouncedReorder(sourceIndex, dropIndex);
      }

      setDragState({
        isDragging: false,
        dragIndex: null,
        dragOverIndex: null,
      });

      logImageOperation('drag_drop', { sourceIndex, dropIndex });
    }, [allowReorder, disabled, debouncedReorder]);

    const handleDragEndEvent = React.useCallback(() => {
      setDragState({
        isDragging: false,
        dragIndex: null,
        dragOverIndex: null,
      });
    }, []);

    // Touch event handlers for mobile drag-and-drop
    const handleTouchStart = React.useCallback((event: React.TouchEvent, index: number) => {
      if (!allowReorder || disabled || isProcessing) return;

      const touch = event.touches[0];
      const position = getTouchPosition(touch, event.currentTarget as HTMLElement);

      setTouchState({
        isActive: true,
        startIndex: index,
        currentIndex: index,
        startPosition: position,
        dragThreshold: 10,
      });

      logImageOperation('touch_start', { index, position });
    }, [allowReorder, disabled]);

    const handleTouchMove = React.useCallback((event: React.TouchEvent) => {
      if (!touchState.isActive || !allowReorder || disabled || isProcessing) return;

      event.preventDefault(); // Prevent scrolling
      const touch = event.touches[0];
      const container = gridRef.current;
      if (!container) return;

      const position = getTouchPosition(touch, container);
      const imageElements = imageRefs.current.filter(Boolean) as HTMLElement[];
      const targetIndex = findImageAtPosition(position, imageElements);

      if (targetIndex !== null && targetIndex !== touchState.currentIndex) {
        setTouchState(prev => ({
          ...prev,
          currentIndex: targetIndex,
        }));
      }
    }, [touchState.isActive, touchState.currentIndex, allowReorder, disabled]);

    const handleTouchEnd = React.useCallback(() => {
      if (!touchState.isActive) return;

      const { startIndex, currentIndex } = touchState;
      if (startIndex !== null && currentIndex !== null && startIndex !== currentIndex) {
        debouncedReorder(startIndex, currentIndex);
      }

      setTouchState({
        isActive: false,
        startIndex: null,
        currentIndex: null,
        startPosition: null,
        dragThreshold: 10,
      });

      logImageOperation('touch_end', { startIndex, currentIndex });
    }, [touchState, debouncedReorder]);

    // Delete handler
    const handleDeleteImage = React.useCallback((index: number) => {
      if (!allowDelete || disabled || isProcessing) return;

      setDeleteConfirmIndex(index);
      
      // Auto-confirm after a short delay for better UX
      setTimeout(() => {
        setDeleteConfirmIndex(null);
        onDelete(index);
        logImageOperation('delete', { index });
      }, 1500);
    }, [allowDelete, disabled, isProcessing, onDelete]);

    // Keyboard navigation handlers
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent, index: number) => {
      if (disabled || isProcessing) return;

      // Handle keyboard navigation
      const newFocusIndex = handleKeyboardNavigation(
        event.nativeEvent,
        index,
        visibleImages.length,
        gridColumns
      );

      if (newFocusIndex !== null) {
        setFocusedIndex(newFocusIndex);
        imageRefs.current[newFocusIndex]?.focus();
        return;
      }

      // Handle keyboard reordering
      if (allowReorder) {
        const reorderedImages = handleKeyboardReorder(
          event.nativeEvent,
          index,
          visibleImages
        );

        if (reorderedImages) {
          const newIndex = event.nativeEvent.key === 'ArrowLeft' ? index - 1 : 
                          event.nativeEvent.key === 'ArrowRight' ? index + 1 :
                          event.nativeEvent.key === 'Home' ? 0 : visibleImages.length - 1;
          
          onReorder(index, newIndex);
          setFocusedIndex(newIndex);
          
          // Focus the moved item after reorder
          setTimeout(() => {
            imageRefs.current[newIndex]?.focus();
          }, 0);
        }
      }

      // Handle delete with keyboard
      if (allowDelete && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault();
        handleDeleteImage(index);
      }
    }, [disabled, visibleImages.length, visibleImages, gridColumns, allowReorder, allowDelete, onReorder, handleDeleteImage]);

    const cancelDelete = React.useCallback(() => {
      setDeleteConfirmIndex(null);
    }, []);

    // Grid style calculation
    const gridStyle = React.useMemo(() => ({
      gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
    }), [gridColumns]);

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4 p-4 transition-opacity duration-200",
          (disabled || isProcessing) && "opacity-50 pointer-events-none",
          isProcessing && "cursor-wait",
          className
        )}
        style={gridStyle}
      >
        {visibleImages.map((image, index) => {
          const imageUrl = imageUrls[index];
          const isDraggedOver = dragState.dragOverIndex === index;
          const isBeingDragged = dragState.dragIndex === index;
          const isTouchActive = touchState.isActive && touchState.currentIndex === index;
          const isDeleteConfirm = deleteConfirmIndex === index;
          const isFocused = focusedIndex === index;

          return (
            <div
              key={image.key}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              className={cn(
                "relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isDraggedOver && "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg",
                isBeingDragged && "opacity-50 scale-95 rotate-2 shadow-xl",
                isTouchActive && "scale-105 shadow-lg z-10",
                isFocused && "ring-2 ring-blue-500 ring-offset-2",
                !disabled && !isProcessing && "cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600",
                isProcessing && "cursor-wait",
                "border-gray-200 dark:border-gray-700",
                "hover:scale-[1.02] active:scale-[0.98]"
              )}
              draggable={allowReorder && !disabled && !isProcessing}
              tabIndex={0}
              role="button"
              aria-label={`Image ${index + 1} of ${visibleImages.length}. ${allowReorder ? 'Draggable. ' : ''}${allowDelete ? 'Press Delete to remove.' : ''}`}
              onDragStart={(e) => handleDragStartEvent(e, index)}
              onDragOver={(e) => handleDragOverEvent(e, index)}
              onDrop={(e) => handleDropEvent(e, index)}
              onDragEnd={handleDragEndEvent}
              onTouchStart={(e) => handleTouchStart(e, index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
            >
              {/* Image */}
              <img
                src={imageUrl}
                alt={`Property image ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />

              {/* Drag handle - visible on hover or focus */}
              {allowReorder && !disabled && !isProcessing && (
                <div
                  className={cn(
                    "absolute top-2 left-2 p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-md shadow-sm transition-all duration-200",
                    "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                    "hover:bg-white dark:hover:bg-gray-800 hover:shadow-md",
                    isBeingDragged && "opacity-100 bg-blue-500 text-white"
                  )}
                  aria-hidden="true"
                >
                  <GripVertical className={cn(
                    "w-4 h-4 transition-colors duration-200",
                    isBeingDragged ? "text-white" : "text-gray-600 dark:text-gray-400"
                  )} />
                </div>
              )}

              {/* Delete button */}
              {allowDelete && !disabled && !isProcessing && (
                <div
                  className={cn(
                    "absolute top-2 right-2 transition-all duration-200",
                    "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                  )}
                >
                  {isDeleteConfirm ? (
                    <div className="flex gap-1 animate-in slide-in-from-top-2 duration-200">
                      <Button
                        size="xs"
                        variant="destructive"
                        onClick={() => handleDeleteImage(index)}
                        className="h-7 w-7 p-0 shadow-lg hover:shadow-xl transition-shadow duration-200"
                        aria-label="Confirm delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={cancelDelete}
                        className="h-7 w-7 p-0 bg-white/90 dark:bg-gray-800/90 shadow-lg hover:shadow-xl transition-shadow duration-200"
                        aria-label="Cancel delete"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() => handleDeleteImage(index)}
                      className="h-7 w-7 p-0 opacity-90 hover:opacity-100 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                      aria-label={`Delete image ${index + 1}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}

              {/* Loading indicator */}
              {image.progress !== 'COMPLETE' && image.progress !== 'ERROR' && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white mb-2" />
                  <div className="text-white text-sm font-medium">
                    {typeof image.progress === 'number' ? `${image.progress}%` : 'Uploading...'}
                  </div>
                  {typeof image.progress === 'number' && (
                    <div className="w-16 bg-white/20 rounded-full h-1 mt-2">
                      <div 
                        className="bg-white h-1 rounded-full transition-all duration-300"
                        style={{ width: `${image.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Error indicator */}
              {image.progress === 'ERROR' && (
                <div className="absolute inset-0 bg-red-500/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white mb-2" />
                  <div className="text-white text-sm font-medium">Upload Failed</div>
                  <div className="text-white/80 text-xs mt-1">Click to retry</div>
                </div>
              )}

              {/* Order indicator */}
              <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium shadow-lg">
                {index + 1}
              </div>

              {/* Success indicator for completed uploads */}
              {image.progress === 'COMPLETE' && !image.isExisting && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded-full p-1 shadow-lg animate-in zoom-in-50 duration-300">
                  <CheckCircle className="h-3 w-3" />
                </div>
              )}

              {/* Drop indicator */}
              {isDraggedOver && dragState.isDragging && (
                <div className="absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-50/80 dark:bg-blue-900/40 backdrop-blur-sm flex items-center justify-center animate-pulse">
                  <div className="text-blue-600 dark:text-blue-400 font-medium text-sm bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full shadow-lg">
                    Drop here
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {visibleImages.length === 0 && (
          <div className="col-span-full flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">No images</div>
              <div className="text-sm">Upload images to get started</div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

SortableImageGrid.displayName = 'SortableImageGrid';

export { SortableImageGrid };
export type { SortableImageGridProps };