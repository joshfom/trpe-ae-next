'use client';

import { useEffect } from 'react';

/**
 * SearchEnhancer handles the progressive enhancement from SSR to CSR
 * It hides the SSR version and shows the interactive CSR version when JS loads
 */
export default function SearchEnhancer() {
    useEffect(() => {
        // When JS loads, hide SSR version and show CSR version
        const ssrSearch = document.getElementById('ssr-search');
        const csrSearch = document.getElementById('csr-search');
        
        if (ssrSearch && csrSearch) {
            // Hide SSR version
            ssrSearch.style.display = 'none';
            // Show CSR version
            csrSearch.classList.remove('hidden');
        }
    }, []);

    return null; // This component doesn't render anything
}
