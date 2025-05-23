"use server"
import {db} from "@/db/drizzle";
import {client} from "@/lib/hono";
import {unstable_cache} from "next/cache";

/**
 * Server action to fetch communities
 * This replaces the useGetCommunities hook that used React Query
 */
export async function getCommunitiesAction() {
    try {
        const response = await client.api.communities.list.$get();

        if (!response.ok) {
            console.error('An error occurred while fetching communities');
            throw new Error('An error occurred while fetching communities');
        }

        const {communities} = await response.json();
        return communities;
    } catch (error) {
        console.error('Error fetching communities:', error);
        throw error;
    }
}