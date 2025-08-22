"use server"
import {client} from "@/lib/hono";
import {unstable_cache} from "next/cache";
import { withResilience } from "@/lib/resilient-api";

/**
 * Server action to fetch featured property
 * @param offeringTypeId - The offering type ID
 * @param limit - Number of properties to fetch (default: 1)
 */
export async function getFeaturedPropertyAction(offeringTypeId: string, limit: string = '1') {
    try {
        const response = await withResilience(
            () => client.api.featured.properties[":offeringTypeId"].$get({
                param: {
                    offeringTypeId,
                },
                query: {
                    limit
                }
            }),
            `getFeaturedProperty-${offeringTypeId}`,
            {
                maxRetries: 2,
                timeoutMs: 8000, // 8 seconds
                baseDelay: 1000,
            }
        );

        if (!response.ok) {
            const errorMessage = `Failed to fetch featured properties: ${response.status} ${response.statusText}`;
            console.error(errorMessage);
            
            throw new Error(errorMessage);
        }

        const {data} = await response.json();
        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error fetching featured property:', error);
        
        // Return fallback empty data instead of throwing in production
        if (process.env.NODE_ENV === 'production') {
            console.warn(`Returning fallback data for featured property ${offeringTypeId}`);
            return null; // or return a default/cached value
        }
        
        throw error;
    }
}
