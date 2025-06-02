"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";
import { processHtmlForStorage } from "@/lib/process-html-for-storage";

type ResponseType = InferResponseType<typeof client.api.admin.insights.$post>
type RequestType = InferRequestType<typeof client.api.admin.insights.$post>["json"]

/**
 * Server action to add a new insight
 * @param data Insight data to add
 * @returns Object with success status and data or error message
 */
export async function addInsight(data: RequestType) {
  try {
    // Pre-process HTML content before storing
    if (data.content) {
      data.content = await processHtmlForStorage(data.content);
    }
    
    const response = await client.api.admin.insights.$post({ json: data });
    
    if (!response.ok) {
      throw new Error(`Failed to add insight: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate insights data
    revalidateTag('admin-insights');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error adding insight:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
