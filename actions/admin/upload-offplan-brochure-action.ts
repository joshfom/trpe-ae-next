"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin.offplans[":offplanId"]["gallery"]["upload"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.offplans[":offplanId"]["gallery"]["upload"]["$post"]>["json"]

type UploadOffplanBrochureResult = {
  success: boolean;
  data?: ResponseType;
  error?: string;
}

/**
 * Uploads brochure files to an offplan project
 * @param offplanId The ID of the offplan project
 * @param data The brochure data to upload
 * @returns Object with success status and data or error
 */
export async function uploadOffplanBrochure(offplanId: string, data: RequestType): Promise<UploadOffplanBrochureResult> {
  try {
    const response = await client.api.admin.offplans[":offplanId"]["gallery"]["upload"].$post({
      json: data,
      param: { offplanId }
    });

    if (!response.ok) {
      throw new Error(`Failed to upload brochure: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate related data
    revalidateTag('offplan-gallery');
    revalidateTag(`offplan-gallery-${offplanId}`);
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error uploading offplan brochure:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
