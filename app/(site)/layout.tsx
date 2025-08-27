// Server component that manages the layout with SSR optimization
import React from 'react';
import SiteTopNavigationSSR from '@/components/site-top-navigation-ssr';
import SiteFooterWrapper from '@/components/SiteFooterWrapper';
import ClientOnlyEnhancements from './client-only-enhancements';

interface LayoutProps {
    children: React.ReactNode
}

function Layout({children}: LayoutProps) {
    return (
        <>
            <SiteTopNavigationSSR />
            {/* Use custom mobile navigation offset utility */}
            <div className="mobile-content-offset">
                {children}
            </div>
            <SiteFooterWrapper />
            <ClientOnlyEnhancements />
        </>
    );
}

export default Layout;