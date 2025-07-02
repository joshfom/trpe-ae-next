import React from 'react';
import { db } from '@/db/drizzle';
import { eq, desc } from 'drizzle-orm';
import { propertyTable } from '@/db/schema/property-table';
import { communityTable } from '@/db/schema/community-table';
import { PropertyType } from '@/types/property';
import FeaturedLuxeListingsClient from './FeaturedLuxeListingsClient';

interface FeaturedLuxeListingsProps {
  className?: string;
}

async function getFeaturedLuxeProperties() {
  try {
    // Fetch 3 featured luxe properties
    const luxeProperties = await db.query.propertyTable.findMany({
      where: eq(propertyTable.isLuxe, true),
      with: {
        community: true,
        subCommunity: true,
        agent: true,
        city: true,
        offeringType: true,
        images: true,
        type: true,
      },
      orderBy: [desc(propertyTable.price)], // Order by highest price first
      limit: 3,
    }) as unknown as PropertyType[];

    return luxeProperties;
  } catch (error) {
    console.error('Error fetching featured luxe properties:', error);
    return [];
  }
}

async function getFeaturedLuxeCommunities() {
  try {
    // Fetch 4 featured luxe communities
    const luxeCommunities = await db.query.communityTable.findMany({
      where: eq(communityTable.isLuxe, true),
      with: {
        city: true,
        properties: {
          limit: 1, // Just get one property for reference
        },
      },
      orderBy: [desc(communityTable.createdAt)], // Order by newest first
      limit: 4,
    });

    return luxeCommunities;
  } catch (error) {
    console.error('Error fetching featured luxe communities:', error);
    return [];
  }
}

export default async function FeaturedLuxeListings({ className = '' }: FeaturedLuxeListingsProps) {
  const [properties, communities] = await Promise.all([
    getFeaturedLuxeProperties(),
    getFeaturedLuxeCommunities()
  ]);

  // Transform properties to match LuxePropCard expected format
  const displayProperties = properties.map((property) => ({
    id: property.id,
    title: property.title || property.name || 'Luxury Property',
    location: `${property.community?.name || property.city?.name || 'Dubai'}, UAE`,
    price: Number(property.price) || 0,
    currency: '$',
    beds: property.bedrooms || 0,
    baths: property.bathrooms || 0,
    sqft: property.size ? Math.round(property.size / 100) : 0, // Convert from centi units to sq ft
    status: property.offeringType?.name === 'For Sale' ? 'For Sale' as const : 'For Rent' as const,
    imageUrl: property.images?.[0]?.s3Url || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }));

  // Transform communities for display
  const displayCommunities = communities.map((community) => ({
    id: community.id,
    name: community.luxeName || community.name || 'Luxury Community',
    location: `${community.city?.name || 'Dubai'}, UAE`,
    imageUrl: community.luxeImageUrl || community.image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    propertyCount: community.properties?.length || 0,
    slug: community.slug,
  }));

  return <FeaturedLuxeListingsClient 
    properties={displayProperties} 
    communities={displayCommunities}
    className={className} 
  />;
}
