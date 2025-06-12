"use server";

import { client } from "@/lib/hono";
import { unstable_cache } from "next/cache";

/**
 * Server action for fetching all agents with caching
 * 
 * @returns Object with success status and agents data or error message
 */
export const getAgentsAction = unstable_cache(
  async () => {
    try {
      // Fetch agents through API
      const response = await client.api.agents.$get();

      // If response is not ok, throw error
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }

      const { data } = await response.json();
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Error fetching agents:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        data: []
      };
    }
  },
  ['agents-list'],
  { 
    revalidate: 3600, // Cache for 1 hour since agents don't change frequently
    tags: ['site-agents']
  }
);
