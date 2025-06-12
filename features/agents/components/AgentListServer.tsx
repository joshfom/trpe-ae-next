import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { getAgentsAction } from "@/actions/agents/get-agents-action";
import { Skeleton } from "@/components/ui/skeleton";

// Define Agent interface
interface Agent {
    id: string;
    firstName: string;
    lastName: string;
    slug: string;
    avatarUrl?: string;
}

// Skeleton component for loading state (can be used by client components)
export const AgentListSkeleton = () => (
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
);

// Agent card component
const AgentCard = ({ agent }: { agent: Agent }) => {
    const agentUrl = `/our-team/${agent.slug}`;
    const agentName = `${agent.firstName} ${agent.lastName}`;
    const avatarSrc = agent.avatarUrl || '/images/defaults/agent.jpg';

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
};

// Server component for AgentList
export default async function AgentListServer() {
    try {
        // Fetch agents on the server
        const result = await getAgentsAction();

        if (!result.success) {
            return (
                <div className="py-6 text-center">
                    <p className="text-red-500">Error loading agents: {result.error}</p>
                </div>
            );
        }

        // Process agents data
        const agents: Agent[] = (result.data || []).map((agent: any) => ({
            id: agent.id,
            firstName: agent.firstName || '',
            lastName: agent.lastName || '',
            slug: agent.slug,
            avatarUrl: agent.avatarUrl
        }));

        if (agents.length === 0) {
            return (
                <div className="py-6 text-center">
                    <p className="text-gray-500">No agents found</p>
                </div>
            );
        }

        return (
            <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {agents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                ))}
            </div>
        );
    } catch (error) {
        console.error('Error in AgentListServer:', error);
        return (
            <div className="py-6 text-center">
                <p className="text-red-500">Error loading agents</p>
            </div>
        );
    }
}
