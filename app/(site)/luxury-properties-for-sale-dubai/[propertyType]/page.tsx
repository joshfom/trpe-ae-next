import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata} from "next";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {notFound} from "next/navigation";
import LuxeListings from "@/features/luxe/components/LuxeListings";


export const metadata: Metadata = {
    title: "Properties for Rent in Dubai | Find Your Next Home",
    description: "Browse the latest Dubai property for rent. Find your next home or investment in Dubai.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/properties/for-rent`,
    },
};

interface PropertyTypePage {
    params: Promise<{
        propertyType: string;
    }>
    searchParams: Promise<{
        [ key: string]: string  | undefined;
    }>
}


async function PropertyForRentPage(props: PropertyTypePage) {
    const params = await props.params;
    const page = (await props.searchParams).page


    const [unitType] = await db.select().from(propertyTypeTable).where(
        eq(propertyTypeTable.slug, params.propertyType)
    ).limit(1);

    if (!unitType) {
        return notFound()
    }

    return (
        <div className={'bg-black lg:pt-20'}>
            <LuxeListings
                unitType={unitType.slug}
                page={page}
            />
        </div>
    );
}

export default PropertyForRentPage;