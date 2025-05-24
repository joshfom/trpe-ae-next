"use server";

import { client } from "@/lib/hono";

/**
 * Fetches all authors
 * @returns Object with fetched authors data or error
 */
export async function getAllAuthors() {
  try {
    const response = await client.api.admin.authors.$get();

    if (!response.ok) {
      throw new Error('Failed to fetch authors');
    }

    const { data } = await response.json();

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
