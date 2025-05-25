"use client"

import React, { memo, useCallback, useMemo } from 'react';
import { CommunityFilterType } from "@/types/community";

interface CommunityItemProps {
    community: CommunityFilterType;
    selectedCommunities: CommunityFilterType[];
    setSelectedCommunities: React.Dispatch<React.SetStateAction<CommunityFilterType[]>>;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
    index: number;
    isMobile?: boolean;
    offeringType: string;
    closeDropdown?: () => void;
}

const CommunityItem = memo<CommunityItemProps>(({
    community,
    selectedCommunities,
    setSelectedCommunities,
    setSearchInput,
    isMobile = false,
    index,
    offeringType,
    closeDropdown
}) => {
    const propertyCount = useMemo(() => {
        switch (offeringType) {
            case 'for-rent':
                return community.rentCount;
            case 'for-sale':
                return community.saleCount;
            case 'general':
                return community.propertyCount;
            case 'commercial-rent':
                return community.commercialRentCount;
            case 'commercial-sale':
                return community.commercialSaleCount;
            default:
                return community.propertyCount;
        }
    }, [community, offeringType]);

    const isDisabled = useMemo(() => 
        selectedCommunities.some((item) => item.slug === community.slug) || propertyCount === 0,
        [selectedCommunities, community.slug, propertyCount]
    );

    const handleClick = useCallback(() => {
        setSelectedCommunities(prev => [...prev, community]);
        setSearchInput('');
        if (isMobile && closeDropdown) {
            closeDropdown();
        }
    }, [community, setSelectedCommunities, setSearchInput, isMobile, closeDropdown]);

    return (
        <button
            type="button"
            disabled={isDisabled}
            onClick={handleClick}
            className="flex hover:bg-slate-50 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">{community.label}</p>
                <p className="text-xs text-gray-500">{propertyCount} properties</p>
            </div>
        </button>
    );
});

CommunityItem.displayName = 'CommunityItem';

export default CommunityItem;
