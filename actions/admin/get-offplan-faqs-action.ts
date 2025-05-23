"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Server action to fetch an offplan's FAQs
 * @param offplanId ID of the offplan to fetch FAQs for
 * @returns Object with success status and data or error message
 */
export async function getOffplanFaqs(offplanId: string) {
  if (!offplanId) {
    return {
      success: false,
      error: "Offplan ID is required"
    };
  }

  try {
    const response = await client.api.admin.offplans[":offplanId"]["faqs"].$get({
      param: { offplanId }
    });

    if (!response.ok) {
      throw new Error('An error occurred while fetching FAQs');
    }

    const { data } = await response.json();
    
    // Revalidate the FAQs tag for this offplan
    revalidateTag(`offplan-faqs-${offplanId}`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching offplan FAQs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
