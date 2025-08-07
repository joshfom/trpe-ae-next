/**
 * Type definitions for enhanced image management
 * Extends the existing FileState interface with additional fields
 */

// Re-export the original FileState for backward compatibility
export type { FileState } from '@/components/multi-image-dropzone';

// Enhanced FileState interface with additional fields
export interface EnhancedFileState {
  file: File | string;
  key: string;
  progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
  // Enhanced fields for comprehensive image management
  id?: string; // Database ID for existing images
  isExisting?: boolean; // Flag to identify existing vs new images
  isDeleted?: boolean; // Flag for soft deletion
  order: number; // Explicit order field for sorting
}

// Image operation callback types
export type ImageDeleteCallback = (index: number) => void;
export type ImageReorderCallback = (fromIndex: number, toIndex: number) => void;

// Enhanced MultiImageDropzone props
export interface EnhancedMultiImageDropzoneProps {
  className?: string;
  value?: EnhancedFileState[];
  onChange?: (files: EnhancedFileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: EnhancedFileState[]) => void | Promise<void>;
  onImageDelete?: ImageDeleteCallback;
  onImageReorder?: ImageReorderCallback;
  disabled?: boolean;
  allowDelete?: boolean;
  allowReorder?: boolean;
  dropzoneOptions?: any; // Will be properly typed when implementing the component
}

// Drag and drop related types
export interface DragState {
  isDragging: boolean;
  draggedIndex: number | null;
  dropTargetIndex: number | null;
}

export interface DragHandlers {
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onDragOver: (index: number) => void;
  onDrop: (targetIndex: number) => void;
}

// Image validation types
export interface ImageValidationRules {
  minImages?: number;
  maxImages?: number;
  maxFileSize?: number;
  allowedTypes?: string[];
}

export interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Form integration types
export interface ImageFormState {
  images: EnhancedFileState[];
  isUploading: boolean;
  uploadProgress: Record<string, number>;
  errors: string[];
}

// Server action types for image operations
export interface ImageOperationPayload {
  imagesToDelete: string[];
  newImages: Array<{
    file: File;
    order: number;
  }>;
  orderUpdates: Array<{
    id: string;
    order: number;
  }>;
  existingImages: Array<{
    id: string;
    url: string;
    order: number;
  }>;
}

export interface ImageOperationResponse {
  success: boolean;
  message?: string;
  errors?: string[];
  updatedImages?: Array<{
    id: string;
    url: string;
    order: number;
  }>;
}