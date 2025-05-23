"use server"
import {client} from "@/lib/hono";
import {unstable_cache} from "next/cache";

/**
 * Server action to fetch featured property
 * @param offeringTypeId - The offering type ID
 * @param limit - Number of properties to fetch (default: 1)
 */
export async function getFeaturedPropertyAction(offeringTypeId: string, limit: string = '1') {
    try {
        const response = await client.api.featured.properties[":offeringTypeId"].$get({
            param: {
                offeringTypeId,
            },
            query: {
                limit
            }
        });

        if (!response.ok) {
            console.error('An error occurred while fetching featured properties');
            throw new Error('An error occurred while fetching featured properties');
        }

        const {data} = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching featured property:', error);
        throw error;
    }
}
