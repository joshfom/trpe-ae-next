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
    
    // Use default image if no avatar URL is provided
    const avatarSrc = agent.avatarUrl || '/images/defaults/agent.jpg';

    return (
        <article className="flex flex-col pb-3 bg-white items-center group">
            <Link href={agentUrl} className="block w-full">
                <span className="sr-only">View {agentName}</span>
                <div className="relative w-full h-96 rounded-3xl overflow-hidden bg-gray-100 shadow-lg">
                    <Image 
                        src={avatarSrc}
                        alt={agentName || 'Agent photo'}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                </div>
            </Link>
            <div className="w-full text-center mt-4 px-2">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    <Link href={agentUrl}>
                        {agentName || 'Team Member'}
                    </Link>
                </h2>
                {agent.title && (
                    <p className="text-sm text-gray-600 mt-1">{agent.title}</p>
                )}
            </div>
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
                <div className="py-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Our team is growing!</h3>
                        <p className="text-gray-500">We&apos;re in the process of updating our team information. Please check back soon.</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {agents.map((agent: Agent) => (
                        <AgentCard key={agent.id} agent={agent} />
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching agents:", error);
        return (
            <div className="py-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load team information</h3>
                    <p className="text-gray-500">We&apos;re experiencing technical difficulties. Please try again later.</p>
                </div>
            </div>
        );
    }
};

export default AgentListServer;