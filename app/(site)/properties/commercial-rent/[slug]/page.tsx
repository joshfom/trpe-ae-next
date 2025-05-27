import React, {Suspense} from 'react';
import {Metadata, ResolvingMetadata} from "next";
import {propertyTable} from "@/db/schema/property-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {db} from "@/db/drizzle";
import {and, eq, ne} from "drizzle-orm";
import {notFound} from "next/navigation";
import ListingDetailView from "@/features/properties/components/ListingDetailView";
import SimilarProperties from "@/features/properties/components/SimilarProperties";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import { PropertyType } from "@/types/property";
import {unstable_cache} from "next/cache";

// Enable ISR with aggressive caching for property details
export const revalidate = 7200; // 2 hours static regeneration

// Enhanced cached database queries with unstable_cache for better SSR performance
const getProperty = unstable_cache(
    async (slug: string): Promise<PropertyType | null> => {
        try {
            return await db.query.propertyTable.findFirst({
                where: eq(propertyTable.slug, slug),
                with: {
                    agent: true,
                    community: true,
                    subCommunity: true,
                    city: true,
                    offeringType: true,
                    images: true,
                    type: true,
                }
            }) as unknown as PropertyType;
        } catch (error) {
            console.error('Error fetching property:', error);
            return null;
        }
    },
    ['property-detail-commercial-rent'],
    {
        revalidate: 3600, // 1 hour cache for property details
        tags: ['properties', 'property-details', 'commercial-rent']
    }
);

const getSimilarProperties = unstable_cache(
    async (propertyId: string, communityId: string, offeringTypeId: string): Promise<PropertyType[]> => {
        try {
            return await db.query.propertyTable.findMany({
                where: and(
                    eq(propertyTable.communityId, communityId),
                    eq(propertyTable.offeringTypeId, offeringTypeId),
                    ne(propertyTable.id, propertyId),
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
        } catch (error) {
            console.error('Error fetching similar properties:', error);
            return [];
        }
    },
    ['similar-properties-commercial-rent'],
    {
        revalidate: 1800, // 30 minutes cache for similar properties
        tags: ['properties', 'similar-properties', 'commercial-rent']
    }
);

// Generate static params for most popular commercial rental properties
export async function generateStaticParams() {
  // Disable static generation for individual properties to prevent database connection exhaustion
  // Properties will be generated on-demand with ISR caching
  return [];
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
        property?.communityId!,
        property?.offeringTypeId
    );

    const propertyJsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": property?.title,
        "image": property?.images?.[0]?.crmUrl || "",
        "description": property?.description,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "AED",
            "price": property?.price,
            "availability": "https://schema.org/InStock",
        }
    };

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
            />
            
            <div className="hidden lg:block h-20 bg-black"></div>

            <Suspense fallback={
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            }>
                <ListingDetailView property={property} />
            </Suspense>
            
            <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                </div>
            }>
                <SimilarProperties properties={similarProperties} />
            </Suspense>
        </div>
    );
}

export default ListingViewPage;