"use client";
import React, { useState } from 'react';
import PropertyCardServer from "@/components/property-card-server";
import Link from "next/link";
import { PropertyType } from "@/types/property";

interface FeaturedListingsTabsProps {
    saleListings: PropertyType[];
    rentalListings: PropertyType[];
}

// Client component for interactive tab functionality
function PropertyGrid({ listings, offeringType }: { listings: PropertyType[], offeringType: string }) {
    const linkHref = `/properties/${offeringType}`;
    const linkText = `See All Properties ${offeringType === 'for-sale' ? 'for Sale' : 'for Rent'}`;

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

function FeaturedListingsTabs({ saleListings, rentalListings }: FeaturedListingsTabsProps) {
    const [activeTab, setActiveTab] = useState<'sale' | 'rent'>('sale');
    
    // Add safety checks for the data
    const safeSaleListings = Array.isArray(saleListings) ? saleListings : [];
    const safeRentalListings = Array.isArray(rentalListings) ? rentalListings : [];

    return (
        <div className="w-full space-y-3 sm:space-y-4 bg-transparent">
            {/* Interactive tab header */}
            <div className="bg-transparent border-b mb-3 sm:mb-4 border-gray-500 w-full">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('sale')}
                        className={`text-lg sm:text-xl bg-transparent py-2 sm:py-3 pl-0 pr-4 sm:pr-6 border-b-4 -mb-1.5 min-h-[44px] transition-colors font-medium ${
                            activeTab === 'sale'
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        For Sale
                    </button>
                    <button
                        onClick={() => setActiveTab('rent')}
                        className={`text-lg sm:text-xl bg-transparent py-2 sm:py-3 pl-0 px-6 sm:px-8 border-b-4 -mb-1.5 min-h-[44px] transition-colors font-medium ${
                            activeTab === 'rent'
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        For Rent
                    </button>
                </div>
            </div>
            
            {/* Tab content */}
            <div className="">
                {activeTab === 'sale' && (
                    safeSaleListings.length > 0 ? (
                        <PropertyGrid listings={safeSaleListings} offeringType="for-sale" />
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No featured properties for sale available at the moment.</p>
                            <Link 
                                href="/properties/for-sale"
                                className="mt-4 inline-block bg-slate-900 text-white px-6 py-2 rounded-full hover:bg-white hover:text-slate-600 transition-colors"
                            >
                                Browse All Properties for Sale
                            </Link>
                        </div>
                    )
                )}
                
                {activeTab === 'rent' && (
                    safeRentalListings.length > 0 ? (
                        <PropertyGrid listings={safeRentalListings} offeringType="for-rent" />
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No featured properties for rent available at the moment.</p>
                            <Link 
                                href="/properties/for-rent"
                                className="mt-4 inline-block bg-slate-900 text-white px-6 py-2 rounded-full hover:bg-white hover:text-slate-600 transition-colors"
                            >
                                Browse All Properties for Rent
                            </Link>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default FeaturedListingsTabs;
