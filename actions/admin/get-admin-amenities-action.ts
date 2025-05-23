"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Fetches all admin amenities
 * @returns Object with success status and data or error message
 */
export async function getAdminAmenities() {
  try {
    const response = await client.api.admin.amenities.$get();

    if (!response.ok) {
      throw new Error('An error occurred while fetching amenities');
    }

    const { data } = await response.json();
    
    // Revalidate the amenities tag so any cached data is updated
    revalidateTag('amenities');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
