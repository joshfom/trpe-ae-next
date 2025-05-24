'use server';

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

interface UpdateLanguageSuccess {
  success: true;
  data: any;
}

interface UpdateLanguageError {
  success: false;
  error: string;
}

type UpdateLanguageResult = UpdateLanguageSuccess | UpdateLanguageError;

/**
 * Server action to update a language
 * @param languageId The ID of the language to update
 * @param data The language data to update
 * @returns Object with success status and data or error
 */
export async function updateLanguage(
  languageId: string,
  data: {
    name: string;
    locale: string;
    slug: string;
    code: string;
    isActive: boolean;
    isDefault: boolean;
  }
): Promise<UpdateLanguageResult> {
  try {
    const response = await client.api.admin.languages[":languageId"]["$post"]({
      param: { languageId },
      json: data,
    });

    if (!response.ok) {
      throw new Error(`Failed to update language: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Revalidate related data
    revalidateTag('admin-languages');
    
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error("Error updating language:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
