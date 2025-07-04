"use client"
import React, { memo, useMemo } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAgents } from "@/features/agents/api/use-get-agents";

// Define Agent interface
interface Agent {
    id: string;
    firstName: string;
    lastName: string;
    slug: string;
    avatarUrl?: string;
}

// Memoized skeleton component for loading state
const AgentListSkeleton = memo(() => (
    <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-4">
                <Skeleton className="h-96 w-full rounded-3xl bg-slate-900/20" />
                <div className="flex justify-center">
                    <Skeleton className="h-4 w-2/3 bg-slate-900/20" />
                </div>
            </div>
        ))}
    </div>
));

AgentListSkeleton.displayName = 'AgentListSkeleton';

// Memoized agent card component
const AgentCard = memo<{ agent: Agent }>(({ agent }) => {
    // Memoize computed values
    const agentUrl = useMemo(() => `/our-team/${agent.slug}`, [agent.slug]);
    const agentName = useMemo(() => `${agent.firstName} ${agent.lastName}`, [agent.firstName, agent.lastName]);
    const avatarSrc = useMemo(() => agent.avatarUrl || '/images/defaults/agent.jpg', [agent.avatarUrl]);

    return (
        <article className="flex flex-col pb-3 bg-white items-center">
            <Link href={agentUrl}>
                <span className="sr-only">View {agentName}</span>
                <div className="relative w-full h-96 rounded-3xl overflow-hidden">
                    <Image 
                        src={avatarSrc}
                        alt={agentName}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                </div>
            </Link>
            <h2 className="text-lg py-2 px-3 text-center hover:text-blue-600 transition-colors">
                <Link href={agentUrl}>
                    {agentName}
                </Link>
            </h2>
        </article>
    );
});

AgentCard.displayName = 'AgentCard';

const AgentList = memo(() => {
    const { data, isLoading, isError, error } = useGetAgents();

    // Memoize processed agents data
    const processedAgents = useMemo(() => {
        if (!data) return [];
        
        return data.map((agent: any): Agent => ({
            id: agent.id,
            firstName: agent.firstName || '',
            lastName: agent.lastName || '',
            slug: agent.slug,
            avatarUrl: agent.avatarUrl
        }));
    }, [data]);

    if (isLoading) {
        return <AgentListSkeleton />;
    }

    if (isError) {
        return (
            <div className="py-6 text-center">
                <p className="text-red-500">Error loading agents: {error?.message}</p>
            </div>
        );
    }

    if (!processedAgents || processedAgents.length === 0) {
        return (
            <div className="py-6 text-center">
                <p className="text-gray-500">No agents found</p>
            </div>
        );
    }

    return (
        <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processedAgents.map((agent: Agent) => (
                <AgentCard key={agent.id} agent={agent} />
            ))}
        </div>
    );
});

AgentList.displayName = 'AgentList';

// Create a compound component with proper typing
const AgentListWithSkeleton = AgentList as typeof AgentList & {
    Skeleton: typeof AgentListSkeleton;
};

// Attach skeleton as static property
AgentListWithSkeleton.Skeleton = AgentListSkeleton;

export default AgentListWithSkeleton;