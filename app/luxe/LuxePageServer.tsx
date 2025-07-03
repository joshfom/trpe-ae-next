import React from 'react';
import LuxePageClient from './LuxePageClient';
import FeaturedLuxeListings from '@/components/luxe/FeaturedLuxeListings';

// Define types to match LuxePageClient expectations
interface PropertyData {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  beds: number;
  baths: number;
  sqft: number;
  status: 'For Sale' | 'For Rent';
  imageUrl: string;
  slug: string;
}

interface CommunityData {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  propertyCount: number;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  slug: string;
  category: string;
}

export default async function LuxePageServer() {
  // TODO: Replace with actual data fetching from your API/database
  const featuredProperties: PropertyData[] = [];
  const featuredCommunities: CommunityData[] = [];
  const featuredInsights: BlogPost[] = [];

  return (
    <>
      <LuxePageClient 
        featuredProperties={featuredProperties}
        featuredCommunities={featuredCommunities}
        featuredInsights={featuredInsights}
      />
      <div id="featured-listings-slot">
        <FeaturedLuxeListings />
      </div>
    </>
  );
}
