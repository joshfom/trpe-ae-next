"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin.offplans[":offplanId"]["gallery"]["upload"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.offplans[":offplanId"]["gallery"]["upload"]["$post"]>["json"]

/**
 * Server action to upload images for an offplan
 * @param offplanId ID of the offplan
 * @param data Image data to upload
 * @returns Object with success status and data or error message
 */
export async function uploadOffplanImages(offplanId: string, data: RequestType) {
  try {
    const response = await client.api.admin.offplans[":offplanId"]["gallery"]["upload"].$post({
      json: data,
      param: { offplanId }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload images: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate offplan gallery data
    revalidateTag(`offplan-gallery-${offplanId}`);
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error uploading offplan images:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
