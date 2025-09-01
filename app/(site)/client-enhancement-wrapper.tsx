'use client'

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import client-only enhancements
const ClientOnlyEnhancements = dynamic(() => import('./client-only-enhancements'), {
    ssr: false,
    loading: () => null
});

// Client-side enhancements for the featured listings
export const SearchEnhancement = dynamic(() => import("@/features/search/SearchEnhancement"), {
    ssr: false
});

export const FeaturedListingsEnhancement = dynamic(() => import("@/features/site/Homepage/components/FeaturedListingsEnhancement"), {
    ssr: false
});

export default function ClientEnhancementWrapper() {
    return (
        <>
            <ClientOnlyEnhancements />
        </>
    );
}
