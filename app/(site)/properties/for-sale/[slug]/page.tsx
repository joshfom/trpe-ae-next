import React, { cache } from 'react';
import {Metadata, ResolvingMetadata} from "next";
import {propertyTable} from "@/db/schema/property-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {db} from "@/db/drizzle";
import {and, eq, ne} from "drizzle-orm";
import {notFound} from "next/navigation";
import ListingDetailView from "@/features/properties/components/ListingDetailView";
import PropertyCardServer from "@/components/property-card-server";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import { PropertyType } from "@/types/property";
import {unstable_cache} from "next/cache";
import { createAdvancedCache } from "@/lib/advanced-cache";
import { generatePropertyStructuredData, generateBreadcrumbStructuredData } from "@/lib/structured-data";
import { WebVitalsReporter } from "@/lib/web-vitals";

// Enable ISR with aggressive caching for property details
export const revalidate = 7200; // 2 hours static regeneration

// Advanced caching with memory + disk layers for property data
const propertyCache = createAdvancedCache({
  keyPrefix: 'property',
  memoryTTL: 600000, // 10 minutes in memory
  diskTTL: 3600000,  // 1 hour on disk
  namespace: 'property-details'
});

const similarPropertiesCache = createAdvancedCache({
  keyPrefix: 'similar',
  memoryTTL: 300000, // 5 minutes in memory
  diskTTL: 1800000,  // 30 minutes on disk
  namespace: 'similar-properties'
});

// Enhanced cached database queries with advanced caching layers
const getProperty = async (slug: string): Promise<PropertyType | null> => {
    return propertyCache.get(slug, async () => {
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
    });
};

const getSimilarProperties = async (propertyId: string, communityId: string, offeringTypeId: string): Promise<PropertyType[]> => {
    const cacheKey = `${propertyId}-${communityId}-${offeringTypeId}`;
    return similarPropertiesCache.get(cacheKey, async () => {
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
};

// Generate static params for most popular properties
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
        keywords: [
            property?.type?.name,
            property?.offeringType?.name,
            property?.community?.name,
            property?.city?.name,
            'Dubai Real Estate',
            'Property for Sale'
        ].filter(Boolean).join(', '),
        authors: [{ name: property?.agent ? `${property.agent.firstName} ${property.agent.lastName}` : 'TRPE Real Estate' }],
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
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

    // Generate comprehensive structured data
    const propertySchema = generatePropertyStructuredData(property);

    const breadcrumbSchema = generateBreadcrumbStructuredData(property);

    // Combine all structured data
    const combinedStructuredData = {
        "@context": "https://schema.org",
        "@graph": [
            propertySchema,
            breadcrumbSchema
        ]
    };

    return (
        <>
            {/* Web Vitals Monitoring */}
            <WebVitalsReporter />
            
            {/* Enhanced Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedStructuredData) }}
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
                            <PropertyCardServer property={property} key={property.id} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default ListingViewPage;