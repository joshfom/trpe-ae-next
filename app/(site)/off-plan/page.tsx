import React, { memo } from 'react';
import type {Metadata} from "next";
import {db} from "@/db/drizzle";
import Link from "next/link";
import {ChevronRight, Home} from "lucide-react";
import { unstable_cache } from "next/cache";
import { desc } from "drizzle-orm";
import { offplanTable } from "@/db/schema/offplan-table";
import ProjectCardServer from "@/features/offplans/components/ProjectCardServer";

// Cached function to get projects with proper cache tags
const getProjects = unstable_cache(
    async (): Promise<any[]> => {
        try {
            const data = await db.query.offplanTable.findMany({
                orderBy: [desc(offplanTable.createdAt)],
                with: {
                    developer: true,
                    community: true,
                    images: true,
                },
                limit: 15,
            });
            return data;
        } catch (error) {
            console.error("Error fetching projects:", error);
            return [];
        }
    },
    ['projects-list'],
    {
        revalidate: 1800, // Cache for 30 minutes
        tags: ['projects', 'projects-list', 'offplan']
    }
);

// Memoized Project Card component
const ProjectCard = memo(({ project }: { project: any }) => (
    <ProjectCardServer project={project} />
));
ProjectCard.displayName = 'ProjectCard';

// Component for rendering project list
const ProjectList = memo(({ projects }: { projects: any[] }) => {
    if (projects.length === 0) {
        return (
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
                    <div className="col-span-2 text-center py-12">
                        <p className="text-xl">No projects available at the moment.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
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
                
                <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </div>
    );
});
ProjectList.displayName = 'ProjectList';

export const metadata: Metadata = {
    title: "Off-Plan Properties in Dubai | New Projects for Sale - TRPE AE",
    description: "Discover exclusive off-plan properties in Dubai with TRPE. Expert guidance and tailored solutions for your investment journey await you!",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/off-plan`,
    },
    openGraph: {
        title: "Off-Plan Properties in Dubai | New Projects for Sale - TRPE AE",
        description: "Discover exclusive off-plan properties in Dubai with TRPE. Expert guidance and tailored solutions for your investment journey await you!",
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_URL}/off-plan`,
    },
    twitter: {
        card: 'summary_large_image',
        title: "Off-Plan Properties in Dubai | New Projects for Sale - TRPE AE",
        description: "Discover exclusive off-plan properties in Dubai with TRPE. Expert guidance and tailored solutions for your investment journey await you!",
    }
};

async function NewProjectsPage() {
    // Fetch projects using cached function for full SSR
    const projects = await getProjects();

    return <ProjectList projects={projects} />;
}

export default NewProjectsPage;