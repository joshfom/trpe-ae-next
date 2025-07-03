'use server'

import { db } from "@/db/drizzle";
import { luxeCommunityTable, communityTable } from "@/db/schema-index";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// Define the luxe community type for the footer
interface FooterLuxeCommunity {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  propertyCount?: number;
}

// Cache the luxe communities for 30 days since they rarely change
export const getFooterLuxeCommunities = unstable_cache(
  async (): Promise<FooterLuxeCommunity[]> => {
    try {
      console.log("Fetching luxe communities from database");
      
      // Query luxe communities with their basic community info
      const luxeCommunities = await db
        .select({
          id: luxeCommunityTable.id,
          name: luxeCommunityTable.name,
          slug: communityTable.slug,
          image: luxeCommunityTable.image,
          featured: luxeCommunityTable.featured,
          displayOrder: luxeCommunityTable.displayOrder,
        })
        .from(luxeCommunityTable)
        .innerJoin(communityTable, eq(luxeCommunityTable.communityId, communityTable.id))
        .where(eq(luxeCommunityTable.featured, true))
        .orderBy(luxeCommunityTable.displayOrder);
      
      console.log(`Found ${luxeCommunities.length} featured luxe communities`);
      
      // Transform the data to match the expected format
      const formattedCommunities: FooterLuxeCommunity[] = luxeCommunities.map(community => ({
        id: community.id,
        name: community.name,
        slug: community.slug,
        image: community.image,
        // You might want to add a property count query here if needed
        propertyCount: 0 // Placeholder - can be populated with actual count if needed
      }));
      
      return formattedCommunities;
    } catch (error) {
      console.error("Error fetching luxe communities:", error);
      return [];
    }
  },
  ['footer-luxe-communities'],
  { 
    revalidate: 2592000, // Cache for 30 days (30 * 24 * 60 * 60 seconds)
    tags: ['luxe-communities'] // Add tags for more granular cache invalidation
  }
);
