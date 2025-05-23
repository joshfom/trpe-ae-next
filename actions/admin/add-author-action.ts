"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin.authors.$post>
type RequestType = InferRequestType<typeof client.api.admin.authors.$post>["json"]

/**
 * Adds a new author
 * @param data Author data to add
 * @returns Object with success status and data or error
 */
export async function addAuthor(data: RequestType) {
  try {
    const response = await client.api.admin.authors.$post({ json: data });
    
    if (!response.ok) {
      throw new Error(`Failed to add author: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate authors data
    revalidateTag('authors');
    revalidateTag('insights');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error adding author:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
