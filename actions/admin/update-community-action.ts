"use server";

import { client } from "@/lib/hono";
import { InferResponseType, InferRequestType } from "hono";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Type definitions for API response and request
 */
type ResponseType = InferResponseType<typeof client.api.admin.communities[":communityId"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.admin.communities[":communityId"]["$patch"]>["json"];

/**
 * Server action to update a community
 * 
 * This action handles:
 * 1. Community data update through the API
 * 2. Next.js cache revalidation
 * 
 * @param communityId - The ID of the community to update
 * @param data - The community data to update
 * @returns Result object with success status and data or error
 */
export async function updateCommunity(communityId: string, data: RequestType) {
  try {
    if (!communityId) {
      return {
        success: false,
        error: "Community ID is required"
      };
    }
    
    // Update community through API
    const response = await client.api.admin.communities[":communityId"]["$patch"]({
      param: { communityId },
      json: data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update community: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate both the path and tag for this community
    revalidatePath(`/communities/${communityId}`);
    revalidateTag(`community-${communityId}`);
    
    // Also revalidate the admin communities list
    revalidatePath('/admin/communities');
    revalidateTag('adminCommunities');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error updating community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
