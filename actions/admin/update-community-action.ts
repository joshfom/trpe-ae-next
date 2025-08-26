"use server";

import { client } from "@/lib/hono";
import { InferResponseType, InferRequestType } from "hono";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Type definitions for API response and request
 */
// Define the community data interface
interface CommunityData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  logo?: string | null;
  banner?: string | null;
  // Add other fields as needed
}

// Define response and request types
type ResponseType = { data: CommunityData };
type RequestType = InferRequestType<typeof client.api.admin.communities[":communityId"]["$patch"]>["json"];

// Define result types for the action
export type UpdateCommunitySuccessResult = {
  success: true;
  data: ResponseType;
}

export type UpdateCommunityErrorResult = {
  success: false;
  error: string;
}

export type UpdateCommunityResult = UpdateCommunitySuccessResult | UpdateCommunityErrorResult;

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
export async function updateCommunity(communityId: string, data: RequestType): Promise<UpdateCommunityResult> {
  try {
    if (!communityId) {
      return {
        success: false,
        error: "Community ID is required"
      } as UpdateCommunityErrorResult;
    }
    
    console.log('Updating community:', { communityId, data });
    
    // Update community through API
    const response = await client.api.admin.communities[":communityId"]["$patch"]({
      param: { communityId },
      json: data
    });
    
    if (!response.ok) {
      // Try to get more detailed error information
      let errorMessage = `Failed to update community: ${response.statusText}`;
      try {
        const errorBody = await response.json() as any;
        if (errorBody && typeof errorBody === 'object' && 'error' in errorBody) {
          errorMessage = `Failed to update community: ${errorBody.error}`;
          if ('details' in errorBody && errorBody.details) {
            console.error('Validation details:', errorBody.details);
            errorMessage += ` - Validation errors: ${JSON.stringify(errorBody.details)}`;
          }
        }
      } catch (e) {
        // If we can't parse the error body, use the status text
      }
      throw new Error(errorMessage);
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
    } as UpdateCommunitySuccessResult;
  } catch (error) {
    console.error("Error updating community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    } as UpdateCommunityErrorResult;
  }
}
