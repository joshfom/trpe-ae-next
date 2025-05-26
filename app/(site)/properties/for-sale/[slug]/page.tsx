import React, { cache, Suspense } from 'react';
import {Metadata, ResolvingMetadata} from "next";
import {propertyTable} from "@/db/schema/property-table";
import {db} from "@/db/drizzle";
import {and, eq, ne} from "drizzle-orm";
import {notFound} from "next/navigation";
import ListingDetailView from "@/features/properties/components/ListingDetailView";
import SimilarProperties from "@/features/properties/components/SimilarProperties";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import { PropertyType } from "@/types/property";

// Cached database queries for better performance
const getProperty = cache(async (slug: string): Promise<PropertyType | null> => {
    try {
        const property = await db.query.propertyTable.findFirst({
            where: eq(propertyTable.slug, slug),
            with: {
                offeringType: true,
                images: true,
                agent: true,
                community: true,
                city: true,
                subCommunity: true,
            }
        }) as unknown as PropertyType;
        return property;
    } catch (error) {
        console.error('Error fetching property:', error);
        return null;
    }
});

const getSimilarProperties = cache(async (propertyId: string, communityId: string, offeringTypeId: string): Promise<PropertyType[]> => {
    try {
        return await db.query.propertyTable.findMany({
            where: and(
                ne(propertyTable.id, propertyId),
                eq(propertyTable.communityId, communityId),
                eq(propertyTable.offeringTypeId, offeringTypeId)
            ),
            limit: 6,
            with: {
                images: true,
                agent: true,
                community: true,
                offeringType: true,
                city: true,
                subCommunity: true,
                type: true,
            }
        }) as unknown as PropertyType[];
    } catch (error) {
        console.error('Error fetching similar properties:', error);
        return [];
    }
});


type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const slug = (await params).slug

    const property = await getProperty(slug);

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    if (!property) {
        return {
            title: 'Property not found',
            description: 'The property you are looking for does not exist.',
        }
    }



    return {
        title: `${property?.title}  | ${property?.referenceNumber}`,

        openGraph: {
            images: [property?.images[0]?.crmUrl, ...previousImages],
            type: 'website',
            url: `${process.env.NEXT_PUBLIC_URL}/properties/${property?.offeringType?.slug}/${property?.slug}`
        },
        description: `${prepareExcerpt(property?.description, 150)} - ${property?.referenceNumber}`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/properties/${property?.offeringType?.slug}/${property?.slug}`,
        },
    }
}

interface ListingViewPageProps {
    params: Promise<{
        slug: string
    }>
}

async function ListingViewPage(props: ListingViewPageProps) {
    const params = await props.params;

    const property = await getProperty(params.slug);

    if (!property) {
        return notFound()
    }

    const similarProperties = await getSimilarProperties(
        property.id, 
        property.communityId || '', 
        property.offeringTypeId
    );


    if(!property) {
        notFound()
    }


    return (
        <div>
            <div className="hidden lg:block h-20 bg-black">

            </div>

            <ListingDetailView property={property} />
            <SimilarProperties properties={similarProperties} />
        </div>

    );
}

export default ListingViewPage;