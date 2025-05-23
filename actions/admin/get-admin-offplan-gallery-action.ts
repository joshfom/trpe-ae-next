"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Server action to fetch an offplan's gallery
 * @param offplanId ID of the offplan to fetch gallery for
 * @returns Object with success status and data or error message
 */
export async function getAdminOffplanGallery(offplanId: string) {
  if (!offplanId) {
    return {
      success: false,
      error: "Offplan ID is required"
    };
  }

  try {
    const response = await client.api.admin.offplans[":offplanId"]["gallery"].$get({
      param: { offplanId }
    });

    if (!response.ok) {
      throw new Error('An error occurred while fetching gallery');
    }

    const { data } = await response.json();
    
    // Revalidate the gallery tag for this offplan
    revalidateTag(`admin-offplan-gallery-${offplanId}`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching offplan gallery:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
