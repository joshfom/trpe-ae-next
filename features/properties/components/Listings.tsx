import React, { cache } from 'react';
import ListingsGrid from "@/features/properties/components/ListingsGrid";
import ServerListingsGrid from "@/features/properties/components/ServerListingsGrid";
import Pagination from "@/components/Pagination";
import { getPropertiesServer } from "@/features/properties/api/get-properties-server";
import { getPropertiesByTypeServer } from "@/features/properties/api/get-properties-by-type-server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PropertyType } from "@/types/property";
import { unstable_cache } from 'next/cache';

interface ListingsProps {
    offeringType?: string;
    propertyType?: string;
    searchParams?: { [key: string]: string | string[] | undefined };
    isLandingPage?: boolean;
    page?: string;
    pathname?: string; // Optional prop to pass pathname directly
}

// Enhanced cache with improved caching for property listings
const getPropertiesWithCache = cache(async (params: {
    offeringType?: string;
    propertyType?: string;
    searchParams: URLSearchParams;
    pathname: string;
    page?: string;
}) => {
    // Create cache key based on parameters
    const cacheKey = [
        'properties',
        params.offeringType || 'all',
        params.propertyType || 'all',
        params.page || '1',
        params.searchParams.toString(),
        params.pathname // Include pathname in cache key
    ].filter(Boolean).join('-');

    console.log('Creating cache with key:', cacheKey);
    console.log('Property type for cache:', params.propertyType);

    return unstable_cache(
        async (cacheParams: {
            offeringType?: string;
            propertyType?: string;
            searchParams: URLSearchParams;
            pathname: string;
            page?: string;
        }) => {
            try {
                console.log('Cache miss or revalidating for:', cacheKey);
                return await getPropertiesServer(cacheParams);
            } catch (error) {
                console.error('Error fetching properties:', error);
                return { 
                    properties: [], 
                    error: 'Failed to load properties',
                    notFound: false 
                };
            }
        },
        [cacheKey],
        {
            revalidate: 60, // Reduce to 1 minute for more frequent updates
            tags: [
                'properties', 
                'listings',
                `offering-${params.offeringType}`,
                `property-type-${params.propertyType}`,
                `page-${params.page || '1'}`
            ]
        }
    )(params);
});

// Empty state component
function EmptyListings() {
    return (
        <div className={'h-[300px] lg:h-[600px] flex flex-col gap-8 justify-center items-center'}>
            <p className="text-2xl text-center text-gray-500">
                No properties found
            </p>
            <p className="text-center text-gray-400">
                Please try changing your search criteria or check back later.
            </p>
        </div>
    );
}

async function Listings({offeringType, propertyType, searchParams = {}, isLandingPage = false, page, pathname: propPathname}: ListingsProps) {
    // Convert searchParams object to URLSearchParams
    const urlSearchParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
        if (typeof value === 'string') {
            urlSearchParams.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach(v => urlSearchParams.append(key, v));
        }
    });

    // Prioritize pathname prop if provided, otherwise get from headers
    let pathname = propPathname;
    
    // If pathname wasn't provided as prop, get it from headers
    if (!pathname) {
        const headersList = await headers();
        pathname = headersList.get("x-pathname") || "";
    }
    
    console.log('Using pathname for property fetching:', pathname);
    console.log('Property type passed directly to Listings:', propertyType);
    
    // For property-types route, ensure we pass the property type correctly
    const isPropertyTypesRoute = pathname.startsWith('/property-types/');
    
    // Use cached function for better performance
    const data = await getPropertiesWithCache({
        offeringType,
        propertyType,
        searchParams: urlSearchParams,
        pathname,
        page
    });

    // Return 404 if the page number exceeds total pages
    if (data.notFound) {
        notFound();
    }

    const listings = data.properties as unknown as PropertyType[] || [];
    const metaLinks = 'metaLinks' in data ? data.metaLinks : null;
    const error = data.error;

    return (
        <div className='pb-8 properties-content navigation-sensitive'>
            <div className={'max-w-7xl lg:px-0 mx-auto grid px-4 pb-6 lg:pb-12'}>
                {/* Show placeholder while loading - important for navigation */}
                {(listings && listings.length === 0 && !error) ? (
                    <div className="min-h-[500px] flex items-center justify-center">
                        <div className="animate-pulse flex flex-col items-center">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                <path strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <p className="mt-4 text-gray-500">Loading properties...</p>
                        </div>
                    </div>
                ) : null}
                
                {listings && listings.length > 0 ? (
                    <>
                        {/* Client-side component with JS enabled */}
                        <div className="js-only">
                            <ListingsGrid listings={listings}/>
                        </div>
                        
                        {/* Server-side rendered content for when JS is disabled */}
                        <div className="no-js-only">
                            <ServerListingsGrid listings={listings} />
                        </div>
                    </>
                ) : null}

                {/* Only show pagination for JS users as server-side pagination would require page reloads */}
                {metaLinks && !isLandingPage && (
                    <div className="js-only">
                        <Pagination metaLinks={metaLinks} />
                    </div>
                )}

                {/* Show server-friendly pagination links when JS is disabled */}
                {metaLinks && !isLandingPage && (
                    <noscript>
                        <div className="no-js-only flex justify-center gap-4 mt-8">
                            {metaLinks.hasPrev && (
                                <a 
                                    href={`${pathname}?page=${metaLinks.currentPage - 1}`}
                                    className="px-4 py-2 bg-gray-200 rounded-md"
                                >
                                    Previous
                                </a>
                            )}
                            <span className="px-4 py-2">
                                Page {metaLinks.currentPage} of {metaLinks.totalPages}
                            </span>
                            {metaLinks.hasNext && (
                                <a 
                                    href={`${pathname}?page=${metaLinks.currentPage + 1}`}
                                    className="px-4 py-2 bg-gray-200 rounded-md"
                                >
                                    Next
                                </a>
                            )}
                        </div>
                    </noscript>
                )}

                {error && (
                    <div className={'h-[300px] lg:h-[600px] flex flex-col justify-center items-center'}>
                        <p className="text-lg text-center text-gray-500">
                            Oops! Something went wrong from our end. Please try again later.
                        </p>
                    </div>
                )}

                {!error && listings && listings.length === 0 && <EmptyListings />}
            </div>
        </div>
    );
}

export default Listings;