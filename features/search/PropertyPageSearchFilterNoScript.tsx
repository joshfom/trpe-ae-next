import React, { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { db } from "@/db/drizzle";
import { asc } from "drizzle-orm";
import { communityTable } from "@/db/schema/community-table";
import { propertyTypeTable } from "@/db/schema/property-type-table";
import { Search } from "lucide-react";

interface PropertyPageSearchFilterNoScriptProps {
    offeringType: string;
    currentParams?: {
        search?: string;
        community?: string;
        propertyType?: string;
        minPrice?: string;
        maxPrice?: string;
        bedrooms?: string;
        bathrooms?: string;
    };
}

// Cached data fetching for server component
const getFilterData = cache(async () => {
    return unstable_cache(
        async () => {
            try {
                const [communities, propertyTypes] = await Promise.all([
                    db.query.communityTable.findMany({
                        orderBy: [asc(communityTable.name)],
                        limit: 50, // Limit for performance
                        columns: {
                            id: true,
                            name: true,
                            label: true,
                            slug: true
                        }
                    }),
                    db.query.propertyTypeTable.findMany({
                        orderBy: [asc(propertyTypeTable.name)],
                        columns: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    })
                ]);

                return { communities, propertyTypes };
            } catch (error) {
                console.error('Error fetching filter data:', error);
                return { communities: [], propertyTypes: [] };
            }
        },
        ['property-filter-data-noscript'],
        {
            revalidate: 21600, // 6 hours - filter data changes infrequently
            tags: ['communities', 'property-types', 'filter-data']
        }
    )();
});

// NoScript-friendly server component for property search filter
async function PropertyPageSearchFilterNoScript({ 
    offeringType, 
    currentParams = {} 
}: PropertyPageSearchFilterNoScriptProps) {
    const { communities, propertyTypes } = await getFilterData();

    // Build the action URL based on offering type
    const actionUrl = `/properties/${offeringType}`;

    return (
        <div className="w-full bg-white border-b sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 py-3">
                {/* Use native HTML form with GET method for no-script compatibility */}
                <form method="GET" action={actionUrl} className="flex flex-wrap gap-2 items-center">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                name="search"
                                defaultValue={currentParams.search || ''}
                                placeholder="Search properties, communities..."
                                className="w-full pl-10 h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Community Filter */}
                    <select 
                        name="community" 
                        defaultValue={currentParams.community || 'all'}
                        className="w-[200px] h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="all">All Communities</option>
                        {communities.map((community) => (
                            <option key={community.id} value={community.slug}>
                                {community.label || community.name || community.slug}
                            </option>
                        ))}
                    </select>

                    {/* Property Type Filter */}
                    <select 
                        name="propertyType" 
                        defaultValue={currentParams.propertyType || 'all'}
                        className="w-[200px] h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="all">All Types</option>
                        {propertyTypes.map((type) => (
                            <option key={type.id} value={type.slug}>
                                {type.name || type.slug}
                            </option>
                        ))}
                    </select>

                    {/* Min Price */}
                    <select 
                        name="minPrice" 
                        defaultValue={currentParams.minPrice || 'no-min'}
                        className="w-[150px] h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="no-min">No Min</option>
                        <option value="500000">500K</option>
                        <option value="1000000">1M</option>
                        <option value="2000000">2M</option>
                        <option value="5000000">5M</option>
                        <option value="10000000">10M</option>
                    </select>

                    {/* Max Price */}
                    <select 
                        name="maxPrice" 
                        defaultValue={currentParams.maxPrice || 'no-max'}
                        className="w-[150px] h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="no-max">No Max</option>
                        <option value="1000000">1M</option>
                        <option value="2000000">2M</option>
                        <option value="5000000">5M</option>
                        <option value="10000000">10M</option>
                        <option value="20000000">20M+</option>
                    </select>

                    {/* Bedrooms */}
                    <select 
                        name="bedrooms" 
                        defaultValue={currentParams.bedrooms || 'any'}
                        className="w-[120px] h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="any">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                    </select>

                    {/* Bathrooms */}
                    <select 
                        name="bathrooms" 
                        defaultValue={currentParams.bathrooms || 'any'}
                        className="w-[120px] h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="any">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                    </select>

                    {/* Search Button */}
                    <button 
                        type="submit" 
                        className="h-10 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PropertyPageSearchFilterNoScript;
