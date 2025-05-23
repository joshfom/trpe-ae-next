"use server"
import {client} from "@/lib/hono";
import {unstable_cache} from "next/cache";

/**
 * Server action to fetch property types
 */
export const getPropertyTypeAction = unstable_cache(
  async () => {
    try {
        const response = await client.api.unit_types.$get();

        if (!response.ok) {
            console.error('An error occurred while fetching property types');
            throw new Error('An error occurred while fetching property types');
        }

        const {data} = await response.json();
        return {
            data
        };
    } catch (error) {
        console.error('Error fetching property types:', error);
        throw error;
    }
  },
  ['property-types'],
  { revalidate: 3600 } // Cache for 1 hour
);
