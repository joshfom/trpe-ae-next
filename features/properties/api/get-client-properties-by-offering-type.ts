"use client"
import { getPropertiesByOfferingTypeAction } from "@/actions/properties/get-properties-by-offering-type-action";
import { toast } from "sonner";

/**
 * Client-side function to fetch properties by offering type using the server action
 * @param offeringTypeId - The offering type ID
 * @param pageParam - The page number
 * @param queryParams - Additional query parameters for filtering
 */
export const getClientPropertiesByOfferingType = async (
  offeringTypeId: string,
  pageParam: number = 1,
  queryParams?: {
    lo?: string;
    maxPrice?: string;
    bed?: string;
    bathrooms?: string;
    minArea?: string;
    maxArea?: string;
    sortBy?: string;
    typeSlug?: string;
  }
) => {
  try {
    if (!offeringTypeId) {
      return null;
    }
    
    const result = await getPropertiesByOfferingTypeAction(offeringTypeId, pageParam, queryParams);
    return result;
  } catch (error) {
    toast.error('An error occurred while fetching properties');
    console.error('Error fetching properties by offering type:', error);
    return null;
  }
};
