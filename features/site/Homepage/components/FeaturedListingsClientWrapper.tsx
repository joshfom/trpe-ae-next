"use client";
import React from 'react';
import FeaturedListingsTabs from './FeaturedListingsTabs';
import { PropertyType } from "@/types/property";

interface FeaturedListingsClientWrapperProps {
    saleListings: PropertyType[];
    rentalListings: PropertyType[];
}

function FeaturedListingsClientWrapper({ saleListings, rentalListings }: FeaturedListingsClientWrapperProps) {
    return (
        <FeaturedListingsTabs 
            saleListings={saleListings} 
            rentalListings={rentalListings} 
        />
    );
}

export default FeaturedListingsClientWrapper;
