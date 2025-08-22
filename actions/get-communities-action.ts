"use server"
import {db} from "@/db/drizzle";
import {client} from "@/lib/hono";
import {unstable_cache} from "next/cache";
import { withResilience } from "@/lib/resilient-api";

/**
 * Server action to fetch communities
 * This replaces the useGetCommunities hook that used React Query
 */
export async function getCommunitiesAction() {
    try {
        const response = await withResilience(
            () => client.api.communities.list.$get(),
            'getCommunities',
            {
                maxRetries: 2,
                timeoutMs: process.env.NODE_ENV === 'production' ? 30000 : 8000, // 30 seconds in production, 8 seconds in dev
                baseDelay: 2000, // Increase base delay
                maxDelay: 15000, // Increase max delay
            }
        );

        if (!response.ok) {
            const errorMessage = `Failed to fetch communities: ${response.status} ${response.statusText}`;
            console.error(errorMessage);
            
            throw new Error(errorMessage);
        }

        const {communities} = await response.json();
        return communities;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error fetching communities:', error);
        
        // Return fallback empty array instead of throwing in production
        if (process.env.NODE_ENV === 'production') {
            console.warn('Returning fallback empty communities array');
            return []; // Return empty array as fallback
        }
        
        throw error;
    }
}