/**
 * @fileoverview Server action for updating existing insights in the database
 * Handles partial and complete insight updates with content processing and image optimization.
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
import { eq } from "drizzle-orm";
import { processInsightImage, ImageProcessingError, ImageFetchError } from "@/lib/insights-image-utils";

/**
 * Interface defining the structure of insight update data
 * All fields are optional to support partial updates
 * 
 * @interface InsightUpdateData
 * @property {string} [title] - Updated title of the insight
 * @property {string} [metaTitle] - Updated SEO meta title
 * @property {string} [metaDescription] - Updated SEO meta description
 * @property {string} [publishedAt] - Updated publication date as ISO string
 * @property {string} [authorId] - Updated author ID
 * @property {string} [altText] - Updated alternative text for cover image
 * @property {string} [coverUrl] - Updated cover image URL
 * @property {string} [content] - Updated HTML content
 * @property {boolean} [isLuxe] - Updated luxe status flag
 */
interface InsightUpdateData {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  authorId?: string;
  altText?: string;
  coverUrl?: string;
  content?: string;
  isLuxe?: boolean;
}

/**
 * Response structure for insight update operations
 * 
 * @interface UpdateResponse
 * @property {boolean} success - Whether the operation was successful
 * @property {object} [data] - The updated insight data (if successful)
 * @property {string} [error] - Error message (if unsuccessful)
 */
interface UpdateResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Server action to update an existing insight in the database
 * 
 * This function handles comprehensive insight updates including:
 * - User authentication validation
 * - Insight existence verification by slug
 * - Selective field updates (only provided fields are updated)
 * - HTML content processing for security and consistency
 * - Cover image processing and optimization when changed
 * - Graceful fallback for image processing failures
 * - Automatic timestamp updating
 * - Cache invalidation for updated data
 * 
 * @async
 * @function updateInsight
 * @param {string} insightSlug - The URL slug of the insight to update
 * @param {InsightUpdateData} data - Partial or complete insight data for updating
 * @returns {Promise<UpdateResponse>} Response object containing success status and updated data or error
 * 
 * @example
 * ```typescript
 * // Partial update - only title and content
 * const result = await updateInsight("market-trends-2025", {
 *   title: "Updated Market Trends for 2025",
 *   content: "<p>New analysis shows...</p>"
 * });
 * 
 * // Complete update with new cover image
 * const fullUpdate = await updateInsight("property-insights", {
 *   title: "Property Market Insights",
 *   content: "<p>Comprehensive market analysis...</p>",
 *   coverUrl: "https://example.com/new-cover.jpg",
 *   metaTitle: "Property Market Analysis 2025",
 *   metaDescription: "In-depth analysis of property market trends",
 *   altText: "Property market growth chart",
 *   isLuxe: true
 * });
 * 
 * if (result.success) {
 *   console.log("Insight updated:", result.data);
 * } else {
 *   console.error("Update failed:", result.error);
 * }
 * ```
 * 
 * @throws {Error} Database query errors
 * @throws {ImageProcessingError} Image processing failures (handled gracefully)
 * @throws {ImageFetchError} Image fetching failures (handled gracefully)
 * 
 * @see {@link processHtmlForStorage} for HTML content processing
 * @see {@link processInsightImage} for image optimization
 * @see {@link getSession} for authentication validation
 * 
 * @security Requires valid admin session - returns authentication error if session invalid
 * @performance Only processes images when coverUrl changes to avoid unnecessary operations
 * @reliability Continues with original image URL if processing fails, ensuring updates succeed
 */
export async function updateInsight(
  insightSlug: string,
  data: InsightUpdateData
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Validate user authentication and session
    const session = await getSession();
    if (!session) {
      return { 
        success: false, 
        error: "Authentication required. Please log in to update insights." 
      };
    }

    // Query database to find the existing insight by slug
    // This also validates that the insight exists before attempting update
    const existingInsights = await db
      .select()
      .from(insightTable)
      .where(eq(insightTable.slug, insightSlug))
      .limit(1);

    // Verify insight exists in database
    if (existingInsights.length === 0) {
      return { 
        success: false, 
        error: `Insight with slug "${insightSlug}" not found.` 
      };
    }

    const existingInsight = existingInsights[0];

    // Process HTML content if provided in update data
    // This ensures content security, consistency, and proper formatting
    let processedContent = data.content;
    if (data.content) {
      processedContent = await processHtmlForStorage(data.content);
    }

    // Handle cover image processing if a new image URL is provided
    let optimizedCoverUrl = data.coverUrl;
    let shouldUpdateImage = false;

    // Only process image if URL has changed to avoid unnecessary operations
    if (data.coverUrl && data.coverUrl !== existingInsight.coverUrl) {
      shouldUpdateImage = true;
      
      try {
        // Attempt to process and optimize the new cover image
        optimizedCoverUrl = await processInsightImage(data.coverUrl);
        console.log(`✅ Successfully processed cover image for insight: ${insightSlug}`);
      } catch (error) {
        // Graceful fallback: continue with original URL if processing fails
        // This ensures updates succeed even if image optimization fails
        console.warn(`⚠️ Image processing failed for insight ${insightSlug}, using original URL:`, error);
        
        if (error instanceof ImageProcessingError) {
          console.warn(`Image processing error: ${error.message}`);
        } else if (error instanceof ImageFetchError) {
          console.warn(`Image fetch error: ${error.message}`);
        } else {
          console.warn(`Unknown image processing error:`, error);
        }
        
        // Keep the original URL provided by user
        optimizedCoverUrl = data.coverUrl;
      }
    }

    // Build update object with only provided fields
    // This enables partial updates - only specified fields are modified
    const updateData: any = {
      updatedAt: new Date(), // Always update the timestamp
    };

    // Conditionally add fields to update object based on provided data
    if (data.title !== undefined) updateData.title = data.title;
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
    if (data.publishedAt !== undefined) updateData.publishedAt = new Date(data.publishedAt);
    if (data.authorId !== undefined) updateData.authorId = data.authorId;
    if (data.altText !== undefined) updateData.altText = data.altText;
    if (processedContent !== undefined) updateData.content = processedContent;
    if (data.isLuxe !== undefined) updateData.isLuxe = data.isLuxe;
    
    // Only update cover URL if it was processed or changed
    if (shouldUpdateImage && optimizedCoverUrl !== undefined) {
      updateData.coverUrl = optimizedCoverUrl;
    }

    // Execute the database update with the constructed update object
    const updatedInsights = await db
      .update(insightTable)
      .set(updateData)
      .where(eq(insightTable.slug, insightSlug))
      .returning();

    // Validate that the update operation affected exactly one record
    if (updatedInsights.length === 0) {
      return { 
        success: false, 
        error: "Failed to update insight. No records were modified." 
      };
    }

    // Invalidate Next.js cache to ensure fresh data is served
    // This affects both individual insight and insights list caches
    revalidateTag("insights");
    revalidateTag(`insight-${insightSlug}`);

    // Return success response with updated insight data
    return { 
      success: true, 
      data: updatedInsights[0] 
    };

  } catch (error) {
    // Handle and log any unexpected errors during the update process
    console.error("❌ Error updating insight:", error);
    
    // Return user-friendly error message without exposing internal details
    return { 
      success: false, 
      error: "An unexpected error occurred while updating the insight. Please try again." 
    };
  }
}
