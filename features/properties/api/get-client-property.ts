"use client"
import { getPropertyAction } from "@/actions/properties/get-property-action";
import { toast } from "sonner";

/**
 * Client-side function to fetch property using the server action
 * @param slug - The property slug
 */
export const getClientProperty = async (slug: string) => {
  try {
    if (!slug) {
      return null;
    }
    
    const data = await getPropertyAction(slug);
    return data;
  } catch (error) {
    toast.error('An error occurred while fetching property');
    console.error('Error fetching property:', error);
    return null;
  }
};
