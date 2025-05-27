import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {notFound} from "next/navigation";
import {propertyTable} from "@/db/schema/property-table";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import { PropertyType } from "@/types/property";
import {unstable_cache} from "next/cache";

// Enable ISR with aggressive caching
export const revalidate = 3600; // 1 hour static regeneration

// Cached property type lookup
const getPropertyTypeWithCache = unstable_cache(
  async (slug: string) => {
    return await db.query.propertyTypeTable.findFirst({
      where: eq(propertyTypeTable.slug, slug),
    }) as unknown as PropertyType;
  },
  ['property-type-detail'],
  {
    revalidate: 14400, // 4 hours cache
    tags: ['property-types']
  }
);

// Generate static params for most common property types
export async function generateStaticParams() {
  // Use hardcoded property types to avoid database queries during build
  try {
    const staticPropertyTypes = [
      'apartment',
      'villa',
      'townhouse',
      'penthouse',
      'duplex',
      'studio',
      'office',
      'retail',
      'warehouse',
      'land'
    ];
    
    return staticPropertyTypes.map((slug) => ({
      propertyType: slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}


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

    const propertyType = await getPropertyTypeWithCache(slug);

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    if (!propertyType) {
        return {
            title: 'Property Type not found',
            description: 'The property type you are looking for does not exist.',
        };
    }

    return {
        title: `${propertyType?.name} in Dubai | Find Your Next Home - TRPE AE`,
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

    const unitType = await getPropertyTypeWithCache(params.propertyType);

    if (!unitType) {
        return notFound()
    }

    return (
        <div className={'bg-black lg:pt-20'}>
            <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            }>
                <Listings
                    propertyType={unitType.slug}
                    page={page}
                />
            </Suspense>
        </div>
    );
}

export default PropertyForRentPage;