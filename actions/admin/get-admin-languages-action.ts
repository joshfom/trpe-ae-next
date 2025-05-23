"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Server action to fetch all admin languages
 * @returns Object with success status and data or error message
 */
export async function getAdminLanguages() {
  try {
    const response = await client.api.admin.languages.$get();

    if (!response.ok) {
      throw new Error('An error occurred while fetching languages');
    }

    const { data } = await response.json();
    
    // Revalidate the languages tag
    revalidateTag('admin-languages');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching languages:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
