import React from 'react';
import {Metadata, ResolvingMetadata} from "next";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {notFound} from "next/navigation";
import {PropertyType} from '@/lib/types/property-type';
import Listings from '@/features/properties/components/Listings';


type Props = {
    params: Promise<{ propertyType: string }>
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
    }) as unknown as PropertyType;

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []



    return {
        title: `${propertyType?.name}  in Dubai | Find Your Next Home - TRPE AE`,
        description: `Explore premium ${propertyType.name} in Dubai with TRPE. Your trusted experts for exceptional living spaces and investment opportunities.`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/properties/${slug}`,
        },
    }
}



interface PropertyTypePage {
    params: Promise<{
        propertyType: string;
    }>,
    searchParams: Promise<{ [key: string]: string  | undefined }>
}


async function PropertyForRentPage(props: PropertyTypePage) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const page = searchParams.page ;


    const [unitType] = await db.select().from(propertyTypeTable).where(
        eq(propertyTypeTable.slug, params.propertyType)
    ).limit(1);

    if (!unitType) {
        return notFound()
    }

    return (
        <div className={'bg-black lg:pt-20'}>
            <Listings
                propertyType={unitType.slug}
                page={page}
            />
        </div>
    );
}

export default PropertyForRentPage;