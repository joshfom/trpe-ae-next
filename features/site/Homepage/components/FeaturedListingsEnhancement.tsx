"use client";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for the interactive tabs
const FeaturedListingsTabs = dynamic(() => import('./FeaturedListingsTabs'), {
    ssr: false
});

// This component will receive the data through a data attribute or context
function FeaturedListingsEnhancement() {
    useEffect(() => {
        // Progressive enhancement: switch from server sections to interactive tabs
        const serverSections = document.querySelector('[data-server-featured-sections]');
        const clientTabsContainer = document.querySelector('[data-client-featured-tabs]');
        
        if (serverSections && clientTabsContainer) {
            // Get the data from the server sections before hiding them
            // We need to pass the data to the client component somehow
            // For now, let's just hide server sections and show client container
            serverSections.classList.add('hidden');
            clientTabsContainer.classList.remove('hidden');
        }
    }, []);

    return null; // This component doesn't render anything itself
}

export default FeaturedListingsEnhancement;
