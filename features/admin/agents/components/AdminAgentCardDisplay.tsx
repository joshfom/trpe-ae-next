"use client"
import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Switch } from "@/components/ui/switch";
import { Crown, User, Edit3 } from "lucide-react";
import { employeeTable } from "@/db/schema/employee-table";
import { useUpdateAgent } from "../api/use-update-agent";
import { useForm } from "react-hook-form";
import { AgentFormSchema } from '../form-schema/agent-form-schema';
import { z } from "zod";
import Link from 'next/link';

type EmployeeType = typeof employeeTable.$inferSelect;

interface AdminAgentCardProps {
    agent: EmployeeType
}

const formSchema = AgentFormSchema;
type FormValues = z.infer<typeof formSchema>;

const AdminAgentCard = memo(({ agent }: AdminAgentCardProps) => {
    const router = useRouter();
    const mutation = useUpdateAgent(agent.id);
    
    // Form for quick updates (like luxe toggle)
    const form = useForm<FormValues>({
        defaultValues: {
            firstName: agent.firstName || '',
            lastName: agent.lastName || '',
            email: agent.email || '',
            phone: agent.phone || '',
            title: agent.title || '',
            bio: agent.bio || '',
            rera: agent.rera || '',
            avatarUrl: agent.avatarUrl || '',
            isVisible: agent.isVisible || false,
            isLuxe: agent.isLuxe || false,
            order: agent.order || 100,
        }
    });

    const handleEditClick = useCallback(() => {
        router.push(`/admin/agents/${agent.id}/edit`);
    }, [router, agent.id]);

    // Quick toggle for luxe status
    const handleLuxeToggle = useCallback((checked: boolean) => {
        const values = form.getValues();
        mutation.mutate({ ...values, isLuxe: checked });
    }, [form, mutation]);

    // Quick toggle for visibility
    const handleVisibilityToggle = useCallback((checked: boolean) => {
        const values = form.getValues();
        mutation.mutate({ ...values, isVisible: checked });
    }, [form, mutation]);

    const displayName = `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || 'Unnamed Agent';

    return (
        <div className="bg-white rounded-xl border flex flex-col justify-between relative hover:shadow-md transition-shadow">
            <div className="flex flex-col">
                <div className="relative h-60">
                    {agent.avatarUrl ? (
                        <img
                            className="rounded-t-xl h-60 object-cover w-full hover:scale-105 ease-in-out transition-all duration-150"
                            src={agent.avatarUrl}
                            alt={displayName}
                        />
                    ) : (
                        <div className="rounded-t-xl h-60 bg-gray-100 flex items-center justify-center">
                            <User size={48} className="text-gray-400" />
                        </div>
                    )}
                    
                    {/* Luxe badge */}
                    {agent.isLuxe && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full">
                            <Crown size={16} />
                        </div>
                    )}
                    
                    {/* Quick toggles */}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">Luxe</span>
                            <Switch
                                checked={agent.isLuxe || false}
                                onCheckedChange={handleLuxeToggle}
                                disabled={mutation.isLoading}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">Visible</span>
                            <Switch
                                checked={agent.isVisible || false}
                                onCheckedChange={handleVisibilityToggle}
                                disabled={mutation.isLoading}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="px-4 py-3 flex-1">
                    <h2 className="font-bold text-lg">{displayName}</h2>
                    <p className="text-sm text-muted-foreground">
                        {agent.title || 'Agent'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {agent.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {agent.isLuxe ? 'Luxe Advisor' : 'Standard Agent'} • {agent.isVisible ? 'Visible' : 'Hidden'}
                    </p>
                    {agent.rera && (
                        <p className="text-xs text-muted-foreground mt-1">
                            RERA: {agent.rera}
                        </p>
                    )}
                </div>
                
                <div className="flex justify-end items-end px-4 pb-4">
                    <Link href={`/admin/agents/${agent.id}/edit`}
                        className="flex items-center gap-2"
                    >
                        <Edit3 size={14} />
                        Edit Agent
                    </Link>
                </div>
            </div>
        </div>
    );
});

AdminAgentCard.displayName = 'AdminAgentCard';

export default AdminAgentCard;
