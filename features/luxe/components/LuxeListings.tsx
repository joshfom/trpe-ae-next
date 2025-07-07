import React, {memo, useMemo} from 'react';
import Pagination from "@/components/Pagination";
import {getLuxePropertiesServer} from "@/features/luxe/hooks/use-search-luxe-properties";
import {headers} from "next/headers";
import Link from "next/link";
import {truncateText} from "@/lib/truncate-text";
import currencyConverter from "@/lib/currency-converter";
import unitConverter from "@/lib/unit-converter";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import {notFound} from "next/navigation";

interface LuxeListingsProps {
    unitType?: string;
    offeringType?: string;
    searchParams?: { [key: string]: string | string[] | undefined };
    page?: string;
}

async function LuxeListings({ unitType, offeringType, searchParams = {}, page = '1' }: LuxeListingsProps) {
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

    // Server-side data fetching
    const data = await getLuxePropertiesServer({
        offeringType,
        propertyType: unitType,
        searchParams: urlSearchParams,
        pathname,
        page: page,
    });

    // Return 404 if the page number exceeds total pages
    if (data.notFound) {
        notFound();
    }

    const listings = data.properties;
    const totalCount = data.totalCount;
    const metaLinks = data.metaLinks;
    const error = data.error;

    // Memoized PropertyCard component
    const LuxePropertyCard = memo(({ property }: { property: any }) => {
        // Memoize computed values
        const computedValues = useMemo(() => ({
            price: currencyConverter(parseInt(`${property.price}`) || 0),
            size: property.size ? unitConverter(property.size / 100) + ' ' : null,
            bedroomText: property?.bedrooms != null && property.bedrooms < 1 ? 'Studio' : property.bedrooms,
            excerptText: prepareExcerpt(property.description || '', 90),
            titleText: truncateText(property.title || '', 35)
        }), [property.price, property.size, property.bedrooms, property.description, property.title]);

        return (
            <div className="rounded-xl shadow-xs bg-white">
                <div className="relative">
                    <div className="relative">
                        {property.images && property.images.length > 0 && (
                            <div className="h-96 relative">
                                <img
                                    src={property.images[0]?.s3Url || ''}
                                    alt={property.title || 'Luxury property'}
                                    className="object-cover rounded-t-xl w-full h-full"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </div>
                    <div className="absolute top-2 right-2 z-10 flex space-x-3">
                        <Link 
                            href={`/property-types/${property.type?.slug || ''}/${property.offeringType?.slug || ''}`} 
                            className="text-white rounded-full text-xs px-4 bg-[#141414] py-1"
                        >
                            {property.type?.name || 'Property'}
                        </Link>
                    </div>
                </div>
                <div className="p-3 pt-8 border-b border-x text-slate-700 rounded-b-xl border-white/20 relative">
                    <div className="flex flex-col space-y-2 text-lg justify-center">
                        <Link 
                            href={`/properties/${property.offeringType?.slug || ''}/${property.slug || '#'}`}
                            className="hover:underline"
                        >
                            {computedValues.titleText}
                        </Link>
                    </div>
                    <div className="py-2">
                        <Link 
                            href={`/properties/${property.offeringType?.slug || ''}/${property.slug || '#'}`}
                            className="text-sm"
                        >
                            {computedValues.excerptText}
                        </Link>
                    </div>
                    <div className="absolute z-20 text-white -top-4 left-4">
                        <Link 
                            href={`/properties/${property.offeringType?.slug || ''}`}
                            className="rounded-full bg-[#141414] border-b py-1 px-3 text-center border-t border-white border-x text-white text-sm"
                        >
                            <span className="sr-only">Property Details</span>
                            {property.offeringType?.name || 'Property'}
                        </Link>
                    </div>
                    <div className="py-3 flex flex-wrap gap-4 justify-start">
                        {property.bedrooms !== undefined && (
                            <div className="flex justify-center items-center">
                                <span className="text-slate-500 mr-2">•</span>
                                {computedValues.bedroomText === 'Studio' ? 'Studio' : (
                                    <p>
                                        Bed
                                        <span className="ml-2">
                                            {property.bedrooms}
                                        </span>
                                    </p>
                                )}
                            </div>
                        )}
                        {property.bathrooms !== undefined && (
                            <div className="flex justify-center items-center">
                                <span className="text-slate-500 mr-2">•</span>
                                Bath
                                <p className="ml-2">
                                    {property.bathrooms}
                                </p>
                            </div>
                        )}
                        {computedValues.size && (
                            <div className="flex grow justify-center items-center">
                                <span className="text-slate-500 mr-2">•</span>
                                <span className="">
                                    Size
                                </span>
                                <p className="ml-2">
                                    {computedValues.size}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4 items-center space-x-2 py-2 justify-between">
                        <Link
                            className="py-1.5 px-5 rounded-full hover:bg-black hover:text-white text-sm border"
                            href={`/properties/${property.offeringType?.slug || ''}/${property.slug || '#'}`}
                        >
                            View Property
                        </Link>
                        <p className="text-lg font-semibold">
                            {computedValues.price}
                        </p>
                    </div>
                </div>
            </div>
        );
    });

    LuxePropertyCard.displayName = 'LuxePropertyCard';

    // Debug information
    console.log("Filter min price:", 9000000);
    console.log("Number of properties returned:", listings.length);
    if (listings && listings.length > 0) {
        console.log("Sample property prices:");
        listings.slice(0, 5).forEach((property, index) => {
            console.log(`Property ${index + 1}: ${property.price} (${typeof property.price})`);
        });
    }

    return (
        <div className={'px-6 lg:px-0'}>
            <div className={'max-w-7xl lg:px-0 mx-auto grid py-6'}>
                <div className="flex space-x-2 py-6 lg:pb-10 items-center justify-between">
                    <h1 className={'text-2xl font-semibold'}>
                        Luxury Properties in Dubai
                    </h1>
                    {totalCount !== undefined && (
                        <p className={'text-slate-600 text-sm'}>
                            {totalCount} Properties
                        </p>
                    )}
                </div>

                {listings && listings.length > 0 ? (
                    <div className="grid gap-x-4 gap-y-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {listings.map((property) => (
                            <LuxePropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : null}

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
                            No luxury properties found
                        </p>

                        <p>
                            Please try changing your search criteria or check back later.
                        </p>
                    </div>
                )}

                {metaLinks && (
                    <Pagination metaLinks={metaLinks} />
                )}
            </div>
        </div>
    );
}

export default LuxeListings;