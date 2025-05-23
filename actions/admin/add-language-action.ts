"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin.languages.$post>
type RequestType = InferRequestType<typeof client.api.admin.languages.$post>["json"]

/**
 * Server action to add a new language
 * @param data Language data to add
 * @returns Object with success status and data or error message
 */
export async function addLanguage(data: RequestType) {
  try {
    const response = await client.api.admin.languages.$post({ json: data });
    
    if (!response.ok) {
      throw new Error(`Failed to add language: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate languages data
    revalidateTag('admin-languages');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error adding language:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
