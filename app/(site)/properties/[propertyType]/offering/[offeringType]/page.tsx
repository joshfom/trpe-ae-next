import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {notFound} from "next/navigation";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {unstable_cache} from "next/cache";

// Enable ISR with aggressive caching
export const revalidate = 7200; // 2 hours static regeneration

// Cached offering type lookup
const getOfferingTypeWithCache = unstable_cache(
  async (slug: string) => {
    return await db.query.offeringTypeTable.findFirst({
      where: eq(offeringTypeTable.slug, slug)
    });
  },
  ['offering-type-lookup-detail'],
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
    params: Promise<{ propertyType: string, offeringType: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const { propertyType, offeringType } = await params;

    const [propertyTypeData, offeringTypeData] = await Promise.all([
        getPropertyTypeWithCache(propertyType),
        getOfferingTypeWithCache(offeringType)
    ]);

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    if (!propertyTypeData || !offeringTypeData) {
        return {
            title: 'Property not found',
            description: 'The property combination you are looking for does not exist.',
        }
    }

    let cononicalSlug = 'for-sale'

    switch (offeringTypeData?.slug) {
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
        title: cononicalSlug === 'for-sale' ? propertyTypeData?.saleMetaTitle || `${propertyTypeData.name} for Sale in Dubai` : propertyTypeData?.rentMetaTitle || `${propertyTypeData.name} for Rent in Dubai`,
        description: cononicalSlug === 'for-sale' ? propertyTypeData?.saleMetaDescription || `Find premium ${propertyTypeData.name} for sale in Dubai` : propertyTypeData?.rentMetaDescription || `Find premium ${propertyTypeData.name} for rent in Dubai`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/properties/${propertyType}/offering/${offeringType}`,
        },
    }
}




// Generate static params for common property type + offering type combinations
export async function generateStaticParams() {
  // Use hardcoded combinations to avoid database queries during build
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
      { propertyType: 'penthouse', offeringType: 'for-sale' },
      { propertyType: 'penthouse', offeringType: 'for-rent' },
      // Commercial properties
      { propertyType: 'office', offeringType: 'commercial-sale' },
      { propertyType: 'office', offeringType: 'commercial-rent' },
      { propertyType: 'retail', offeringType: 'commercial-sale' },
      { propertyType: 'retail', offeringType: 'commercial-rent' },
    ];
    
    return staticCombinations;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
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

    // Validate both property type and offering type exist using cached lookups
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

export default PropertyTypeOfferingPage;