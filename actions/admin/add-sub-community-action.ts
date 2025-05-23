"use server";

import { client } from "@/lib/hono";
import { revalidatePath } from "next/cache";
import { InferResponseType, InferRequestType } from "hono";

/**
 * Type definitions for API response and request
 */
type ResponseType = InferResponseType<typeof client.api.admin.communities[':communityId']['$post']>;
type RequestType = InferRequestType<typeof client.api.admin.communities[':communityId']['$post']>["json"];

/**
 * Server action for adding a sub-community to a community
 * 
 * @param communityId - The ID of the parent community
 * @param data - The data for creating a sub-community
 * @returns An object with success status and data or error
 */
export async function addSubCommunityAction(communityId: string, data: RequestType) {
  try {
    // Check if communityId is provided
    if (!communityId) {
      throw new Error('Community ID is required');
    }

    // Add sub-community through API
    const response = await client.api.admin.communities[':communityId'].$post({
      param: {
        communityId
      },
      json: data
    });

    // If response is not ok, throw error
    if (!response.ok) {
      throw new Error('Failed to add sub-community');
    }

    const result = await response.json();

    // Revalidate paths that might be affected
    revalidatePath(`/admin/settings/communities/${communityId}`);
    revalidatePath('/admin/settings/communities');
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error adding sub-community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
