import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CommunityFilterType } from '@/types/community';
import { pushToDataLayer } from '@/lib/gtm';
import PopularSearchLink from './components/PopularSearchLink';
import SearchInputTracker from './components/SearchInputTracker';

interface MainSearchServerProps {
    mode?: 'rental' | 'sale' | 'general' | 'off-plan';
    communities?: CommunityFilterType[];
}

// Server component version of MainSearch for SSR
function MainSearchServer({ mode = 'general' }: MainSearchServerProps) {

    const placeholderText = mode === 'rental' 
        ? 'Search for rental properties...' 
        : mode === 'sale' 
        ? 'Search for properties for sale...'
        : 'Search properties, communities, or locations...';

    return (
        <div data-server-search className="w-full lg:w-[70%] max-w-4xl mx-auto">
            <div className="relative">
                <div className="hidden lg:flex gap-6 bg-white rounded-full shadow-lg p-3 pl-8 items-center">
                    <SearchInputTracker 
                        placeholder={placeholderText}
                        searchLocation="homepage"
                        mode={mode}
                    />
                    <Link href={`/properties/${mode === 'rental' ? 'for-rent' : mode === 'sale' ? 'for-sale' : 'for-sale'}`}>
                        <Button 
                            size="lg" 
                            className="bg-black text-white py-3 w-40"
                        >
                            <Search className="h-5 w-5 text-white stroke-1 mr-2"/>
                            Search
                        </Button>
                    </Link>
                </div>
                
                {/* Mobile search - matches CSR design */}
                <div className="lg:hidden">
                    <div className="flex flex-col justify-center items-center">
                        <div className="relative w-full">
                            <Input
                                placeholder="Search Properties"
                                className="w-full rounded-full px-8 py-3 border-0 focus-visible:ring-0"
                                disabled
                            />
                            <Search className="absolute top-3 right-4 h-6 w-6 stroke-1 text-gray-700"/>
                        </div>
                    </div>
                </div>
                
                {/* Popular searches - server rendered */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <PopularSearchLink 
                            href="/properties/for-sale?community=downtown-dubai" 
                            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                            searchTerm="Downtown Dubai"
                        >
                            Downtown Dubai
                        </PopularSearchLink>
                        <PopularSearchLink 
                            href="/properties/for-sale?community=dubai-marina" 
                            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                            searchTerm="Dubai Marina"
                        >
                            Dubai Marina
                        </PopularSearchLink>
                        <PopularSearchLink 
                            href="/properties/for-sale?community=jumeirah-beach-residence" 
                            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                            searchTerm="JBR"
                        >
                            JBR
                        </PopularSearchLink>
                        <PopularSearchLink 
                            href="/properties/for-sale?community=palm-jumeirah" 
                            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                            searchTerm="Palm Jumeirah"
                        >
                            Palm Jumeirah
                        </PopularSearchLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainSearchServer;
