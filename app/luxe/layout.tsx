'use client'

import React from 'react';
import LuxeTopNavigation from '@/components/luxe/luxe-top-navigation';
import LuxeFooter from '@/components/luxe/luxe-footer';

interface LuxeLayoutProps {
    children: React.ReactNode
}

// This is a client component wrapper for layout elements that need client-side functionality
function LuxeLayout({ children }: LuxeLayoutProps) {
    return (
        <>
            <LuxeTopNavigation />
            {children}
            <LuxeFooter />
        </>
    );
}

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(LuxeLayout);
