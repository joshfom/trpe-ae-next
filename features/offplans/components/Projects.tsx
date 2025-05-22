import React from 'react';
import {ChevronRight, Home} from "lucide-react";
import Link from "next/link";
import ProjectsGrid from "@/features/offplans/components/ProjectsGrid";
import {useGetProjects} from "@/features/offplans/api/use-get-projects";

export default async function Projects() {
    let listings: ProjectType[] = [];
    
    try {
        const projectData = await useGetProjects();
        if (Array.isArray(projectData)) {
            // Properly convert to unknown first before casting to ProjectType
            listings = projectData as unknown as ProjectType[];
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        // Return empty array if fetch fails - this prevents build failures
    }

    return (
        <>
            <div className="flex justify-between items-center max-w-7xl mx-auto ">
                <div className="flex space-x-2 items-center mt-2">
                    <Link href={'/'} className={'text-white group'}>
                        <span className="sr-only">
                            Go to Home Page
                        </span>
                        <Home size={20} className={'text-slate-500 group-hover:text-white stroke-1'}/>
                    </Link>
                    <ChevronRight size={18} className={'text-slate-300'}/>
                </div>
            </div>

            <div className={'max-w-7xl lg:px-0 mx-auto grid py-6  '}>
                <div className="flex space-x-2 py-6 items-center justify-between">
                </div>
                <ProjectsGrid listings={listings}/>
            </div>
        </>
    );
}