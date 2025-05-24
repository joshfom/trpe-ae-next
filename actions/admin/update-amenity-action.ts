"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";
import { z } from "zod";

// Define the amenity data schema based on the API
const AmenitySchema = z.object({
  name: z.string(),
  icon: z.string()
});

type AmenityData = z.infer<typeof AmenitySchema>;

/**
 * Updates an existing amenity
 * @param amenityId ID of the amenity to update
 * @param data Amenity data to update
 * @returns Object with success status and data or error
 */
export async function updateAmenity(amenityId: string, data: AmenityData) {
  try {
    // Validate the input data
    const validatedData = AmenitySchema.parse(data);
    
    const response = await client.api.admin.amenities[":amenityId"].$post({
      param: { amenityId },
      json: validatedData
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update amenity: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Revalidate tags to ensure fresh data
    revalidateTag('amenities');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error updating amenity:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
