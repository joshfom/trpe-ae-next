import React from 'react';
import LuxeTopNavigation from '@/components/luxe/luxe-top-navigation';
import LuxeFooterSuspense from '@/components/luxe/LuxeFooterSuspense';

interface LuxeLayoutProps {
    children: React.ReactNode
}

// Server component layout with client components for navigation
export default function LuxeLayout({ children }: LuxeLayoutProps) {
    return (
        <>
            <LuxeTopNavigation />
            {children}
            <LuxeFooterSuspense />
        </>
    );
}
