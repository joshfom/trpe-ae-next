"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Fetches all admin sub-communities
 * @returns Object with success status and sub-communities data or error message
 */
export async function getAdminSubCommunities() {
  try {
    const response = await client.api.admin.communities.sub_communities.$get();

    if (!response.ok) {
      throw new Error('An error occurred while fetching sub-communities');
    }

    const { data } = await response.json();
    
    // Revalidate the sub-communities tag
    revalidateTag('adminSubCommunities');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching sub-communities:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}

/**
 * Fetches sub-communities for a specific community
 * 
 * @param communityId - The ID of the community to fetch sub-communities for
 * @returns Object with success status and sub-communities data or error message
 */
export async function getAdminSubCommunitiesForCommunity(communityId: string) {
  try {
    // Check if communityId is provided
    if (!communityId) {
      throw new Error('Community ID is required');
    }

    // Fetch sub-communities through API
    const response = await client.api.admin.communities[":communityId"].sub_communities.$get({
      param: { communityId }
    });

    // If response is not ok, throw error
    if (!response.ok) {
      throw new Error('Failed to fetch sub-communities');
    }

    const { data } = await response.json();
    
    // Revalidate the community-specific sub-communities tag
    revalidateTag(`admin-communities-${communityId}`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching sub-communities:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: []
    };
  }
}
