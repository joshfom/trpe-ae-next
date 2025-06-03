import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata} from "next";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {notFound} from "next/navigation";


export const metadata: Metadata = {
    title: "Type of properties in Dubai | Find Your Next Home",
    description: "Browse the latest Dubai property for rent. Find your next home or investment in Dubai.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/properties/for-sale`,
    },
};

interface PropertyTypePage {
    params: Promise<{
        propertyType: string;
    }>
}


async function PropertyForRentPage(props: PropertyTypePage) {
    const params = await props.params;


    const [unitType] = await db.select().from(propertyTypeTable).where(
        eq(propertyTypeTable.slug, params.propertyType)
    ).limit(1);

    if (!unitType) {
        return notFound()
    }

    return (
        <div className={'bg-black lg:pt-20'}>
            <Suspense>
                <Listings
                    propertyType={unitType.slug}
                />
            </Suspense>
        </div>
    );
}

export default PropertyForRentPage;