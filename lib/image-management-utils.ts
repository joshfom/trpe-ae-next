/**
 * Enhanced image management utilities for luxe properties
 * Provides comprehensive image state management with support for
 * deletion, reordering, and mixed existing/new image operations
 */

/**
 * Enhanced FileState interface with additional fields for comprehensive image management
 */
export interface EnhancedFileState {
  file: File | string;
  key: string;
  progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
  // Enhanced fields for image management
  id?: string; // Database ID for existing images
  isExisting?: boolean; // Flag to identify existing vs new images
  isDeleted?: boolean; // Flag for soft deletion
  order: number; // Explicit order field for sorting
}

/**
 * Interface for image form data structure
 */
export interface ImageFormData {
  // Existing images (from database)
  existingImages: Array<{
    id: string;
    url: string;
    order: number;
    isDeleted?: boolean; // For soft deletion
  }>;
  
  // New images (to be uploaded)
  newImages: Array<{
    file: File;
    order: number;
  }>;
}

/**
 * Interface for image operation results
 */
export interface ImageOperationResult {
  success: boolean;
  message?: string;
  updatedImages?: EnhancedFileState[];
}

/**
 * Reorder images by moving an image from one position to another
 * @param images - Array of EnhancedFileState objects
 * @param fromIndex - Source index
 * @param toIndex - Target index
 * @returns Updated array with reordered images
 */
export function reorderImages(
  images: EnhancedFileState[],
  fromIndex: number,
  toIndex: number
): EnhancedFileState[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || 
      fromIndex >= images.length || toIndex >= images.length) {
    return images;
  }

  const reorderedImages = [...images];
  const [movedImage] = reorderedImages.splice(fromIndex, 1);
  reorderedImages.splice(toIndex, 0, movedImage);

  // Update order numbers to maintain sequential ordering
  return reorderedImages.map((image, index) => ({
    ...image,
    order: index
  }));
}

/**
 * Mark an image for deletion (soft delete)
 * @param images - Array of EnhancedFileState objects
 * @param index - Index of image to delete
 * @returns Updated array with image marked for deletion
 */
export function markImageForDeletion(
  images: EnhancedFileState[],
  index: number
): ImageOperationResult {
  if (index < 0 || index >= images.length) {
    return {
      success: false,
      message: 'Invalid image index'
    };
  }

  const updatedImages = images.map((image, i) => {
    if (i === index) {
      return {
        ...image,
        isDeleted: true
      };
    }
    return image;
  });

  return {
    success: true,
    updatedImages
  };
}

/**
 * Remove an image completely from the array (hard delete for new images)
 * @param images - Array of EnhancedFileState objects
 * @param index - Index of image to remove
 * @returns Updated array with image removed and order numbers updated
 */
export function removeImage(
  images: EnhancedFileState[],
  index: number
): ImageOperationResult {
  if (index < 0 || index >= images.length) {
    return {
      success: false,
      message: 'Invalid image index'
    };
  }

  const updatedImages = images
    .filter((_, i) => i !== index)
    .map((image, newIndex) => ({
      ...image,
      order: newIndex
    }));

  return {
    success: true,
    updatedImages
  };
}

/**
 * Add new images to the collection
 * @param existingImages - Current array of EnhancedFileState objects
 * @param newImages - Array of new images to add
 * @returns Updated array with new images appended
 */
export function addImages(
  existingImages: EnhancedFileState[],
  newImages: EnhancedFileState[]
): EnhancedFileState[] {
  const startOrder = existingImages.length;
  
  const imagesWithOrder = newImages.map((image, index) => ({
    ...image,
    order: startOrder + index,
    isExisting: false
  }));

  return [...existingImages, ...imagesWithOrder];
}

/**
 * Convert existing property images to EnhancedFileState format
 * @param propertyImages - Array of property image objects from database
 * @returns Array of EnhancedFileState objects
 */
export function convertPropertyImagesToFileState(
  propertyImages: Array<{
    id: string;
    s3Url?: string;
    url?: string;
    order?: number;
  }>
): EnhancedFileState[] {
  return propertyImages
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((image, index) => ({
      file: image.s3Url || image.url || '',
      key: `existing-${image.id}`,
      progress: 'COMPLETE' as const,
      id: image.id,
      isExisting: true,
      isDeleted: false,
      order: image.order !== undefined ? image.order : index
    }));
}

/**
 * Get only non-deleted images for display
 * @param images - Array of EnhancedFileState objects
 * @returns Filtered array without deleted images
 */
export function getVisibleImages(images: EnhancedFileState[]): EnhancedFileState[] {
  return images.filter(image => !image.isDeleted);
}

/**
 * Get images that need to be deleted from database
 * @param images - Array of EnhancedFileState objects
 * @returns Array of image IDs to delete
 */
export function getImagesToDelete(images: EnhancedFileState[]): string[] {
  return images
    .filter(image => image.isExisting && image.isDeleted && image.id)
    .map(image => image.id!)
    .filter(Boolean);
}

/**
 * Get new images that need to be uploaded
 * @param images - Array of EnhancedFileState objects
 * @returns Array of new images to upload
 */
export function getNewImagesToUpload(images: EnhancedFileState[]): EnhancedFileState[] {
  return images.filter(image => 
    !image.isExisting && 
    !image.isDeleted && 
    image.file instanceof File &&
    image.progress === 'PENDING'
  );
}

/**
 * Get existing images that need order updates
 * @param images - Array of EnhancedFileState objects
 * @param originalImages - Original array for comparison
 * @returns Array of images with updated order information
 */
export function getImagesWithOrderUpdates(
  images: EnhancedFileState[],
  originalImages: EnhancedFileState[]
): Array<{ id: string; order: number }> {
  const updates: Array<{ id: string; order: number }> = [];
  
  images.forEach((image, index) => {
    if (image.isExisting && image.id && !image.isDeleted) {
      const originalImage = originalImages.find(orig => orig.id === image.id);
      if (originalImage && originalImage.order !== image.order) {
        updates.push({
          id: image.id,
          order: image.order
        });
      }
    }
  });
  
  return updates;
}

/**
 * Enhanced validation result interface
 */
export interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  counts: {
    total: number;
    existing: number;
    new: number;
    deleted: number;
    visible: number;
  };
}

/**
 * Validate image collection meets requirements with comprehensive feedback
 * @param images - Array of EnhancedFileState objects
 * @param minImages - Minimum required images (default: 6)
 * @param maxImages - Maximum allowed images (default: 20)
 * @returns Enhanced validation result
 */
export function validateImageCollection(
  images: EnhancedFileState[],
  minImages: number = 6,
  maxImages: number = 20
): ImageValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const visibleImages = getVisibleImages(images);
  const existingImages = images.filter(img => img.isExisting && !img.isDeleted);
  const newImages = images.filter(img => !img.isExisting && !img.isDeleted);
  const deletedImages = images.filter(img => img.isDeleted);
  const pendingUploads = images.filter(img => !img.isExisting && img.progress === 'PENDING');
  const failedUploads = images.filter(img => !img.isExisting && img.progress === 'ERROR');
  
  const counts = {
    total: images.length,
    existing: existingImages.length,
    new: newImages.length,
    deleted: deletedImages.length,
    visible: visibleImages.length
  };
  
  // Minimum images validation
  if (visibleImages.length < minImages) {
    const needed = minImages - visibleImages.length;
    errors.push(`Minimum ${minImages} images required. Add ${needed} more image${needed > 1 ? 's' : ''}.`);
  }
  
  // Maximum images validation
  if (visibleImages.length > maxImages) {
    const excess = visibleImages.length - maxImages;
    errors.push(`Maximum ${maxImages} images allowed. Remove ${excess} image${excess > 1 ? 's' : ''}.`);
  }
  
  // Pending uploads validation (warning only, not error)
  if (pendingUploads.length > 0) {
    warnings.push(`${pendingUploads.length} image${pendingUploads.length > 1 ? 's' : ''} still uploading. Please wait for completion.`);
  }
  
  // Failed uploads validation
  if (failedUploads.length > 0) {
    errors.push(`${failedUploads.length} image${failedUploads.length > 1 ? 's' : ''} failed to upload. Please retry or remove them.`);
  }
  
  // Deletion warnings
  if (deletedImages.length > 0) {
    warnings.push(`${deletedImages.length} image${deletedImages.length > 1 ? 's' : ''} marked for deletion.`);
  }
  
  // Progress validation for form submission (only for submission validation, not general validation)
  // This is handled separately in validateImagesForSubmission
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    counts
  };
}

/**
 * Validate image collection for real-time feedback during operations
 * @param images - Array of EnhancedFileState objects
 * @param operation - Type of operation being performed
 * @param minImages - Minimum required images
 * @param maxImages - Maximum allowed images
 * @returns Real-time validation result
 */
export function validateImageOperationRealTime(
  images: EnhancedFileState[],
  operation: 'add' | 'delete' | 'reorder' | 'upload',
  minImages: number = 6,
  maxImages: number = 20
): ImageValidationResult {
  const baseValidation = validateImageCollection(images, minImages, maxImages);
  const visibleImages = getVisibleImages(images);
  
  // Add operation-specific validation messages
  switch (operation) {
    case 'add':
      if (visibleImages.length >= maxImages) {
        baseValidation.errors.unshift(`Cannot add more images. Maximum ${maxImages} images allowed.`);
      } else if (visibleImages.length === maxImages - 1) {
        baseValidation.warnings.push(`Adding this image will reach the maximum limit of ${maxImages} images.`);
      }
      break;
      
    case 'delete':
      if (visibleImages.length <= minImages) {
        baseValidation.errors.unshift(`Cannot delete image. Minimum ${minImages} images required.`);
      } else if (visibleImages.length - 1 === minImages) {
        baseValidation.warnings.push(`Deleting this image will reach the minimum limit of ${minImages} images.`);
      }
      break;
      
    case 'upload':
      const uploadingImages = images.filter(img => 
        !img.isExisting && 
        typeof img.progress === 'number' && 
        img.progress < 100
      );
      if (uploadingImages.length > 0) {
        baseValidation.warnings.push(`${uploadingImages.length} image${uploadingImages.length > 1 ? 's' : ''} currently uploading...`);
      }
      break;
  }
  
  baseValidation.isValid = baseValidation.errors.length === 0;
  return baseValidation;
}

/**
 * Validate images before form submission
 * @param images - Array of EnhancedFileState objects
 * @param minImages - Minimum required images
 * @param maxImages - Maximum allowed images
 * @returns Submission validation result
 */
export function validateImagesForSubmission(
  images: EnhancedFileState[],
  minImages: number = 6,
  maxImages: number = 20
): ImageValidationResult {
  const validation = validateImageCollection(images, minImages, maxImages);
  const visibleImages = getVisibleImages(images);
  
  // Additional submission-specific validations
  const pendingImages = images.filter(img => 
    !img.isExisting && 
    img.progress === 'PENDING'
  );
  
  const uploadingImages = images.filter(img => 
    !img.isExisting && 
    typeof img.progress === 'number' && 
    img.progress < 100
  );
  
  const errorImages = images.filter(img => img.progress === 'ERROR');
  
  if (pendingImages.length > 0) {
    validation.errors.push(`${pendingImages.length} image${pendingImages.length > 1 ? 's' : ''} not uploaded yet. Please wait for upload to complete.`);
  }
  
  if (uploadingImages.length > 0) {
    validation.errors.push(`${uploadingImages.length} image${uploadingImages.length > 1 ? 's are' : ' is'} still uploading. Please wait for completion.`);
  }
  
  if (errorImages.length > 0) {
    validation.errors.push(`${errorImages.length} image${errorImages.length > 1 ? 's' : ''} failed to upload. Please retry or remove them.`);
  }
  
  // Check for valid URLs in completed images
  const completedImages = visibleImages.filter(img => 
    img.progress === 'COMPLETE' || img.isExisting
  );
  
  const invalidUrlImages = completedImages.filter(img => 
    typeof img.file !== 'string' || !img.file.trim()
  );
  
  if (invalidUrlImages.length > 0) {
    validation.errors.push(`${invalidUrlImages.length} image${invalidUrlImages.length > 1 ? 's have' : ' has'} invalid URL. Please re-upload.`);
  }
  
  validation.isValid = validation.errors.length === 0;
  return validation;
}

/**
 * Merge image operations for form submission
 * @param images - Current array of EnhancedFileState objects
 * @returns Structured data for server action
 */
export function mergeImageOperations(images: EnhancedFileState[]): {
  imagesToDelete: string[];
  newImages: Array<{ file: string; order: number }>;
  orderUpdates: Array<{ id: string; order: number }>;
  existingImages: Array<{ id: string; url: string; order: number }>;
} {
  const imagesToDelete = getImagesToDelete(images);
  
  // Get new images that have been uploaded (progress === 'COMPLETE' and file is now a URL)
  const newImages = images
    .filter(image => !image.isExisting && !image.isDeleted && image.progress === 'COMPLETE')
    .map(image => ({
      file: typeof image.file === 'string' ? image.file : '',
      order: image.order
    }));
  
  const existingImages = images
    .filter(image => image.isExisting && !image.isDeleted && image.id)
    .map(image => ({
      id: image.id!,
      url: typeof image.file === 'string' ? image.file : '',
      order: image.order
    }));
  
  const orderUpdates = existingImages.map(image => ({
    id: image.id,
    order: image.order
  }));
  
  return {
    imagesToDelete,
    newImages,
    orderUpdates,
    existingImages
  };
}
/**
 
* Drag and drop utility functions
 */

/**
 * Handle drag start event
 * @param index - Index of the dragged item
 * @param dataTransfer - DataTransfer object from drag event
 */
export function handleDragStart(index: number, dataTransfer: DataTransfer | null): void {
  if (!dataTransfer) return;
  dataTransfer.effectAllowed = 'move';
  dataTransfer.setData('text/plain', index.toString());
}

/**
 * Handle drag over event to determine if drop is allowed
 * @param event - Drag event
 * @returns Whether drop is allowed
 */
export function handleDragOver(event: React.DragEvent | DragEvent): boolean {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  return true;
}

/**
 * Handle drop event and extract source index
 * @param event - Drop event
 * @returns Source index or null if invalid
 */
export function handleDrop(event: React.DragEvent | DragEvent): number | null {
  event.preventDefault();
  if (!event.dataTransfer) return null;
  const sourceIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
  return isNaN(sourceIndex) ? null : sourceIndex;
}

/**
 * Keyboard navigation utilities for accessibility
 */

/**
 * Handle keyboard navigation for image grid
 * @param event - Keyboard event
 * @param currentIndex - Currently focused image index
 * @param totalImages - Total number of images
 * @param gridColumns - Number of columns in the grid
 * @returns New focus index or null if no change
 */
export function handleKeyboardNavigation(
  event: KeyboardEvent,
  currentIndex: number,
  totalImages: number,
  gridColumns: number = 4
): number | null {
  const { key } = event;
  
  switch (key) {
    case 'ArrowLeft':
      event.preventDefault();
      return currentIndex > 0 ? currentIndex - 1 : totalImages - 1;
      
    case 'ArrowRight':
      event.preventDefault();
      return currentIndex < totalImages - 1 ? currentIndex + 1 : 0;
      
    case 'ArrowUp':
      event.preventDefault();
      const upIndex = currentIndex - gridColumns;
      return upIndex >= 0 ? upIndex : currentIndex;
      
    case 'ArrowDown':
      event.preventDefault();
      const downIndex = currentIndex + gridColumns;
      return downIndex < totalImages ? downIndex : currentIndex;
      
    case 'Home':
      event.preventDefault();
      return 0;
      
    case 'End':
      event.preventDefault();
      return totalImages - 1;
      
    default:
      return null;
  }
}

/**
 * Handle keyboard-based reordering
 * @param event - Keyboard event
 * @param currentIndex - Currently focused image index
 * @param images - Array of images
 * @returns Updated images array or null if no change
 */
export function handleKeyboardReorder(
  event: KeyboardEvent,
  currentIndex: number,
  images: EnhancedFileState[]
): EnhancedFileState[] | null {
  const { key, ctrlKey, metaKey } = event;
  const isModifierPressed = ctrlKey || metaKey;
  
  if (!isModifierPressed) return null;
  
  switch (key) {
    case 'ArrowLeft':
      event.preventDefault();
      if (currentIndex > 0) {
        return reorderImages(images, currentIndex, currentIndex - 1);
      }
      break;
      
    case 'ArrowRight':
      event.preventDefault();
      if (currentIndex < images.length - 1) {
        return reorderImages(images, currentIndex, currentIndex + 1);
      }
      break;
      
    case 'Home':
      event.preventDefault();
      if (currentIndex > 0) {
        return reorderImages(images, currentIndex, 0);
      }
      break;
      
    case 'End':
      event.preventDefault();
      if (currentIndex < images.length - 1) {
        return reorderImages(images, currentIndex, images.length - 1);
      }
      break;
  }
  
  return null;
}

/**
 * Touch event utilities for mobile drag-and-drop
 */

/**
 * Calculate touch position relative to container
 * @param touch - Touch object
 * @param container - Container element
 * @returns Relative position
 */
export function getTouchPosition(
  touch: React.Touch | Touch,
  container: HTMLElement
): { x: number; y: number } {
  const rect = container.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  };
}

/**
 * Find image index at touch position
 * @param position - Touch position
 * @param imageElements - Array of image elements
 * @returns Image index or null if not found
 */
export function findImageAtPosition(
  position: { x: number; y: number },
  imageElements: HTMLElement[]
): number | null {
  for (let i = 0; i < imageElements.length; i++) {
    const element = imageElements[i];
    const rect = element.getBoundingClientRect();
    
    if (
      position.x >= rect.left &&
      position.x <= rect.right &&
      position.y >= rect.top &&
      position.y <= rect.bottom
    ) {
      return i;
    }
  }
  
  return null;
}

/**
 * Performance optimization utilities
 */

/**
 * Debounce function for frequent operations
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance-critical operations
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Error handling utilities
 */

/**
 * Create user-friendly error messages for image operations
 * @param error - Error object or message
 * @param operation - Type of operation that failed
 * @returns User-friendly error message
 */
export function createImageErrorMessage(
  error: Error | string,
  operation: 'upload' | 'delete' | 'reorder' | 'validation'
): string {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  const operationMessages = {
    upload: 'Failed to upload image',
    delete: 'Failed to delete image',
    reorder: 'Failed to reorder images',
    validation: 'Image validation failed'
  };
  
  return `${operationMessages[operation]}: ${errorMessage}`;
}

/**
 * Log image operation for debugging
 * @param operation - Operation type
 * @param details - Operation details
 */
export function logImageOperation(
  operation: string,
  details: Record<string, any>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Image Management] ${operation}:`, details);
  }
}