import { PropertyType } from '@/types/property';
import { StructuredDataSchema } from './structured-data-generator';

export interface LuxePageSchema {
  '@context': string;
  '@type': string;
  '@id': string;
  name: string;
  description: string;
  url: string;
  mainEntity?: StructuredDataSchema;
  breadcrumb?: StructuredDataSchema;
  potentialAction?: {
    '@type': string;
    target: string;
    name: string;
  };
  about?: {
    '@type': string;
    name: string;
    description: string;
  };
  provider?: {
    '@type': string;
    name: string;
    url: string;
  };
}

export interface LuxeCollectionSchema {
  '@context': string;
  '@type': string;
  '@id': string;
  name: string;
  description: string;
  url: string;
  numberOfItems?: number;
  mainEntity?: {
    '@type': string;
    name: string;
    description: string;
    itemListElement?: Array<{
      '@type': string;
      position: number;
      item: StructuredDataSchema;
    }>;
  };
}

export interface LuxeAdvisorSchema {
  '@context': string;
  '@type': string;
  '@id': string;
  name: string;
  jobTitle: string;
  description?: string;
  image?: string;
  email?: string;
  telephone?: string;
  url: string;
  worksFor: {
    '@type': string;
    name: string;
    url: string;
  };
  knowsAbout: string[];
  areaServed: {
    '@type': string;
    name: string;
  };
  expertise?: string[];
  award?: string[];
}

export interface LuxeJournalSchema {
  '@context': string;
  '@type': string;
  '@id': string;
  headline: string;
  description: string;
  author: {
    '@type': string;
    name: string;
    url?: string;
  };
  publisher: {
    '@type': string;
    name: string;
    url: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  image?: string;
  articleSection: string;
  keywords: string[];
  about: {
    '@type': string;
    name: string;
    description: string;
  };
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
}

export class LuxeStructuredDataGenerator {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
  }

  /**
   * Generate structured data for the Luxe home page
   */
  generateLuxeHomeSchema(): LuxePageSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${this.baseUrl}/luxe`,
      name: 'Luxe - Exclusive Luxury Real Estate Collection',
      description: 'Discover Dubai\'s most exclusive luxury properties, expert advisors, and premium insights from TRPE Global\'s Luxe collection.',
      url: `${this.baseUrl}/luxe`,
      about: {
        '@type': 'Thing',
        name: 'Luxury Real Estate in Dubai',
        description: 'Premium luxury properties, expert advisors, and exclusive market insights'
      },
      provider: {
        '@type': 'Organization',
        name: 'TRPE Global',
        url: this.baseUrl
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/luxe/properties?search={search_term}`,
        name: 'Search Luxury Properties'
      }
    };
  }

  /**
   * Generate structured data for Luxe Properties collection page
   */
  generateLuxePropertiesSchema(properties?: PropertyType[]): LuxeCollectionSchema {
    const schema: LuxeCollectionSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${this.baseUrl}/luxe/properties`,
      name: 'Luxe Properties - Exclusive Luxury Real Estate',
      description: 'Browse our curated collection of luxury properties for sale and rent in Dubai\'s most prestigious locations.',
      url: `${this.baseUrl}/luxe/properties`,
      numberOfItems: properties?.length || 0,
      mainEntity: {
        '@type': 'ItemList',
        name: 'Luxury Properties Collection',
        description: 'Curated selection of premium luxury properties in Dubai',
        itemListElement: properties?.slice(0, 10).map((property, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: this.generateLuxePropertySchema(property)
        })) || []
      }
    };

    return schema;
  }

  /**
   * Generate structured data for individual Luxe property
   */
  generateLuxePropertySchema(property: PropertyType): StructuredDataSchema {
    const propertyUrl = `${this.baseUrl}/luxe/property/${property.slug}`;
    const primaryImage = property.images && property.images.length > 0 ? (property.images[0].s3Url || property.images[0].crmUrl) : undefined;
    
    return {
      '@context': 'https://schema.org',
      '@type': ['Product', 'Accommodation', 'LuxuryAccommodation'],
      '@id': propertyUrl,
      name: property.title,
      description: property.description || `Luxury ${property.type?.name || 'property'} in ${property.community?.name || 'Dubai'}`,
      url: propertyUrl,
      image: primaryImage,
      brand: {
        '@type': 'Brand',
        name: 'TRPE Luxe',
        description: 'Exclusive luxury real estate collection'
      },
      category: 'Luxury Real Estate',
      offers: {
        '@type': 'Offer',
        price: property.price?.toString(),
        priceCurrency: 'AED',
        availability: 'https://schema.org/InStock',
        priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
        seller: {
          '@type': 'Organization',
          name: 'TRPE Global',
          url: this.baseUrl
        }
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Property Type',
          value: property.type?.name || 'Luxury Property'
        },
        {
          '@type': 'PropertyValue',
          name: 'Bedrooms',
          value: property.bedrooms?.toString() || 'TBD'
        },
        {
          '@type': 'PropertyValue',
          name: 'Bathrooms',
          value: property.bathrooms?.toString() || 'TBD'
        },
        {
          '@type': 'PropertyValue',
          name: 'Size',
          value: property.size ? `${property.size} sqft` : 'TBD'
        },
        {
          '@type': 'PropertyValue',
          name: 'Community',
          value: property.community?.name || 'Dubai'
        }
      ],
      geo: property.latitude && property.longitude ? {
        '@type': 'GeoCoordinates',
        latitude: parseFloat(property.latitude),
        longitude: parseFloat(property.longitude)
      } : undefined
    };
  }

  /**
   * Generate structured data for Luxe Journals collection page
   */
  generateLuxeJournalsSchema(journalsCount?: number): LuxeCollectionSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${this.baseUrl}/luxe/journals`,
      name: 'Luxe Journals - Exclusive Real Estate Insights',
      description: 'Exclusive insights, trends, and expert analysis from Dubai\'s luxury real estate market.',
      url: `${this.baseUrl}/luxe/journals`,
      numberOfItems: journalsCount || 0,
      mainEntity: {
        '@type': 'ItemList',
        name: 'Luxury Real Estate Insights Collection',
        description: 'Premium insights and trends from Dubai\'s luxury real estate market'
      }
    };
  }

  /**
   * Generate structured data for individual Luxe journal article
   */
  generateLuxeJournalSchema(journal: {
    title: string;
    slug: string;
    description?: string;
    content?: string;
    publishedAt: string;
    updatedAt?: string;
    author?: {
      name: string;
      slug?: string;
    };
    category?: {
      name: string;
      slug: string;
    };
    image?: string;
    keywords?: string[];
  }): LuxeJournalSchema {
    const journalUrl = `${this.baseUrl}/luxe/journals/${journal.slug}`;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': journalUrl,
      headline: journal.title,
      description: journal.description || journal.title,
      author: {
        '@type': 'Person',
        name: journal.author?.name || 'TRPE Luxe Team',
        url: journal.author?.slug ? `${this.baseUrl}/luxe/advisors/${journal.author.slug}` : undefined
      },
      publisher: {
        '@type': 'Organization',
        name: 'TRPE Luxe',
        url: `${this.baseUrl}/luxe`,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/images/luxe-logo.png`
        }
      },
      datePublished: journal.publishedAt,
      dateModified: journal.updatedAt || journal.publishedAt,
      image: journal.image,
      articleSection: journal.category?.name || 'Luxury Real Estate',
      keywords: journal.keywords || ['luxury real estate', 'Dubai', 'premium properties'],
      about: {
        '@type': 'Thing',
        name: 'Luxury Real Estate in Dubai',
        description: 'Premium real estate market insights and trends'
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': journalUrl
      }
    };
  }

  /**
   * Generate structured data for Luxe Advisors collection page
   */
  generateLuxeAdvisorsSchema(advisorsCount?: number): LuxeCollectionSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${this.baseUrl}/luxe/advisors`,
      name: 'Luxe Advisors - Expert Luxury Real Estate Consultants',
      description: 'Meet our team of expert luxury real estate advisors specializing in Dubai\'s premium property market.',
      url: `${this.baseUrl}/luxe/advisors`,
      numberOfItems: advisorsCount || 0,
      mainEntity: {
        '@type': 'ItemList',
        name: 'Luxury Real Estate Advisors',
        description: 'Expert consultants specializing in luxury properties'
      }
    };
  }

  /**
   * Generate structured data for individual Luxe advisor
   */
  generateLuxeAdvisorSchema(advisor: {
    name: string;
    slug: string;
    title?: string;
    bio?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    expertise?: string[];
    languages?: string[];
  }): LuxeAdvisorSchema {
    const advisorUrl = `${this.baseUrl}/luxe/advisors/${advisor.slug}`;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': advisorUrl,
      name: advisor.name,
      jobTitle: advisor.title || 'Luxury Real Estate Advisor',
      description: advisor.bio,
      image: advisor.avatarUrl,
      email: advisor.email,
      telephone: advisor.phone,
      url: advisorUrl,
      worksFor: {
        '@type': 'Organization',
        name: 'TRPE Luxe',
        url: `${this.baseUrl}/luxe`
      },
      knowsAbout: [
        'Luxury Real Estate',
        'Dubai Property Market',
        'Premium Properties',
        'Investment Advisory',
        'Property Valuation',
        ...(advisor.expertise || [])
      ],
      areaServed: {
        '@type': 'City',
        name: 'Dubai, UAE'
      },
      expertise: advisor.expertise || [
        'Luxury Property Sales',
        'Investment Consultation',
        'Market Analysis',
        'Client Advisory'
      ]
    };
  }

  /**
   * Generate WebSite schema for Luxe section
   */
  generateLuxeWebsiteSchema(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${this.baseUrl}/luxe`,
      name: 'TRPE Luxe',
      description: 'Exclusive luxury real estate collection featuring premium properties, expert advisors, and market insights in Dubai',
      url: `${this.baseUrl}/luxe`,
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${this.baseUrl}/luxe/properties?search={search_term}`,
            actionPlatform: [
              'https://schema.org/DesktopWebPlatform',
              'https://schema.org/MobileWebPlatform'
            ]
          },
          'query-input': 'required name=search_term'
        }
      ],
      publisher: {
        '@type': 'Organization',
        name: 'TRPE Global',
        url: this.baseUrl
      }
    };
  }
}

// Export singleton instance
export const luxeStructuredData = new LuxeStructuredDataGenerator();
