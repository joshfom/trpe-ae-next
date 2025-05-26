"use client"

import React, { Suspense, memo } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import ProjectCard from "@/features/offplans/components/ProjectCard";

interface ListingsGridProps {
    listings?: ProjectType[]
}

// Memoized skeleton component
const ProjectsGridSkeleton = memo(() => (
    <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
        {Array.from({ length: 4 }, (_, i) => (
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

ProjectsGridSkeleton.displayName = 'ProjectsGridSkeleton';

// Memoized main component
const ProjectsGrid = memo<ListingsGridProps>(({ listings }) => {
    if (!listings || listings.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No projects found</p>
            </div>
        );
    }

    return (
        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
            {listings.map((listing) => (
                <ProjectCard key={listing.id} project={listing} />
            ))}
        </div>
    );
});

ProjectsGrid.displayName = 'ProjectsGrid';

// Create a compound component with proper typing
const ProjectsGridWithSkeleton = ProjectsGrid as typeof ProjectsGrid & {
    Skeleton: typeof ProjectsGridSkeleton;
};

// Attach skeleton as static property
ProjectsGridWithSkeleton.Skeleton = ProjectsGridSkeleton;

export default ProjectsGridWithSkeleton;
