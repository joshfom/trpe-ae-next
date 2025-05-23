"use server"
import { unstable_cache } from "next/cache";
import Fuse from 'fuse.js';

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
 * Server action to search communities
 * @param communities - List of communities to search
 * @param searchInput - Search query
 */
export async function searchCommunitiesAction(
    communities: CommunityFilterType[],
    searchInput: string
) {
    try {
        // If search input is empty, return all communities
        if (!searchInput.trim()) {
            return communities;
        }

        // Create a new Fuse instance with our search configuration
        const fuse = new Fuse(communities, {
            keys: ['name', 'shortName'],
            threshold: 0.3, // Adjust this value to control search sensitivity
            includeScore: true
        });

        // Perform the search and return the results
        const searchResults = fuse.search(searchInput);
        return searchResults.map(result => result.item);
    } catch (error) {
        console.error('Error searching communities:', error);
        return [];
    }
}
