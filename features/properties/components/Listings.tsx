import React from 'react';
import ListingsGrid from "@/features/properties/components/ListingsGrid";
import Pagination from "@/components/Pagination";
import { getPropertiesServer } from "@/features/properties/api/get-properties-server";
import { getPropertiesByTypeServer } from "@/features/properties/api/get-properties-by-type-server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface ListingsProps {
    offeringType?: string;
    propertyType?: string;
    searchParams?: { [key: string]: string | string[] | undefined };
    isLandingPage?: boolean;
    page?: string
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

    // Check if we should use the simplified landing page approach
    const useSimplifiedFetch = (isLandingPage || 
        (offeringType && !propertyType && urlSearchParams.toString() === "")) && offeringType;

    let data;

    data = await getPropertiesServer({
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

    const listings = data.properties as unknown as PropertyType[] || undefined;
    const metaLinks = 'metaLinks' in data ? data.metaLinks : null;
    const error = data.error;

    return (
        <div className='pb-8'>
            <div className={'max-w-7xl lg:px-0 mx-auto grid px-4 pb-6 lg:pb-12 '}>
                {listings && listings.length > 0 ? (
                    <ListingsGrid listings={listings}/>
                ) : null}

                {metaLinks && !isLandingPage && (
                    <Pagination
                        metaLinks={metaLinks}
                    />
                )}

                {error && (
                    <div className={'h-[300px] lg:h-[600px] flex flex-col justify-center items-center'}>
                        <p className="text-lg text-center text-gray-500">
                            Oops! Something went wrong from our end. Please try again later.
                        </p>
                    </div>
                )}

                {!error && listings && listings.length === 0 && (
                    <div className={'h-[300px] lg:h-[600px] flex flex-col gap-8 justify-center items-center'}>
                        <p className="text-2xl text-center text-gray-500">
                            No properties found
                        </p>

                        <p>
                            Please try changing your search criteria or check back later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Listings;