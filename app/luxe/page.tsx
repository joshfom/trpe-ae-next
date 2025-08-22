import React from 'react';
import {db} from '@/db/drizzle';
import {and, desc, eq} from 'drizzle-orm';
import {propertyTable} from '@/db/schema/property-table';
import {communityTable} from '@/db/schema/community-table';
import {insightTable} from '@/db/schema/insight-table';
import {PropertyType} from '@/types/property';
import LuxePageClient from './LuxePageClient';
import LuxePageSSR from './LuxePageSSR';

// Server-side data fetching functions
async function getFeaturedLuxeProperties() {
  try {
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
      orderBy: [desc(propertyTable.price)],
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
    const luxeCommunities = await db.query.communityTable.findMany({
      where: eq(communityTable.isLuxe, true),
      with: {
        city: true,
        properties: {
          limit: 1,
        },
      },
      orderBy: [desc(communityTable.createdAt)],
      limit: 4,
    });

    return luxeCommunities;
  } catch (error) {
    console.error('Error fetching featured luxe communities:', error);
    return [];
  }
}

async function getFeaturedLuxeInsights() {
  try {
    const luxeInsights = await db.query.insightTable.findMany({
      where: and(
        eq(insightTable.isLuxe, true),
        eq(insightTable.isPublished, "yes")
      ),
      orderBy: [desc(insightTable.publishedAt), desc(insightTable.createdAt)],
      limit: 3,
      with: {
        author: true
      }
    });

    return luxeInsights;
  } catch (error) {
    console.error('Error fetching featured luxe insights:', error);
    return [];
  }
}

export default async function LuxePage() {
  // Fetch data on the server
  const [properties, communities, insights] = await Promise.all([
    getFeaturedLuxeProperties(),
    getFeaturedLuxeCommunities(),
    getFeaturedLuxeInsights()
  ]);

  // Transform properties data
  const transformedProperties = properties.map((property) => ({
    id: property.id,
    title: property.title || property.name || 'Luxury Property',
    location: `${property.community?.name || property.city?.name || 'Dubai'}, UAE`,
    price: Number(property.price) || 0,
    currency: 'AED',
    slug: property.slug,
    beds: property.bedrooms || 0,
    baths: property.bathrooms || 0,
    sqft: property.size,
    status: property.offeringType?.name === 'For Sale' ? 'For Sale' as const : 'For Rent' as const,
    imageUrl: property.images?.[0]?.s3Url || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }));

  // Transform communities data
  const transformedCommunities = communities.map((community) => ({
    id: community.id,
    name: community.luxeName || community.name || 'Luxury Community',
    location: `${community.city?.name || 'Dubai'}, UAE`,
    imageUrl: community.luxeImageUrl || community.image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    propertyCount: community.properties?.length || 0,
    slug: community.slug,
  }));

  // Transform insights data for LuxeBlogSection
  const transformedInsights = insights.map((insight) => ({
    id: insight.id,
    title: insight.title || 'Untitled',
    excerpt: insight.metaDescription || 'Discover the latest insights from Dubai\'s luxury real estate market.',
    author: insight.author?.name || 'TRPE Luxe Team',
    date: insight.publishedAt ? new Date(insight.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : new Date(insight.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    imageUrl: insight.coverUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: insight.slug,
    category: 'Luxury Insights'
  }));

  return (
    <>
      {/* SSR Version - Always renders first for SEO and no-JS users */}
      <div className="ssr-version">
        <LuxePageSSR 
          featuredProperties={transformedProperties}
          featuredCommunities={transformedCommunities}
          featuredInsights={transformedInsights}
        />
      </div>
      
      {/* Client-Side Version - Will hydrate and replace SSR version */}
      <div style={{ display: 'none' }} className="js-enhanced">
        <LuxePageClient 
          featuredProperties={transformedProperties}
          featuredCommunities={transformedCommunities}
          featuredInsights={transformedInsights}
        />
      </div>
      
      {/* Script to show enhanced version when JS is available */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const ssrElement = document.querySelector('.ssr-version');
            const jsElement = document.querySelector('.js-enhanced');
            if (ssrElement && jsElement) {
              ssrElement.style.display = 'none';
              jsElement.style.display = 'block';
            }
          })();
        `
      }} />
    </>
  );
}
