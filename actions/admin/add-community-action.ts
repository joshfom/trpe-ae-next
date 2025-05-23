"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin.communities.$post>
type RequestType = InferRequestType<typeof client.api.admin.communities.$post>["json"]

/**
 * Adds a new community
 * @param data Community data to add
 * @returns Object with success status and data or error
 */
export async function addCommunity(data: RequestType) {
  try {
    const response = await client.api.admin.communities.$post({ json: data });
    
    if (!response.ok) {
      throw new Error(`Failed to add community: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate communities data
    revalidateTag('admin-communities');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error adding community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
