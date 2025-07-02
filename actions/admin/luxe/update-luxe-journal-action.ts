"use server";

import { revalidateTag } from "next/cache";
import { processHtmlForStorage } from "@/lib/process-html-for-storage";
import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { eq } from "drizzle-orm";
import { processInsightImage, ImageProcessingError, ImageFetchError } from "@/lib/insights-image-utils";

interface LuxeJournalUpdateData {
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
 * Server action to update a luxe journal entry
 * @param slug The slug of the journal entry to update
 * @param data Updated journal data
 * @returns Object with success status and data or error message
 */
export async function updateLuxeJournal(slug: string, data: LuxeJournalUpdateData) {
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

    // Check if the journal entry exists and is a luxe entry
    const existingJournal = await db.query.insightTable.findFirst({
      where: (insights, { eq }) => eq(insights.slug, slug)
    });

    if (!existingJournal) {
      return {
        success: false,
        error: "Journal entry not found.",
        data: null
      };
    }

    // Process the content HTML for storage
    const processedContent = await processHtmlForStorage(content);

    let processedCoverUrl = coverUrl;

    // Process cover image if provided and different from existing
    if (coverUrl && coverUrl !== existingJournal.coverUrl) {
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
        // For other image processing errors, continue with existing image
        processedCoverUrl = existingJournal.coverUrl || undefined;
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

    // Update the luxe journal entry, ensuring isLuxe remains true
    const [updatedJournal] = await db.update(insightTable)
      .set({
        title,
        content: processedContent,
        metaTitle,
        metaDescription,
        publishedAt: parsedPublishedAt?.toISOString(),
        authorId,
        altText,
        coverUrl: processedCoverUrl,
        isLuxe: true, // Always keep as true for luxe journal entries
        updatedAt: new Date().toISOString(),
      })
      .where(eq(insightTable.slug, slug))
      .returning();

    // Revalidate cache
    revalidateTag('insights');
    revalidateTag('luxe-insights');

    return {
      success: true,
      data: updatedJournal,
      error: null
    };

  } catch (error: unknown) {
    console.error('Error updating luxe journal entry:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return {
      success: false,
      error: `Failed to update luxe journal entry: ${errorMessage}`,
      data: null
    };
  }
}
