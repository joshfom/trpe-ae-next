"use server";

import { revalidateTag } from "next/cache";
import { processHtmlForStorage } from "@/lib/process-html-for-storage";
import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { createId } from "@paralleldrive/cuid2";
import slugify from "slugify";
import { processInsightImage, ImageProcessingError, ImageFetchError } from "@/lib/insights-image-utils";

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
 * Server action to add a new insight
 * @param data Insight data to add
 * @returns Object with success status and data or error message
 */
export async function addInsight(data: InsightData) {
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

    // Pre-process HTML content before storing
    const processedContent = content ? await processHtmlForStorage(content) : content;
    
    // Create slug from title
    const slug = slugify(title, {
      lower: true,
      strict: true
    });

    try {
      // Process the cover image to ensure it's WebP format
      const processedCoverUrl = await processInsightImage(coverUrl, { quality: 80 });
      
      // Insert into database
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

      // Revalidate insights data for both admin and frontend
      revalidateTag('admin-insights');
      revalidateTag('insights');
      revalidateTag('insights-list');
      
      return {
        success: true,
        data: result[0]
      };
    } catch (imageError) {
      console.error('Error processing insight image:', imageError);
      
      // Check if it's a specific image processing error
      if (imageError instanceof ImageProcessingError || imageError instanceof ImageFetchError) {
        return {
          success: false,
          error: `Image processing failed: ${imageError.message}`,
          data: null
        };
      }
      
      // For other errors, still try to save with original image
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

      // Revalidate insights data for both admin and frontend
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
