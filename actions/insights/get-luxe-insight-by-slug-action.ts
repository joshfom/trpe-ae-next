"use server";

import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { and, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

/**
 * Server action for fetching a single luxe insight by slug
 * 
 * @param slug - The slug of the insight to fetch
 * @returns Object with success status and insight data or error message
 */
export const getLuxeInsightBySlugAction = unstable_cache(
  async (slug: string) => {
    try {
      // Fetch luxe insight by slug from database with author relation
      const insight = await db.query.insightTable.findFirst({
        where: and(
          eq(insightTable.slug, slug),
          eq(insightTable.isLuxe, true),
          eq(insightTable.isPublished, "yes")
        ),
        with: {
          author: true
        }
      });
      
      if (!insight) {
        return {
          success: false,
          error: "Insight not found",
          data: null
        };
      }

      return {
        success: true,
        data: insight
      };
    } catch (error) {
      console.error("Error fetching luxe insight by slug:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        data: null
      };
    }
  },
  ['luxe-insight-by-slug'],
  { 
    revalidate: 300, // Cache for 5 minutes instead of 30 minutes
    tags: ['luxe-insights']
  }
);
