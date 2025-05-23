"use client"
import { getFaqListAction } from "@/actions/admin/get-faq-list-action";
import { toast } from "sonner";

/**
 * Client-side function to fetch FAQ list using the server action
 * @param targetId - The target ID
 * @param target - The target type
 */
export const getClientFaqList = async (targetId: string, target: string) => {
  try {
    if (!targetId) {
      return null;
    }
    
    const data = await getFaqListAction(targetId, target);
    return data;
  } catch (error) {
    toast.error('An error occurred while fetching faqs');
    console.error('Error fetching FAQ list:', error);
    return null;
  }
};
