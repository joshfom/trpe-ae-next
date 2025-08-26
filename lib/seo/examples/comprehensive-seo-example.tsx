import React from 'react';
import { Metadata } from 'next';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoMetadataGenerator, PageContext } from '@/lib/seo/metadata-generator';
import { structuredDataGenerator } from '@/lib/seo/structured-data-generator';
import { canonicalURLGenerator } from '@/lib/seo/canonical-url-generator';
import { robotsMetaGenerator } from '@/lib/seo/robots-meta-generator';
import { hreflangGenerator } from '@/lib/seo/hreflang-generator';
import { PropertyType } from '@/types/property';

/**
 * Example: Property Detail Page with Comprehensive SEO
 * This example shows how to use all SEO components together for a property detail page
 */

interface PropertyPageProps {
  property: PropertyType;
  locale?: string;
}

export async function generatePropertyPageMetadata(
  property: PropertyType,
  locale: string = 'en'
): Promise<Metadata> {
  const context: PageContext = {
    path: `/properties/${property.offeringType?.slug}/${property.slug}`,
    pageType: 'property-detail',
    data: property,
    locale
  };

  return await seoMetadataGenerator.generateMetadata(context);
}

export function PropertyPageSEOHead({ property, locale = 'en' }: PropertyPageProps) {
  // Generate metadata
  const [metadata, setMetadata] = React.useState<Metadata | null>(null);

  React.useEffect(() => {
    generatePropertyPageMetadata(property, locale).then(setMetadata);
  }, [property, locale]);

  if (!metadata) return null;

  // Generate structured data
  const structuredData = [
    // Property structured data
    structuredDataGenerator.generatePropertySchema(property),
    
    // Organization structured data
    structuredDataGenerator.generateOrganizationSchema(),
    
    // Breadcrumb structured data
    structuredDataGenerator.generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Properties', url: '/properties' },
      { name: property.offeringType?.name || 'Properties', url: `/properties/${property.offeringType?.slug}` },
      { name: property.title, url: `/properties/${property.offeringType?.slug}/${property.slug}` }
    ])
  ];

  // Generate hreflang tags
  const hreflangTags = hreflangGenerator.generateHreflangTags(
    `/properties/${property.offeringType?.slug}/${property.slug}`,
    locale
  );

  // Define critical resources to preload
  const preloadResources = [
    // Preload the hero image
    ...(property.images?.[0]?.crmUrl ? [{
      href: property.images[0].crmUrl,
      as: 'image' as const,
      type: 'image/jpeg'
    }] : []),
    
    // Preload critical CSS
    {
      href: '/styles/critical.css',
      as: 'style' as const,
      type: 'text/css'
    }
  ];

  // Define pages to prefetch
  const prefetchUrls = [
    // Prefetch related properties or community page
    ...(property.community?.slug ? [`/communities/${property.community.slug}`] : []),
    '/properties', // Properties listing
    '/contact-us' // Contact page
  ];

  // Fallback metadata
  const fallbackMetadata = {
    title: `${property.title} | TRPE Global`,
    description: `${property.bedrooms} bedroom property in ${property.community?.name}, Dubai`,
    image: property.images?.[0]?.crmUrl || '/images/og-default.jpg'
  };

  return (
    <SEOHead
      metadata={metadata}
      structuredData={structuredData}
      hreflangTags={hreflangTags}
      preloadResources={preloadResources}
      prefetchUrls={prefetchUrls}
      fallbackMetadata={fallbackMetadata}
      enableValidation={process.env.NODE_ENV === 'development'}
      customHead={
        <>
          {/* Property-specific meta tags */}
          <meta name="property:price" content={property.price?.toString()} />
          <meta name="property:bedrooms" content={property.bedrooms?.toString()} />
          <meta name="property:type" content={property.type?.name} />
          <meta name="property:community" content={property.community?.name || undefined} />
          
          {/* Real estate specific Open Graph tags */}
          <meta property="product:price:amount" content={property.price?.toString()} />
          <meta property="product:price:currency" content="AED" />
          
          {/* Additional performance hints for property images */}
          {property.images?.slice(1, 4).map((image, index) => (
            <link
              key={`prefetch-image-${index}`}
              rel="prefetch"
              href={image.crmUrl}
              as="image"
            />
          ))}
        </>
      }
    />
  );
}

/**
 * Example: Properties Listing Page with SEO
 */

interface PropertiesListingPageProps {
  offeringType?: string;
  community?: string;
  propertyType?: string;
  page?: number;
  locale?: string;
}

export async function generatePropertiesListingMetadata({
  offeringType = 'properties',
  community,
  propertyType,
  page = 1,
  locale = 'en'
}: PropertiesListingPageProps): Promise<Metadata> {
  let path = `/properties`;
  if (offeringType !== 'properties') {
    path += `/${offeringType}`;
  }

  const context: PageContext = {
    path,
    pageType: 'properties',
    data: {
      offeringType: offeringType.charAt(0).toUpperCase() + offeringType.slice(1),
      community,
      propertyType,
      page
    },
    locale
  };

  return await seoMetadataGenerator.generateMetadata(context);
}

export function PropertiesListingPageSEOHead(props: PropertiesListingPageProps) {
  const [metadata, setMetadata] = React.useState<Metadata | null>(null);

  React.useEffect(() => {
    generatePropertiesListingMetadata(props).then(setMetadata);
  }, [props]);

  if (!metadata) return null;

  // Generate canonical URL with pagination support
  const canonicalUrl = canonicalURLGenerator.generateListingCanonicalURL(
    `/properties${props.offeringType ? `/${props.offeringType}` : ''}`,
    props.page
  );

  // Generate structured data
  const structuredData = [
    structuredDataGenerator.generateOrganizationSchema(),
    structuredDataGenerator.generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Properties', url: '/properties' },
      ...(props.offeringType ? [{ 
        name: props.offeringType.charAt(0).toUpperCase() + props.offeringType.slice(1), 
        url: `/properties/${props.offeringType}` 
      }] : [])
    ])
  ];

  // Generate hreflang tags
  const hreflangTags = hreflangGenerator.generateHreflangTags(
    `/properties${props.offeringType ? `/${props.offeringType}` : ''}`,
    props.locale
  );

  return (
    <SEOHead
      metadata={{
        ...metadata,
        alternates: {
          ...metadata.alternates,
          canonical: canonicalUrl
        }
      }}
      structuredData={structuredData}
      hreflangTags={hreflangTags}
      preloadResources={[
        {
          href: '/styles/properties-listing.css',
          as: 'style',
          type: 'text/css'
        }
      ]}
      prefetchUrls={[
        '/communities',
        '/insights',
        '/contact-us'
      ]}
      fallbackMetadata={{
        title: `Properties ${props.offeringType ? `for ${props.offeringType}` : ''} in Dubai | TRPE Global`,
        description: `Browse premium properties ${props.offeringType ? `for ${props.offeringType}` : ''} in Dubai with TRPE Global`,
        image: '/images/properties-og.jpg'
      }}
      enableValidation={process.env.NODE_ENV === 'development'}
    />
  );
}

/**
 * Example: Home Page with SEO
 */

export async function generateHomePageMetadata(locale: string = 'en'): Promise<Metadata> {
  const context: PageContext = {
    path: '/',
    pageType: 'home',
    locale
  };

  return await seoMetadataGenerator.generateMetadata(context);
}

export function HomePageSEOHead({ locale = 'en' }: { locale?: string }) {
  const [metadata, setMetadata] = React.useState<Metadata | null>(null);

  React.useEffect(() => {
    generateHomePageMetadata(locale).then(setMetadata);
  }, [locale]);

  if (!metadata) return null;

  // Generate comprehensive structured data for home page
  const structuredData = [
    structuredDataGenerator.generateOrganizationSchema(),
    
    // Local business structured data
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://trpe.ae/#organization',
      name: 'TRPE Global',
      description: 'Dubai\'s leading real estate agency specializing in luxury properties',
      url: 'https://trpe.ae',
      telephone: '+971-4-XXX-XXXX',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Dubai Marina',
        addressLocality: 'Dubai',
        addressCountry: 'AE'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 25.2048,
        longitude: 55.2708
      },
      openingHours: 'Mo-Su 09:00-18:00',
      priceRange: '$$$',
      servesCuisine: 'Real Estate Services'
    }
  ];

  // Generate hreflang tags
  const hreflangTags = hreflangGenerator.generateHreflangTags('/', locale);

  return (
    <SEOHead
      metadata={metadata}
      structuredData={structuredData}
      hreflangTags={hreflangTags}
      preloadResources={[
        {
          href: '/styles/critical-home.css',
          as: 'style',
          type: 'text/css'
        },
        {
          href: '/images/hero-banner.jpg',
          as: 'image',
          type: 'image/jpeg'
        }
      ]}
      prefetchUrls={[
        '/properties',
        '/communities',
        '/insights',
        '/about-us'
      ]}
      fallbackMetadata={{
        title: 'TRPE Global - Dubai\'s Premier Real Estate Agency',
        description: 'Find the best properties for sale and rent in Dubai with TRPE Global, Dubai\'s leading real estate agency.',
        image: '/images/home-og.jpg'
      }}
      enableValidation={process.env.NODE_ENV === 'development'}
      customHead={
        <>
          {/* Home page specific meta tags */}
          <meta name="google-site-verification" content="your-verification-code" />
          <meta name="msvalidate.01" content="your-bing-verification-code" />
          
          {/* Rich snippets for real estate business */}
          <meta name="business:contact_data:street_address" content="Dubai Marina" />
          <meta name="business:contact_data:locality" content="Dubai" />
          <meta name="business:contact_data:region" content="Dubai" />
          <meta name="business:contact_data:postal_code" content="00000" />
          <meta name="business:contact_data:country_name" content="United Arab Emirates" />
        </>
      }
    />
  );
}

/**
 * Utility function to generate SEO metadata for any page type
 */
export async function generatePageSEOMetadata(
  pageType: PageContext['pageType'],
  path: string,
  data?: any,
  locale: string = 'en'
): Promise<{
  metadata: Metadata;
  structuredData: any[];
  hreflangTags: any[];
  canonicalUrl: string;
}> {
  const context: PageContext = {
    path,
    pageType,
    data,
    locale
  };

  const metadata = await seoMetadataGenerator.generateMetadata(context);
  const canonicalUrl = canonicalURLGenerator.generateCanonicalURL({ path });
  const hreflangTags = hreflangGenerator.generateHreflangTags(path, locale);

  // Generate appropriate structured data based on page type
  let structuredData: any[] = [
    structuredDataGenerator.generateOrganizationSchema()
  ];

  switch (pageType) {
    case 'property-detail':
      if (data) {
        structuredData.push(structuredDataGenerator.generatePropertySchema(data));
      }
      break;
    case 'home':
      // Add local business data for home page
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'TRPE Global',
        url: 'https://trpe.ae'
      });
      break;
  }

  return {
    metadata,
    structuredData,
    hreflangTags,
    canonicalUrl
  };
}