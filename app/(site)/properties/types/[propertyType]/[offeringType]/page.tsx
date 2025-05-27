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
import {unstable_cache} from "next/cache";

// Enable ISR with aggressive caching
export const revalidate = 3600; // 1 hour static regeneration

// Cached offering type lookup
const getOfferingTypeWithCache = unstable_cache(
  async (slug: string) => {
    return await db.query.offeringTypeTable.findFirst({
      where: eq(offeringTypeTable.slug, slug)
    });
  },
  ['offering-type-lookup'],
  {
    revalidate: 14400, // 4 hours cache
    tags: ['offering-types']
  }
);

// Cached property type lookup
const getPropertyTypeWithCache = unstable_cache(
  async (slug: string) => {
    return await db.query.propertyTypeTable.findFirst({
      where: eq(propertyTypeTable.slug, slug)
    });
  },
  ['property-type-lookup-detail'],
  {
    revalidate: 14400, // 4 hours cache
    tags: ['property-types']
  }
);


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
    const { offeringType: offeringTypeSlug, propertyType: propertyTypeSlug } = await params;

    const [offeringType, propertyType] = await Promise.all([
        getOfferingTypeWithCache(offeringTypeSlug),
        getPropertyTypeWithCache(propertyTypeSlug)
    ]);

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    if (!offeringType || !propertyType) {
        return {
            title: 'Property not found',
            description: 'The property combination you are looking for does not exist.',
        }
    }

    return {
        title: `${propertyType.name} ${offeringType.name} in Dubai | Find Your Next Home - TRPE AE`,
        description: `Browse premium ${propertyType.name} properties ${offeringType.name} in Dubai with TRPE. Your trusted experts for exceptional living spaces and investment opportunities.`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/properties/types/${propertyTypeSlug}/${offeringTypeSlug}`,
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

    // Validate both property type and offering type exist
    const [propertyType, offeringType] = await Promise.all([
        getPropertyTypeWithCache(params.propertyType),
        getOfferingTypeWithCache(params.offeringType)
    ]);

    if (!propertyType || !offeringType) {
        return notFound();
    }

    return (
        <div className={'bg-black lg:pt-20'}>
            <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            }>
                <Listings 
                    propertyType={params.propertyType}
                    offeringType={params.offeringType}
                />
            </Suspense>
        </div>
    );
}

// Generate static params for common property type + offering type combinations
export async function generateStaticParams() {
  // Minimize database queries during build by generating only the most critical combinations
  try {
    // Only generate for the most common property types to reduce database load
    const staticCombinations = [
      // Most common combinations based on typical Dubai property market
      { propertyType: 'apartment', offeringType: 'for-sale' },
      { propertyType: 'apartment', offeringType: 'for-rent' },
      { propertyType: 'villa', offeringType: 'for-sale' },
      { propertyType: 'villa', offeringType: 'for-rent' },
      { propertyType: 'townhouse', offeringType: 'for-sale' },
      { propertyType: 'townhouse', offeringType: 'for-rent' },
      // Commercial properties
      { propertyType: 'office', offeringType: 'commercial-sale' },
      { propertyType: 'office', offeringType: 'commercial-rent' },
    ];
    
    return staticCombinations;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default PropertyTypeOfferingPage;