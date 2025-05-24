'use server';

import { client } from "@/lib/hono";
import { unstable_cache } from "next/cache";

interface GetUnitTypesSuccess {
  success: true;
  data: any[];
}

interface GetUnitTypesError {
  success: false;
  error: string;
}

type GetUnitTypesResult = GetUnitTypesSuccess | GetUnitTypesError;

/**
 * Gets all unit types
 * @returns Object with success status and unit types data or error
 */
export const getAdminUnitTypes = unstable_cache(
  async (): Promise<GetUnitTypesResult> => {
    try {
      const response = await client.api.admin.types.unit_type.$get();

      if (!response.ok) {
        throw new Error('An error occurred while fetching unit types');
      }

      const { data } = await response.json();
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Error fetching unit types:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching unit types'
      };
    }
  },
  ["admin-unit-types"],
  { tags: ["admin-unit-types"], revalidate: 60 * 30 } // Cache for 30 minutes
);
