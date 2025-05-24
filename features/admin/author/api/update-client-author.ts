"use client"
import { updateAuthor } from "@/actions/admin/update-author-action";
import { toast } from "sonner";

/**
 * Client-side function to update author using the server action
 * @param authorId - The ID of the author to update
 * @param data - The updated author data
 * @param onSuccess - Optional callback for successful update
 */
export const updateClientAuthor = async (
  authorId: string,
  data: {
    name: string;
    about: string;
    avatar?: string;
  },
  onSuccess?: () => void
) => {
  try {
    if (!authorId) {
      throw new Error("Author ID is required");
    }

    const result = await updateAuthor(authorId, data);

    if (!result.success) {
      throw new Error(result.error || "Failed to update author");
    }

    toast.success("Author updated successfully");
    
    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess();
    }

    return result.data;
  } catch (error) {
    console.error("Error updating author:", error);
    toast.error("An error occurred while updating author");
    throw error;
  }
};
