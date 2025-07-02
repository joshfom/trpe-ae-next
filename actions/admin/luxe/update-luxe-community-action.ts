"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Type definitions for API response and request
 */
type ResponseType = InferResponseType<typeof client.api.admin["luxe-communities"][":communityId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.admin["luxe-communities"][":communityId"]["$patch"]>["json"];

export type UpdateLuxeCommunitySuccessResult = {
  success: true;
  data: ResponseType;
}

export type UpdateLuxeCommunityErrorResult = {
  success: false;
  error: string;
}

export type UpdateLuxeCommunityResult = UpdateLuxeCommunitySuccessResult | UpdateLuxeCommunityErrorResult;

/**
 * Server action to update a community's luxe fields
 * 
 * This action handles:
 * 1. Community luxe fields update through the API
 * 2. Next.js cache revalidation
 * 
 * @param communityId - The ID of the community to update
 * @param data - The luxe community data to update
 * @returns Result object with success status and data or error
 */
export async function updateLuxeCommunity(communityId: string, data: RequestType): Promise<UpdateLuxeCommunityResult> {
    try {
        const response = await client.api.admin["luxe-communities"][":communityId"].$patch({
            param: { communityId },
            json: data
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Error:', response.status, errorData);
            return {
                success: false,
                error: `Failed to update luxe community: ${response.status} ${response.statusText}`
            };
        }
        
        const responseData = await response.json();
        
        // Revalidate relevant cache tags and paths
        revalidateTag('luxe-communities');
        revalidatePath('/admin/luxe/communities');
        
        return {
            success: true,
            data: responseData
        };
        
    } catch (error) {
        console.error('Network or parsing error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unknown error occurred while updating luxe community"
        };
    }
}
