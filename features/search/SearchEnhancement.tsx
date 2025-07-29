'use client'

import React, { useEffect } from 'react';
import MainSearch from '@/features/search/MainSearch';
import { pushToDataLayer } from '@/lib/gtm';

interface SearchEnhancementProps {
    mode?: 'rental' | 'sale' | 'general' | 'off-plan';
}

/**
 * Progressive enhancement wrapper for MainSearch
 * This component replaces the server-rendered search with the full interactive version
 */
function SearchEnhancement({ mode = 'general' }: SearchEnhancementProps) {
    useEffect(() => {
        console.log('SearchEnhancement component mounting with mode:', mode);
        console.trace('SearchEnhancement homepage component trace');
        
        // Track search enhancement activation in GTM
        pushToDataLayer({
            event: 'search_enhancement_activated',
            search_mode: mode,
            page_location: 'homepage',
            timestamp: new Date().toISOString()
        });
        
        // Hide the server-rendered search and show the interactive one
        const serverSearch = document.querySelector('[data-server-search]');
        const clientSearch = document.querySelector('[data-client-search]');
        
        if (serverSearch && clientSearch) {
            console.log('Switching from server search to client search on homepage');
            serverSearch.classList.add('hidden');
            clientSearch.classList.remove('hidden');
            
            // Track successful search component switch
            pushToDataLayer({
                event: 'search_component_switched',
                from: 'server',
                to: 'client',
                page_location: 'homepage',
                timestamp: new Date().toISOString()
            });
        } else {
            console.warn('Could not find server or client search elements');
            
            // Track error in GTM
            pushToDataLayer({
                event: 'search_component_error',
                error_type: 'elements_not_found',
                page_location: 'homepage',
                timestamp: new Date().toISOString()
            });
        }
    }, [mode]);

    return (
        <div data-client-search className="hidden max-w-4xl mx-auto w-full">
            <MainSearch mode={mode} />
        </div>
    );
}

export default SearchEnhancement;
