"use server";

import { client } from "@/lib/hono";
import { revalidatePath } from "next/cache";
import { InferResponseType, InferRequestType } from "hono";

/**
 * Type definitions for API response and request
 */
type ResponseType = InferResponseType<typeof client.api.crm.property_owners["bulk_create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.crm.property_owners["bulk_create"]["$post"]>["json"];

/**
 * Server action for bulk creating property owners
 * 
 * @param data - The data for creating property owners in bulk
 * @returns An object with success status and data or error
 */
export async function bulkCreatePropertyOwnersAction(data: RequestType) {
  try {
    // Bulk create property owners through API
    const response = await client.api.crm.property_owners["bulk_create"]["$post"]({
      json: data
    });

    // If response is not ok, throw error
    if (!response.ok) {
      throw new Error('Failed to create property owners in bulk');
    }

    const result = await response.json();

    // Revalidate paths that might be affected
    revalidatePath("/crm/property-owners");
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error creating property owners in bulk:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
