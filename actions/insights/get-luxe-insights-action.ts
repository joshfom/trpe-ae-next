"use server";

import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { and, eq, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

/**
 * Server action for fetching all luxe insights/journals with caching
 * 
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 9)
 * @returns Object with success status and luxe insights data or error message
 */
export const getLuxeInsightsAction = unstable_cache(
  async (page: number = 1, limit: number = 9) => {
    try {
      const offset = (page - 1) * limit;
      
      // Fetch luxe insights directly from database
      const data = await db.query.insightTable.findMany({
        where: and(
          eq(insightTable.isLuxe, true),
          eq(insightTable.isPublished, "yes")
        ),
        orderBy: [desc(insightTable.publishedAt), desc(insightTable.createdAt)],
        limit,
        offset
      });
      
      // Get total count for pagination
      const totalResult = await db.select().from(insightTable)
        .where(and(
          eq(insightTable.isLuxe, true),
          eq(insightTable.isPublished, "yes")
        ));
      
      const total = totalResult.length;
      const totalPages = Math.ceil(total / limit);
      
      return {
        success: true,
        data: {
          insights: data,
          pagination: {
            currentPage: page,
            totalPages,
            total,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        }
      };
    } catch (error) {
      console.error("Error fetching luxe insights:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        data: {
          insights: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            total: 0,
            hasNextPage: false,
            hasPrevPage: false
          }
        }
      };
    }
  },
  ['luxe-insights-list'],
  { 
    revalidate: 1800, // Cache for 30 minutes since insights don't change frequently
    tags: ['luxe-insights']
  }
);
