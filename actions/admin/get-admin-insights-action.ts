"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

interface InsightsParams {
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Server action to fetch admin insights with optional filtering and pagination
 * @param params Optional parameters for search, pagination, and limiting results
 * @returns Object with success status and data or error message
 */
export async function getAdminInsights(params: InsightsParams = {}) {
  const { search = '', page = 1, limit = 9 } = params;

  try {
    const response = await client.api.admin['insights'].$get({
      query: {
        search,
        page: page.toString(),
        limit: limit.toString()
      }
    });

    if (!response.ok) {
      throw new Error('An error occurred while fetching insights');
    }

    const data = await response.json();
    
    // Revalidate insights data
    revalidateTag('admin-insights');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching insights:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
