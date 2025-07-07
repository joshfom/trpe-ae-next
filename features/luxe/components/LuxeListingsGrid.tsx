"use client"

import React, {memo} from 'react';
import {Skeleton} from "@/components/ui/skeleton";
import LuxePropertyCard from "@/features/luxe/components/LuxePropertyCard";
import {PropertyType} from "@/types/property";

interface LuxeListingsProps {
    listings?: PropertyType[]
}

// Memoized skeleton component
const LuxeListingsGridSkeleton = memo(() => (
    <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
        {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={''}>
                <Skeleton className={'h-96 w-full bg-zinc-300/40 rounded-xl'} />
                <div className="px-2 py-4 space-y-2">
                    <Skeleton className={'h-5 w-full bg-zinc-300/40 rounded-xl'} />
                    <Skeleton className={'h-3 w-full bg-zinc-300/40 rounded-xl'} />
                    <Skeleton className={'h-3 w-full bg-zinc-300/40 rounded-xl'} />
                </div>
                <div className={'flex justify-between px-2'}>
                    <Skeleton className={'h-3 w-1/3 bg-zinc-300/40 rounded-xl'} />
                    <Skeleton className={'h-3 w-1/3 bg-zinc-300/40 rounded-xl'} />
                </div>
            </div>
        ))}
    </div>
));

LuxeListingsGridSkeleton.displayName = 'LuxeListingsGridSkeleton';

// Memoized main component
const LuxeListingsGrid = memo<LuxeListingsProps>(({ listings }) => {
    if (!listings || listings.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No luxury properties found</p>
            </div>
        );
    }

    return (
        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
            {listings.map((listing) => (
                <LuxePropertyCard key={listing.id} property={listing} />
            ))}
        </div>
    );
});

LuxeListingsGrid.displayName = 'LuxeListingsGrid';

// Create a compound component with proper typing
const LuxeListingsGridWithSkeleton = LuxeListingsGrid as typeof LuxeListingsGrid & {
    Skeleton: typeof LuxeListingsGridSkeleton;
};

// Attach skeleton as static property
LuxeListingsGridWithSkeleton.Skeleton = LuxeListingsGridSkeleton;

export default LuxeListingsGridWithSkeleton;