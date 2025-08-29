import React from 'react';
import { Metadata } from 'next';
import { db } from '@/db/drizzle';
import { propertyTable } from '@/db/schema/property-table';
import { eq } from 'drizzle-orm';
import { PropertyType } from '@/types/property';
import LuxePropCardSSR from '@/components/luxe/LuxePropCardSSR';
import LuxePropCard from '@/components/luxe/LuxePropCard';
import { LuxePropertiesSEO } from '@/components/seo/LuxeSEO';

// Force dynamic rendering to handle database queries
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Luxe Properties | Premium Dubai Real Estate Collection | TRPE',
  description: 'Explore our exclusive collection of luxury properties in Dubai. Premium penthouses, villas, and luxury apartments in the most prestigious locations.',
  openGraph: {
    title: 'Luxe Properties | Premium Dubai Real Estate Collection | TRPE',
    description: 'Explore our exclusive collection of luxury properties in Dubai. Premium penthouses, villas, and luxury apartments in the most prestigious locations.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        width: 1200,
        height: 630,
        alt: 'Luxe Properties - Dubai Premium Real Estate Collection',
      },
    ],
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL}/luxe/properties`,
  },
};

export default async function LuxePropertiesPage() {
  // Fetch luxe properties from database
  const properties = await db.query.propertyTable.findMany({
    where: eq(propertyTable.isLuxe, true),
    with: {
      community: true,
      city: true,
      offeringType: true,
      images: true,
      type: true,
    },
    limit: 20,
    orderBy: (properties, { desc }) => [desc(properties.createdAt)],
  }) as unknown as PropertyType[];

  return (
    <div className="min-h-screen bg-white">
      {/* Luxe Properties SEO with structured data and breadcrumbs */}
      <LuxePropertiesSEO 
        properties={properties} 
        breadcrumbClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
      />
      
      {/* Mobile-First Hero Section */}
      <section className='w-full relative h-[50vh] sm:h-[60vh] lg:h-[70vh]'>
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury Properties in Dubai"
          className='w-full h-full object-cover'
        />
        
        {/* Dark overlay */}
        <div className='absolute inset-0 bg-black/50'></div>
        
        {/* Content */}
        <div className='absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6'>
          <h1 className='text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-light mb-4 sm:mb-6 text-center leading-tight'>
            Luxe Properties
          </h1>
          <p className='text-white text-base sm:text-lg lg:text-xl text-center max-w-3xl'>
            Discover our exclusive collection of luxury properties in Dubai&apos;s most prestigious locations
          </p>
        </div>
      </section>

      {/* Properties Grid Section */}
      <section className='w-full py-8 sm:py-12 lg:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className="mb-8 sm:mb-12 text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-light text-gray-900 mb-4 sm:mb-6">
              {properties.length} Luxe Properties found
            </h3>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Exclusive luxury collection
            </p>
          </div>

          {/* SSR Version - Always renders first */}
          <div id="ssr-properties" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {properties.map((property) => {
              const primaryImage = property.images?.[0]?.crmUrl || property.images?.[0]?.image;
              const price = property.price ? parseFloat(property.price) : 0;
              
              return (
                <LuxePropCardSSR
                  key={`ssr-${property.id}`}
                  id={property.id}
                  slug={property.slug}
                  title={property.title}
                  location={`${property.community?.name || ''}, ${property.city?.name || 'Dubai'}`}
                  price={price}
                  currency="AED"
                  beds={property.bedrooms || 0}
                  baths={property.bathrooms || 0}
                  sqft={property.size || 0}
                  imageUrl={primaryImage || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'}
                  status={property.offeringType?.name as "For Sale" | "For Rent" | "Sold" || "For Sale"}
                  showPrice={true}
                />
              );
            })}
          </div>

          {/* Client-Side Version - Will hydrate and replace SSR version when JS loads */}
          <div id="csr-properties" style={{ display: 'none' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {properties.map((property) => {
              const primaryImage = property.images?.[0]?.crmUrl || property.images?.[0]?.image;
              const price = property.price ? parseFloat(property.price) : 0;
              
              return (
                <LuxePropCard
                  key={`csr-${property.id}`}
                  id={property.id}
                  slug={property.slug}
                  title={property.title}
                  location={`${property.community?.name || ''}, ${property.city?.name || 'Dubai'}`}
                  price={price}
                  currency="AED"
                  beds={property.bedrooms || 0}
                  baths={property.bathrooms || 0}
                  sqft={property.size || 0}
                  imageUrl={primaryImage || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'}
                  status={property.offeringType?.name as "For Sale" | "For Rent" | "Sold" || "For Sale"}
                  showPrice={true}
                />
              );
            })}
          </div>

          {/* Enhancement Script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                document.addEventListener('DOMContentLoaded', function() {
                  // Switch from SSR to CSR version
                  const ssrElement = document.getElementById('ssr-properties');
                  const csrElement = document.getElementById('csr-properties');
                  
                  if (ssrElement && csrElement) {
                    // Hide SSR version
                    ssrElement.style.display = 'none';
                    // Show CSR version
                    csrElement.style.display = 'grid';
                  }
                });
              `
            }}
          />
        </div>
      </section>
    </div>
  );
}