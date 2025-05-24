'use server';

import { client } from "@/lib/hono";
import { unstable_cache } from "next/cache";

interface GetPropertyTypeSuccess {
  success: true;
  data: any;
}

interface GetPropertyTypeError {
  success: false;
  error: string;
}

type GetPropertyTypeResult = GetPropertyTypeSuccess | GetPropertyTypeError;

/**
 * Gets a single property type by ID
 * @param propertyTypeId - The ID of the property type to fetch
 * @returns Object with success status and property type data or error
 */
export const getAdminPropertyType = unstable_cache(
  async (propertyTypeId: string): Promise<GetPropertyTypeResult> => {
    try {
      const response = await client.api.admin["property-types"][":propertyTypeId"].$get({
        param: {
          propertyTypeId
        }
      });

      if (!response.ok) {
        throw new Error('An error occurred while fetching property type');
      }

      const { data } = await response.json();
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Error fetching property type:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching property type'
      };
    }
  },
  ["admin-property-type"],
  { tags: ["admin-property-type"], revalidate: 60 * 30 } // Cache for 30 minutes
);
