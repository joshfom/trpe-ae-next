"use client"
import React from 'react';
import Link from "next/link";
import {useGetAgents} from "@/features/agents/api/use-get-agents";
import {Skeleton} from "@/components/ui/skeleton";

function AgentList() {

    const {data: agents, isLoading} = useGetAgents()

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
                    <div key={agent.id} className="flex flex-col pb-3 bg-white items-center">
                        <Link href={`/our-team/${agent.slug}`}>
                            <span className="sr-only">View agent</span>
                            <div className="relative w-full h-96 rounded-3xl overflow-hidden">
                                <img 
                                    src={agent.avatarUrl || '/images/defaults/agent.jpg'}
                                    alt={`${agent.firstName} ${agent.lastName}`}
                                    className="object-cover absolute inset-0 w-full h-full"
                                />
                            </div>
                        </Link>
                        <h2 className="text-lg py-2 px-3">
                            <Link href={`/our-team/${agent.slug}`}>
                                {agent.firstName + ' ' + agent.lastName}
                            </Link>
                        </h2>
                    </div>
                ))
            }
        </div>
    );
}

export default AgentList;