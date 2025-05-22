import React from 'react';
import type {Metadata} from "next";
import { client } from "@/lib/hono";
import ProjectCardServer from "@/features/offplans/components/ProjectCardServer";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Off-Plan Properties in Dubai | New Projects for Sale - TRPE AE",
    description: "Discover exclusive off-plan properties in Dubai with TRPE. Expert guidance and tailored solutions for your investment journey await you!",
    alternates: {
        canonical: `/off-plan`,
    },
};

async function NewProjectsPage() {
    // Fetch projects directly server-side
    let listings: ProjectType[] = [];
    
    try {
        const response = await client.api.projects.$get();
        if (response.ok) {
            const { data } = await response.json();
            listings = data as unknown as ProjectType[];
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
    }

    return (
        <div>
            <div className="py-12 hidden lg:block bg-black">
            </div>
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
                        {listings.map((listing) => (
                            <ProjectCardServer key={listing.id} project={listing} />
                        ))}
                        
                        {listings.length === 0 && (
                            <div className="col-span-2 text-center py-12">
                                <p className="text-xl">No projects available at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewProjectsPage;