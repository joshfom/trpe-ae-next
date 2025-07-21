"use server";

import { client } from "@/lib/hono";
import { InferResponseType } from "hono";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Type definitions for API response
 */
type ResponseType = InferResponseType<typeof client.api.admin["luxe-communities"]["$get"], 200>;

export type GetLuxeCommunitiesSuccessResult = {
  success: true;
  data: ResponseType;
}

export type GetLuxeCommunitiesErrorResult = {
  success: false;
  error: string;
}

export type GetLuxeCommunitiesResult = GetLuxeCommunitiesSuccessResult | GetLuxeCommunitiesErrorResult;

/**
 * Server action to get all luxe communities
 * 
 * This action handles:
 * 1. Fetching luxe communities data through the API
 * 2. Error handling for failed requests
 * 
 * @returns Result object with success status and data or error
 */
export async function getLuxeCommunities(): Promise<GetLuxeCommunitiesResult> {
    try {
        console.log('Action: Starting to fetch luxe communities...');
        
        // Check if client is available
        if (!client) {
            console.error('Action: Client is not available');
            return {
                success: false,
                error: "API client is not available"
            };
        }
        
        console.log('Action: Client is available, making request...');
        const response = await client.api.admin["luxe-communities"].$get();
        
        console.log('Action: Response status:', response.status, response.ok);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Error:', response.status, errorData);
            return {
                success: false,
                error: `Failed to fetch luxe communities: ${response.status} ${response.statusText}`
            };
        }
        
        const data = await response.json();
        console.log('Action: Received data:', data);
        
        return {
            success: true,
            data
        };
        
    } catch (error) {
        console.error('Action: Network or parsing error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unknown error occurred while fetching luxe communities"
        };
    }
}
