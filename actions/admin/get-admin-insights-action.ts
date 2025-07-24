"use server";

import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { count, desc, asc, sql, eq, and } from "drizzle-orm";

interface InsightsParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Server action to fetch admin insights with optional filtering and pagination
 * @param params Optional parameters for search, pagination, and limiting results
 * @returns Object with success status and data or error message
 */
export async function getAdminInsights(params: InsightsParams = {}) {
  const { search = '', page = 1, limit = 9, sortBy = 'createdAt', sortOrder = 'desc' } = params;

  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: "Please log in to access admin resources."
      };
    }

    const offset = (page - 1) * limit;

    // Determine sort column and order
    const getSortColumn = (sortBy: string) => {
      switch (sortBy) {
        case 'title':
          return insightTable.title;
        case 'publishedAt':
          return insightTable.publishedAt;
        case 'updatedAt':
          return insightTable.updatedAt;
        case 'createdAt':
        default:
          return insightTable.createdAt;
      }
    };

    const sortColumn = getSortColumn(sortBy);
    const orderFn = sortOrder === 'asc' ? asc : desc;

    let query = db.select().from(insightTable).where(eq(insightTable.isLuxe, false)).orderBy(orderFn(sortColumn));
    let countQuery = db.select({ value: count() }).from(insightTable).where(eq(insightTable.isLuxe, false));

    if (search) {
      console.log('search:', search);
      const searchCondition = sql`to_tsvector('english', ${insightTable.title}) @@ plainto_tsquery('english', ${search})`;

      //@ts-ignore
      query = query.where(and(eq(insightTable.isLuxe, false), searchCondition));
      //@ts-ignore
      countQuery = countQuery.where(and(eq(insightTable.isLuxe, false), searchCondition));
    }

    // Apply pagination
    //@ts-ignore
    query = query.limit(limit).offset(offset);

    const [data, totalResult] = await Promise.all([
      query,
      countQuery
    ]);

    const total = totalResult[0]?.value || 0;
    const totalPages = Math.ceil(total / limit);
    
    return {
      success: true,
      data: {
        data,
        totalPages,
        currentPage: page,
        total
      }
    };
  } catch (error) {
    console.error("Error fetching insights:", error);
    
    // Always return a valid response object
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
      data: null
    };
  }
}
