import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import LuxePropertySearch from "@/components/luxe/LuxePropertySearch";
import LuxePropCard from "@/components/luxe/LuxePropCard";
import LuxePropCardSSR from "@/components/luxe/LuxePropCardSSR";
import {PropertyType} from "@/types/property";

export default async function LuxePropertiesPage() {
  // Fetch only luxe properties from the database
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
      orderBy: (properties, { desc }) => [desc(properties.price), desc(properties.createdAt)],
    }) as unknown as PropertyType[];

    // Transform the data to match the expected format for the luxe components
    const transformedProperties = luxeProperties.map((property) => {
      // Debug: Log property data to check slug
      if (!property.slug) {
        console.warn('Property missing slug:', property.id, property.title);
      }
      
      return {
        id: property.id,
        title: property.title || property.name || 'Luxury Property',
        slug: property.slug || `property-${property.id}`, // Fallback slug if missing
        location: `${property.community?.name || property.city?.name || 'Dubai'}, UAE`,
        price: Number(property.price) || 0,
        beds: property.bedrooms || 0,
        baths: property.bathrooms || 0,
        sqft: property.size ? Math.round(property.size / 100) : 0, // Convert from centi units and round
        imageUrl: property.images?.[0]?.s3Url || property.images?.[0]?.crmUrl || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      };
    });

    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className='w-full relative h-[60vh] lg:h-[70vh]'>
          {/* Background Image - Modern architecture with greenery */}
          <img 
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Modern Architecture"
            className='w-full h-full object-cover'
          />
          
          {/* Light overlay for better search visibility */}
          <div className='absolute inset-0 bg-white/30'></div>
          
          {/* Search Container */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='max-w-6xl mx-auto px-4 w-full'>
              <LuxePropertySearch 
                resultsCount={transformedProperties.length}
                communityFilter="Luxe Properties"
              />
            </div>
          </div>
        </section>

        {/* Properties Grid Section */}
        <section className='w-full py-16 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4'>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-playfair font-medium text-gray-800">
                  {transformedProperties.length} Luxe Properties found
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">
                  Exclusive luxury collection
                </span>
              </div>

              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear Filters</span>
              </button>
            </div>

            {/* Properties Grid */}
            {transformedProperties.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl text-gray-600 mb-2">No Luxe Properties Found</h3>
                <p className="text-gray-500">
                  There are currently no luxury properties available in our collection.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Properties need to be marked as &quot;isLuxe: true&quot; in the database to appear here.
                </p>
              </div>
            ) : (
              <>
                {/* SSR Version - Always renders first */}
                <div id="ssr-properties" className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
                  {transformedProperties.map((property) => (
                    <LuxePropCardSSR 
                      key={`ssr-${property.id}`}
                      id={property.id}
                      title={property.title}
                      location={property.location}
                      slug={property.slug}
                      price={property.price}
                      beds={property.beds}
                      baths={property.baths}
                      sqft={property.sqft}
                      imageUrl={property.imageUrl}
                      className='bg-white shadow-sm hover:shadow-lg transition-shadow'
                    />
                  ))}
                </div>

                {/* Client-Side Version - Will hydrate and replace SSR version when JS loads */}
                <div id="csr-properties" style={{ display: 'none' }} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
                  {transformedProperties.map((property) => (
                    <LuxePropCard 
                      key={`csr-${property.id}`}
                      id={property.id}
                      title={property.title}
                      location={property.location}
                      slug={property.slug}
                      price={property.price}
                      beds={property.beds}
                      baths={property.baths}
                      sqft={property.sqft}
                      imageUrl={property.imageUrl}
                      className='bg-white shadow-sm hover:shadow-lg transition-shadow'
                    />
                  ))}
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

                {/* Note: Pagination functionality requires client-side state management */}
                {transformedProperties.length > 12 && (
                  <div className="text-center text-gray-500 text-sm mt-8">
                    Showing {transformedProperties.length} properties
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error fetching luxe properties:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-playfair font-medium text-gray-800 mb-4">
            Unable to Load Luxe Properties
          </h1>
          <p className="text-gray-600 mb-4">
            We&apos;re experiencing technical difficulties. Please try again later.
          </p>
          <a 
            href="/luxe/properties"
            className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Refresh Page
          </a>
        </div>
      </div>
    );
  }
}
