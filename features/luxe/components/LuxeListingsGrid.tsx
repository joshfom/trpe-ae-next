

import React, {Suspense} from 'react';
import PropertyCard from "@/components/property-card";
import {Skeleton} from "@/components/ui/skeleton";
import LuxePropertyCard from "@/features/luxe/components/LuxePropertyCard";


interface LuxeListingsProps {
    listings?: PropertyType[]
}

function LuxeListingsGrid({listings}: LuxeListingsProps) {

    return (

        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>

        {
            listings?.map((listing) => (

                <LuxePropertyCard key={listing.id} property={listing}/>
            ))}

    </div>
    );
}

export default LuxeListingsGrid;

// eslint-disable-next-line react/display-name
LuxeListingsGrid.Skeleton = () => {
    return (
        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
            {
                Array.from({length: 6}, (_, i) => (
                    <div key={i} className={''}>
                        <Skeleton className={'h-96 w-full bg-zinc-300/40 rounded-xl'}/>
                        <div className="px-2 py-4 space-y-2">
                            <Skeleton className={'h-5 w-full bg-zinc-300/40 rounded-xl'}/>
                            <Skeleton className={'h-3 w-full bg-zinc-300/40 rounded-xl'}/>
                            <Skeleton className={'h-3 w-full bg-zinc-300/40 rounded-xl'}/>
                        </div>
                        <div className={'flex justify-between px-2'}>
                            <Skeleton className={'h-3 w-1/3 bg-zinc-300/40 rounded-xl'}/>
                            <Skeleton className={'h-3 w-1/3 bg-zinc-300/40 rounded-xl'}/>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}