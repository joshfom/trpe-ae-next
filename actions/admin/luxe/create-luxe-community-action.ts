"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Type definitions for API response and request
 */
type ResponseType = InferResponseType<typeof client.api.admin["luxe-communities"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.admin["luxe-communities"]["$post"]>["json"];

export type CreateLuxeCommunitySuccessResult = {
  success: true;
  data: ResponseType;
}

export type CreateLuxeCommunityErrorResult = {
  success: false;
  error: string;
}

export type CreateLuxeCommunityResult = CreateLuxeCommunitySuccessResult | CreateLuxeCommunityErrorResult;

/**
 * Server action to create a new luxe community
 * 
 * This action handles:
 * 1. Luxe community data creation through the API
 * 2. Next.js cache revalidation
 * 
 * @param data - The luxe community data to create
 * @returns Result object with success status and data or error
 */
export async function createLuxeCommunity(data: RequestType): Promise<CreateLuxeCommunityResult> {
    try {
        const response = await client.api.admin["luxe-communities"].$post({
            json: data
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Error:', response.status, errorData);
            return {
                success: false,
                error: `Failed to create luxe community: ${response.status} ${response.statusText}`
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
            error: error instanceof Error ? error.message : "An unknown error occurred while creating luxe community"
        };
    }
}
