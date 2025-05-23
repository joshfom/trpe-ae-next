"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Fetches a specific admin community by ID
 * @param communityId ID of the community to fetch
 * @returns Object with success status and community data or error message
 */
export async function getAdminCommunity(communityId?: string) {
  if (!communityId) {
    return {
      success: false,
      error: "Community ID is required"
    };
  }

  try {
    const response = await client.api.admin.communities[":communityId"].$get({
      param: {
        communityId
      }
    });

    if (!response.ok) {
      throw new Error('An error occurred while fetching community');
    }

    const { data } = await response.json();
    
    // Revalidate the specific community
    revalidateTag(`admin-community-${communityId}`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
