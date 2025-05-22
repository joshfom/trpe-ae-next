import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata} from "next";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import LuxeListings from "@/features/luxe/components/LuxeListings";


export const metadata: Metadata = {
    title: "Properties for Rent in Dubai | Find Your Next Home",
    description: "Browse the latest Dubai property for rent. Find your next home or investment in Dubai.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/properties/for-rent`,
    },
};


type Prop = {
    searchParams: Promise<{ [ key: string]: string | undefined }>
}


async function PropertyForRentPage({searchParams}: Prop) {

    const page = (await searchParams).page;

    return (
        <div className={'bg-black lg:pt-20'}>
            <LuxeListings
                offeringType={'commercial-sale'}
                page={page}
            />
        </div>
    );
}

export default PropertyForRentPage;