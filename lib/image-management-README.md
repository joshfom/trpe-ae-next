# Enhanced Image Management Utilities

This module provides comprehensive image management utilities for the luxe properties CRUD functionality, enabling advanced features like image deletion, drag-and-drop reordering, and mixed existing/new image operations.

## Overview

The enhanced image management system extends the existing `FileState` interface with additional fields and provides utility functions for complex image operations. It's designed to work seamlessly with the existing MultiImageDropzone component while adding powerful new capabilities.

## Core Interfaces

### EnhancedFileState

```typescript
interface EnhancedFileState {
  file: File | string;           // File object or URL string
  key: string;                   // Unique identifier for the file
  progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
  // Enhanced fields
  id?: string;                   // Database ID for existing images
  isExisting?: boolean;          // Flag to identify existing vs new images
  isDeleted?: boolean;           // Flag for soft deletion
  order: number;                 // Explicit order field for sorting
}
```

### ImageOperationPayload

```typescript
interface ImageOperationPayload {
  imagesToDelete: string[];      // IDs of images to delete from database
  newImages: Array<{             // New images to upload
    file: File;
    order: number;
  }>;
  orderUpdates: Array<{          // Existing images with updated order
    id: string;
    order: number;
  }>;
  existingImages: Array<{        // All existing images (for reference)
    id: string;
    url: string;
    order: number;
  }>;
}
```

## Core Functions

### Image State Management

#### `reorderImages(images, fromIndex, toIndex)`
Reorders images by moving an image from one position to another and updates all order numbers accordingly.

```typescript
const reorderedImages = reorderImages(images, 0, 2);
```

#### `markImageForDeletion(images, index)`
Marks an existing image for deletion (soft delete) without removing it from the array.

```typescript
const result = markImageForDeletion(images, 1);
if (result.success) {
  setImages(result.updatedImages);
}
```

#### `removeImage(images, index)`
Completely removes an image from the array (for new images) and updates order numbers.

```typescript
const result = removeImage(images, 2);
if (result.success) {
  setImages(result.updatedImages);
}
```

#### `addImages(existingImages, newImages)`
Adds new images to the collection with proper order numbering.

```typescript
const updatedImages = addImages(currentImages, newlyUploadedImages);
```

### Data Conversion

#### `convertPropertyImagesToFileState(propertyImages)`
Converts database property images to EnhancedFileState format for form usage.

```typescript
const fileStates = convertPropertyImagesToFileState(property.images);
setImages(fileStates);
```

### Filtering and Querying

#### `getVisibleImages(images)`
Returns only non-deleted images for display purposes.

```typescript
const visibleImages = getVisibleImages(allImages);
```

#### `getImagesToDelete(images)`
Returns array of image IDs that need to be deleted from the database.

```typescript
const deleteIds = getImagesToDelete(images);
```

#### `getNewImagesToUpload(images)`
Returns array of new images that need to be uploaded.

```typescript
const newImages = getNewImagesToUpload(images);
```

### Validation

#### `validateImageCollection(images, minImages, maxImages)`
Validates the image collection against minimum and maximum requirements.

```typescript
const validation = validateImageCollection(images, 6, 20);
if (!validation.isValid) {
  console.error(validation.errors);
}
```

### Form Integration

#### `mergeImageOperations(images)`
Prepares image data for server action submission by categorizing all operations.

```typescript
const operations = mergeImageOperations(images);
// Send operations to server action
await updatePropertyImages(propertyId, operations);
```

## Accessibility Features

### Keyboard Navigation

#### `handleKeyboardNavigation(event, currentIndex, totalImages, gridColumns)`
Handles keyboard navigation within the image grid.

```typescript
const newIndex = handleKeyboardNavigation(event, focusedIndex, images.length, 4);
if (newIndex !== null) {
  setFocusedIndex(newIndex);
}
```

#### `handleKeyboardReorder(event, currentIndex, images)`
Handles keyboard-based image reordering using Ctrl/Cmd + Arrow keys.

```typescript
const reorderedImages = handleKeyboardReorder(event, focusedIndex, images);
if (reorderedImages) {
  setImages(reorderedImages);
}
```

## Touch and Mobile Support

### Touch Event Utilities

#### `getTouchPosition(touch, container)`
Calculates touch position relative to container element.

#### `findImageAtPosition(position, imageElements)`
Finds the image element at a specific touch position.

## Performance Optimization

### Debouncing and Throttling

#### `debounce(func, wait)`
Debounces function calls to prevent excessive operations.

```typescript
const debouncedSave = debounce(saveImages, 500);
```

#### `throttle(func, limit)`
Throttles function calls for performance-critical operations.

```typescript
const throttledReorder = throttle(handleReorder, 100);
```

## Error Handling

### `createImageErrorMessage(error, operation)`
Creates user-friendly error messages for different operations.

```typescript
const errorMessage = createImageErrorMessage(error, 'upload');
toast.error(errorMessage);
```

## Usage Examples

### Basic Setup

```typescript
import {
  EnhancedFileState,
  convertPropertyImagesToFileState,
  reorderImages,
  markImageForDeletion,
  validateImageCollection,
  mergeImageOperations
} from '@/lib/image-management-utils';

// Initialize with existing property images
const [images, setImages] = useState<EnhancedFileState[]>([]);

useEffect(() => {
  if (property?.images) {
    const fileStates = convertPropertyImagesToFileState(property.images);
    setImages(fileStates);
  }
}, [property]);
```

### Handling Image Deletion

```typescript
const handleImageDelete = (index: number) => {
  const image = images[index];
  
  if (image.isExisting) {
    // Mark existing image for deletion
    const result = markImageForDeletion(images, index);
    if (result.success) {
      setImages(result.updatedImages);
    }
  } else {
    // Remove new image completely
    const result = removeImage(images, index);
    if (result.success) {
      setImages(result.updatedImages);
    }
  }
};
```

### Handling Image Reordering

```typescript
const handleImageReorder = (fromIndex: number, toIndex: number) => {
  const reorderedImages = reorderImages(images, fromIndex, toIndex);
  setImages(reorderedImages);
};
```

### Form Submission

```typescript
const handleSubmit = async (formData: any) => {
  // Validate images
  const validation = validateImageCollection(images, 6, 20);
  if (!validation.isValid) {
    toast.error(validation.errors.join(', '));
    return;
  }
  
  // Prepare image operations
  const imageOperations = mergeImageOperations(images);
  
  // Submit to server action
  const result = await updateLuxePropertyAction(propertyId, {
    ...formData,
    imageOperations
  });
  
  if (result.success) {
    toast.success('Property updated successfully');
  }
};
```

## Integration with Components

This utility module is designed to work with:

- **MultiImageDropzone**: Enhanced version with delete and reorder capabilities
- **SortableImageGrid**: New component for drag-and-drop functionality
- **LuxePropertyForm**: Updated form with comprehensive image management
- **Server Actions**: Optimized image CRUD operations

## Testing

The module includes comprehensive tests covering:

- Image reordering logic
- Deletion operations (soft and hard delete)
- Data conversion functions
- Validation rules
- Keyboard navigation
- Performance utilities
- Error handling

Run tests with:
```bash
bun test lib/__tests__/image-management-utils.test.ts
```

## Performance Considerations

- **Debounced Operations**: Frequent operations like reordering are debounced
- **Lazy Loading**: Large image collections support progressive loading
- **Memory Management**: Proper cleanup of object URLs and event listeners
- **Optimistic Updates**: UI updates immediately while syncing with server

## Security Considerations

- **File Validation**: All uploaded files are validated for type and size
- **Access Control**: Image operations respect user permissions
- **Data Integrity**: Atomic operations prevent partial updates
- **Audit Trail**: All image modifications are logged for debugging

## Browser Compatibility

- **Modern Browsers**: Full support for drag-and-drop and touch events
- **Mobile Devices**: Touch-optimized drag-and-drop functionality
- **Accessibility**: Full keyboard navigation and screen reader support
- **Progressive Enhancement**: Graceful degradation for older browsers