// Server component for rendering properties without client-side JavaScript
// This component is crucial for users with JavaScript disabled
import React from 'react';
import { PropertyType } from "@/types/property";
import PropertyCardServer from "@/components/property-card-server";

interface ServerListingsGridProps {
    listings: PropertyType[]
}

// This is a server component with no client-side JavaScript dependencies
export default function ServerListingsGrid({ listings }: ServerListingsGridProps) {
    // Handle edge cases with helpful user messaging
    if (!listings) {
        return (
            <div className='h-[300px] lg:h-[600px] flex flex-col gap-8 justify-center items-center'>
                <p className="text-2xl text-center text-gray-500">
                    Error loading properties
                </p>
                <p className="text-center text-gray-400">
                    We encountered an issue loading the properties. Please try again later.
                </p>
            </div>
        );
    }
    
    if (listings.length === 0) {
        return (
            <div className='h-[300px] lg:h-[600px] flex flex-col gap-8 justify-center items-center'>
                <p className="text-2xl text-center text-gray-500">
                    No properties found
                </p>
                <p className="text-center text-gray-400">
                    Please try changing your search criteria or check back later.
                </p>
            </div>
        );
    }

    // Ensure each property has all required fields before rendering
    const validListings = listings.filter(listing => 
        listing && listing.id && 
        // Filter out properties without critical fields
        !(listing.price === undefined || listing.price === null)
    );

    return (
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
            {validListings.map((listing) => (
                <PropertyCardServer key={listing.id} property={listing} />
            ))}
            
            {validListings.length === 0 && listings.length > 0 && (
                <div className='col-span-full h-[300px] flex flex-col gap-8 justify-center items-center'>
                    <p className="text-xl text-center text-gray-500">
                        Some properties could not be displayed
                    </p>
                    <p className="text-center text-gray-400">
                        Try refreshing the page or modifying your search criteria.
                    </p>
                </div>
            )}
        </div>
    );
}
