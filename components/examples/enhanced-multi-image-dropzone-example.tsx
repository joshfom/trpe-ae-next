/**
 * Example usage of the enhanced MultiImageDropzone component
 * Demonstrates delete functionality and enhanced FileState interface
 */

'use client';

import React from 'react';
import { MultiImageDropzone, FileState } from '@/components/multi-image-dropzone';
import { EnhancedFileState, convertPropertyImagesToFileState } from '@/lib/image-management-utils';

interface EnhancedMultiImageDropzoneExampleProps {
  // Example of existing property images from database
  existingImages?: Array<{
    id: string;
    s3Url: string;
    order: number;
  }>;
  onSave?: (images: EnhancedFileState[]) => Promise<void>;
}

export function EnhancedMultiImageDropzoneExample({ 
  existingImages = [], 
  onSave 
}: EnhancedMultiImageDropzoneExampleProps) {
  // Initialize with existing images converted to EnhancedFileState format
  const [images, setImages] = React.useState<FileState[]>(() => 
    convertPropertyImagesToFileState(existingImages)
  );
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string>('');

  // Handle image changes (upload, delete, reorder)
  const handleImagesChange = React.useCallback(async (newImages: FileState[]) => {
    setImages(newImages);
    setMessage(''); // Clear any previous messages
  }, []);

  // Handle individual image deletion
  const handleImageDelete = React.useCallback(async (index: number) => {
    console.log(`Image at index ${index} was deleted`);
    setMessage(`Image ${index + 1} deleted successfully`);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  }, []);

  // Handle image reordering
  const handleImageReorder = React.useCallback(async (fromIndex: number, toIndex: number) => {
    console.log(`Image moved from position ${fromIndex + 1} to ${toIndex + 1}`);
    setMessage(`Image reordered: moved from position ${fromIndex + 1} to ${toIndex + 1}`);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  }, []);

  // Handle form submission
  const handleSave = React.useCallback(async () => {
    if (!onSave) return;
    
    setIsLoading(true);
    try {
      await onSave(images);
      setMessage('Images saved successfully!');
    } catch (error) {
      setMessage('Failed to save images. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [images, onSave]);

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Enhanced Image Management</h2>
        <p className="text-gray-600">
          Upload, delete, and manage property images with enhanced functionality.
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('success') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : message.includes('Failed') 
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {message}
        </div>
      )}

      {/* Enhanced MultiImageDropzone */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Property Images</h3>
        
        <MultiImageDropzone
          value={images}
          onChange={handleImagesChange}
          onImageDelete={handleImageDelete}
          onImageReorder={handleImageReorder}
          allowDelete={true}
          allowReorder={true}
          showDeleteConfirmation={true}
          minImages={6}
          maxImages={20}
          disabled={isLoading}
          className="border-2 border-dashed border-gray-300 rounded-lg"
          dropzoneOptions={{
            maxFiles: 20,
            maxSize: 5 * 1024 * 1024, // 5MB
            accept: {
              'image/*': ['.jpg', '.jpeg', '.png', '.webp']
            }
          }}
        />
      </div>

      {/* Image Statistics */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Image Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Images:</span>
            <span className="ml-2 font-medium">{images.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Existing:</span>
            <span className="ml-2 font-medium">
              {images.filter(img => img.isExisting && !img.isDeleted).length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">New:</span>
            <span className="ml-2 font-medium">
              {images.filter(img => !img.isExisting && !img.isDeleted).length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Deleted:</span>
            <span className="ml-2 font-medium text-red-600">
              {images.filter(img => img.isDeleted).length}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={isLoading || images.filter(img => !img.isDeleted).length < 6}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Images'}
        </button>
        
        <button
          onClick={() => {
            setImages(convertPropertyImagesToFileState(existingImages));
            setMessage('Images reset to original state');
          }}
          disabled={isLoading}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Feature Highlights */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2 text-blue-900">Enhanced Features</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Delete uploaded images with confirmation dialog</li>
          <li>✓ Drag-and-drop reordering with visual feedback</li>
          <li>✓ Touch support for mobile drag-and-drop</li>
          <li>✓ Keyboard navigation and accessibility</li>
          <li>✓ Separate handling for existing vs new images</li>
          <li>✓ Soft delete for existing images (preserves database integrity)</li>
          <li>✓ Hard delete for new images (removes from memory)</li>
          <li>✓ Real-time validation with minimum/maximum image limits</li>
          <li>✓ Visual feedback with hover states and loading indicators</li>
          <li>✓ Backward compatibility with existing MultiImageDropzone usage</li>
        </ul>
      </div>

      {/* Debug Information (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="bg-gray-100 p-4 rounded-lg">
          <summary className="cursor-pointer font-medium">Debug Information</summary>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(images, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

// Example usage with mock data
export function EnhancedMultiImageDropzoneDemo() {
  const mockExistingImages = [
    {
      id: '1',
      s3Url: 'https://example.com/property-image-1.jpg',
      order: 0
    },
    {
      id: '2', 
      s3Url: 'https://example.com/property-image-2.jpg',
      order: 1
    },
    {
      id: '3',
      s3Url: 'https://example.com/property-image-3.jpg', 
      order: 2
    }
  ];

  const handleSave = async (images: EnhancedFileState[]) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Saving images:', {
      toDelete: images.filter(img => img.isDeleted).map(img => img.id),
      toUpload: images.filter(img => !img.isExisting && !img.isDeleted),
      toUpdate: images.filter(img => img.isExisting && !img.isDeleted)
    });
  };

  return (
    <EnhancedMultiImageDropzoneExample
      existingImages={mockExistingImages}
      onSave={handleSave}
    />
  );
}