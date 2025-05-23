"use client"
import { addPageMetaAction } from "@/actions/admin/add-page-meta-action";
import { toast } from "sonner";
import { InferRequestType } from "hono";
import { client } from "@/lib/hono";

type RequestType = InferRequestType<typeof client.api.admin["page-meta"]["new"]["$post"]>["json"];

/**
 * Client-side function to add page meta using the server action
 * @param data - The page meta data to add
 * @param onSuccess - Optional callback for successful addition
 */
export const addClientPageMeta = async (
  data: RequestType,
  onSuccess?: (data: any) => void
) => {
  try {
    const result = await addPageMetaAction(data);
    console.log('Page meta added successfully:', result);
    toast.success('Page meta added successfully');
    
    if (onSuccess) {
      onSuccess(result);
    }
    
    return result;
  } catch (error) {
    console.error('Error adding page meta:', error);
    
    if (error instanceof Error) {
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.error) {
          toast.error(errorData.error);
          return;
        }
      } catch (e) {
        // Not a JSON error
      }
    }
    
    toast.error('An error occurred while updating page Meta');
    throw error;
  }
};
