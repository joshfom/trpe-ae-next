"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Fetches all admin cities
 * @returns Object with success status and data or error message
 */
export async function getAdminCities() {
  try {
    const response = await client.api.admin.cities.$get();

    if (!response.ok) {
      throw new Error('An error occurred while fetching cities');
    }

    const { data } = await response.json();
    
    // Revalidate the cities tag
    revalidateTag('admin-cities');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching cities:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
