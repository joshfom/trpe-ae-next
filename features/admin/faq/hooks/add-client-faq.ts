"use client"
import { addFaqAction } from "@/actions/admin/add-faq-action";
import { toast } from "sonner";
import { InferRequestType } from "hono";
import { client } from "@/lib/hono";

type RequestType = InferRequestType<typeof client.api.admin.faqs[":target"]["faqs"][":targetId"]["new"]["$post"]>["json"];

/**
 * Client-side function to add a FAQ using the server action
 * @param targetId - The target ID
 * @param target - The target type
 * @param data - The FAQ data to add
 * @param onSuccess - Optional callback for successful addition
 */
export const addClientFaq = async (
  targetId: string, 
  target: string, 
  data: RequestType,
  onSuccess?: () => void
) => {
  try {
    const result = await addFaqAction(targetId, target, data);
    toast.success('FAQ added successfully');
    if (onSuccess) {
      onSuccess();
    }
    return result;
  } catch (error) {
    toast.error('An error occurred while adding FAQ');
    console.error('Error adding FAQ:', error);
    throw error;
  }
};
