import React, { Suspense } from 'react';
import 'swiper/css';
import PropertyCardServer from "@/components/property-card-server";
import Link from "next/link";
import {PropertyType} from "@/types/property";
import NextDynamic from "next/dynamic";

// Dynamic import for client-side tabs
const FeaturedListingsClientWrapper = NextDynamic(() => import('./FeaturedListingsClientWrapper'), {
    loading: () => (
        <div className="space-y-12">
            {/* Loading state that matches server structure */}
            <div className="space-y-6">
                <div className="border-b border-gray-500 pb-3">
                    <div className="h-8 bg-gray-200 animate-pulse rounded w-48"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-gray-200 animate-pulse rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    )
});

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
                    <PropertyCardServer key={property.id} property={property} offeringType={offeringType} />
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

// Server component for better SSR performance - shows both sections initially, then hydrates to interactive tabs
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

                {/* Progressive Enhancement: Client-side interactive tabs */}
                <div className="w-full">
                    <FeaturedListingsClientWrapper 
                        saleListings={safeSaleListings} 
                        rentalListings={safeRentalListings} 
                    />
                </div>
            </div>
        </section>
    );
}

export default FeaturedListingsSectionServer;
