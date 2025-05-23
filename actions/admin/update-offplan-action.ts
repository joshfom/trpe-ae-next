"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin.offplans[":offplanId"]["update"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.admin.offplans[":offplanId"]["update"]["$patch"]>["json"]

/**
 * Server action to update an offplan
 * @param offplanId ID of the offplan to update
 * @param data Offplan data to update
 * @returns Object with success status and data or error message
 */
export async function updateOffplan(offplanId: string, data: RequestType) {
  if (!offplanId) {
    return {
      success: false,
      error: "Offplan ID is required"
    };
  }

  try {
    const response = await client.api.admin.offplans[":offplanId"]["update"]["$patch"]({
      param: { offplanId },
      json: data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update offplan: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate offplans data
    revalidateTag('admin-offplans');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error updating offplan:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
