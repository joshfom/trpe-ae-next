"use server"
import {client} from "@/lib/hono";
import {unstable_cache} from "next/cache";

/**
 * Server action to fetch unit type by slug
 * @param slug - The unit type slug
 */
export const getUnitTypeAction = unstable_cache(
  async (slug?: string) => {
    try {
        if (!slug) {
            return null;
        }
        
        const response = await client.api.unit_types[':slug'].$get({
            param: {
                slug
            },
        });

        if (!response.ok) {
            console.error('An error occurred while fetching unit type');
            throw new Error('An error occurred while fetching unit type');
        }

        const {unitType} = await response.json();
        return {
            unitType
        };
    } catch (error) {
        console.error('Error fetching unit type:', error);
        throw error;
    }
  },
  ['unit-type'],
  { revalidate: 3600 } // Cache for 1 hour
);
