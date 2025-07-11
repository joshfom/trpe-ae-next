"use client"
import { addPageMetaAction } from "@/actions/admin/add-page-meta-action";
import { toast } from "sonner";

interface PageMetaData {
    metaTitle: string;
    metaDescription: string;
    noIndex?: boolean;
    noFollow?: boolean;
    title: string;
    content?: string; // Optional to match schema
    path: string;
    metaKeywords?: string;
    includeInSitemap?: boolean;
}

/**
 * Client-side function to add page meta using the server action
 * @param data - The page meta data to add
 * @param onSuccess - Optional callback for successful addition
 */
export const addClientPageMeta = async (
  data: PageMetaData,
  onSuccess?: (data: any) => void
) => {
  try {
    const result = await addPageMetaAction(data);
    
    if (!result.success) {
      toast.error(result.error || 'Failed to add page meta');
      return result;
    }
    
    console.log('Page meta added successfully:', result.data);
    toast.success('Page meta added successfully');
    
    if (onSuccess) {
      onSuccess(result.data);
    }
    
    return result;
  } catch (error) {
    console.error('Error adding page meta:', error);
    toast.error('Failed to add page meta');
    throw error;
  }
};
