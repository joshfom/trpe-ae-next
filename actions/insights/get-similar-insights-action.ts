'use server';

import { client } from "@/lib/hono";
import { unstable_cache } from "next/cache";

interface GetSimilarInsightsSuccess {
  success: true;
  data: any[];
}

interface GetSimilarInsightsError {
  success: false;
  error: string;
}

type GetSimilarInsightsResult = GetSimilarInsightsSuccess | GetSimilarInsightsError;

/**
 * Gets similar insights for a given insight
 * @param insightId - The ID of the insight to find similar insights for
 * @returns Object with success status and similar insights data or error
 */
export const getSimilarInsights = unstable_cache(
  async (insightId: string): Promise<GetSimilarInsightsResult> => {
    try {
      const response = await client.api.insights.similar[":insightId"].$get({
        param: {
          insightId
        }
      });

      if (!response.ok) {
        throw new Error('An error occurred while fetching similar insights');
      }

      const { data } = await response.json();
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Error fetching similar insights:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching similar insights'
      };
    }
  },
  ["insights-similar"],
  { tags: ["insights-similar"], revalidate: 60 * 30 } // Cache for 30 minutes
);
