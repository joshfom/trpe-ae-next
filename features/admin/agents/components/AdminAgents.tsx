"use client"
import React from 'react';
import AdminAgentCardDisplay from './AdminAgentCardDisplay';
import { useGetAgents } from '../api/use-get-agents';
import { employeeTable } from "@/db/schema/employee-table";

type EmployeeType = typeof employeeTable.$inferSelect;

function AdminAgents() {
    const { data: agents, isLoading, error } = useGetAgents();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Loading agents...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500">Error loading agents: {error.message}</div>
            </div>
        );
    }

    if (!agents || agents.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">No agents found</div>
            </div>
        );
    }

    return (
        <div className={'px-8'}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {agents.map((agent: EmployeeType) => (
                    <AdminAgentCardDisplay key={agent.id} agent={agent} />
                ))}
            </div>
        </div>
    );
}

export default AdminAgents;
