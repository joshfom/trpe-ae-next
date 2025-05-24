"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

export type DeleteAuthorSuccessResult = {
  success: true;
}

export type DeleteAuthorErrorResult = {
  success: false;
  error: string;
}

export type DeleteAuthorResult = DeleteAuthorSuccessResult | DeleteAuthorErrorResult;

/**
 * Deletes an author
 * @param authorId The ID of the author to delete
 * @returns Object with success status and data or error
 */
export async function deleteAuthor(authorId: string): Promise<DeleteAuthorResult> {
  try {
    // Using the proper DELETE endpoint now that it's implemented
    const response = await client.api.admin.authors[":authorId"].$delete({
      param: { authorId }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete author: ${response.statusText}`);
    }
    
    // Revalidate related data
    revalidateTag('authors');
    revalidateTag('insights');
    
    return {
      success: true
    } as DeleteAuthorSuccessResult;
  } catch (error) {
    console.error("Error deleting author:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    } as DeleteAuthorErrorResult;
  }
}
