'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { buildPropertySearchUrl } from './hooks/path-search-helper';
import { CommunityFilterType, toCommunityFilterType } from "@/types/community";
import { trackSearchFormSubmit } from "@/lib/gtm-events";

interface PropertyPageSearchFilterClientProps {
    offeringType: string;
    communities: Array<{
        id: string;
        name: string | null;
        label?: string | null;
        slug: string;
    }>;
    propertyTypes: Array<{
        id: string;
        name: string | null;
        slug: string;
    }>;
}

function PropertyPageSearchFilterClient({ 
    offeringType, 
    communities, 
    propertyTypes 
}: PropertyPageSearchFilterClientProps) {
    const router = useRouter();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        
        // Extract form values
        const search = formData.get('search') as string;
        const community = formData.get('community') as string;
        const propertyType = formData.get('propertyType') as string;
        const minPrice = formData.get('minPrice') as string;
        const maxPrice = formData.get('maxPrice') as string;
        const bedrooms = formData.get('bedrooms') as string;
        const bathrooms = formData.get('bathrooms') as string;

        // Track the search form submission with GTM
        trackSearchFormSubmit({
            form_id: "property-search-filter-client",
            form_name: "Property Search Filter",
            form_destination: window.location.origin,
            form_length: [search, community, propertyType, minPrice, maxPrice, bedrooms, bathrooms]
                .filter(val => val && val !== 'all' && val !== 'no-min' && val !== 'no-max' && val !== 'any').length,
            search_term: search || "",
            filters: {
                community: community !== 'all' ? community : undefined,
                propertyType: propertyType !== 'all' ? propertyType : undefined,
                minPrice: minPrice !== 'no-min' ? minPrice : undefined,
                maxPrice: maxPrice !== 'no-max' ? maxPrice : undefined,
                bedrooms: bedrooms !== 'any' ? bedrooms : undefined,
                bathrooms: bathrooms !== 'any' ? bathrooms : undefined
            },
            send_to: "AW-11470392777"
        });

        // Find selected community for path building
        const selectedCommunities = community && community !== 'all' 
            ? communities
                .filter(c => c.slug === community)
                .map(c => toCommunityFilterType(c))
            : [];

        // Build search parameters
        const searchParams = {
            query: search || undefined,
            unitType: propertyType && propertyType !== 'all' ? propertyType : undefined,
            minPrice: minPrice && minPrice !== 'no-min' ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice && maxPrice !== 'no-max' ? parseInt(maxPrice) : undefined,
            bed: bedrooms && bedrooms !== 'any' ? parseInt(bedrooms) : undefined,
            bath: bathrooms && bathrooms !== 'any' ? parseInt(bathrooms) : undefined,
        };

        // Build the URL using the path-based helper
        const searchUrl = buildPropertySearchUrl({
            searchType: offeringType,
            selectedCommunities,
            formData: searchParams
        });

        // Navigate to the search URL
        router.push(searchUrl);
    };

    return (
        <div className="w-full bg-white border-b sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                name="search"
                                placeholder="Search properties, communities..."
                                className="pl-10 h-10"
                            />
                        </div>
                    </div>

                    {/* Community Filter */}
                    <Select name="community">
                        <SelectTrigger className="w-[200px] h-10">
                            <SelectValue placeholder="All Communities" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Communities</SelectItem>
                            {communities.map((community) => (
                                <SelectItem key={community.id} value={community.slug}>
                                    {community.label || community.name || community.slug}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Property Type Filter */}
                    <Select name="propertyType">
                        <SelectTrigger className="w-[200px] h-10">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {propertyTypes.map((type) => (
                                <SelectItem key={type.id} value={type.slug}>
                                    {type.name || type.slug}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Price Range */}
                    <Select name="minPrice">
                        <SelectTrigger className="w-[150px] h-10">
                            <SelectValue placeholder="Min Price" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="no-min">No Min</SelectItem>
                            <SelectItem value="500000">500K</SelectItem>
                            <SelectItem value="1000000">1M</SelectItem>
                            <SelectItem value="2000000">2M</SelectItem>
                            <SelectItem value="5000000">5M</SelectItem>
                            <SelectItem value="10000000">10M</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select name="maxPrice">
                        <SelectTrigger className="w-[150px] h-10">
                            <SelectValue placeholder="Max Price" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="no-max">No Max</SelectItem>
                            <SelectItem value="1000000">1M</SelectItem>
                            <SelectItem value="2000000">2M</SelectItem>
                            <SelectItem value="5000000">5M</SelectItem>
                            <SelectItem value="10000000">10M</SelectItem>
                            <SelectItem value="20000000">20M+</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Bedrooms */}
                    <Select name="bedrooms">
                        <SelectTrigger className="w-[120px] h-10">
                            <SelectValue placeholder="Beds" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                            <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Bathrooms */}
                    <Select name="bathrooms">
                        <SelectTrigger className="w-[120px] h-10">
                            <SelectValue placeholder="Baths" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                            <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Search Button */}
                    <Button type="submit" className="h-10 px-6">
                        <Search className="w-4 h-4 mr-2" />
                        Search
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default PropertyPageSearchFilterClient;
