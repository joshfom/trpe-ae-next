"use client"
import { getPropertyTypeAction } from "@/actions/properties/get-property-type-action";
import { toast } from "sonner";

/**
 * Client-side function to fetch property types using the server action
 */
export const getClientPropertyType = async () => {
  try {
    const data = await getPropertyTypeAction();
    return data;
  } catch (error) {
    toast.error('An error occurred while fetching property types');
    console.error('Error fetching property types:', error);
    return null;
  }
};
