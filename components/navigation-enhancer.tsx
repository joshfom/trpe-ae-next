"use client"
import React, { useEffect, useState } from 'react';
import SiteTopNavigation from '@/components/site-top-navigation';

/**
 * Client-side navigation enhancer
 * Replaces SSR navigation with full CSR navigation when JavaScript loads
 */
export default function NavigationEnhancer() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Hide SSR navigation and show CSR navigation
        const ssrNav = document.querySelector('[data-ssr-nav]') as HTMLElement;
        if (ssrNav) {
            ssrNav.style.display = 'none';
        }
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div data-csr-nav>
            <SiteTopNavigation />
        </div>
    );
}
