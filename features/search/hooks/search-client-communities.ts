"use client"
import { searchCommunitiesAction } from "@/actions/community/search-communities-action";
import { CommunityFilterType } from "@/types/community";

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
