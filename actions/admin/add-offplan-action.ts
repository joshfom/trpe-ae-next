"use server";

import { client } from "@/lib/hono";
import { InferRequestType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = {
  data: {
    id: string;
  };
} | { Unauthorized: string; };

type RequestType = InferRequestType<typeof client.api.admin.offplans.new.$post>["json"]

/**
 * Server action to add a new offplan
 * @param data Offplan data to add
 * @returns Object with success status and data or error message
 */
export async function addOffplan(data: RequestType) {
  try {
    const response = await client.api.admin.offplans.new.$post({ json: data });
    
    if (!response.ok) {
      throw new Error(`Failed to add offplan: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Check if response indicates unauthorized access
    if ('Unauthorized' in responseData) {
      return {
        success: false,
        error: "Unauthorized access"
      };
    }
    
    // Revalidate offplans data
    revalidateTag('admin-offplans');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error adding offplan:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
