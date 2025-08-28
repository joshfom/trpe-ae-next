import React from 'react';
import {Metadata, ResolvingMetadata} from "next";
import {propertyTable} from "@/db/schema/property-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {db} from "@/db/drizzle";
import {and, eq, ne} from "drizzle-orm";
import {notFound} from "next/navigation";
import ListingDetailView from "@/features/properties/components/ListingDetailView";
import SimilarProperties from "@/features/properties/components/SimilarProperties";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import {PropertyType} from "@/lib/types/property-type";

// Generate static params for commercial rent properties
export async function generateStaticParams() {
    try {
        const offeringType = await db.query.offeringTypeTable.findFirst({
            where: eq(offeringTypeTable.slug, "commercial-rent")
        });
        
        if (!offeringType) return [];
        
        const properties = await db.query.propertyTable.findMany({
            columns: { slug: true },
            where: eq(propertyTable.offeringTypeId, offeringType.id),
            limit: 100 // Limit to top 100 properties
        });
        
        return properties.map(property => ({
            slug: property.slug,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}


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

    const property = await db.query.propertyTable.findFirst({
        where: eq(propertyTable.slug, slug),
        with: {
            offeringType: true,
            images: true,
        }
    }) as unknown as PropertyType;

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

    const property = await db.query.propertyTable.findFirst({
        where: eq(propertyTable.slug, params.slug),
        with: {
            agent: true,
            community: true,
            subCommunity: true,
            city: true,
            offeringType: true,
            images: true,
        }
    }) as unknown as PropertyType;

    if (!property) {
        return notFound()
    }

    const similarProperties = await db.query.propertyTable.findMany({
        where: and(
            eq(propertyTable.communityId, property?.communityId!),
            eq(propertyTable.offeringTypeId, property?.offeringTypeId),
            ne(propertyTable.id, property.id),
        ),
        with: {
            community: true,
            subCommunity: true,
            agent: true,
            city: true,
            offeringType: true,
            images: true,
            type: true,
        },
        limit: 3,
    }) as unknown as PropertyType[];


    // const {data} = useGetProperty(params.slug)

    if(!property) {
        notFound()
    }


    return (
        <div>
            <ListingDetailView property={property} />
            <SimilarProperties properties={similarProperties} />
        </div>

    );
}

export default ListingViewPage;