// Server component that manages the layout with SSR optimization
import React, { Suspense } from 'react';
import SiteLayoutClient from './site-layout-client';
import { NavigationSkeleton, FooterSkeleton } from '@/components/ssr-skeletons';

interface LayoutProps {
    children: React.ReactNode
}

function Layout({children}: LayoutProps) {
    return (
       <SiteLayoutClient>
                <div className="">
                    {children}
                </div>
            </SiteLayoutClient>
    );
}

export default Layout;