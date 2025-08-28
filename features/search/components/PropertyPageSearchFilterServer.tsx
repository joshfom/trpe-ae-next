import React from 'react';
import Link from "next/link";
import { db } from "@/db/drizzle";
import { communityTable } from "@/db/schema/community-table";

interface PropertyPageSearchFilterServerProps {
    offeringType: string;
    searchParams?: URLSearchParams;
    pathname?: string;
}

// Server-side search filter that provides basic filtering with form submission
async function PropertyPageSearchFilterServer({ 
    offeringType, 
    searchParams, 
    pathname 
}: PropertyPageSearchFilterServerProps) {
    // Get current search parameters
    const currentParams = searchParams || new URLSearchParams();
    
    // Fetch communities for the filter dropdown (server-side)
    const communities = await db.query.communityTable.findMany({
        orderBy: (communities, { asc }) => [asc(communities.name)],
        limit: 50 // Limit for performance
    });

    // Get current filters from URL
    const currentCommunity = currentParams.get('community') || '';
    const currentMinPrice = currentParams.get('minPrice') || '';
    const currentMaxPrice = currentParams.get('maxPrice') || '';
    const currentBedrooms = currentParams.get('bedrooms') || '';
    const currentPropertyType = currentParams.get('propertyType') || '';

    // Build form action URL
    const formAction = pathname || `/dubai/properties/residential/${offeringType}`;

    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-4">
                <form method="GET" action={formAction} className="space-y-4">
                    {/* Mobile-first responsive grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        
                        {/* Community Filter */}
                        <div className="flex flex-col">
                            <label htmlFor="community" className="text-sm font-medium text-gray-700 mb-1">
                                Community
                            </label>
                            <select 
                                name="community" 
                                id="community"
                                defaultValue={currentCommunity}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Communities</option>
                                {communities.map((community) => (
                                    <option key={community.id} value={community.slug}>
                                        {community.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div className="flex flex-col">
                            <label htmlFor="minPrice" className="text-sm font-medium text-gray-700 mb-1">
                                Min Price
                            </label>
                            <select 
                                name="minPrice" 
                                id="minPrice"
                                defaultValue={currentMinPrice}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">No Min</option>
                                <option value="100000">AED 100k</option>
                                <option value="500000">AED 500k</option>
                                <option value="1000000">AED 1M</option>
                                <option value="2000000">AED 2M</option>
                                <option value="5000000">AED 5M</option>
                                <option value="10000000">AED 10M</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="maxPrice" className="text-sm font-medium text-gray-700 mb-1">
                                Max Price
                            </label>
                            <select 
                                name="maxPrice" 
                                id="maxPrice"
                                defaultValue={currentMaxPrice}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">No Max</option>
                                <option value="500000">AED 500k</option>
                                <option value="1000000">AED 1M</option>
                                <option value="2000000">AED 2M</option>
                                <option value="5000000">AED 5M</option>
                                <option value="10000000">AED 10M</option>
                                <option value="20000000">AED 20M</option>
                            </select>
                        </div>

                        {/* Bedrooms */}
                        <div className="flex flex-col">
                            <label htmlFor="bedrooms" className="text-sm font-medium text-gray-700 mb-1">
                                Bedrooms
                            </label>
                            <select 
                                name="bedrooms" 
                                id="bedrooms"
                                defaultValue={currentBedrooms}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Any</option>
                                <option value="0">Studio</option>
                                <option value="1">1 Bed</option>
                                <option value="2">2 Bed</option>
                                <option value="3">3 Bed</option>
                                <option value="4">4 Bed</option>
                                <option value="5">5+ Bed</option>
                            </select>
                        </div>

                        {/* Search Button */}
                        <div className="flex flex-col justify-end">
                            <button 
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Clear Filters Link */}
                    {(currentCommunity || currentMinPrice || currentMaxPrice || currentBedrooms) && (
                        <div className="flex justify-start">
                            <Link 
                                href={formAction}
                                className="text-sm text-gray-600 hover:text-gray-800 underline"
                            >
                                Clear all filters
                            </Link>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default PropertyPageSearchFilterServer;
