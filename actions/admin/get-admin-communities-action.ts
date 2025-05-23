"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Fetches all admin communities
 * @returns Object with success status and communities data or error message
 */
export async function getAdminCommunities() {
  try {
    const response = await client.api.admin.communities.$get();

    if (!response.ok) {
      throw new Error('An error occurred while fetching communities');
    }

    const { data } = await response.json();
    
    // Revalidate the communities tag
    revalidateTag('admin-communities');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching communities:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
