"use server";

import { revalidateTag } from "next/cache";
import { s3Service } from "@/lib/s3Service";
import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { eq } from "drizzle-orm";

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
    // Check authentication first
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: "Please log in or your session to access resource.",
        data: null
      };
    }

    // Check if insight exists
    const existingInsight = await db.query.insightTable.findFirst({
      where: eq(insightTable.slug, slug)
    });

    if (!existingInsight) {
      return {
        success: false,
        error: "Insight not found",
        data: null
      };
    }

    // Delete the insight from the database
    const [deletedInsight] = await db.delete(insightTable)
      .where(eq(insightTable.slug, slug))
      .returning();

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
    
    // Revalidate insights data for both admin and frontend
    revalidateTag('admin-insights');
    revalidateTag('insights');
    revalidateTag('insights-list');
    
    return {
      success: true,
      data: deletedInsight
    };
  } catch (error) {
    console.error("Error deleting insight:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
