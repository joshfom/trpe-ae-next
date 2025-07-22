/**
 * Utility functions for image processing and conversion
 */

/**
 * Convert an image file to WebP format
 * @param file - The original image file
 * @param quality - WebP quality (0-1, default: 0.8)
 * @param maxWidth - Maximum width for resizing (optional)
 * @param maxHeight - Maximum height for resizing (optional)
 * @returns Promise<File> - The converted WebP file
 */
export async function convertImageToWebP(
  file: File,
  quality: number = 0.8,
  maxWidth?: number,
  maxHeight?: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    // Check if file is already WebP
    if (file.type === 'image/webp') {
      resolve(file);
      return;
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate dimensions
        let { width, height } = img;
        
        // Resize if max dimensions are specified
        if (maxWidth || maxHeight) {
          const aspectRatio = width / height;
          
          if (maxWidth && width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
          
          if (maxHeight && height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and convert to WebP
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create new File with WebP extension
              const originalName = file.name.replace(/\.[^/.]+$/, '');
              const webpFile = new File([blob], `${originalName}.webp`, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(webpFile);
            } else {
              reject(new Error('Failed to convert image to WebP'));
            }
          },
          'image/webp',
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load the image
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Convert multiple images to WebP format
 * @param files - Array of image files
 * @param quality - WebP quality (0-1, default: 0.8)
 * @param maxWidth - Maximum width for resizing (optional)
 * @param maxHeight - Maximum height for resizing (optional)
 * @returns Promise<File[]> - Array of converted WebP files
 */
export async function convertMultipleImagesToWebP(
  files: File[],
  quality: number = 0.8,
  maxWidth?: number,
  maxHeight?: number
): Promise<File[]> {
  const convertedFiles: File[] = [];
  
  for (const file of files) {
    try {
      const convertedFile = await convertImageToWebP(file, quality, maxWidth, maxHeight);
      convertedFiles.push(convertedFile);
    } catch (error) {
      console.error(`Failed to convert ${file.name} to WebP:`, error);
      // Keep original file if conversion fails
      convertedFiles.push(file);
    }
  }
  
  return convertedFiles;
}

/**
 * Check if the browser supports WebP format
 * @returns boolean
 */
export function supportsWebP(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('webp') > 0;
}

/**
 * Get optimized image settings based on file size and type
 * @param file - The image file
 * @returns Object with quality and max dimensions
 */
export function getOptimizedImageSettings(file: File) {
  const fileSizeMB = file.size / (1024 * 1024);
  
  // Adjust quality and dimensions based on file size
  if (fileSizeMB > 5) {
    return { quality: 0.7, maxWidth: 1920, maxHeight: 1080 };
  } else if (fileSizeMB > 2) {
    return { quality: 0.8, maxWidth: 2560, maxHeight: 1440 };
  } else {
    return { quality: 0.85, maxWidth: undefined, maxHeight: undefined };
  }
}
