"use server";

import { client } from "@/lib/hono";

/**
 * Fetches featured properties based on offering type ID
 * @param offeringTypeId The ID of the offering type
 * @param limit The number of properties to fetch (default: 1)
 * @returns Object with fetched property data or error
 */
export async function getFeaturedProperties(offeringTypeId: string, limit: string = '1') {
  try {
    const response = await client.api.featured.properties[":offeringTypeId"].$get({
      param: {
        offeringTypeId,
      },
      query: {
        limit
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch featured properties');
    }

    const { data } = await response.json();

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
