// Server component that manages the layout with SSR optimization
import React, { Suspense } from 'react';
import SiteLayoutClient from './site-layout-client';
import { NavigationSkeleton, FooterSkeleton } from '@/components/ssr-skeletons';

interface LayoutProps {
    children: React.ReactNode
}

function Layout({children}: LayoutProps) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white">
                <NavigationSkeleton />
                <div className="flex-1">{children}</div>
                <FooterSkeleton />
            </div>
        }>
            <SiteLayoutClient>
                <div className="">
                    {children}
                </div>
            </SiteLayoutClient>
        </Suspense>
    );
}

export default Layout;