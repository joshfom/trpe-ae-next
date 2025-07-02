"use client"
import React, { memo } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import LuxeAgentCard from '@/components/luxe/LuxeAgentCard';

// Define LuxeAgent interface
interface LuxeAgent {
    id: string;
    name: string;
    title: string;
    image: string;
    description: string;
    phone?: string;
    email?: string;
    linkedin?: string;
}

interface LuxeAdvisorsListProps {
    agents: LuxeAgent[];
}

// Memoized skeleton component for loading state
const LuxeAdvisorsListSkeleton = memo(() => (
    <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4">
                <Skeleton className="h-96 w-full rounded-xl bg-slate-200" />
                <div className="space-y-2 p-4">
                    <Skeleton className="h-6 w-3/4 bg-slate-200" />
                    <Skeleton className="h-4 w-1/2 bg-slate-200" />
                    <Skeleton className="h-16 w-full bg-slate-200" />
                </div>
            </div>
        ))}
    </div>
));

LuxeAdvisorsListSkeleton.displayName = 'LuxeAdvisorsListSkeleton';

const LuxeAdvisorsList = memo<LuxeAdvisorsListProps>(({ agents }) => {
    if (!agents || agents.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="mb-4">
                        <svg 
                            className="mx-auto h-12 w-12 text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Luxury Advisors Available</h3>
                    <p className="text-gray-500">
                        Our luxury advisory team is currently being updated. Please check back soon or contact us directly for assistance.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {agents.map((agent) => (
                    <div key={agent.id} className="flex justify-center">
                        <LuxeAgentCard
                            name={agent.name}
                            title={agent.title}
                            image={agent.image}
                            description={agent.description}
                            phone={agent.phone}
                            email={agent.email}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
});

LuxeAdvisorsList.displayName = 'LuxeAdvisorsList';

// Create a compound component with proper typing
const LuxeAdvisorsListWithSkeleton = LuxeAdvisorsList as typeof LuxeAdvisorsList & {
    Skeleton: typeof LuxeAdvisorsListSkeleton;
};

// Attach skeleton as static property
LuxeAdvisorsListWithSkeleton.Skeleton = LuxeAdvisorsListSkeleton;

export default LuxeAdvisorsListWithSkeleton;
