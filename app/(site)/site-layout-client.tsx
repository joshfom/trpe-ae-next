import React from 'react';
import SiteFooterWrapper from "@/components/SiteFooterWrapper";
import SiteTopNavigation from "@/components/site-top-navigation";
import ClientEnhancementWrapper from "./client-enhancement-wrapper";

interface ClientLayoutProps {
    children: React.ReactNode
}

// This is now a server component that uses server-side footer
async function SiteLayoutClient({ children }: ClientLayoutProps) {
    return (
        <>
            <SiteTopNavigation />
            {/* Use custom mobile navigation offset utility */}
            <div className="mobile-content-offset">
                {children}
            </div>
            <SiteFooterWrapper />
            {/* Client-side enhancements - Only loaded when JavaScript is available */}
            <ClientEnhancementWrapper />
        </>
    );
}

// Export as server component
export default SiteLayoutClient;
