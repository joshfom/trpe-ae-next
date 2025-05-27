'use client'

import React, { useEffect } from 'react';
import MainSearch from '@/features/search/MainSearch';

interface SearchEnhancementProps {
    mode?: 'rental' | 'sale' | 'general' | 'off-plan';
}

/**
 * Progressive enhancement wrapper for MainSearch
 * This component replaces the server-rendered search with the full interactive version
 */
function SearchEnhancement({ mode = 'general' }: SearchEnhancementProps) {
    useEffect(() => {
        // Hide the server-rendered search and show the interactive one
        const serverSearch = document.querySelector('[data-server-search]');
        const clientSearch = document.querySelector('[data-client-search]');
        
        if (serverSearch && clientSearch) {
            serverSearch.classList.add('hidden');
            clientSearch.classList.remove('hidden');
        }
    }, []);

    return (
        <div data-client-search className="hidden max-w-4xl mx-auto w-full">
            <MainSearch mode={mode} />
        </div>
    );
}

export default SearchEnhancement;
