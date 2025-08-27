'use client';

import { useEffect } from 'react';

/**
 * Progressive enhancement component for search functionality
 * Replaces SSR search with full interactive CSR search when JavaScript loads
 */
export default function SearchEnhancer() {
    useEffect(() => {
        console.log('SearchEnhancer mounting - activating interactive search');
        
        // Hide SSR search and show CSR search with full functionality
        const ssrSearch = document.getElementById('ssr-search');
        const csrSearch = document.getElementById('csr-search');
        
        if (ssrSearch && csrSearch) {
            console.log('Switching from SSR search to CSR search with dropdowns and type switching');
            
            // Hide the SSR version
            ssrSearch.classList.add('hidden');
            
            // Show the CSR version with full interactivity
            csrSearch.classList.remove('hidden');
            
            console.log('Search enhancement complete - interactive features now available');
        } else {
            console.warn('Search elements not found:', { ssrSearch, csrSearch });
        }
    }, []);

    return null; // This component only performs DOM manipulation
}
