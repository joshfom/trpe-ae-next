"use client"

import { client } from "@/lib/hono";
import { toast } from "sonner";

export const updateClientLanguage = async (
  languageId: string,
  data: {
    name: string;
    locale: string;
    slug: string;
    code: string;
    isActive: boolean;
    isDefault: boolean;
  },
  onSuccess?: () => void
) => {
  try {
    const response = await client.api.admin.languages[":languageId"]["$post"]({
      param: { languageId },
      json: data,
    });

    // Process the response
    const result = await response.json();
    
    // Assume success if we get data back
    if (result && result.data) {
      toast.success("Language updated successfully");
      if (onSuccess) {
        onSuccess();
      }
      return { success: true, data: result.data };
    } else {
      toast.error("Failed to update language");
      return { success: false, error: "Failed to update language" };
    }
  } catch (error) {
    console.error("Error updating language:", error);
    toast.error("An error occurred while updating the language");
    throw error;
  }
};
