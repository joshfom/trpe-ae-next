'use server';

import { client } from "@/lib/hono";
import { unstable_cache } from "next/cache";

interface GetAgentsDataSuccess {
  success: true;
  data: any;
}

interface GetAgentsDataError {
  success: false;
  error: string;
}

type GetAgentsDataResult = GetAgentsDataSuccess | GetAgentsDataError;

// Create a cached version of the fetch function
export const getAgentsData = unstable_cache(
  async (): Promise<GetAgentsDataResult> => {
    try {
      const response = await client.api.admin.agents.$get();

      if (!response.ok) {
        throw new Error('An error occurred while fetching agents');
      }

      const { data } = await response.json();
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Error fetching agents data:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching agents'
      };
    }
  },
  ["agents-data"],
  { tags: ["agents-data"], revalidate: 60 * 5 } // Cache for 5 minutes
);
