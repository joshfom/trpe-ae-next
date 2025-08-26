import { Metadata } from 'next';
import { PropertyType } from '@/types/property';
import { generatePropertySEO } from '../seo-utils';
import { SEOHead } from '@/components/seo/SEOHead';
import { BreadcrumbNav, generatePropertyBreadcrumbs } from '@/components/seo/BreadcrumbNav';

/**
 * Example of how to implement SEO for a property detail page
 */

// This would be in your page.tsx file
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Fetch property data (this would be your actual data fetching)
  const property = await fetchPropertyBySlug(params.slug);
  
  if (!property) {
    return {
      title: 'Property Not Found | TRPE Global',
      description: 'The requested property could not be found.',
    };
  }

  // Generate SEO metadata using our utility
  const { metadata } = await generatePropertySEO(property);
  return metadata;
}

// This would be your page component
export default async function PropertyDetailPage({ params }: { params: { slug: string } }) {
  const property = await fetchPropertyBySlug(params.slug);
  
  if (!property) {
    return <div>Property not found</div>;
  }

  // Generate SEO data
  const { structuredData } = await generatePropertySEO(property);
  
  // Generate breadcrumbs
  const breadcrumbs = generatePropertyBreadcrumbs({
    title: property.title,
    slug: property.slug,
    offeringType: property.offeringType,
    community: property.community ? {
      name: property.community.name || '',
      slug: property.community.slug
    } : undefined
  });

  return (
    <>
      {/* SEO Head with structured data */}
      <SEOHead 
        metadata={{} as Metadata} // Metadata is handled by generateMetadata
        structuredData={structuredData}
        preloadResources={[
          {
            href: property.images?.[0]?.crmUrl || '',
            as: 'image',
            type: 'image/jpeg'
          }
        ]}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav 
          items={breadcrumbs}
          className="mb-6"
          showStructuredData={true}
        />
        
        {/* Property Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
            <p className="text-gray-600 mb-6">{property.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="font-semibold">Bedrooms:</span> {property.bedrooms}
              </div>
              <div>
                <span className="font-semibold">Bathrooms:</span> {property.bathrooms}
              </div>
              <div>
                <span className="font-semibold">Size:</span> {property.size} sqft
              </div>
              <div>
                <span className="font-semibold">Price:</span> AED {property.price?.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div>
            {property.images && property.images.length > 0 && (
              <img 
                src={property.images[0].crmUrl} 
                alt={property.title}
                className="w-full h-64 object-cover rounded-lg"
                loading="eager" // First image should load immediately
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Mock function - replace with your actual data fetching
async function fetchPropertyBySlug(slug: string): Promise<PropertyType | null> {
  // This would be your actual database query
  return {
    id: 'prop-123',
    title: 'Luxury 3BR Apartment in Downtown Dubai',
    slug: slug,
    description: 'Beautiful apartment with stunning views of the Burj Khalifa',
    bedrooms: 3,
    bathrooms: 2,
    size: 2000,
    price: 2500000,
    type: { name: 'Apartment' },
    community: { name: 'Downtown Dubai', slug: 'downtown-dubai' },
    city: { name: 'Dubai' },
    offeringType: { name: 'Sale', slug: 'sale' },
    images: [
      { crmUrl: 'https://example.com/property-image.jpg' }
    ],
    amenities: [
      { name: 'Swimming Pool' },
      { name: 'Gym' },
      { name: 'Parking' }
    ],
    agent: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+971501234567',
      email: 'john@trpe.ae'
    },
    latitude: 25.1972,
    longitude: 55.2744,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  } as unknown as PropertyType;
}