"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Server action to fetch all admin developers
 * @returns Object with success status and data or error message
 */
export async function getAdminDevelopers() {
  try {
    const response = await client.api.admin.developers.$get();

    if (!response.ok) {
      throw new Error('An error occurred while fetching developers');
    }

    const { data } = await response.json();
    
    // Revalidate the developers tag
    revalidateTag('admin-developers');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching developers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
