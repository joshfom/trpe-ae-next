"use server"

import { db } from "@/db/drizzle";
import { communityTable } from "@/db/schema/community-table";
import { propertyTable } from "@/db/schema/property-table";
import { offeringTypeTable } from "@/db/schema/offering-type-table";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

/**
 * Server action to fetch communities directly from database
 * This replaces the useGetCommunities hook that used React Query
 * Now uses only direct database queries for better reliability and performance
 */
export async function getCommunitiesAction() {
    try {
        return await unstable_cache(
            async () => {
                console.log('Fetching communities directly from database');
                return await getCommunitiesFromDatabase();
            },
            ['communities-list'],
            {
                revalidate: 300, // 5 minutes
                tags: ['communities']
            }
        )();
    } catch (error) {
        console.error('Error in getCommunitiesAction:', error);
        return []; // Return empty array to prevent breaking the UI
    }
}

/**
 * Direct database query for communities with detailed property counts
 */
async function getCommunitiesFromDatabase() {
    try {
        // Step 1: Get all communities
        const allCommunities = await db.select({
            id: communityTable.id,
            name: communityTable.name,
            slug: communityTable.slug,
            shortName: communityTable.shortName,
        }).from(communityTable);

        if (allCommunities.length === 0) {
            console.log('No communities found in database');
            return [];
        }

        console.log(`Found ${allCommunities.length} communities`);

        // Step 2: Get offering types for detailed counts
        const [rentType, saleType, commercialRentType, commercialSaleType] = await Promise.all([
            db.query.offeringTypeTable.findFirst({
                where: eq(offeringTypeTable.slug, "for-rent"),
                columns: { id: true }
            }),
            db.query.offeringTypeTable.findFirst({
                where: eq(offeringTypeTable.slug, "for-sale"),
                columns: { id: true }
            }),
            db.query.offeringTypeTable.findFirst({
                where: eq(offeringTypeTable.slug, "commercial-rent"),
                columns: { id: true }
            }),
            db.query.offeringTypeTable.findFirst({
                where: eq(offeringTypeTable.slug, "commercial-sale"),
                columns: { id: true }
            })
        ]);

        // Step 3: Get property counts for each type
        const [totalCounts, rentCounts, saleCounts, commercialRentCounts, commercialSaleCounts] = await Promise.all([
            // Total property counts per community
            db.select({
                communityId: propertyTable.communityId,
                count: db.$count(propertyTable)
            })
            .from(propertyTable)
            .groupBy(propertyTable.communityId),
            
            // Rent property counts
            rentType ? db.select({
                communityId: propertyTable.communityId,
                count: db.$count(propertyTable)
            })
            .from(propertyTable)
            .where(eq(propertyTable.offeringTypeId, rentType.id))
            .groupBy(propertyTable.communityId) : [],
            
            // Sale property counts
            saleType ? db.select({
                communityId: propertyTable.communityId,
                count: db.$count(propertyTable)
            })
            .from(propertyTable)
            .where(eq(propertyTable.offeringTypeId, saleType.id))
            .groupBy(propertyTable.communityId) : [],
            
            // Commercial rent property counts
            commercialRentType ? db.select({
                communityId: propertyTable.communityId,
                count: db.$count(propertyTable)
            })
            .from(propertyTable)
            .where(eq(propertyTable.offeringTypeId, commercialRentType.id))
            .groupBy(propertyTable.communityId) : [],
            
            // Commercial sale property counts
            commercialSaleType ? db.select({
                communityId: propertyTable.communityId,
                count: db.$count(propertyTable)
            })
            .from(propertyTable)
            .where(eq(propertyTable.offeringTypeId, commercialSaleType.id))
            .groupBy(propertyTable.communityId) : []
        ]);

        // Step 4: Create lookup maps
        const totalCountsMap = new Map(totalCounts.map(item => [item.communityId, item.count || 0]));
        const rentCountsMap = new Map(rentCounts.map(item => [item.communityId, item.count || 0]));
        const saleCountsMap = new Map(saleCounts.map(item => [item.communityId, item.count || 0]));
        const commercialRentCountsMap = new Map(commercialRentCounts.map(item => [item.communityId, item.count || 0]));
        const commercialSaleCountsMap = new Map(commercialSaleCounts.map(item => [item.communityId, item.count || 0]));

        // Step 5: Build final communities array
        const communities = allCommunities.map(community => ({
            id: community.id,
            name: community.name,
            slug: community.slug,
            shortName: community.shortName,
            propertyCount: totalCountsMap.get(community.id) || 0,
            rentCount: rentCountsMap.get(community.id) || 0,
            saleCount: saleCountsMap.get(community.id) || 0,
            commercialRentCount: commercialRentCountsMap.get(community.id) || 0,
            commercialSaleCount: commercialSaleCountsMap.get(community.id) || 0,
        }));

        console.log(`Successfully processed ${communities.length} communities with property counts`);
        
        return communities;
    } catch (error) {
        console.error('Direct database query failed:', error);
        throw error;
    }
}