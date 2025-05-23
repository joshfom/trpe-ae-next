"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin.insights[":insightSlug"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.admin.insights[":insightSlug"]["$patch"]>["json"]

/**
 * Server action to update an insight
 * @param insightSlug Slug of the insight to update
 * @param data Data for updating the insight
 * @returns Object with success status and data or error message
 */
export async function updateInsight(insightSlug: string, data: RequestType) {
  if (!insightSlug) {
    return {
      success: false,
      error: "Insight slug is required"
    };
  }

  try {
    const response = await client.api.admin.insights[":insightSlug"]["$patch"]({
      param: { insightSlug },
      json: data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update insight: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate insights data
    revalidateTag('admin-insights');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error updating insight:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
