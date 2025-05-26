"use client"
import React, { memo, useMemo } from 'react';
import 'swiper/css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCard from "@/components/property-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PropertyType } from "@/types/property";

interface FeaturedListingsSectionProps {
    saleListings: PropertyType[],
    rentalListings: PropertyType[]
}

// Memoized property grid component
const PropertyGrid = memo<{ listings: PropertyType[], offeringType: string }>(
    ({ listings, offeringType }) => {
        const linkHref = useMemo(() => 
            `/properties/${offeringType}`, 
            [offeringType]
        );
        
        const linkText = useMemo(() => 
            `See All Properties ${offeringType === 'for-sale' ? 'for sale' : 'for rent'}`,
            [offeringType]
        );

        return (
            <div>
                <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
                    {listings.map((property) => (
                        <PropertyCard key={property.id} property={property} offeringType={offeringType} />
                    ))}
                </div>
                <div className="py-6 flex items-center mt-8 justify-center">
                    <Link 
                        href={linkHref}
                        className={'bg-slate-900 rounded-full lg:px-8 py-2 border text-white hover:bg-white hover:text-slate-600 px-6 transition-colors'}
                    >
                        {linkText}
                    </Link>
                </div>
            </div>
        );
    }
);

PropertyGrid.displayName = 'PropertyGrid';

const FeaturedListingsSection = memo<FeaturedListingsSectionProps>(
    ({ saleListings, rentalListings }) => {
        // Memoize the listings to prevent unnecessary re-renders
        const memoizedSaleListings = useMemo(() => saleListings, [saleListings]);
        const memoizedRentalListings = useMemo(() => rentalListings, [rentalListings]);

        return (
            <section className="w-full">
                <div className="max-w-7xl mx-auto px-4 py-12 border-b border-gray-500 sm:px-6 lg:px-8">
                    <div className="space-y-4 py-12">
                        <h2 className={'text-4xl'}>
                            Featured Properties
                        </h2>
                    </div>

                    <Tabs defaultValue="for-sale" className="w-full space-y-4 bg-transparent">
                        <TabsList
                            className={'bg-transparent border-b mb-4 border-gray-500 rounded-none w-full justify-start'}
                        >
                            <TabsTrigger
                                className={'text-xl bg-transparent py-3 pl-0 pr-6 border-b-4 rounded-none -mb-1.5'}
                                value="for-sale"
                            >
                                For Sale
                            </TabsTrigger>
                            <TabsTrigger
                                className={'text-xl bg-transparent py-3 pl-0 px-8 border-b-4 rounded-none -mb-1.5'}
                                value="for-rent"
                            >
                                For Rent
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent className={''} value="for-sale">
                            <PropertyGrid listings={memoizedSaleListings} offeringType="for-sale" />
                        </TabsContent>
                        
                        <TabsContent className={''} value="for-rent">
                            <PropertyGrid listings={memoizedRentalListings} offeringType="for-rent" />
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        );
    }
);

FeaturedListingsSection.displayName = 'FeaturedListingsSection';

export default FeaturedListingsSection;