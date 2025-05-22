"use client"

import React, {Suspense} from 'react';
import PropertyCard from "@/components/property-card";
import {Skeleton} from "@/components/ui/skeleton";
import ProjectCard from "@/features/offplans/components/ProjectCard";


interface ListingsGridProps {
    listings?: ProjectType[]
}

function ProjectsGrid({listings}: ListingsGridProps) {

    return (

        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>

            {
                listings?.map((listing) => (
                    <ProjectCard key={listing.id} project={listing}/>
                ))}

        </div>
    );
}

export default ProjectsGrid;

// eslint-disable-next-line react/display-name
ProjectsGrid.Skeleton = () => {
    return (
        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
            {
                Array.from({length: 4}, (_, i) => (
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