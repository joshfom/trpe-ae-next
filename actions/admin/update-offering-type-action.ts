"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin["offering-types"][":offeringTypeId"]["update"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.admin["offering-types"][":offeringTypeId"]["update"]["$patch"]>["json"];

/**
 * Server action to update an offering type
 * @param offeringTypeId ID of the offering type to update
 * @param data Updated offering type data
 * @returns Object with success status and data or error message
 */
export async function updateOfferingType(offeringTypeId: string, data: RequestType) {
  try {
    if (!offeringTypeId) {
      throw new Error('Offering Type ID is required');
    }
    
    const response = await client.api.admin["offering-types"][":offeringTypeId"]["update"]["$patch"]({
      param: { offeringTypeId },
      json: data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update offering type: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate offering types data
    revalidateTag('admin-offering-types');
    revalidateTag(`admin-offering-type-${offeringTypeId}`);
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error updating offering type:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
