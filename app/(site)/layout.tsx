// Server component that manages the layout with SSR optimization
import React from 'react';
import SiteLayoutClient from './site-layout-client';
// Import the client reference manifest fix
import '@/lib/client-reference-manifest-fix';

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