import React from 'react';
import { PropertyType } from '@/types/property';

export interface StructuredDataConfig {
  includeAgent?: boolean;
  includeImages?: boolean;
  includeLocation?: boolean;
  includeOffers?: boolean;
}

/**
 * Generates comprehensive structured data for property pages
 * Follows schema.org RealEstate specifications for better SEO
 */
export function generatePropertyStructuredData(
  property: PropertyType, 
  config: StructuredDataConfig = {}
) {
  const {
    includeAgent = true,
    includeImages = true,
    includeLocation = true,
    includeOffers = true
  } = config;

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
  const propertyUrl = `${baseUrl}/properties/${property.offeringType?.slug}/${property.slug}`;

  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": propertyUrl,
    "name": property.title,
    "description": property.description || `${property.bedrooms} bedroom ${property.type?.name} in ${property.community?.name}`,
    "url": propertyUrl,
    "sku": property.id,
    "category": property.type?.name,
    "brand": {
      "@type": "Organization",
      "name": "TRPE Global",
      "url": baseUrl
    }
  };

  // Add images if available and requested
  if (includeImages && property.images && property.images.length > 0) {
    structuredData.image = property.images.map(img => ({
      "@type": "ImageObject",
      "url": img.crmUrl,
      "caption": property.title
    }));
  }

  // Add location data
  if (includeLocation && property.community) {
    structuredData.location = {
      "@type": "Place",
      "name": property.community.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": property.community.name,
        "addressRegion": property.city?.name || "Dubai",
        "addressCountry": "AE"
      }
    };

    // Add coordinates if available
    if (property.latitude && property.longitude) {
      structuredData.location.geo = {
        "@type": "GeoCoordinates",
        "latitude": property.latitude,
        "longitude": property.longitude
      };
    }
  }

  // Add offers/pricing information
  if (includeOffers && property.price) {
    structuredData.offers = {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "AED",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      "url": propertyUrl
    };

    // Add seller information if agent data is available
    if (includeAgent && property.agent) {
      structuredData.offers.seller = {
        "@type": "RealEstateAgent",
        "name": `${property.agent.firstName} ${property.agent.lastName}`,
        "telephone": property.agent.phone,
        "email": property.agent.email
      };
    }
  }

  // Add property-specific details
  const propertyDetails: any = {};
  
  if (property.size) {
    propertyDetails.floorSize = {
      "@type": "QuantitativeValue",
      "value": property.size,
      "unitText": "sqft"
    };
  }

  if (property.bedrooms) {
    propertyDetails.numberOfRooms = property.bedrooms;
  }

  if (property.bathrooms) {
    propertyDetails.numberOfBathroomsTotal = property.bathrooms;
  }

  // Add additional property schema for real estate
  const realEstateData = {
    ...structuredData,
    ...propertyDetails,
    "@type": ["Product", "Accommodation"],
    "additionalType": "https://schema.org/Residence",
    "datePosted": property.createdAt,
    "dateModified": property.updatedAt || property.createdAt
  };

  return JSON.stringify(realEstateData, null, 2);
}

/**
 * Generates breadcrumb structured data for property pages
 */
export function generateBreadcrumbStructuredData(
  property: PropertyType,
  additionalCrumbs: Array<{ name: string; url: string }> = []
) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
  
  const breadcrumbs = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": baseUrl
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Properties",
      "item": `${baseUrl}/properties`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": property.offeringType?.name || "Properties",
      "item": `${baseUrl}/properties/${property.offeringType?.slug}`
    },
    ...additionalCrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": 4 + index,
      "name": crumb.name,
      "item": crumb.url
    })),
    {
      "@type": "ListItem",
      "position": 4 + additionalCrumbs.length,
      "name": property.title,
      "item": `${baseUrl}/properties/${property.offeringType?.slug}/${property.slug}`
    }
  ];

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs
  }, null, 2);
}

/**
 * Generates organization structured data for the company
 */
export function generateOrganizationStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
  
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "TRPE Global",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Leading real estate agency in Dubai specializing in property sales and rentals",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dubai",
      "addressCountry": "AE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+971-XX-XXX-XXXX",
      "contactType": "customer service",
      "availableLanguage": ["en", "ar"]
    },
    "sameAs": [
      "https://facebook.com/trpeglobal",
      "https://instagram.com/trpeglobal",
      "https://linkedin.com/company/trpeglobal"
    ]
  }, null, 2);
}

/**
 * Generates local business structured data for SEO
 */
export function generateLocalBusinessStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
  
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TRPE Global",
    "image": `${baseUrl}/logo.png`,
    "url": baseUrl,
    "telephone": "+971-XX-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address",
      "addressLocality": "Dubai",
      "postalCode": "00000",
      "addressCountry": "AE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.2048,
      "longitude": 55.2708
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday", 
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  }, null, 2);
}

/**
 * Generates FAQ structured data for property pages
 */
export function generatePropertyFAQStructuredData(property: PropertyType) {
  const faqs = [
    {
      "@type": "Question",
      "name": `What is the price of this ${property.type?.name} in ${property.community?.name}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `This ${property.type?.name} in ${property.community?.name} is priced at AED ${property.price?.toLocaleString()}.`
      }
    },
    {
      "@type": "Question", 
      "name": `How many bedrooms does this property have?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `This property has ${property.bedrooms} bedroom${property.bedrooms !== 1 ? 's' : ''}.`
      }
    },
    {
      "@type": "Question",
      "name": `What is the area size of this property?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `This property has an area of ${property.size} square feet.`
      }
    }
  ];

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs
  }, null, 2);
}

/**
 * Component for injecting structured data into the page head
 */
export function StructuredDataScript({ data }: { data: string }) {
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: data }
  });
}

/**
 * Generates generic breadcrumb structured data from array of crumbs
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}
