"use server";

import { revalidateTag } from "next/cache";
import { processHtmlForStorage } from "@/lib/process-html-for-storage";
import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { eq } from "drizzle-orm";
import { processInsightImage, ImageProcessingError, ImageFetchError } from "@/lib/insights-image-utils";

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
 * Server action to update an insight
 * @param insightSlug Slug of the insight to update
 * @param data Data for updating the insight
 * @returns Object with success status and data or error message
 */
export async function updateInsight(insightSlug: string, data: InsightUpdateData) {
  if (!insightSlug) {
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
      where: eq(insightTable.slug, insightSlug)
    });

    if (!existingInsight) {
      return {
        success: false,
        error: "Insight not found",
        data: null
      };
    }

    // Pre-process HTML content before storing
    let processedContent = data.content;
    if (data.content) {
      processedContent = await processHtmlForStorage(data.content);
    }

    // Process cover image if provided
    let processedCoverUrl = data.coverUrl;

    if (data.coverUrl && data.coverUrl !== existingInsight.coverUrl) {
      try {
        processedCoverUrl = await processInsightImage(data.coverUrl, { quality: 80 });
      } catch (error) {
        if (error instanceof ImageProcessingError || error instanceof ImageFetchError) {
          console.error('Image processing failed:', error.message);
          // Continue with original URL if processing fails
          processedCoverUrl = data.coverUrl;
        } else {
          throw error;
        }
      }
    }

    // Update the insight
    const [updatedInsight] = await db.update(insightTable).set({
      title: data.title || existingInsight.title,
      metaTitle: data.metaTitle !== undefined ? data.metaTitle : existingInsight.metaTitle,
      metaDescription: data.metaDescription !== undefined ? data.metaDescription : existingInsight.metaDescription,
      publishedAt: data.publishedAt || existingInsight.publishedAt,
      authorId: data.authorId || existingInsight.authorId,
      altText: data.altText !== undefined ? data.altText : existingInsight.altText,
      coverUrl: processedCoverUrl || existingInsight.coverUrl,
      content: processedContent || existingInsight.content,
      isLuxe: data.isLuxe !== undefined ? data.isLuxe : existingInsight.isLuxe,
      updatedAt: new Date().toISOString()
    }).where(eq(insightTable.slug, insightSlug)).returning();
    
    // Revalidate insights data for both admin and frontend
    revalidateTag('admin-insights');
    revalidateTag('insights');
    revalidateTag('insights-list');
    
    return {
      success: true,
      data: updatedInsight
    };
  } catch (error) {
    console.error("Error updating insight:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
