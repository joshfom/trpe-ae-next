import React from 'react';
import 'swiper/css';
import PropertyCard from "@/components/property-card";
import Link from "next/link";
import {PropertyType} from "@/types/property";

interface FeaturedListingsSectionServerProps {
    saleListings: PropertyType[],
    rentalListings: PropertyType[]
}

// Server component version for better SSR performance
function PropertyGrid({ listings, offeringType }: { listings: PropertyType[], offeringType: string }) {
    const linkHref = `/properties/${offeringType}`;
    const linkText = `See All Properties ${offeringType === 'for-sale' ? 'for sale' : 'for rent'}`;

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {listings.map((property) => (
                    <PropertyCard key={property.id} property={property} offeringType={offeringType} />
                ))}
            </div>
            <div className="py-4 sm:py-6 flex items-center mt-6 sm:mt-8 justify-center">
                <Link 
                    href={linkHref}
                    className="bg-slate-900 rounded-full px-6 py-2 sm:px-8 border text-white hover:bg-white hover:text-slate-600 transition-colors min-h-[44px] flex items-center"
                >
                    {linkText}
                </Link>
            </div>
        </div>
    );
}

// Server component for better SSR performance - shows only first tab (For Sale) content
function FeaturedListingsSectionServer({ saleListings, rentalListings }: FeaturedListingsSectionServerProps) {
    // Add safety checks for the data
    const safeSaleListings = Array.isArray(saleListings) ? saleListings : [];
    const safeRentalListings = Array.isArray(rentalListings) ? rentalListings : [];

    return (
        <section className="w-full">
            <div className="max-w-7xl mx-auto px-4 py-8 border-b border-gray-500 sm:px-6 lg:px-8 sm:py-12 lg:py-16">
                <div className="space-y-3 py-6 sm:space-y-4 sm:py-8 lg:py-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
                        Featured Properties
                    </h2>
                </div>

                {/* SSR Version - Shows For Sale properties without tab functionality */}
                <div className="w-full space-y-3 sm:space-y-4 bg-transparent">
                    {/* Static tab header for visual consistency */}
                    <div className="bg-transparent border-b mb-3 sm:mb-4 border-gray-500 w-full">
                        <div className="flex">
                            <div className="text-lg sm:text-xl bg-transparent py-2 sm:py-3 pl-0 pr-4 sm:pr-6 border-b-4 border-black -mb-1.5 min-h-[44px] text-black font-medium">
                                For Sale
                            </div>
                            <div className="text-lg sm:text-xl bg-transparent py-2 sm:py-3 pl-0 px-6 sm:px-8 -mb-1.5 min-h-[44px] text-gray-600 hover:text-gray-800 cursor-pointer">
                                For Rent
                            </div>
                        </div>
                    </div>
                    
                    {/* Show only For Sale properties for SSR */}
                    <div className="">
                        {safeSaleListings.length > 0 ? (
                            <PropertyGrid listings={safeSaleListings} offeringType="for-sale" />
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No featured properties available at the moment.</p>
                                <Link 
                                    href="/properties/for-sale"
                                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                                >
                                    Browse All Properties
                                </Link>
                            </div>
                        )}
                    </div>
                    
                    {/* Notice for users about tab functionality */}
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-2">
                            Tab switching requires JavaScript. 
                        </p>
                        <Link 
                            href="/properties/for-rent"
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            View rental properties here
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeaturedListingsSectionServer;
