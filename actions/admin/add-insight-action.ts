/**
 * @fileoverview Server action for adding new insights to the database
 * Handles insight creation with content processing, image optimization, and database insertion.
 * 
 * @author Auto-generated JSDoc
 * @version 1.0.0
 * @since 2025-01-18
 */

"use server";

import { revalidateTag } from "next/cache";
import { processHtmlForStorage } from "@/lib/process-html-for-storage";
import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { createId } from "@paralleldrive/cuid2";
import slugify from "slugify";
import { processInsightImage, ImageProcessingError, ImageFetchError } from "@/lib/insights-image-utils";

/**
 * Interface defining the structure of insight data for creation
 * 
 * @interface InsightData
 * @property {string} title - The title of the insight (required)
 * @property {string} [metaTitle] - SEO meta title (optional)
 * @property {string} [metaDescription] - SEO meta description (optional)
 * @property {string} [publishedAt] - ISO string date when insight should be published (optional)
 * @property {string} [authorId] - ID of the insight author (optional)
 * @property {string} [altText] - Alternative text for the cover image (optional)
 * @property {string} [coverUrl] - URL of the cover image (optional but validated as required)
 * @property {string} content - HTML content of the insight (required)
 */
interface InsightData {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string; // Changed from Date to string
  authorId?: string;
  altText?: string;
  coverUrl?: string; // Made optional
  content: string;
}

/**
 * Response structure for insight creation operations
 * 
 * @interface InsightResponse
 * @property {boolean} success - Whether the operation was successful
 * @property {object|null} data - The created insight data (if successful)
 * @property {string} [error] - Error message (if unsuccessful)
 */
interface InsightResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Server action to create a new insight in the database
 * 
 * This function handles the complete workflow of insight creation including:
 * - User authentication validation
 * - Input data validation and sanitization
 * - HTML content processing for safe storage
 * - Slug generation from title
 * - Cover image processing and optimization to WebP format
 * - Database insertion with generated ID
 * - Cache invalidation for updated data
 * 
 * @async
 * @function addInsight
 * @param {InsightData} data - The insight data to be created
 * @returns {Promise<InsightResponse>} Response object containing success status and data or error
 * 
 * @example
 * ```typescript
 * const result = await addInsight({
 *   title: "Understanding Real Estate Trends",
 *   content: "<p>Market analysis shows...</p>",
 *   coverUrl: "https://example.com/image.jpg",
 *   metaTitle: "Real Estate Trends 2025",
 *   metaDescription: "Comprehensive analysis of real estate market trends",
 *   altText: "Real estate market graph showing growth trends"
 * });
 * 
 * if (result.success) {
 *   console.log("Insight created:", result.data);
 * } else {
 *   console.error("Creation failed:", result.error);
 * }
 * ```
 * 
 * @throws {Error} Database insertion errors
 * @throws {ImageProcessingError} Image processing failures
 * @throws {ImageFetchError} Image fetching failures
 * 
 * @see {@link processHtmlForStorage} for HTML content processing
 * @see {@link processInsightImage} for image optimization
 * @see {@link getSession} for authentication validation
 */
export async function addInsight(data: InsightData): Promise<InsightResponse> {
  try {
    // Check authentication first
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: "Please log in or your session to access resource.",
        data: null
      };
    }

    // Validate required fields
    const { title, coverUrl, content, metaTitle, metaDescription, publishedAt, authorId, altText } = data;
    
    if (!title || !content) {
      return {
        success: false,
        error: "Please provide title and content.",
        data: null
      };
    }

    if (!coverUrl) {
      return {
        success: false,
        error: "Please provide a cover image.",
        data: null
      };
    }

    // Pre-process HTML content before storing for security and consistency
    const processedContent = content ? await processHtmlForStorage(content) : content;
    
    // Create URL-safe slug from title for SEO-friendly URLs
    const slug = slugify(title, {
      lower: true,
      strict: true
    });

    try {
      // Process the cover image to ensure optimal WebP format and quality
      const processedCoverUrl = await processInsightImage(coverUrl, { quality: 80 });
      
      // Insert new insight into database with generated ID and processed data
      const result = await db.insert(insightTable).values({
        id: createId(),
        slug,
        title,
        metaTitle,
        authorId,
        publishedAt,
        metaDescription,
        altText,
        coverUrl: processedCoverUrl,
        content: processedContent,
      }).returning();

      // Invalidate relevant cache tags to ensure fresh data on frontend
      revalidateTag('admin-insights');
      revalidateTag('insights');
      revalidateTag('insights-list');
      
      return {
        success: true,
        data: result[0]
      };
    } catch (imageError) {
      console.error('Error processing insight image:', imageError);
      
      // Handle specific image processing errors gracefully
      if (imageError instanceof ImageProcessingError || imageError instanceof ImageFetchError) {
        return {
          success: false,
          error: `Image processing failed: ${imageError.message}`,
          data: null
        };
      }
      
      // For other image errors, attempt to save with original image URL
      // This ensures insights can still be created even if image optimization fails
      const result = await db.insert(insightTable).values({
        id: createId(),
        slug,
        title,
        metaTitle,
        authorId,
        publishedAt,
        metaDescription,
        altText,
        coverUrl, // Use original URL if processing fails
        content: processedContent,
      }).returning();

      // Invalidate cache tags even for fallback saves
      revalidateTag('admin-insights');
      revalidateTag('insights');
      revalidateTag('insights-list');
      
      return {
        success: true,
        data: result[0]
      };
    }
  } catch (error) {
    console.error("Error adding insight:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
      data: null
    };
  }
}
