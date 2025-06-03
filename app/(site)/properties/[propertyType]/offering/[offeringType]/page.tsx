import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {notFound} from "next/navigation";
import {propertyTypeTable} from "@/db/schema/property-type-table";


type Props = {
    params: Promise<{ propertyType: string, offeringType: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const slug = (await params).propertyType

    const propertyType = await db.query.propertyTypeTable.findFirst({
        where: eq(propertyTypeTable.slug, slug),
    }) as unknown as UnitType;

    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, (await params).offeringType),
    }) as unknown as OfferingType

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    let cononicalSlug = 'for-sale'

    switch (offeringType?.slug) {
        case 'for-sale':
            cononicalSlug = 'for-sale';
            break;
        case 'for-rent':
            cononicalSlug = 'for-rent';
            break;
        case 'commercial-rent':
            cononicalSlug = 'for-rent';
            break;
        case 'commercial-sale':
            cononicalSlug = 'for-sale';
            break;
    }


    return {
        title: cononicalSlug === 'for-sale' ? propertyType?.saleMetaTitle : propertyType?.rentMetaTitle,
        description: cononicalSlug === 'for-sale' ? propertyType?.saleMetaDescription : propertyType?.rentMetaDescription,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/properties/${cononicalSlug}`,
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

    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, params.offeringType)
    });



    return (
        <div className={'bg-black lg:pt-20'}>
            <Listings
                propertyType={params.propertyType}
                offeringType={params.offeringType}
            />
        </div>
    );
}

export default PropertyTypeOfferingPage;