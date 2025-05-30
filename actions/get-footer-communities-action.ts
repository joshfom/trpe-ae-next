'use server'

import { client } from "@/lib/hono";
import { unstable_cache } from "next/cache";

// Define the community type to match the API response format
interface Community {
  id?: string;
  name: string | null;  // Updated to allow null values from API
  slug: string;
  shortName?: string | null;  // Updated to allow null values
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
      console.log("Fetching footer communities from server action");
      const response = await client.api.communities.list.$get();
      
      if (!response.ok) {
        console.error("Failed to fetch footer communities:", response.status);
        return [];
      }
      
      const data = await response.json();
      
      // Log the raw data to see what's coming back
      console.log("API response data:", JSON.stringify(data).substring(0, 200) + "...");
      
      // The API returns data in 'communities' array
      const communities: Community[] = data.communities || [];
      
      // Filter to only include communities with at least one property and a valid name
      // propertyCount is the total, which combines all property types
      const withProperties = communities.filter(
        (community) => (community.propertyCount || 0) > 0 && community.name !== null
      );
      
      console.log(`Found ${withProperties.length} communities with properties out of ${communities.length} total`);
      
      // Return up to 16 communities with properties
      return withProperties.slice(0, 16);
    } catch (error) {
      console.error("Error fetching footer communities:", error);
      return [];
    }
  },
  ['footer-communities'],
  { revalidate: 172800 } // Cache for 48 hours
);