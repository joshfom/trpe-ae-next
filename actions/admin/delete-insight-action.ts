"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";
import { s3Service } from "@/lib/s3Service";

/**
 * Server action to delete an insight
 * @param slug Slug of the insight to delete
 * @param coverUrl Optional URL of the cover image to delete from S3
 * @returns Object with success status and data or error message
 */
export async function deleteInsight({ slug, coverUrl }: { slug: string; coverUrl?: string }) {
  if (!slug) {
    return {
      success: false,
      error: "Insight slug is required"
    };
  }

  try {
    // First delete the insight from the database
    const response = await client.api.admin.insights[":insightSlug"].$delete({
      param: { insightSlug: slug }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete insight: ${response.statusText}`);
    }

    const responseData = await response.json();

    // If there's a cover image, try to delete it from S3
    // But don't fail the entire operation if S3 deletion fails
    if (coverUrl) {
      try {
        await s3Service.deleteFile(coverUrl);
      } catch (error) {
        console.error('Error deleting image from S3:', error);
        // Don't throw here, as the insight is already deleted from the database
      }
    }
    
    // Revalidate insights data
    revalidateTag('admin-insights');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error deleting insight:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
