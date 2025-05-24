"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin.cities.$post>
type RequestType = InferRequestType<typeof client.api.admin.cities.$post>["json"]

export type AddCitySuccessResult = {
  success: true;
  data: ResponseType;
}

export type AddCityErrorResult = {
  success: false;
  error: string;
}

export type AddCityResult = AddCitySuccessResult | AddCityErrorResult;

/**
 * Adds a new city
 * @param data City data to add
 * @returns Object with success status and data or error
 */
export async function addCity(data: RequestType): Promise<AddCityResult> {
  try {
    const response = await client.api.admin.cities.$post({ json: data });
    
    if (!response.ok) {
      throw new Error(`Failed to add city: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate cities data
    revalidateTag('admin-cities');
    revalidateTag('cities');
    
    return {
      success: true,
      data: responseData
    } as AddCitySuccessResult;
  } catch (error) {
    console.error("Error adding city:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    } as AddCityErrorResult;
  }
}
