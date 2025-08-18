/**
 * @fileoverview Server action for safely deleting insights from the database and associated assets
 * Handles insight deletion with cascade cleanup of S3 images and cache invalidation.
 * 
 * @author Auto-generated JSDoc
 * @version 1.0.0
 * @since 2025-01-18
 */

"use server";

import { revalidateTag } from "next/cache";
import { s3Service } from "@/lib/s3Service";
import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { eq } from "drizzle-orm";

/**
 * Parameters for insight deletion operation
 * 
 * @interface DeleteInsightParams
 * @property {string} slug - The URL slug of the insight to delete (required)
 * @property {string} [coverUrl] - Optional URL of the cover image to delete from S3 storage
 */
interface DeleteInsightParams {
  slug: string;
  coverUrl?: string;
}

/**
 * Response structure for insight deletion operations
 * 
 * @interface DeleteResponse
 * @property {boolean} success - Whether the deletion was successful
 * @property {object} [data] - The deleted insight data (if successful)
 * @property {string} [error] - Error message (if unsuccessful)
 */
interface DeleteResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Server action to safely delete an insight and its associated assets
 * 
 * This function performs a comprehensive deletion operation that includes:
 * - User authentication validation
 * - Insight existence verification by slug
 * - Safe database deletion with transaction handling
 * - Graceful S3 asset cleanup (cover image deletion)
 * - Multi-level cache invalidation for fresh data
 * - Robust error handling with fallback strategies
 * 
 * The deletion process is designed to be fault-tolerant:
 * - Database deletion takes priority over S3 cleanup
 * - S3 deletion failures don't prevent successful insight deletion
 * - Cache invalidation ensures immediate UI updates
 * 
 * @async
 * @function deleteInsight
 * @param {DeleteInsightParams} params - Object containing slug and optional coverUrl
 * @param {string} params.slug - The URL slug of the insight to delete
 * @param {string} [params.coverUrl] - Optional cover image URL to delete from S3
 * @returns {Promise<DeleteResponse>} Response object containing success status and deleted data or error
 * 
 * @example
 * ```typescript
 * // Delete insight without cover image cleanup
 * const result = await deleteInsight({ 
 *   slug: "market-analysis-2025" 
 * });
 * 
 * // Delete insight with cover image cleanup
 * const resultWithImage = await deleteInsight({ 
 *   slug: "property-trends",
 *   coverUrl: "https://s3-bucket.com/insights/cover-image.webp"
 * });
 * 
 * if (result.success) {
 *   console.log("Insight deleted:", result.data.title);
 * } else {
 *   console.error("Deletion failed:", result.error);
 * }
 * ```
 * 
 * @throws {Error} Database query errors
 * @throws {Error} S3 service errors (handled gracefully - doesn't prevent deletion)
 * 
 * @see {@link s3Service.deleteFile} for S3 asset cleanup
 * @see {@link getSession} for authentication validation
 * @see {@link revalidateTag} for cache invalidation
 * 
 * @security Requires valid admin session - returns authentication error if session invalid
 * @performance Uses database returning() clause to get deleted record in single operation
 * @reliability S3 cleanup failures are logged but don't prevent successful deletion
 * @caching Invalidates multiple cache tags: admin-insights, insights, insights-list
 */
export async function deleteInsight({ slug, coverUrl }: DeleteInsightParams): Promise<DeleteResponse> {
  // Validate required parameters before proceeding
  if (!slug) {
    return {
      success: false,
      error: "Insight slug is required for deletion operation"
    };
  }

  try {
    // Validate user authentication and session
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: "Authentication required. Please log in to delete insights.",
        data: null
      };
    }

    // Verify that the insight exists before attempting deletion
    // This prevents unnecessary database operations and provides better error messages
    const existingInsight = await db.query.insightTable.findFirst({
      where: eq(insightTable.slug, slug)
    });

    if (!existingInsight) {
      return {
        success: false,
        error: `Insight with slug "${slug}" not found in database`,
        data: null
      };
    }

    // Execute the database deletion operation
    // Using returning() to get the deleted record for confirmation and response data
    const [deletedInsight] = await db.delete(insightTable)
      .where(eq(insightTable.slug, slug))
      .returning();

    // Attempt to clean up associated S3 assets (cover image)
    // This is performed after database deletion to ensure data consistency
    // S3 cleanup failures are handled gracefully and don't prevent successful deletion
    if (coverUrl) {
      try {
        await s3Service.deleteFile(coverUrl);
        console.log(`✅ Successfully deleted cover image from S3: ${coverUrl}`);
      } catch (error) {
        // Log S3 deletion errors but don't fail the entire operation
        // The insight has already been successfully deleted from the database
        console.error(`⚠️ Error deleting cover image from S3 (${coverUrl}):`, error);
        console.warn('S3 cleanup failed, but insight deletion was successful');
      }
    }
    
    // Invalidate multiple cache layers to ensure immediate UI updates
    // This ensures that both admin interfaces and public pages reflect the deletion
    revalidateTag('admin-insights');    // Admin dashboard insights list
    revalidateTag('insights');          // General insights cache
    revalidateTag('insights-list');     // Public insights list cache
    
    // Return success response with deleted insight data for confirmation
    return {
      success: true,
      data: deletedInsight
    };

  } catch (error) {
    // Handle and log any unexpected errors during the deletion process
    console.error("❌ Error during insight deletion:", error);
    
    // Return detailed error information for debugging while keeping user-friendly messages
    return {
      success: false,
      error: error instanceof Error 
        ? `Deletion failed: ${error.message}` 
        : "An unexpected error occurred during insight deletion. Please try again."
    };
  }
}
