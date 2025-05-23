import sharp from 'sharp';
import { s3Service } from './s3Service';
import { createId } from '@paralleldrive/cuid2';

// Define types for WebP conversion operations
export interface WebpConversionOptions {
  quality?: number;
  lossless?: boolean;
}

// Error types
export class ImageProcessingError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'ImageProcessingError';
  }
}

export class ImageFetchError extends Error {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = 'ImageFetchError';
  }
}

/**
 * Checks if a URL points to a WebP image
 * @param url - The URL to check
 * @returns True if the image is WebP, false otherwise
 */
export function isWebpImage(url: string): boolean {
  return url.toLowerCase().endsWith('.webp');
}

/**
 * Fetches an image from URL and converts it to WebP format
 * @param imageUrl - The URL of the image to convert
 * @param options - WebP conversion options
 * @returns Buffer containing the WebP image
 * @throws {ImageFetchError} If the image cannot be fetched
 * @throws {ImageProcessingError} If the image cannot be processed
 */
export async function convertToWebp(
  imageUrl: string, 
  options: WebpConversionOptions = { quality: 80 }
): Promise<Buffer> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new ImageFetchError(
        `Failed to fetch image: ${response.status} ${response.statusText}`,
        response.status
      );
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return await sharp(buffer)
      .webp(options)
      .toBuffer();
  } catch (error) {
    if (error instanceof ImageFetchError) {
      throw error;
    }
    console.error('Error converting image to WebP:', error);
    throw new ImageProcessingError('Failed to convert image to WebP format', error);
  }
}

/**
 * Processes an insight image - checks if it's WebP, converts if needed, and uploads to S3
 * @param imageUrl - The URL of the image (could be an external URL or existing S3 URL)
 * @param options - WebP conversion options
 * @returns The URL of the processed image in S3
 * @throws {ImageProcessingError} If the image cannot be processed or uploaded
 */
export async function processInsightImage(
  imageUrl: string, 
  options: WebpConversionOptions = { quality: 80 }
): Promise<string> {
  if (!imageUrl) {
    throw new ImageProcessingError('Image URL is required');
  }

  try {
    // If already WebP, return as is
    if (isWebpImage(imageUrl)) {
      return imageUrl;
    }
    
    // If it's a data URI or external URL, convert and upload
    const webpBuffer = await convertToWebp(imageUrl, options);
    const filename = `insight-${createId()}.webp`;
    const directory = 'insights';
    
    return await s3Service.uploadBuffer(webpBuffer, filename, directory);
  } catch (error) {
    if (error instanceof ImageFetchError || error instanceof ImageProcessingError) {
      throw error;
    }
    console.error('Error processing insight image:', error);
    throw new ImageProcessingError('Failed to process and upload insight image', error);
  }
}

/**
 * Interface for insight image update options
 */
export interface InsightImageUpdateOptions {
  shouldDeleteOld?: boolean;
  webpOptions?: WebpConversionOptions;
}

/**
 * If an insight image is changing, process the new image and optionally delete the old one
 * @param newImageUrl - The URL of the new image
 * @param oldImageUrl - The URL of the old image to delete (optional)
 * @param options - Update options including whether to delete old image and WebP conversion options
 * @returns The URL of the processed new image
 * @throws {ImageProcessingError} If the image cannot be processed or updated
 */
export async function updateInsightImage(
  newImageUrl: string, 
  oldImageUrl?: string | null,
  options: InsightImageUpdateOptions = { shouldDeleteOld: true, webpOptions: { quality: 80 } }
): Promise<string> {
  if (!newImageUrl) {
    throw new ImageProcessingError('New image URL is required');
  }
  
  const { shouldDeleteOld = true, webpOptions = { quality: 80 } } = options;
  
  try {
    // Process the new image first
    const processedImageUrl = await processInsightImage(newImageUrl, webpOptions);
    
    // If we have an old image that's different from the new one, and we should delete it
    if (
      oldImageUrl && 
      typeof oldImageUrl === 'string' &&
      oldImageUrl !== newImageUrl && 
      oldImageUrl !== processedImageUrl && 
      shouldDeleteOld
    ) {
      try {
        await s3Service.deleteFile(oldImageUrl);
      } catch (deleteError) {
        // Log but don't throw - we've already got the new image
        console.error('Error deleting old insight image:', deleteError);
      }
    }
    
    return processedImageUrl;
  } catch (error) {
    if (error instanceof ImageFetchError || error instanceof ImageProcessingError) {
      throw error;
    }
    console.error('Error updating insight image:', error);
    throw new ImageProcessingError('Failed to update insight image', error);
  }
}
