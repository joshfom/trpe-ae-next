"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Server action to fetch admin page metas
 * @returns Object with success status and data or error message
 */
export async function getAdminPageMetas() {
  try {
    const response = await client.api.admin["page-meta"]["$get"]();
    
    if (!response.ok) {
      throw new Error('An error occurred while fetching page metas');
    }
    
    const { data } = await response.json();
    
    // Revalidate page metas data
    revalidateTag('admin-page-metas');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching page metas:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
