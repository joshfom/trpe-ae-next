import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {notFound} from "next/navigation";
import {propertyTable} from "@/db/schema/property-table";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import {propertyTypeTable} from "@/db/schema/property-type-table";


type Props = {
    params: Promise<{
        offeringType: string,
        propertyType: string
    }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const slug = (await params).offeringType


    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, slug)
    }) as unknown as OfferingType;

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    if (!offeringType) {
        return {
            title: 'Property not found',
            description: 'The offeringType you are looking for does not exist.',
        }
    }

    return {
        title: `Properties ${offeringType?.name} in Dubai | Find Your Next Home`,

        description: `Browse the latest Dubai property for rent. Find your next home or investment in Dubai.`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/properties/${offeringType.slug}`,
        },
    }
}


interface PropertyTypeOfferingPageProps {
    params: Promise<{
        propertyType: string;
        offeringType: string;
    }>
}

async function PropertyTypeOfferingPage(props: PropertyTypeOfferingPageProps) {
    const params = await props.params;



    return (
        <div className={'bg-black lg:pt-20'}>
             <Listings propertyType={params.propertyType}/>
        </div>
    );
}

export default PropertyTypeOfferingPage;