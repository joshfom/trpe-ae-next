"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin.developers.$post>
type RequestType = InferRequestType<typeof client.api.admin.developers.$post>["json"]

/**
 * Server action to add a new developer
 * @param data Developer data to add
 * @returns Object with success status and data or error message
 */
export async function addDeveloper(data: RequestType) {
  try {
    const response = await client.api.admin.developers.$post({ json: data });
    
    if (!response.ok) {
      throw new Error(`Failed to add developer: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate developers data
    revalidateTag('admin-developers');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error adding developer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
