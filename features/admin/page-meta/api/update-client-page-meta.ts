"use client"
import { updatePageMetaAction } from "@/actions/admin/update-page-meta-action";
import { toast } from "sonner";
import { InferRequestType } from "hono";
import { client } from "@/lib/hono";

type RequestType = InferRequestType<typeof client.api.admin["page-meta"][":id"]["update"]["$patch"]>["json"];

/**
 * Client-side function to update page meta using the server action
 * @param id - The ID of the page meta to update
 * @param data - The updated page meta data
 * @param onSuccess - Optional callback for successful update
 */
export const updateClientPageMeta = async (
  id: string,
  data: RequestType,
  onSuccess?: () => void
) => {
  try {
    if (!id) {
      throw new Error("Page meta ID is required");
    }
    
    const result = await updatePageMetaAction(id, data);
    toast.success('Page meta updated successfully');
    
    if (onSuccess) {
      onSuccess();
    }
    
    return result;
  } catch (error) {
    console.error('Error updating page meta:', error);
    
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
    
    toast.error('An error occurred while updating page meta');
    throw error;
  }
};
