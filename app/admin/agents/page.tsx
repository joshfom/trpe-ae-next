"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import AdminAgents from "@/features/admin/agents/components/AdminAgents";

function AdminAgentsPage() {
    const router = useRouter();

    return (
        <div className={'space-y-8'}>
            <div className="flex justify-between py-8 px-8">
                <div>
                    <h2 className="text-2xl">Agents</h2>
                    <p className="text-muted-foreground">Manage agent profiles and settings</p>
                </div>
                <nav className="flex items-center space-x-4">
                    <Button 
                        className={'py-2'}
                        onClick={() => router.push('/admin/agents/new')}
                    >
                        Add Agent
                    </Button>
                </nav>
            </div>

            <AdminAgents />
        </div>
    );
}

export default AdminAgentsPage;
