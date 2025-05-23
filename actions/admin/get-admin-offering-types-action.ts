"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Server action to fetch admin offering types
 * @returns Object with success status and data or error message
 */
export async function getAdminOfferingTypes() {
  try {
    const response = await client.api.admin["offering-types"].$get();
    
    if (!response.ok) {
      throw new Error('An error occurred while fetching Offering Types');
    }
    
    const { data } = await response.json();
    
    // Revalidate offering types data
    revalidateTag('admin-offering-types');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching offering types:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
