import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CommunityFilterType } from '@/types/community';

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
        <div data-server-search className="w-full max-w-4xl mx-auto">
            <div className="relative">
                <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-lg shadow-lg p-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            placeholder={placeholderText}
                            className="pl-10 border-0 focus:ring-0 text-lg h-12"
                            disabled // Disabled in server version - will be enhanced client-side
                        />
                    </div>
                    <Link href={`/properties/${mode === 'rental' ? 'for-rent' : mode === 'sale' ? 'for-sale' : 'for-sale'}`}>
                        <Button 
                            size="lg" 
                            className="w-full sm:w-auto h-12 px-8 bg-slate-900 hover:bg-slate-800"
                        >
                            <Search className="w-5 h-5 mr-2" />
                            Search
                        </Button>
                    </Link>
                </div>
                
                {/* Popular searches - server rendered */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Link 
                            href="/properties/for-sale?community=downtown-dubai" 
                            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                        >
                            Downtown Dubai
                        </Link>
                        <Link 
                            href="/properties/for-sale?community=dubai-marina" 
                            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                        >
                            Dubai Marina
                        </Link>
                        <Link 
                            href="/properties/for-sale?community=jumeirah-beach-residence" 
                            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                        >
                            JBR
                        </Link>
                        <Link 
                            href="/properties/for-sale?community=palm-jumeirah" 
                            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                        >
                            Palm Jumeirah
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainSearchServer;
