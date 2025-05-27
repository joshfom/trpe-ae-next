import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {notFound} from "next/navigation";
import {unstable_cache} from "next/cache";
import { PropertyType } from "@/types/property";

// Enable ISR with aggressive caching
export const revalidate = 3600; // 1 hour static regeneration

// Cached property type lookup
const getPropertyTypeWithCache = unstable_cache(
  async (slug: string) => {
    const [unitType] = await db.select().from(propertyTypeTable).where(
      eq(propertyTypeTable.slug, slug)
    ).limit(1);
    return unitType;
  },
  ['property-type-lookup'],
  {
    revalidate: 14400, // 4 hours cache
    tags: ['property-types']
  }
);

export async function generateMetadata(
  { params }: { params: Promise<{ propertyType: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { propertyType } = await params;
  
  const unitType = await getPropertyTypeWithCache(propertyType);
  
  if (!unitType) {
    return {
      title: 'Property Type not found',
      description: 'The property type you are looking for does not exist.',
    };
  }

  return {
    title: `${unitType.name} Properties in Dubai | Find Your Next Home - TRPE AE`,
    description: `Explore premium ${unitType.name} properties in Dubai with TRPE. Your trusted experts for exceptional living spaces and investment opportunities.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL}/properties/types/${propertyType}`,
    },
  };
}

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

interface PropertyTypePage {
    params: Promise<{
        propertyType: string;
    }>
}

async function PropertyForRentPage(props: PropertyTypePage) {
    const params = await props.params;

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
                />
            </Suspense>
        </div>
    );
}

export default PropertyForRentPage;