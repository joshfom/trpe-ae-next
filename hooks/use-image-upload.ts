import { useCallback } from 'react'
import { useEdgeStore } from '@/db/edgestore'
import { convertImageToWebP, getOptimizedImageSettings } from '@/lib/image-utils'

/**
 * Hook for handling image uploads with automatic WebP conversion
 * Centralizes the logic for converting images to WebP and uploading to EdgeStore
 */
export function useImageUpload() {
  const { edgestore } = useEdgeStore()

  /**
   * Upload a single image with WebP conversion
   * @param file - The image file to upload
   * @param onProgress - Optional progress callback
   * @returns Promise with the uploaded file URL
   */
  const uploadSingleImage = useCallback(async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    try {
      // Convert to WebP
      const { quality, maxWidth, maxHeight } = getOptimizedImageSettings(file)
      const webpFile = await convertImageToWebP(file, quality, maxWidth, maxHeight)
      
      // Upload to EdgeStore
      const result = await edgestore.publicFiles.upload({
        file: webpFile,
        onProgressChange: onProgress,
      })
      
      return result.url
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    }
  }, [edgestore])

  /**
   * Upload multiple images with WebP conversion
   * @param files - Array of image files to upload
   * @param onProgress - Optional progress callback for each file
   * @returns Promise with array of uploaded file URLs
   */
  const uploadMultipleImages = useCallback(async (
    files: File[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      try {
        // Convert to WebP
        const { quality, maxWidth, maxHeight } = getOptimizedImageSettings(file)
        const webpFile = await convertImageToWebP(file, quality, maxWidth, maxHeight)
        
        // Upload to EdgeStore
        const result = await edgestore.publicFiles.upload({
          file: webpFile,
          onProgressChange: (progress) => onProgress?.(index, progress),
        })
        
        return result.url
      } catch (error) {
        console.error(`Failed to upload image ${index}:`, error)
        throw error
      }
    })

    return Promise.all(uploadPromises)
  }, [edgestore])

  /**
   * Convert and prepare a file for upload (without uploading)
   * Useful for components that handle the upload separately
   * @param file - The image file to convert
   * @returns Promise with the converted WebP file
   */
  const convertToWebP = useCallback(async (file: File): Promise<File> => {
    try {
      const { quality, maxWidth, maxHeight } = getOptimizedImageSettings(file)
      return await convertImageToWebP(file, quality, maxWidth, maxHeight)
    } catch (error) {
      console.error('Image conversion failed:', error)
      // Return original file if conversion fails
      return file
    }
  }, [])

  /**
   * Convert multiple files to WebP (without uploading)
   * @param files - Array of image files to convert
   * @returns Promise with array of converted WebP files
   */
  const convertMultipleToWebP = useCallback(async (files: File[]): Promise<File[]> => {
    const conversionPromises = files.map(async (file) => {
      try {
        const { quality, maxWidth, maxHeight } = getOptimizedImageSettings(file)
        return await convertImageToWebP(file, quality, maxWidth, maxHeight)
      } catch (error) {
        console.error(`Failed to convert ${file.name}:`, error)
        // Return original file if conversion fails
        return file
      }
    })

    return Promise.all(conversionPromises)
  }, [])

  return {
    uploadSingleImage,
    uploadMultipleImages,
    convertToWebP,
    convertMultipleToWebP,
  }
}
