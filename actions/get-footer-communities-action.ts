'use server'

import { db } from "@/db/drizzle";
import { communityTable } from "@/db/schema/community-table";
import { propertyTable } from "@/db/schema/property-table";
import { offeringTypeTable } from "@/db/schema/offering-type-table";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// Define the community type to match the expected format
interface Community {
  id?: string;
  name: string | null;
  slug: string;
  shortName?: string | null;
  propertyCount?: number;
  rentCount?: number;
  saleCount?: number;
  commercialRentCount?: number;
  commercialSaleCount?: number;
}

// Cache the result of the community fetch for 48 hours (172800 seconds)
export const getFooterCommunities = unstable_cache(
  async (): Promise<Community[]> => {
    try {
      console.log("Fetching footer communities directly from database");
      
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

      // Filter to only include communities with at least one property and a valid name
      const withProperties = communities.filter(
        (community) => (community.propertyCount || 0) > 0 && community.name !== null
      );
      
      console.log(`Found ${withProperties.length} communities with properties out of ${communities.length} total`);
      
      // Return up to 16 communities with properties for footer
      return withProperties.slice(0, 16);
    } catch (error) {
      console.error("Error fetching footer communities:", error);
      return [];
    }
  },
  ['footer-communities'],
  { 
    revalidate: 172800, // Cache for 48 hours
    tags: ['communities', 'footer']
  }
);