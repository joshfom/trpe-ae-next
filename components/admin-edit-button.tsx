'use client';

import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import AuthWrapper from './auth-wrapper';

interface AdminEditButtonProps {
    href: string;
    label: string;
}

const AdminEditButton: React.FC<AdminEditButtonProps> = ({ href, label }) => {
    return (
        <AuthWrapper>
            {(user) => {
                if (!user) return null;
                
                return (
                    <Link href={href}>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Edit2 className="h-4 w-4" />
                            {label}
                        </Button>
                    </Link>
                );
            }}
        </AuthWrapper>
    );
};

export default AdminEditButton;
