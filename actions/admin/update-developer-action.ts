"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin.developers[":developerId"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.admin.developers[":developerId"]["$patch"]>["json"]

/**
 * Server action to update a developer
 * @param developerId ID of the developer to update
 * @param data Developer data to update
 * @returns Object with success status and data or error message
 */
export async function updateDeveloper(developerId: string, data: RequestType) {
  if (!developerId) {
    return {
      success: false,
      error: "Developer ID is required"
    };
  }

  try {
    const response = await client.api.admin.developers[":developerId"]["$patch"]({
      param: { developerId },
      json: data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update developer: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate developers data
    revalidateTag('admin-developers');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error updating developer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
