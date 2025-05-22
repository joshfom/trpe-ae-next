import sharp from 'sharp';
import { s3Service } from '@/lib/s3Service';

/**
 * Fetches an image from URL and converts it to WebP format
 * @param imageUrl - The URL of the image to convert
 * @param quality - WebP quality (1-100)
 * @returns Buffer containing the WebP image
 */
export async function convertToWebp(imageUrl: string, quality = 80): Promise<Buffer> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return await sharp(buffer)
      .webp({ quality })
      .toBuffer();
  } catch (error) {
    console.error('Error converting image to WebP:', error);
    throw error;
  }
}

/**
 * Uploads a WebP image to S3
 * @param imageBuffer - The WebP image buffer
 * @param propertyId - The ID of the property
 * @param index - The index of the image (for ordering)
 * @returns The URL of the uploaded image
 */
export async function uploadPropertyImageToS3(
  imageBuffer: Buffer, 
  propertyId: string, 
  index: number
): Promise<string> {
  try {
    const filename = `${propertyId}-${index}-${Date.now()}.webp`;
    const directory = `media/${propertyId}`; // Changed from properties to media
    
    const command = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${directory}/${filename}`,
      Body: imageBuffer,
      ContentType: 'image/webp',
    };
    
    return await s3Service.uploadBuffer(imageBuffer, filename, directory);
  } catch (error) {
    console.error('Error uploading WebP image to S3:', error);
    throw error;
  }
}

/**
 * Deletes all property images from S3
 * @param propertyId - The ID of the property
 * @param imageUrls - Array of image URLs to delete
 */
export async function deletePropertyImagesFromS3(imageUrls: string[]): Promise<void> {
  try {
    if (imageUrls.length === 0) return;
    
    await s3Service.deleteMultipleFiles(imageUrls);
  } catch (error) {
    console.error('Error deleting property images from S3:', error);
    throw error;
  }
}