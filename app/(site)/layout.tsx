// Server component that manages the layout with SSR optimization
import React, { Suspense } from 'react';
import SiteLayoutClient from './site-layout-client';
import { NavigationSkeleton, FooterSkeleton } from '@/components/ssr-skeletons';
import { getFooterCommunities } from '@/actions/get-footer-communities-action';

interface LayoutProps {
    children: React.ReactNode
}

async function Layout({children}: LayoutProps) {
    // Fetch communities data on the server side
    const communities = await getFooterCommunities();
    
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white">
                <NavigationSkeleton />
                <div className="flex-1">{children}</div>
                <FooterSkeleton />
            </div>
        }>
            <SiteLayoutClient communities={communities}>
                <div className="">
                    {children}
                </div>
            </SiteLayoutClient>
        </Suspense>
    );
}

export default Layout;