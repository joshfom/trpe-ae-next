"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Server action to fetch admin property types
 * @returns Object with success status and data or error message
 */
export async function getAdminPropertyTypes() {
  try {
    const response = await client.api.admin["property-types"].$get();
    
    if (!response.ok) {
      throw new Error('An error occurred while fetching Property Types');
    }
    
    const { data } = await response.json();
    
    // Revalidate property types data
    revalidateTag('admin-property-types');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching property types:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
