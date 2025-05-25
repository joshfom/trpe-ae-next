"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import {Skeleton} from "@/components/ui/skeleton";
import { getAgentsAction } from "@/actions/agents/get-agents-action";
import { toast } from "sonner";

// Define Agent interface
interface Agent {
    id: string;
    firstName: string;
    lastName: string;
    slug: string;
    avatarUrl?: string;
}

function AgentList() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            setIsLoading(true);
            try {
                const result = await getAgentsAction();
                if (result.success) {
                    // Type assertion to ensure data conforms to Agent[]
                    const typedAgents: Agent[] = result.data.map((agent: any) => ({
                        id: agent.id,
                        firstName: agent.firstName || '',
                        lastName: agent.lastName || '',
                        slug: agent.slug,
                        avatarUrl: agent.avatarUrl
                    }));
                    setAgents(typedAgents);
                } else {
                    toast.error(result.error || 'Failed to fetch agents');
                }
            } catch (error) {
                toast.error('An error occurred while fetching agents');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgents();
    }, []);

    return (
        <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {
                isLoading && (
                    //loop though 8 items to show skeleton
                    Array.from({length: 8}).map((_, index) => (
                        <div key={index} className="space-y-4">
                            <Skeleton className="h-96 w-full rounded-3xl bg-slate-900/20 "/>
                            <div className={'flex justify-center'}>
                                <Skeleton className="h-4 w-2/3 bg-slate-900/20"/>
                            </div>
                        </div>
                    ))
                )
            }
            {
                agents?.map((agent) => (
                    <article key={agent.id} className="flex flex-col pb-3 bg-white items-center">
                        <Link href={`/our-team/${agent.slug}`}>
                            <span className="sr-only">View agent</span>
                            <div className="relative w-full h-96 rounded-3xl overflow-hidden">
                                <Image 
                                    src={agent.avatarUrl || '/images/defaults/agent.jpg'}
                                    alt={`${agent.firstName} ${agent.lastName}`}
                                    fill
                                    className="object-cover"
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                />
                            </div>
                        </Link>
                        <h2 className="text-lg py-2 px-3">
                            <Link href={`/our-team/${agent.slug}`}>
                                {agent.firstName + ' ' + agent.lastName}
                            </Link>
                        </h2>
                    </article>
                ))
            }
        </div>
    );
}

export default AgentList;