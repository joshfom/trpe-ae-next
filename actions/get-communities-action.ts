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
        // First try to get from cache or use direct database query as fallback
        return await unstable_cache(
            async () => {
                try {
                    // Try the API endpoint first
                    const response = await withResilience(
                        () => client.api.communities.list.$get(),
                        'getCommunities',
                        {
                            maxRetries: 1,
                            timeoutMs: 5000, // Shorter timeout
                            baseDelay: 1000,
                            maxDelay: 3000,
                        }
                    );

                    if (response.ok) {
                        const {communities} = await response.json();
                        return communities;
                    } else {
                        throw new Error(`API responded with ${response.status}`);
                    }
                } catch (apiError) {
                    console.warn('API call failed, falling back to direct database query:', apiError);
                    
                    // Fallback to direct database query
                    return await getCommunitiesFromDatabase();
                }
            },
            ['communities-list'],
            {
                revalidate: 300, // 5 minutes
                tags: ['communities']
            }
        )();
    } catch (error) {
        console.error('Error in getCommunitiesAction:', error);
        
        // Final fallback: try direct database query one more time
        try {
            return await getCommunitiesFromDatabase();
        } catch (dbError) {
            console.error('Database fallback also failed:', dbError);
            return []; // Return empty array to prevent breaking the UI
        }
    }
}

/**
 * Direct database query fallback for communities
 */
async function getCommunitiesFromDatabase() {
    const { communityTable } = await import("@/db/schema/community-table");
    const { propertyTable } = await import("@/db/schema/property-table");
    const { offeringTypeTable } = await import("@/db/schema/offering-type-table");
    const { eq } = await import("drizzle-orm");
    
    try {
        // Get all communities (simple query first)
        const allCommunities = await db.select({
            id: communityTable.id,
            name: communityTable.name,
            slug: communityTable.slug,
            shortName: communityTable.shortName,
        }).from(communityTable);

        if (allCommunities.length === 0) {
            return [];
        }

        // Get total property counts per community
        const totalCounts = await db.select({
            communityId: propertyTable.communityId,
            count: db.$count(propertyTable)
        })
        .from(propertyTable)
        .groupBy(propertyTable.communityId);

        // Create lookup map for efficient data access
        const totalCountsMap = new Map(totalCounts.map(item => [item.communityId, item.count || 0]));

        // Build final communities array with basic counts
        const communities = allCommunities.map(community => ({
            name: community.name,
            slug: community.slug,
            shortName: community.shortName,
            propertyCount: totalCountsMap.get(community.id) || 0,
            rentCount: 0, // Simplified for fallback
            saleCount: 0, // Simplified for fallback
            commercialRentCount: 0, // Simplified for fallback
            commercialSaleCount: 0, // Simplified for fallback
        }));

        return communities;
    } catch (error) {
        console.error('Direct database query failed:', error);
        throw error;
    }
}