import { useState } from 'react';
import { CommunityFilterType } from '@/features/search/types/property-search.types';
import Fuse from 'fuse.js';

interface UseCommunitySearchProps {
    communities: CommunityFilterType[];
    searchInput: string;
}

export const useCommunitySearch = ({ communities, searchInput }: UseCommunitySearchProps) => {
    const [loading, setLoading] = useState(false);

    // Since we're working with prefetched data, we can perform the search synchronously
    const performSearch = (): CommunityFilterType[] => {
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
    };

    // Execute the search immediately
    try {
        setLoading(true);
        const results = performSearch();
        setLoading(false);
        return { results, loading };
    } catch (error) {
        console.error('Error searching communities:', error);
        setLoading(false);
        return { results: [], loading };
    }
};