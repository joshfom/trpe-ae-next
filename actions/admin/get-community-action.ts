"use server";

import { db } from "@/db/drizzle";
import { communityTable } from "@/db/schema/community-table";
import { validateRequest } from "@/lib/auth";
import { eq } from "drizzle-orm";

/**
 * Server action to get a community by ID
 * @param communityId - ID of the community to fetch
 * @returns Object with success status and data or error message
 */
export async function getCommunityAction(communityId: string) {
  try {
    // Check if user is authenticated
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: Please log in to access communities'
      };
    }

    // Fetch the community from the database
    const community = await db.query.communityTable.findFirst({
      where: eq(communityTable.id, communityId)
    });

    if (!community) {
      return {
        success: false,
        error: 'Community not found'
      };
    }
    
    return {
      success: true,
      data: community
    };
  } catch (error) {
    console.error("Error fetching community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
