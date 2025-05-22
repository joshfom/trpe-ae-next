"use client"

import React, {Suspense} from 'react';
import PropertyCard from "@/components/property-card";
import {Skeleton} from "@/components/ui/skeleton";


interface ListingsGridProps {
    listings?: PropertyType[]
}

function ListingsGrid({listings}: ListingsGridProps) {

    return (

        <Suspense fallback={
            <div className={'grid grid-cols-1 lg:grid-cols-3 gap-8'}>
                {
                    Array.from({length: 6}, (_, i) => (
                        <div key={i} className={'bg-zinc-800 h-96 animate-pulse rounded-lg'}>

                        </div>
                    ))
                }
            </div>
        }>
            <div className={'grid grid-cols-1 lg:grid-cols-3 gap-8'}>

                {
                    listings?.map((listing) => (
                        // @ts-ignore
                        <PropertyCard key={listing.id} property={listing}/>
                    ))}

            </div>

        </Suspense>
    );
}

export default ListingsGrid;

// eslint-disable-next-line react/display-name
ListingsGrid.Skeleton = () => {
    return (
        <div className={'grid grid-cols-1 lg:grid-cols-3 gap-8'}>
            {
                Array.from({length: 6}, (_, i) => (
                    <div key={i} className={''}>
                        <Skeleton className={'h-96 w-full bg-zinc-600/40 rounded-xl'}/>
                        <div className="px-2 py-4 space-y-2">
                            <Skeleton className={'h-5 w-full bg-zinc-600/40 rounded-xl'}/>
                            <Skeleton className={'h-3 w-full bg-zinc-600/40 rounded-xl'}/>
                            <Skeleton className={'h-3 w-full bg-zinc-600/40 rounded-xl'}/>
                        </div>
                        <div className={'flex justify-between px-2'}>
                            <Skeleton className={'h-3 w-1/3 bg-zinc-600/40 rounded-xl'}/>
                            <Skeleton className={'h-3 w-1/3 bg-zinc-600/40 rounded-xl'}/>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}