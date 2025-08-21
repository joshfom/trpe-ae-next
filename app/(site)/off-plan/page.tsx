import React, {cache, Suspense} from 'react';
import type {Metadata} from "next";
import {client} from "@/lib/hono";
import Link from "next/link";
import {ChevronRight, Home} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import for ProjectCardServer to reduce initial bundle size
const ProjectCardServer = dynamic(() => import("@/features/offplans/components/ProjectCardServer"), {
    loading: () => <ProjectCardSkeleton />,
    ssr: true
});

// Skeleton component for loading state
const ProjectCardSkeleton = React.memo(() => (
    <div className="rounded-xl bg-gray-200 animate-pulse">
        <div className="h-96 bg-gray-300 rounded-t-xl"></div>
        <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
    </div>
));
ProjectCardSkeleton.displayName = 'ProjectCardSkeleton';

// Cached project fetching function
const getProjects = cache(async (): Promise<ProjectType[]> => {
    try {
        const response = await client.api.projects.$get();
        if (response.ok) {
            const { data } = await response.json();
            return data as unknown as ProjectType[];
        }
        return [];
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
});

export const metadata: Metadata = {
    title: "Off-Plan Properties in Dubai | New Projects for Sale - TRPE AE",
    description: "Discover exclusive off-plan properties in Dubai with TRPE. Expert guidance and tailored solutions for your investment journey await you!",
    alternates: {
        canonical: `/off-plan`,
    },
};

async function NewProjectsPage() {
    // Fetch projects using cached function
    const listings = await getProjects();

    return (
        <div>
            <div className={'max-w-7xl mx-auto py-12 px-6'}>
                <h1 className={'text-4xl'}>
                    New Projects in Dubai
                </h1>
                
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex space-x-2 items-center mt-2">
                        <Link href={'/'} className={'text-white group'}>
                            <span className="sr-only">
                                Go to Home Page
                            </span>
                            <Home size={20} className={'text-slate-500 group-hover:text-white stroke-1'}/>
                        </Link>
                        <ChevronRight size={18} className={'text-slate-300'}/>
                        <span>Off-Plan Properties</span>
                    </div>
                </div>

                <div className={'max-w-7xl lg:px-0 mx-auto grid py-6'}>
                    <div className="flex space-x-2 py-6 items-center justify-between">
                    </div>
                    
                    <Suspense fallback={
                        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <ProjectCardSkeleton key={index} />
                            ))}
                        </div>
                    }>
                        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
                            {listings.map((listing) => (
                                <ProjectCardServer key={listing.id} project={listing} />
                            ))}
                            
                            {listings.length === 0 && (
                                <div className="col-span-2 text-center py-12">
                                    <p className="text-xl">No projects available at the moment.</p>
                                </div>
                            )}
                        </div>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default NewProjectsPage;