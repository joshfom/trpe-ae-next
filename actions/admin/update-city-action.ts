"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { AdminCityFormSchema } from "@/lib/types/form-schema/admin-city-form-schema";

// Define the shapes directly based on the API
type CityData = {
  id: string;
  name: string | null;
  slug: string;
  longitude: string | null;
  latitude: string | null;
  updatedAt: string | null;
  createdAt: string;
  short_name: string | null;
  countryId: string | null;
};

type RequestType = z.infer<typeof AdminCityFormSchema>;
type ResponseType = { data: CityData };

export type UpdateCitySuccessResult = {
  success: true;
  data: ResponseType;
}

export type UpdateCityErrorResult = {
  success: false;
  error: string;
}

export type UpdateCityResult = UpdateCitySuccessResult | UpdateCityErrorResult;

/**
 * Updates a city
 * @param cityId The ID of the city to update
 * @param data City data to update
 * @returns Object with success status and data or error
 */
export async function updateCity(cityId: string, data: RequestType): Promise<UpdateCityResult> {
  try {
    const response = await client.api.admin.cities[":cityId"].$patch({
      param: { cityId },
      json: data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update city: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate cities data
    revalidateTag('admin-cities');
    revalidateTag('cities');
    
    return {
      success: true,
      data: responseData
    } as UpdateCitySuccessResult;
  } catch (error) {
    console.error("Error updating city:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    } as UpdateCityErrorResult;
  }
}
