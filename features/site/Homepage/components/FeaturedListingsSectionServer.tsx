import React from 'react';
import 'swiper/css';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
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

// Server component for better SSR performance
function FeaturedListingsSectionServer({ saleListings, rentalListings }: FeaturedListingsSectionServerProps) {
    return (
        <section className="w-full">
            <div className="max-w-7xl mx-auto px-4 py-8 border-b border-gray-500 sm:px-6 lg:px-8 sm:py-12 lg:py-16">
                <div className="space-y-3 py-6 sm:space-y-4 sm:py-8 lg:py-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
                        Featured Properties
                    </h2>
                </div>

                <Tabs defaultValue="for-sale" className="w-full space-y-3 sm:space-y-4 bg-transparent">
                    <TabsList
                        className="bg-transparent border-b mb-3 sm:mb-4 border-gray-500 rounded-none w-full justify-start"
                    >
                        <TabsTrigger
                            className="text-lg sm:text-xl bg-transparent py-2 sm:py-3 pl-0 pr-4 sm:pr-6 border-b-4 rounded-none -mb-1.5 min-h-[44px]"
                            value="for-sale"
                        >
                            For Sale
                        </TabsTrigger>
                        <TabsTrigger
                            className="text-lg sm:text-xl bg-transparent py-2 sm:py-3 pl-0 px-6 sm:px-8 border-b-4 rounded-none -mb-1.5 min-h-[44px]"
                            value="for-rent"
                        >
                            For Rent
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent className="" value="for-sale">
                        <PropertyGrid listings={saleListings} offeringType="for-sale" />
                    </TabsContent>
                    
                    <TabsContent className="" value="for-rent">
                        <PropertyGrid listings={rentalListings} offeringType="for-rent" />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}

export default FeaturedListingsSectionServer;
