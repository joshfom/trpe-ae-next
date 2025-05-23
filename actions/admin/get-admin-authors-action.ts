"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Fetches all admin authors
 * @returns Object with success status and data or error message
 */
export async function getAdminAuthors() {
  try {
    const response = await client.api.admin.authors.$get();

    if (!response.ok) {
      throw new Error('An error occurred while fetching authors');
    }

    const { data } = await response.json();
    
    // Revalidate the authors tag
    revalidateTag('authors');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching authors:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
