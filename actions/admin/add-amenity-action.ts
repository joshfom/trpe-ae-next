"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

export type AddAmenityRequestData = {
  name: string;
  icon: string;
  [key: string]: any;
};

/**
 * Server action to add a new amenity
 * @param amenityData - Amenity data to be added
 * @returns Object with success status and data or error message
 */
export async function addAmenityAction(amenityData: AddAmenityRequestData) {
  try {
    const response = await client.api.admin.amenities.$post({
      json: amenityData
    });

    if (!response.ok) {
      throw new Error('Failed to add amenity');
    }

    const data = await response.json();
    
    // Revalidate the amenity tag
    revalidateTag('amenity');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error adding amenity:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
