"use client"
import React from 'react';
import { useGetLuxeAgents } from '../api/use-get-luxe-agents';
import AdminAgentCard from '@/features/admin/agents/components/AdminAgentCard';
import { Crown } from 'lucide-react';
import { employeeTable } from "@/db/schema/employee-table";

type EmployeeType = typeof employeeTable.$inferSelect;

function AdminLuxeAdvisors() {
    const { data: luxeAgents, isLoading, error } = useGetLuxeAgents();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Loading luxe advisors...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500">Error loading luxe advisors: {error.message}</div>
            </div>
        );
    }

    if (!luxeAgents || luxeAgents.length === 0) {
        return (
            <div className="px-8">
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <Crown className="h-12 w-12 text-yellow-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Luxe Advisors Yet</h3>
                    <p className="text-gray-500 text-center max-w-md">
                        No agents have been marked as luxe advisors yet. 
                        Go to the regular agents page to mark agents as luxe, or they'll automatically be marked when assigned to luxe properties.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={'px-8'}>
            <div className="mb-6 flex items-center gap-2 text-yellow-600">
                <Crown className="h-5 w-5" />
                <span className="text-sm font-medium">
                    {luxeAgents.length} Luxe Advisor{luxeAgents.length !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {luxeAgents.map((agent: EmployeeType) => (
                    <AdminAgentCard key={agent.id} agent={agent} />
                ))}
            </div>
        </div>
    );
}

export default AdminLuxeAdvisors;
