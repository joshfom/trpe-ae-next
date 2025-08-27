'use client'

import React from 'react';

import SiteTopNavigation from "@/components/site-top-navigation";
import SiteFooterWrapper from "@/components/SiteFooterWrapper";

interface ClientLayoutProps {
    children: React.ReactNode
}

// This is a client component wrapper for layout elements that need client-side functionality
function SiteLayoutClient({ children }: ClientLayoutProps) {
    return (
        <>
            <SiteTopNavigation />
            {/* Use custom mobile navigation offset utility */}
            <div className="mobile-content-offset">
                {children}
            </div>
            <SiteFooterWrapper />
        </>
    );
}

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(SiteLayoutClient);
