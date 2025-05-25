"use client"

import React, { memo, useCallback } from 'react';
import { X } from "lucide-react";
import { CommunityFilterType } from "@/types/community";

interface SelectedCommunitiesListProps {
    selectedCommunities: CommunityFilterType[];
    setSelectedCommunities: React.Dispatch<React.SetStateAction<CommunityFilterType[]>>;
    classNames?: string;
}

const SelectedCommunitiesList = memo<SelectedCommunitiesListProps>(({
    selectedCommunities,
    setSelectedCommunities,
    classNames = ""
}) => {
    const removeCommunity = useCallback((communityToRemove: CommunityFilterType) => {
        setSelectedCommunities(prev => 
            prev.filter(community => community.slug !== communityToRemove.slug)
        );
    }, [setSelectedCommunities]);

    if (selectedCommunities.length === 0) {
        return null;
    }

    return (
        <div className={`flex flex-wrap gap-2 mb-4 ${classNames}`}>
            {selectedCommunities.map((community) => (
                <div
                    key={community.slug}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                    <span>{community.label}</span>
                    <button
                        type="button"
                        onClick={() => removeCommunity(community)}
                        className="ml-2 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:text-blue-600"
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
        </div>
    );
});

SelectedCommunitiesList.displayName = 'SelectedCommunitiesList';

export default SelectedCommunitiesList;
