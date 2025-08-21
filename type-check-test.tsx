// Quick type check test for the fixed commercial pages
import React from 'react';
import PropertyPageSearchFilter from '@/features/search/PropertyPageSearchFilter';
import SearchPageH1Heading from '@/features/search/SearchPageH1Heading';
import Listings from '@/features/properties/components/Listings';

// Test the correct prop types without className
export default function TypeCheckTest() {
    return (
        <div>
            <PropertyPageSearchFilter offeringType="commercial-sale" />
            <SearchPageH1Heading heading="Test Heading" />
            <Listings offeringType="commercial-sale" />
        </div>
    );
}
