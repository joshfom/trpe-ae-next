import React from 'react';
import ListingsGridServer from "@/features/properties/components/ListingsGridServer";
import PaginationServer from "@/components/PaginationServer";
import { getPropertiesServer } from "@/features/properties/api/get-properties-server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PropertyType } from '@/lib/types/property-type';

interface ListingsServerProps {
    offeringType?: string;
    propertyType?: string;
    searchParams?: { [key: string]: string | string[] | undefined };
    isLandingPage?: boolean;
    page?: string
}

async function ListingsServer({offeringType, propertyType, searchParams = {}, isLandingPage = false, page}: ListingsServerProps) {

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

    let data = await getPropertiesServer({
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
        <div className='pb-6 lg:pb-8'>
            <div className={'max-w-7xl mx-auto grid sm:px-6 lg:px-0 pb-4 lg:pb-12'}>
                {listings && listings.length > 0 ? (
                    <ListingsGridServer listings={listings}/>
                ) : null}

                {metaLinks && !isLandingPage && (
                    <PaginationServer
                        metaLinks={metaLinks}
                        pathname={pathname}
                        searchParams={urlSearchParams}
                    />
                )}

                {error && (
                    <div className={'h-[200px] sm:h-[300px] lg:h-[600px] flex flex-col justify-center items-center px-4'}>
                        <p className="text-base lg:text-lg text-center text-gray-500">
                            Oops! Something went wrong from our end. Please try again later.
                        </p>
                    </div>
                )}

                {!error && listings && listings.length === 0 && (
                    <div className={'h-[200px] sm:h-[300px] lg:h-[600px] flex flex-col gap-4 lg:gap-8 justify-center items-center px-4'}>
                        <p className="text-xl lg:text-2xl text-center text-gray-500">
                            No properties found
                        </p>

                        <p className="text-sm lg:text-base text-center text-gray-400">
                            Please try changing your search criteria or check back later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListingsServer;
