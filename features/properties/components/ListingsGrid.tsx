"use client"

import React, { Suspense, memo, useEffect, useState } from 'react';
import PropertyCard from "@/components/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyType } from "@/types/property";

interface ListingsGridProps {
    listings?: PropertyType[]
}

const ListingsGrid = memo<ListingsGridProps>(({ listings }) => {
    // State to handle navigation loading states
    const [isNavigating, setIsNavigating] = useState(false);
    const [isClient, setIsClient] = useState(false);
    
    // Check if we're running on client-side
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    // Effect to handle router navigation events
    useEffect(() => {
        // Ensure we're running on the client side
        if (typeof document === 'undefined') return;
        
        const handleRouteChangeStart = () => {
            console.log('Navigation start detected');
            setIsNavigating(true);
        };
        
        const handleRouteChangeComplete = () => {
            console.log('Navigation complete detected');
            setIsNavigating(false);
        };
        
        try {
            // Add event listeners for our custom navigation events
            document.addEventListener('navigationstart', handleRouteChangeStart);
            document.addEventListener('navigationcomplete', handleRouteChangeComplete);
            
            // Also observe the HTML element's class changes for navigation
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const htmlElement = document.documentElement;
                        if (htmlElement.classList.contains('navigating')) {
                            handleRouteChangeStart();
                        } else if (isNavigating) {
                            handleRouteChangeComplete();
                        }
                    }
                });
            });
            
            observer.observe(document.documentElement, { attributes: true });
            
            return () => {
                document.removeEventListener('navigationstart', handleRouteChangeStart);
                document.removeEventListener('navigationcomplete', handleRouteChangeComplete);
                observer.disconnect();
            };
        } catch (error) {
            console.error('Error setting up navigation listeners:', error);
            return () => {};
        }
    }, [isNavigating]);
    
    // When server rendering or no listings available
    if (!isClient || !listings || listings.length === 0) {
        return <div className="navigation-sensitive"><ListingsGridSkeleton /></div>;
    }
    
    // Show skeleton during navigation (only when we're on client-side)
    if (isClient && isNavigating) {
        return <div className="navigation-sensitive"><ListingsGridSkeleton /></div>;
    }

    return (
        <Suspense fallback={<ListingsGridSkeleton />}>
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
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
    <div className={'grid grid-cols-1 lg:grid-cols-3 gap-8'}>
        {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={''}>
                <Skeleton className={'h-96 w-full bg-zinc-600/40 rounded-xl'} />
                <div className="px-2 py-4 space-y-2">
                    <Skeleton className={'h-5 w-full bg-zinc-600/40 rounded-xl'} />
                    <Skeleton className={'h-3 w-full bg-zinc-600/40 rounded-xl'} />
                    <Skeleton className={'h-3 w-full bg-zinc-600/40 rounded-xl'} />
                </div>
                <div className={'flex justify-between px-2'}>
                    <Skeleton className={'h-3 w-1/3 bg-zinc-600/40 rounded-xl'} />
                    <Skeleton className={'h-3 w-1/3 bg-zinc-600/40 rounded-xl'} />
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