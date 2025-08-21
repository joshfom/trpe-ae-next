"use client"

import React, { Suspense, memo } from 'react';
import PropertyCard from "@/components/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyType } from "@/types/property";

interface ListingsGridProps {
    listings?: PropertyType[]
}

const ListingsGrid = memo<ListingsGridProps>(({ listings }) => {
    if (!listings || listings.length === 0) {
        return null;
    }

    return (
        <Suspense fallback={
            <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'}>
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className={'bg-gray-200 h-64 sm:h-80 lg:h-96 animate-pulse rounded-xl'} />
                ))}
            </div>
        }>
            <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'}>
                {listings.map((listing) => (
                    <PropertyCard key={listing.id} property={listing} />
                ))}
            </div>
        </Suspense>
    );
});

ListingsGrid.displayName = 'ListingsGrid';

// Optimized skeleton component with memo
const ListingsGridSkeleton = memo(() => (
    <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'}>
        {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={''}>
                <Skeleton className={'h-64 sm:h-80 lg:h-96 w-full bg-gray-200 rounded-xl'} />
                <div className="px-2 py-4 space-y-3">
                    <Skeleton className={'h-5 w-full bg-gray-200 rounded-lg'} />
                    <Skeleton className={'h-3 w-full bg-gray-200 rounded-lg'} />
                    <Skeleton className={'h-3 w-3/4 bg-gray-200 rounded-lg'} />
                </div>
                <div className={'flex justify-between px-2 gap-4'}>
                    <Skeleton className={'h-3 w-1/3 bg-gray-200 rounded-lg'} />
                    <Skeleton className={'h-3 w-1/4 bg-gray-200 rounded-lg'} />
                </div>
            </div>
        ))}
    </div>
));

ListingsGridSkeleton.displayName = 'ListingsGridSkeleton';

// Type assertion to add Skeleton property
const ListingsGridWithSkeleton = ListingsGrid as typeof ListingsGrid & {
    Skeleton: typeof ListingsGridSkeleton;
};

ListingsGridWithSkeleton.Skeleton = ListingsGridSkeleton;

export default ListingsGridWithSkeleton;