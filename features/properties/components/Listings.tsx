import React, { Suspense, cache } from 'react';
import ListingsGrid from "@/features/properties/components/ListingsGrid";
import Pagination from "@/components/Pagination";
import { getPropertiesServer } from "@/features/properties/api/get-properties-server";
import { getPropertiesByTypeServer } from "@/features/properties/api/get-properties-by-type-server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

interface ListingsProps {
    offeringType?: string;
    propertyType?: string;
    searchParams?: { [key: string]: string | string[] | undefined };
    isLandingPage?: boolean;
    page?: string
}

// Enhanced cache with multiple cache strategies
const getPropertiesWithCache = cache(async (params: {
    offeringType?: string;
    propertyType?: string;
    searchParams: URLSearchParams;
    pathname: string;
    page?: string;
}) => {
    try {
        return await getPropertiesServer(params);
    } catch (error) {
        console.error('Error fetching properties:', error);
        return { 
            properties: [], 
            error: 'Failed to load properties',
            notFound: false 
        };
    }
});

// Optimized loading component for Suspense boundary
function ListingsLoading() {
    return (
        <div className='pb-8'>
            <div className={'max-w-7xl lg:px-0 mx-auto grid px-4 pb-6 lg:pb-12'}>
                <div className={'grid grid-cols-1 lg:grid-cols-3 gap-8'}>
                    {Array.from({length: 6}, (_, i) => (
                        <div key={i} className={'bg-zinc-600/40 h-96 animate-pulse rounded-lg'}></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Enhanced error component with retry functionality
function ListingsError({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
    return (
        <div className={'h-[300px] lg:h-[600px] flex flex-col justify-center items-center gap-4'}>
            <p className="text-lg text-center text-gray-500">
                {error.message || 'Sorry, we encountered an error while loading properties.'}
            </p>
            <button 
                onClick={resetErrorBoundary}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
                Try Again
            </button>
        </div>
    );
}

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

async function Listings({offeringType, propertyType, searchParams = {}, isLandingPage = false, page}: ListingsProps) {
    // Convert searchParams object to URLSearchParams
    const urlSearchParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
        if (typeof value === 'string') {
            urlSearchParams.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach(v => urlSearchParams.append(key, v));
        }
    });

    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";

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
        <ErrorBoundary
            FallbackComponent={ListingsError}
            onError={(error, errorInfo) => {
                console.error('Listings error:', error, errorInfo);
            }}
        >
            <Suspense fallback={<ListingsLoading />}>
                <div className='pb-8'>
                    <div className={'max-w-7xl lg:px-0 mx-auto grid px-4 pb-6 lg:pb-12'}>
                        {listings && listings.length > 0 ? (
                            <ListingsGrid listings={listings}/>
                        ) : null}

                        {metaLinks && !isLandingPage && (
                            <Pagination metaLinks={metaLinks} />
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
            </Suspense>
        </ErrorBoundary>
    );
}

export default Listings;