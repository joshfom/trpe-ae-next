'use server';

import { client } from "@/lib/hono";
import { unstable_cache } from "next/cache";

interface GetSimilarCommunitiesSuccess {
  success: true;
  data: any[];
}

interface GetSimilarCommunitiesError {
  success: false;
  error: string;
}

type GetSimilarCommunitiesResult = GetSimilarCommunitiesSuccess | GetSimilarCommunitiesError;

// Create a cached version of the fetch function
export const getSimilarCommunities = unstable_cache(
  async (communityId: string): Promise<GetSimilarCommunitiesResult> => {
    try {
      const response = await client.api.communities[':communityId'].similar.$get({
        param: {
          communityId
        }
      });

      if (!response.ok) {
        throw new Error('An error occurred while fetching similar communities');
      }

      const { data } = await response.json();
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Error fetching similar communities:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching similar communities'
      };
    }
  },
  ["community-similar"],
  { tags: ["community-similar"], revalidate: 60 * 30 } // Cache for 30 minutes
);
