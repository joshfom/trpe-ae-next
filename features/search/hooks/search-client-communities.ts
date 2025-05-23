"use client"
import { searchCommunitiesAction } from "@/actions/community/search-communities-action";

interface CommunityFilterType {
    id?: string;
    slug: string;
    name: string | null;
    shortName?: string | null;
    propertyCount?: number;
    rentCount?: number;
    saleCount?: number;
    commercialRentCount?: number;
    commercialSaleCount?: number;
}

/**
 * Client-side function to search communities using the server action
 * @param communities - List of communities to search
 * @param searchInput - Search query
 */
export const searchClientCommunities = async (
    communities: CommunityFilterType[],
    searchInput: string
) => {
    try {
        const results = await searchCommunitiesAction(communities, searchInput);
        return results;
    } catch (error) {
        console.error('Error searching communities:', error);
        return [];
    }
};
