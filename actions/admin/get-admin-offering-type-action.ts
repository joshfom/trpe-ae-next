'use server';

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

interface GetOfferingTypeSuccess {
  success: true;
  data: any;
}

interface GetOfferingTypeError {
  success: false;
  error: string;
}

type GetOfferingTypeResult = GetOfferingTypeSuccess | GetOfferingTypeError;

/**
 * Server action to get admin offering type by ID
 * @param offeringTypeId The ID of the offering type to fetch
 * @returns Object with success status and data or error
 */
export async function getAdminOfferingType(offeringTypeId: string): Promise<GetOfferingTypeResult> {
  try {
    const response = await client.api.admin["offering-types"][":offeringTypeId"].$get({
      param: { offeringTypeId }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch offering type: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching offering type:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
