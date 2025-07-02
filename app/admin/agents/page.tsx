"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AdminAgents from "@/features/admin/agents/components/AdminAgents";
import { AddEditAgentSheet } from "@/features/admin/agents/components/AddEditAgentSheet";

function AdminAgentsPage() {
    const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);

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
                        onClick={() => setIsAddAgentOpen(true)}
                    >
                        Add Agent
                    </Button>
                </nav>
            </div>

            <AdminAgents />
            
            <AddEditAgentSheet 
                isOpen={isAddAgentOpen}
                onClose={() => setIsAddAgentOpen(false)}
            />
        </div>
    );
}

export default AdminAgentsPage;
