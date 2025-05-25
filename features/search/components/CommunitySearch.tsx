"use client"

import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CommunityFilterType } from "@/types/community";
import { getClientCommunities } from '../../community/api/get-client-communities';
import Fuse from 'fuse.js';
import CommunityItem from './CommunityItem';
import SelectedCommunitiesList from './SelectedCommunitiesList';
import { Skeleton } from "@/components/ui/skeleton";
import ClickAwayListener from "@/lib/click-away-listener";

interface CommunitySearchProps {
    selectedCommunities: CommunityFilterType[];
    setSelectedCommunities: React.Dispatch<React.SetStateAction<CommunityFilterType[]>>;
    offeringType: string;
    isMobile?: boolean;
}

const CommunitySearch = memo<CommunitySearchProps>(({
    selectedCommunities,
    setSelectedCommunities,
    offeringType,
    isMobile = false
}) => {
    const [searchInput, setSearchInput] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [communities, setCommunities] = useState<CommunityFilterType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch communities on mount
    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const data = await getClientCommunities();
                setCommunities(data);
            } catch (error) {
                console.error('Failed to fetch communities:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCommunities();
    }, []);

    // Memoize Fuse search instance
    const fuse = useMemo(() => {
        if (communities.length === 0) return null;
        
        return new Fuse(communities, {
            keys: ['label'],
            threshold: 0.3,
            includeScore: true,
        });
    }, [communities]);

    // Memoize filtered communities
    const filteredCommunities = useMemo(() => {
        if (!fuse || !searchInput.trim()) {
            return communities.slice(0, 10); // Show first 10 by default
        }

        const results = fuse.search(searchInput);
        return results.slice(0, 10).map(result => result.item);
    }, [fuse, searchInput, communities]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        setIsDropdownOpen(true);
    }, []);

    const handleInputFocus = useCallback(() => {
        setIsDropdownOpen(true);
    }, []);

    const closeDropdown = useCallback(() => {
        setIsDropdownOpen(false);
        setSearchInput('');
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-32" />
            </div>
        );
    }

    return (
        <ClickAwayListener onClickAway={closeDropdown}>
            <div className="relative">
                <SelectedCommunitiesList
                    selectedCommunities={selectedCommunities}
                    setSelectedCommunities={setSelectedCommunities}
                />
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        type="text"
                        placeholder="Search communities..."
                        value={searchInput}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className="pl-10"
                    />
                </div>

                {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredCommunities.length > 0 ? (
                            filteredCommunities.map((community, index) => (
                                <CommunityItem
                                    key={community.slug}
                                    community={community}
                                    selectedCommunities={selectedCommunities}
                                    setSelectedCommunities={setSelectedCommunities}
                                    setSearchInput={setSearchInput}
                                    index={index}
                                    isMobile={isMobile}
                                    offeringType={offeringType}
                                    closeDropdown={closeDropdown}
                                />
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">
                                No communities found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ClickAwayListener>
    );
});

CommunitySearch.displayName = 'CommunitySearch';

export default CommunitySearch;
