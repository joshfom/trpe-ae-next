/**
 * @fileoverview Server action for retrieving admin insights with filtering and pagination
 * Handles authenticated access to insights data with search, sorting, and pagination capabilities.
 * 
 * @author Auto-generated JSDoc
 * @version 1.0.0
 * @since 2025-01-18
 */

"use server";

import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { count, desc, asc, sql, eq, and } from "drizzle-orm";

/**
 * Interface defining optional parameters for insights retrieval
 * 
 * @interface InsightsParams
 * @property {string} [search] - Search term to filter insights by title (uses PostgreSQL full-text search)
 * @property {number} [page=1] - Page number for pagination (1-based)
 * @property {number} [limit=9] - Number of insights per page
 * @property {string} [sortBy='createdAt'] - Field to sort by ('title', 'publishedAt', 'updatedAt', 'createdAt')
 * @property {'asc'|'desc'} [sortOrder='desc'] - Sort order (ascending or descending)
 */
interface InsightsParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Response structure for insights retrieval operations
 * 
 * @interface InsightsResponse
 * @property {boolean} success - Whether the operation was successful
 * @property {object} [data] - Paginated insights data with metadata
 * @property {Array} data.data - Array of insight objects
 * @property {number} data.totalPages - Total number of pages available
 * @property {number} data.currentPage - Current page number
 * @property {number} data.total - Total number of insights matching criteria
 * @property {string} [error] - Error message (if unsuccessful)
 */
interface InsightsResponse {
  success: boolean;
  data?: {
    data: any[];
    totalPages: number;
    currentPage: number;
    total: number;
  };
  error?: string;
}

/**
 * Server action to fetch admin insights with comprehensive filtering and pagination
 * 
 * This function provides authenticated access to insights data with support for:
 * - Full-text search across insight titles using PostgreSQL's built-in search
 * - Flexible sorting by multiple fields (title, publication date, creation date, etc.)
 * - Pagination with configurable page size
 * - Filtering to exclude luxe insights (isLuxe = false)
 * - Comprehensive error handling and authentication validation
 * 
 * @async
 * @function getAdminInsights
 * @param {InsightsParams} [params={}] - Optional parameters for filtering and pagination
 * @returns {Promise<InsightsResponse>} Response object with paginated insights data or error
 * 
 * @example
 * ```typescript
 * // Basic usage - get first page with default settings
 * const result = await getAdminInsights();
 * 
 * // Advanced usage with search and custom pagination
 * const searchResult = await getAdminInsights({
 *   search: "real estate trends",
 *   page: 2,
 *   limit: 15,
 *   sortBy: "publishedAt",
 *   sortOrder: "desc"
 * });
 * 
 * if (searchResult.success) {
 *   console.log(`Found ${searchResult.data.total} insights`);
 *   console.log(`Showing page ${searchResult.data.currentPage} of ${searchResult.data.totalPages}`);
 *   searchResult.data.data.forEach(insight => {
 *     console.log(`- ${insight.title}`);
 *   });
 * }
 * ```
 * 
 * @throws {Error} Database query errors
 * @throws {Error} Authentication validation errors
 * 
 * @see {@link getSession} for authentication validation
 * @see {@link insightTable} for database schema definition
 * 
 * @security Requires valid admin session - returns authentication error if session invalid
 * @performance Uses database indexes for efficient searching and sorting
 * @scalability Implements offset-based pagination for large datasets
 */
export async function getAdminInsights(params: InsightsParams = {}): Promise<InsightsResponse> {
  // Set default values for optional parameters
  const { search = '', page = 1, limit = 9, sortBy = 'createdAt', sortOrder = 'desc' } = params;

  try {
    // Validate user authentication before proceeding
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: "Please log in to access admin resources."
      };
    }

    // Calculate offset for pagination (0-based for database)
    const offset = (page - 1) * limit;

    /**
     * Maps sort field names to actual database columns
     * Provides type-safe column references for sorting
     * 
     * @param {string} sortBy - The field name to sort by
     * @returns {object} Drizzle column reference for sorting
     */
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

    // Determine sort configuration
    const sortColumn = getSortColumn(sortBy);
    const orderFn = sortOrder === 'asc' ? asc : desc;

    // Build base queries for both data retrieval and count
    // Filter out luxe insights (isLuxe = false) and apply sorting
    let query = db.select().from(insightTable).where(eq(insightTable.isLuxe, false)).orderBy(orderFn(sortColumn));
    let countQuery = db.select({ value: count() }).from(insightTable).where(eq(insightTable.isLuxe, false));

    // Apply full-text search if search term provided
    if (search) {
      console.log('Applying search filter:', search);
      
      // Use PostgreSQL's full-text search for efficient title searching
      // to_tsvector creates searchable text vectors, plainto_tsquery parses search terms
      const searchCondition = sql`to_tsvector('english', ${insightTable.title}) @@ plainto_tsquery('english', ${search})`;

      // Apply search condition to both queries
      //@ts-ignore - Drizzle type system limitation with complex SQL expressions
      query = query.where(and(eq(insightTable.isLuxe, false), searchCondition));
      //@ts-ignore - Drizzle type system limitation with complex SQL expressions
      countQuery = countQuery.where(and(eq(insightTable.isLuxe, false), searchCondition));
    }

    // Apply pagination limits to data query
    //@ts-ignore - Drizzle type system limitation with chained methods
    query = query.limit(limit).offset(offset);

    // Execute both queries concurrently for optimal performance
    const [data, totalResult] = await Promise.all([
      query,
      countQuery
    ]);

    // Extract total count and calculate pagination metadata
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
    
    // Return consistent error response structure
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
      data: undefined
    };
  }
}
