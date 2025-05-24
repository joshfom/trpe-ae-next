"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

interface AuthorData {
  name: string;
  about: string;
  avatar?: string;
}

/**
 * Updates an existing author
 * @param authorId The ID of the author to update
 * @param data The author data to update
 * @returns Object with success status and data or error
 */
export async function updateAuthor(authorId: string, data: AuthorData) {
  try {
    const response = await client.api.admin.authors[":authorId"].$patch({
      param: { authorId },
      json: data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update author: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Revalidate related data
    revalidateTag('authors');
    revalidateTag('insights');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error updating author:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
