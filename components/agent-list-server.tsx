import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { db } from "@/db/drizzle";
import { employeeTable } from "@/db/schema/employee-table";
import { eq, and } from "drizzle-orm";

// Define Agent interface
interface Agent {
    id: string;
    firstName: string | null;
    lastName: string | null;
    slug: string;
    avatarUrl: string | null;
    title: string | null;
    bio: string | null;
}

// Server-side agent card component
const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
    const agentUrl = `/our-team/${agent.slug}`;
    const agentName = `${agent.firstName || ''} ${agent.lastName || ''}`.trim();
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
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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

// Server-side agent list component
const AgentListServer: React.FC = async () => {
    try {
        // Fetch agents directly from database
        const agents = await db
            .select({
                id: employeeTable.id,
                firstName: employeeTable.firstName,
                lastName: employeeTable.lastName,
                slug: employeeTable.slug,
                avatarUrl: employeeTable.avatarUrl,
                title: employeeTable.title,
                bio: employeeTable.bio,
            })
            .from(employeeTable)
            .where(
                and(
                    eq(employeeTable.isVisible, true),
                    eq(employeeTable.type, 'agent')
                )
            )
            .orderBy(employeeTable.order);

        if (!agents || agents.length === 0) {
            return (
                <div className="py-6 text-center">
                    <p className="text-gray-500">No agents found</p>
                </div>
            );
        }

        return (
            <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {agents.map((agent: Agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                ))}
            </div>
        );
    } catch (error) {
        console.error("Error fetching agents:", error);
        return (
            <div className="py-6 text-center">
                <p className="text-red-500">Error loading agents. Please try again later.</p>
            </div>
        );
    }
};

export default AgentListServer;