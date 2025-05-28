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

// Cache the result of the community fetch for 1 hour during debugging
export const getFooterCommunities = unstable_cache(
  async (): Promise<Community[]> => {
    try {
      console.log("Fetching footer communities from server action");
      const response = await client.api.communities.list.$get({
        query: {
          limit: 50 // Increase limit to ensure we get enough communities
        }
      });
      
      if (!response.ok) {
        console.error("Failed to fetch footer communities:", response.status);
        return [];
      }
      
      const data = await response.json();
      
      // Log the full response to debug any issues
      console.log("API full response data:", JSON.stringify(data));
      
      // The API returns data in 'communities' array
      const communities: Community[] = data.communities || [];
      
      // Filter to only include communities with at least one property and a valid name
      // propertyCount is the total, which combines all property types
      const withProperties = communities.filter(
        (community) => (community.propertyCount || 0) > 0 && community.name !== null
      );
      
      console.log(`Found ${withProperties.length} communities with properties out of ${communities.length} total`);
      
      // Return up to 16 communities with properties - use a more lenient filter if needed
      let result = withProperties.slice(0, 16);
      
      // If no communities with properties are found, return all communities as a fallback
      if (result.length === 0 && communities.length > 0) {
        console.log("No communities with properties found, using all communities as fallback");
        result = communities.filter(c => c.name !== null).slice(0, 16);
      }
      
      console.log(`Returning ${result.length} communities for footer display`);
      return result;
    } catch (error) {
      console.error("Error fetching footer communities:", error);
      return [];
    }
  },
  ['footer-communities'],
  { revalidate: 172800 } // Cache for 48 hours
);