'use client'

import React from 'react';
import SiteFooter from "@/components/site-footer";
import SiteTopNavigation from "@/components/site-top-navigation";

interface ClientLayoutProps {
    children: React.ReactNode
}

// This is a client component wrapper for layout elements that need client-side functionality
function SiteLayoutClient({ children }: ClientLayoutProps) {
    return (
        <>
            <SiteTopNavigation />
            {children}
            <SiteFooter />
        </>
    );
}

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(SiteLayoutClient);
