"use client"

import React, { Suspense, memo } from 'react';
import PropertyCard from "@/components/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyType } from "@/types/property";

interface ListingsGridProps {
    listings?: PropertyType[]
}

// Memoized skeleton component
const ListingsGridSkeleton = memo(() => (
    <div className={'grid grid-cols-1 lg:grid-cols-3 gap-8'}>
        {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={''}>
                <Skeleton className={'h-96 w-full bg-zinc-600/40 rounded-xl'} />
                <div className="px-2 py-4 space-y-2">
                    <Skeleton className={'h-5 w-full bg-zinc-600/40 rounded-xl'} />
                    <Skeleton className={'h-3 w-full bg-zinc-600/40 rounded-xl'} />
                    <Skeleton className={'h-3 w-full bg-zinc-600/40 rounded-xl'} />
                    <Skeleton className={'h-3 w-1/2 bg-zinc-600/40 rounded-xl'} />
                </div>
            </div>
        ))}
    </div>
));

ListingsGridSkeleton.displayName = 'ListingsGridSkeleton';

// Memoized grid component
const ListingsGrid = memo<ListingsGridProps>(({ listings }) => {
    if (!listings || listings.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No properties found</p>
            </div>
        );
    }

    return (
        <div className={'grid grid-cols-1 lg:grid-cols-3 gap-8'}>
            {listings.map((listing) => (
                <PropertyCard key={listing.id} property={listing} />
            ))}
        </div>
    );
});

ListingsGrid.displayName = 'ListingsGrid';

// Create a compound component with proper typing
const ListingsGridWithSkeleton = ListingsGrid as typeof ListingsGrid & {
    Skeleton: typeof ListingsGridSkeleton;
};

// Attach skeleton as a static property
ListingsGridWithSkeleton.Skeleton = ListingsGridSkeleton;

export default ListingsGridWithSkeleton;
