'use client'

import React from 'react';
import SiteFooter from "@/components/site-footer";
import SiteTopNavigation from "@/components/site-top-navigation";
// Use the default export to avoid any confusion
import ClientUtilities from "@/components/client-utils";

interface ClientLayoutProps {
    children: React.ReactNode;
    communities?: any[]; // Add communities prop to match what's passed from parent
}

// This is a client component wrapper for layout elements that need client-side functionality
function SiteLayoutClient({ children, communities = [] }: ClientLayoutProps) {
    // Add an effect to ensure the navigation class is removed if page loads directly
    React.useEffect(() => {
        if (typeof document === 'undefined') return;
        
        try {
            // Make sure navigating class is removed on direct page load
            document.documentElement.classList.remove('navigating');
            
            // Force a repaint to ensure UI is properly updated
            const reflow = document.documentElement.offsetHeight;
            
            // Mark the page as fully loaded for any CSS transitions
            document.documentElement.classList.add('page-loaded');
            
            return () => {
                document.documentElement.classList.remove('page-loaded');
            };
        } catch (error) {
            console.error('Error in SiteLayoutClient effect:', error);
        }
    }, []);
    
    // Use state to track if we're on the client side
    const [isClient, setIsClient] = React.useState(false);
    
    // Set isClient to true when component mounts (client-side only)
    React.useEffect(() => {
        setIsClient(true);
    }, []);
    
    return (
        <div className="site-layout">
            {/* Only render ClientUtilities when on client-side */}
            {isClient && (
                <div className="js-only">
                    <ClientUtilities />
                </div>
            )}
            
            {/* Navigation is included in both JS and no-JS modes */}
            <SiteTopNavigation />
            
            {/* Main content with JS-enabled enhancements when available */}
            <div className="navigation-sensitive properties-content">
                {children}
            </div>
            
            <SiteFooter communities={communities} />
        </div>
    );
}

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(SiteLayoutClient);
