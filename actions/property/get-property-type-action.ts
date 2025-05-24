"use server";

import { client } from "@/lib/hono";

/**
 * Fetches property types from the API
 * @returns Object with fetched property types data or error
 */
export async function getPropertyTypes() {
  try {
    const response = await client.api.unit_types.$get();

    if (!response.ok) {
      throw new Error('Failed to fetch property types');
    }

    const { data } = await response.json();

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching property types:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
