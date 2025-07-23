"use server";

import { revalidateTag } from "next/cache";
import { processHtmlForStorage } from "@/lib/process-html-for-storage";
import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { createId } from "@paralleldrive/cuid2";
import slugify from "slugify";
import { processInsightImage, ImageProcessingError, ImageFetchError } from "@/lib/insights-image-utils";

interface LuxeJournalData {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  authorId?: string;
  altText?: string;
  coverUrl?: string;
  content: string;
  isLuxe?: boolean;
}

/**
 * Server action to add a new luxe journal entry
 * @param data Luxe journal data to add
 * @returns Object with success status and data or error message
 */
export async function addLuxeJournal(data: LuxeJournalData) {
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

    // Process the content HTML for storage
    const processedContent = await processHtmlForStorage(content);
    const insight_id = createId();

    // Create a unique slug from the title
    let baseSlug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g });
    let slug = baseSlug;
    let counter = 1;

    // Check if slug already exists and create a unique one
    while (true) {
      const existingInsight = await db.query.insightTable.findFirst({
        where: (insights, { eq }) => eq(insights.slug, slug)
      });

      if (!existingInsight) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    let processedCoverUrl = coverUrl;

    // Process cover image if provided
    if (coverUrl) {
      try {
        const imageResult = await processInsightImage(coverUrl, { quality: 80 });
        processedCoverUrl = imageResult;
      } catch (error) {
        console.warn('Cover image processing failed:', error);
        if (error instanceof ImageFetchError) {
          return {
            success: false,
            error: "Failed to fetch the cover image. Please check the URL and try again.",
            data: null
          };
        }
        // For other image processing errors, continue without the image
        processedCoverUrl = undefined;
      }
    }

    // Parse published date
    let parsedPublishedAt: Date | null = null;
    if (publishedAt) {
      parsedPublishedAt = new Date(publishedAt);
      if (isNaN(parsedPublishedAt.getTime())) {
        parsedPublishedAt = null;
      }
    }

    // Insert the new luxe journal entry into the insights table with isLuxe = true
    const [newInsight] = await db.insert(insightTable).values({
      id: insight_id,
      title,
      content: processedContent,
      slug,
      metaTitle,
      metaDescription,
      publishedAt: parsedPublishedAt?.toISOString(),
      authorId,
      altText,
      coverUrl: processedCoverUrl,
      isLuxe: true, // Always set to true for luxe journal entries
      isPublished: 'yes',
    }).returning();

    // Revalidate cache
    // Revalidate insights cache tags for frontend
    revalidateTag('insights');
    revalidateTag('luxe-insights');
    revalidateTag('insights-list');
    
    return {
      success: true,
      data: newInsight
    };

  } catch (error: unknown) {
    console.error('Error adding luxe journal entry:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return {
      success: false,
      error: `Failed to add luxe journal entry: ${errorMessage}`,
      data: null
    };
  }
}
