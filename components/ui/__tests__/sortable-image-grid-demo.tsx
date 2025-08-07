'use client';

import React from 'react';
import { SortableImageGrid } from '../sortable-image-grid';
import { EnhancedFileState } from '../../../lib/image-management-utils';

// Demo component to test SortableImageGrid functionality
export function SortableImageGridDemo() {
  const [images, setImages] = React.useState<EnhancedFileState[]>([
    {
      file: 'https://picsum.photos/400/300?random=1',
      key: 'demo-1',
      progress: 'COMPLETE',
      id: '1',
      isExisting: true,
      isDeleted: false,
      order: 0,
    },
    {
      file: 'https://picsum.photos/400/300?random=2',
      key: 'demo-2',
      progress: 'COMPLETE',
      id: '2',
      isExisting: true,
      isDeleted: false,
      order: 1,
    },
    {
      file: 'https://picsum.photos/400/300?random=3',
      key: 'demo-3',
      progress: 'COMPLETE',
      id: '3',
      isExisting: true,
      isDeleted: false,
      order: 2,
    },
    {
      file: 'https://picsum.photos/400/300?random=4',
      key: 'demo-4',
      progress: 'COMPLETE',
      id: '4',
      isExisting: false,
      isDeleted: false,
      order: 3,
    },
  ]);

  const handleReorder = React.useCallback((fromIndex: number, toIndex: number) => {
    console.log(`Reordering image from ${fromIndex} to ${toIndex}`);
    
    setImages(prevImages => {
      const newImages = [...prevImages];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      
      // Update order numbers
      return newImages.map((image, index) => ({
        ...image,
        order: index,
      }));
    });
  }, []);

  const handleDelete = React.useCallback((index: number) => {
    console.log(`Deleting image at index ${index}`);
    
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages[index] = {
        ...newImages[index],
        isDeleted: true,
      };
      return newImages;
    });
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">SortableImageGrid Demo</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Features:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>Drag and drop to reorder images</li>
          <li>Click delete button to remove images</li>
          <li>Keyboard navigation with arrow keys</li>
          <li>Keyboard reordering with Ctrl+Arrow keys</li>
          <li>Delete with Delete or Backspace keys</li>
          <li>Touch support for mobile devices</li>
          <li>Visual feedback during operations</li>
        </ul>
      </div>

      <SortableImageGrid
        images={images}
        onReorder={handleReorder}
        onDelete={handleDelete}
        allowDelete={true}
        allowReorder={true}
        gridColumns={3}
        className="border rounded-lg"
      />

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Current Image State:</h3>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
          {JSON.stringify(
            images.map(img => ({
              key: img.key,
              order: img.order,
              isExisting: img.isExisting,
              isDeleted: img.isDeleted,
            })),
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}