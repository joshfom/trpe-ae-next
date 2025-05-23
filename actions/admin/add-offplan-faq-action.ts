"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin.offplans[":offplanId"]["faqs"]["new"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.offplans[":offplanId"]["faqs"]["new"]["$post"]>["json"]

/**
 * Server action to add a new offplan FAQ
 * @param offplanId ID of the offplan to add the FAQ to
 * @param data FAQ data to add
 * @returns Object with success status and data or error message
 */
export async function addOffplanFaq(offplanId: string, data: RequestType) {
  if (!offplanId) {
    return {
      success: false,
      error: "Offplan ID is required"
    };
  }

  try {
    const response = await client.api.admin.offplans[":offplanId"]["faqs"]["new"].$post({
      param: { offplanId },
      json: data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add offplan FAQ: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate offplan FAQs data
    revalidateTag(`offplan-faqs-${offplanId}`);
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error adding offplan FAQ:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
