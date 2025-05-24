"use server";

import { client } from "@/lib/hono";

/**
 * Fetches properties for a specific community
 * @param communityId The ID of the community
 * @returns Object with fetched properties data or error
 */
export async function getCommunityProperties(communityId: string) {
  try {
    if (!communityId) {
      throw new Error('Community ID is required');
    }
    
    const response = await client.api.communities[':communityId'].$get({
      param: {
        communityId
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch community properties');
    }

    const { data } = await response.json();

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching community properties:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
