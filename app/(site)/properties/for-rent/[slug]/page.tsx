import React, { cache } from 'react';
import {Metadata, ResolvingMetadata} from "next";
import {propertyTable} from "@/db/schema/property-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {db} from "@/db/drizzle";
import {and, eq, ne} from "drizzle-orm";
import {notFound} from "next/navigation";
import ListingDetailView from "@/features/properties/components/ListingDetailView";
import PropertyCard from "@/components/property-card";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import { PropertyType } from "@/types/property";
import {unstable_cache} from "next/cache";

// Enable ISR with aggressive caching for property details
export const revalidate = 7200; // 2 hours static regeneration

// Enhanced cached database queries with unstable_cache for better SSR performance
const getProperty = unstable_cache(
    async (slug: string): Promise<PropertyType | null> => {
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
                    type: true,
                }
            }) as unknown as PropertyType;
            return property;
        } catch (error) {
            console.error('Error fetching property:', error);
            return null;
        }
    },
    ['property-detail-rent'],
    {
        revalidate: 3600, // 1 hour cache for property details
        tags: ['properties', 'property-details', 'for-rent']
    }
);

const getSimilarProperties = unstable_cache(
    async (propertyId: string, communityId: string, offeringTypeId: string): Promise<PropertyType[]> => {
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
    },
    ['similar-properties-rent'],
    {
        revalidate: 1800, // 30 minutes cache for similar properties
        tags: ['properties', 'similar-properties', 'for-rent']
    }
);

// Generate static params for most popular rental properties
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
        title: `${property?.title} | ${property?.referenceNumber}`,

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

    console.log('Property details fetched:', property);

    const similarProperties = await getSimilarProperties(
        property.id, 
        property.communityId || '', 
        property.offeringTypeId
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
            "url": `${process.env.NEXT_PUBLIC_URL}/properties/${property?.offeringType?.slug}/${property?.slug}`,
        }
    }

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
            />
            
            <div className="hidden lg:block h-20 bg-black"></div>

            {/* Property Detail - Direct server rendering */}
            <ListingDetailView property={property} />
            
            {/* Similar Properties - Server-side rendered */}
            {similarProperties && similarProperties.length > 0 && (
                <div className={'bg-black w-full'}>
                    <div className={'max-w-7xl mx-auto pt-12 pb-0'}>
                        <h2 className={'text-white text-3xl font-bold'}>Similar Properties</h2>
                    </div>
                    <div className="max-w-7xl mx-auto grid px-3 col-span-1 lg:grid-cols-3 py-12 gap-4">
                        {similarProperties.map((property) => (
                            <PropertyCard property={property} key={property.id} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListingViewPage;