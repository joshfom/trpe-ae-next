"use client"
import { useState, useEffect } from 'react';
import { CommunityFilterType } from '@/types/community';
import { searchClientCommunities } from './search-client-communities';

interface UseCommunitySearchProps {
    communities: CommunityFilterType[];
    searchInput: string;
}

export const useCommunitySearch = ({ communities, searchInput }: UseCommunitySearchProps) => {
    const [results, setResults] = useState<CommunityFilterType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const performSearch = async () => {
            setLoading(true);
            try {
                const searchResults = await searchClientCommunities(communities, searchInput);
                setResults(searchResults);
            } catch (error) {
                console.error('Error searching communities:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [communities, searchInput]);

    return { results, loading };
};