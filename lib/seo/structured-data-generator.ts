import { PropertyType } from '@/types/property';

export interface StructuredDataSchema {
  '@context': string;
  '@type': string | string[];
  [key: string]: any;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface OrganizationConfig {
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    telephone: string;
    email: string;
    contactType: string;
    availableLanguage: string[];
  };
  socialMedia: string[];
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: {
    dayOfWeek: string[];
    opens: string;
    closes: string;
  };
}

export class StructuredDataGenerator {
  private baseUrl: string;
  private organizationConfig: OrganizationConfig;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
    this.organizationConfig = {
      name: 'TRPE Global',
      url: this.baseUrl,
      logo: `${this.baseUrl}/images/logo.png`,
      description: 'Leading real estate agency in Dubai specializing in luxury properties, sales, and rentals with expert market knowledge and personalized service.',
      address: {
        streetAddress: 'Business Bay, Dubai',
        addressLocality: 'Dubai',
        postalCode: '00000',
        addressCountry: 'AE'
      },
      contactPoint: {
        telephone: '+971-4-XXX-XXXX',
        email: 'info@trpe.ae',
        contactType: 'customer service',
        availableLanguage: ['en', 'ar']
      },
      socialMedia: [
        'https://facebook.com/trpeglobal',
        'https://instagram.com/trpeglobal',
        'https://linkedin.com/company/trpeglobal',
        'https://twitter.com/trpeglobal'
      ],
      geo: {
        latitude: 25.1972,
        longitude: 55.2744
      },
      openingHours: {
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00'
      }
    };
  }

  /**
   * Generate comprehensive property structured data
   */
  generatePropertySchema(property: PropertyType): StructuredDataSchema {
    const propertyUrl = `${this.baseUrl}/properties/${property.offeringType?.slug}/${property.slug}`;
    
    const baseSchema: StructuredDataSchema = {
      '@context': 'https://schema.org',
      '@type': ['Product', 'Accommodation', 'Residence'],
      '@id': propertyUrl,
      name: property.title,
      description: this.generatePropertyDescription(property),
      url: propertyUrl,
      identifier: property.id,
      sku: property.id,
      category: property.type?.name,
      additionalType: 'https://schema.org/Residence',
      datePosted: property.createdAt,
      dateModified: property.updatedAt || property.createdAt
    };

    // Add images
    if (property.images && property.images.length > 0) {
      baseSchema.image = property.images.map(img => ({
        '@type': 'ImageObject',
        url: img.crmUrl,
        caption: property.title,
        width: 800,
        height: 600
      }));
    }

    // Add location data
    if (property.community) {
      baseSchema.location = {
        '@type': 'Place',
        name: property.community.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: property.community.name,
          addressRegion: property.city?.name || 'Dubai',
          addressCountry: 'AE'
        }
      };

      if (property.latitude && property.longitude) {
        baseSchema.location.geo = {
          '@type': 'GeoCoordinates',
          latitude: property.latitude,
          longitude: property.longitude
        };
      }
    }

    // Add offers/pricing
    if (property.price) {
      baseSchema.offers = {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'AED',
        availability: 'https://schema.org/InStock',
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        url: propertyUrl,
        seller: {
          '@type': 'RealEstateAgent',
          name: this.organizationConfig.name,
          url: this.organizationConfig.url
        }
      };

      // Add agent information if available
      if (property.agent) {
        baseSchema.offers.seller = {
          '@type': 'RealEstateAgent',
          name: `${property.agent.firstName} ${property.agent.lastName}`,
          telephone: property.agent.phone,
          email: property.agent.email,
          worksFor: {
            '@type': 'RealEstateAgent',
            name: this.organizationConfig.name,
            url: this.organizationConfig.url
          }
        };
      }
    }

    // Add property-specific details
    if (property.size) {
      baseSchema.floorSize = {
        '@type': 'QuantitativeValue',
        value: property.size,
        unitText: 'sqft',
        unitCode: 'FTK'
      };
    }

    if (property.bedrooms) {
      baseSchema.numberOfRooms = property.bedrooms;
      baseSchema.numberOfBedrooms = property.bedrooms;
    }

    if (property.bathrooms) {
      baseSchema.numberOfBathroomsTotal = property.bathrooms;
    }

    // Add amenities (Note: amenities relationship needs to be included in PropertyType)
    // TODO: Add amenities relationship to PropertyType and implement proper amenity loading
    // if (property.amenities && property.amenities.length > 0) {
    //   baseSchema.amenityFeature = property.amenities.map(amenity => ({
    //     '@type': 'LocationFeatureSpecification',
    //     name: amenity.name,
    //     value: true
    //   }));
    // }

    // Add brand/organization
    baseSchema.brand = {
      '@type': 'Organization',
      name: this.organizationConfig.name,
      url: this.organizationConfig.url,
      logo: this.organizationConfig.logo
    };

    return baseSchema;
  }

  /**
   * Generate organization structured data
   */
  generateOrganizationSchema(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      '@id': `${this.baseUrl}#organization`,
      name: this.organizationConfig.name,
      url: this.organizationConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: this.organizationConfig.logo,
        width: 300,
        height: 100
      },
      description: this.organizationConfig.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: this.organizationConfig.address.streetAddress,
        addressLocality: this.organizationConfig.address.addressLocality,
        postalCode: this.organizationConfig.address.postalCode,
        addressCountry: this.organizationConfig.address.addressCountry
      },
      geo: this.organizationConfig.geo ? {
        '@type': 'GeoCoordinates',
        latitude: this.organizationConfig.geo.latitude,
        longitude: this.organizationConfig.geo.longitude
      } : undefined,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: this.organizationConfig.contactPoint.telephone,
        email: this.organizationConfig.contactPoint.email,
        contactType: this.organizationConfig.contactPoint.contactType,
        availableLanguage: this.organizationConfig.contactPoint.availableLanguage
      },
      sameAs: this.organizationConfig.socialMedia,
      foundingDate: '2020',
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: '50-100'
      },
      areaServed: {
        '@type': 'City',
        name: 'Dubai',
        addressCountry: 'AE'
      },
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 25.2048,
          longitude: 55.2708
        },
        geoRadius: '50000'
      }
    };
  }

  /**
   * Generate local business structured data
   */
  generateLocalBusinessSchema(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${this.baseUrl}#localbusiness`,
      name: this.organizationConfig.name,
      image: this.organizationConfig.logo,
      url: this.organizationConfig.url,
      telephone: this.organizationConfig.contactPoint.telephone,
      email: this.organizationConfig.contactPoint.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: this.organizationConfig.address.streetAddress,
        addressLocality: this.organizationConfig.address.addressLocality,
        postalCode: this.organizationConfig.address.postalCode,
        addressCountry: this.organizationConfig.address.addressCountry
      },
      geo: this.organizationConfig.geo ? {
        '@type': 'GeoCoordinates',
        latitude: this.organizationConfig.geo.latitude,
        longitude: this.organizationConfig.geo.longitude
      } : undefined,
      openingHoursSpecification: this.organizationConfig.openingHours ? {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: this.organizationConfig.openingHours.dayOfWeek,
        opens: this.organizationConfig.openingHours.opens,
        closes: this.organizationConfig.openingHours.closes
      } : undefined,
      priceRange: '$$$',
      currenciesAccepted: 'AED',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '150',
        bestRating: '5',
        worstRating: '1'
      }
    };
  }

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: {
          '@type': 'WebPage',
          '@id': crumb.url,
          url: crumb.url,
          name: crumb.name
        }
      }))
    };
  }

  /**
   * Generate FAQ structured data
   */
  generateFAQSchema(faqs: FAQItem[]): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  /**
   * Generate website structured data
   */
  generateWebsiteSchema(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${this.baseUrl}#website`,
      url: this.baseUrl,
      name: this.organizationConfig.name,
      description: this.organizationConfig.description,
      publisher: {
        '@id': `${this.baseUrl}#organization`
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/properties?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      },
      inLanguage: ['en', 'ar']
    };
  }

  /**
   * Generate article structured data for insights
   */
  generateArticleSchema(article: any): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${this.baseUrl}/insights/${article.slug}`,
      headline: article.title,
      description: article.excerpt,
      image: article.featuredImage ? {
        '@type': 'ImageObject',
        url: article.featuredImage,
        width: 1200,
        height: 630
      } : undefined,
      datePublished: article.publishedAt || article.createdAt,
      dateModified: article.updatedAt || article.createdAt,
      author: {
        '@type': 'Person',
        name: article.author?.name || 'TRPE Global Team',
        url: article.author?.url || this.baseUrl
      },
      publisher: {
        '@type': 'Organization',
        name: this.organizationConfig.name,
        logo: {
          '@type': 'ImageObject',
          url: this.organizationConfig.logo,
          width: 300,
          height: 100
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.baseUrl}/insights/${article.slug}`
      },
      articleSection: 'Real Estate',
      keywords: article.tags || ['Dubai real estate', 'property market', 'investment'],
      wordCount: article.content?.length || 1000,
      inLanguage: 'en'
    };
  }

  /**
   * Generate property listing page structured data
   */
  generatePropertyListingSchema(properties: PropertyType[], pageInfo: any): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      numberOfItems: properties.length,
      itemListElement: properties.map((property, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          '@id': `${this.baseUrl}/properties/${property.offeringType?.slug}/${property.slug}`,
          name: property.title,
          description: this.generatePropertyDescription(property),
          image: property.images?.[0]?.crmUrl,
          offers: property.price ? {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: 'AED'
          } : undefined
        }
      }))
    };
  }

  /**
   * Generate community structured data
   */
  generateCommunitySchema(community: any): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Place',
      '@id': `${this.baseUrl}/communities/${community.slug}`,
      name: community.name,
      description: community.description,
      image: community.image,
      address: {
        '@type': 'PostalAddress',
        addressLocality: community.name,
        addressRegion: 'Dubai',
        addressCountry: 'AE'
      },
      geo: community.latitude && community.longitude ? {
        '@type': 'GeoCoordinates',
        latitude: community.latitude,
        longitude: community.longitude
      } : undefined,
      containedInPlace: {
        '@type': 'City',
        name: 'Dubai',
        addressCountry: 'AE'
      },
      additionalProperty: community.amenities?.map((amenity: any) => ({
        '@type': 'PropertyValue',
        name: amenity.name,
        value: true
      }))
    };
  }

  /**
   * Helper method to generate property description
   */
  private generatePropertyDescription(property: PropertyType): string {
    const parts = [];
    
    if (property.bedrooms) {
      parts.push(`${property.bedrooms} bedroom`);
    }
    
    if (property.type?.name) {
      parts.push(property.type.name.toLowerCase());
    }
    
    if (property.community?.name) {
      parts.push(`in ${property.community.name}`);
    }
    
    if (property.size) {
      parts.push(`${property.size} sqft`);
    }
    
    if (property.price) {
      parts.push(`AED ${property.price.toLocaleString()}`);
    }
    
    const baseDescription = parts.join(' ');
    
    return property.description || 
           `${baseDescription}. Premium property for ${property.offeringType?.name?.toLowerCase()} in Dubai with modern amenities and excellent location.`;
  }
}

// Export singleton instance
export const structuredDataGenerator = new StructuredDataGenerator();