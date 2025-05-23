"use server";

import { client } from "@/lib/hono";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";
import { InferResponseType, InferRequestType } from "hono";

/**
 * Type definitions for API response and request
 */
type ResponseType = InferResponseType<typeof client.api.admin["property-types"][":propertyTypeId"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.admin["property-types"][":propertyTypeId"]["$patch"]>["json"];

/**
 * Server action for updating a property type
 * 
 * This action:
 * 1. Updates property type data through the API
 * 2. Handles revalidation of affected paths
 * 3. Returns success or error state
 * 
 * @param propertyTypeId - The ID of the property type to update
 * @param data - The data to update the property type with
 * @returns An object with success status and data or error
 */
export async function updatePropertyTypeAction(propertyTypeId: string, data: RequestType) {
  try {
    // Check if propertyTypeId is provided
    if (!propertyTypeId) {
      throw new Error('Property Type ID is required');
    }

    // Update property type through API
    const response = await client.api.admin["property-types"][":propertyTypeId"]["$patch"]({
      param: { propertyTypeId },
      json: data
    });

    // If response is not ok, throw error
    if (!response.ok) {
      throw new Error('Failed to update property type');
    }

    const result = await response.json();

    // Revalidate paths that might be affected
    revalidatePath("/admin/property-types");
    revalidatePath(`/admin/property-types/${propertyTypeId}`);
    
    // Handle Next.js cache revalidation for public paths
    try {
      const revalidateData = {
        path: `/pro/${propertyTypeId}`,
        tag: `property-type-${propertyTypeId}`
      };

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(revalidateData)
      });
    } catch (error) {
      console.warn('Cache revalidation failed, but property type was updated:', error);
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error updating property type:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
