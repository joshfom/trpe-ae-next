"use client"
import { getUnitTypeAction } from "@/actions/properties/get-unit-type-action";
import { toast } from "sonner";

/**
 * Client-side function to fetch unit type using the server action
 * @param slug - The unit type slug
 */
export const getClientUnitType = async (slug?: string) => {
  try {
    if (!slug) {
      return null;
    }
    
    const data = await getUnitTypeAction(slug);
    return data;
  } catch (error) {
    toast.error('An error occurred while fetching unit type');
    console.error('Error fetching unit type:', error);
    return null;
  }
};
