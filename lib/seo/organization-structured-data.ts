export interface OrganizationConfig {
  name: string;
  url: string;
  logo: string;
  description: string;
  foundingDate: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    telephone: string;
    email: string;
    contactType: string;
    availableLanguage: string[];
    hoursAvailable?: {
      dayOfWeek: string[];
      opens: string;
      closes: string;
    };
  };
  socialMedia: string[];
  geo?: {
    latitude: number;
    longitude: number;
  };
  businessVerification?: {
    duns?: string;
    taxID?: string;
    vatID?: string;
    legalName?: string;
  };
  awards?: Array<{
    name: string;
    year: string;
    awardingBody: string;
  }>;
  certifications?: Array<{
    name: string;
    issuingOrganization: string;
    validFrom: string;
    validUntil?: string;
  }>;
}

export interface LocalBusinessConfig extends OrganizationConfig {
  openingHours: {
    dayOfWeek: string[];
    opens: string;
    closes: string;
  };
  priceRange: string;
  currenciesAccepted: string[];
  paymentAccepted: string[];
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
    bestRating: string;
    worstRating: string;
  };
  serviceArea?: {
    type: 'GeoCircle' | 'AdministrativeArea';
    geoMidpoint?: {
      latitude: number;
      longitude: number;
    };
    geoRadius?: string;
    addressCountry?: string;
    addressRegion?: string;
  };
  hasOfferCatalog?: {
    name: string;
    itemListElement: Array<{
      name: string;
      description: string;
      category: string;
    }>;
  };
}

export interface OrganizationStructuredDataSchema {
  '@context': string;
  '@type': string | string[];
  '@id': string;
  name: string;
  alternateName?: string;
  url: string;
  logo: any;
  description: string;
  foundingDate: string;
  address: any;
  geo?: any;
  contactPoint: any;
  sameAs: string[];
  numberOfEmployees?: any;
  areaServed?: any;
  serviceArea?: any;
  knowsAbout?: string[];
  memberOf?: any[];
  awards?: any[];
  hasCredential?: any[];
  slogan?: string;
  brand?: any;
  parentOrganization?: any;
  subOrganization?: any[];
  department?: any[];
}

export interface LocalBusinessStructuredDataSchema extends OrganizationStructuredDataSchema {
  '@type': 'LocalBusiness' | string[];
  telephone: string;
  email: string;
  image: string;
  openingHoursSpecification: any;
  priceRange: string;
  currenciesAccepted: string;
  paymentAccepted: string;
  aggregateRating?: any;
  hasOfferCatalog?: any;
  makesOffer?: any[];
}

/**
 * OrganizationStructuredData class for generating comprehensive organization
 * and local business structured data with enhanced business information
 */
export class OrganizationStructuredData {
  private config: OrganizationConfig;

  constructor(config?: Partial<OrganizationConfig>) {
    const defaultConfig: OrganizationConfig = {
      name: 'TRPE Global',
      url: process.env.NEXT_PUBLIC_URL || 'https://trpe.ae',
      logo: `${process.env.NEXT_PUBLIC_URL || 'https://trpe.ae'}/images/logo.png`,
      description: 'Leading real estate agency in Dubai specializing in luxury properties, sales, and rentals with expert market knowledge and personalized service.',
      foundingDate: '2020-01-01',
      address: {
        streetAddress: 'Business Bay',
        addressLocality: 'Business Bay',
        addressRegion: 'Dubai',
        postalCode: '00000',
        addressCountry: 'AE'
      },
      contactPoint: {
        telephone: '+971-4-XXX-XXXX',
        email: 'info@trpe.ae',
        contactType: 'customer service',
        availableLanguage: ['en', 'ar'],
        hoursAvailable: {
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '18:00'
        }
      },
      socialMedia: [
        'https://facebook.com/trpeglobal',
        'https://instagram.com/trpeglobal',
        'https://linkedin.com/company/trpeglobal',
        'https://twitter.com/trpeglobal',
        'https://youtube.com/trpeglobal'
      ]
    };

    // Only add optional fields if not explicitly provided in config
    if (!config || config.geo !== undefined) {
      defaultConfig.geo = config?.geo || {
        latitude: 25.1972,
        longitude: 55.2744
      };
    }

    if (!config || config.businessVerification !== undefined) {
      defaultConfig.businessVerification = config?.businessVerification || {
        legalName: 'TRPE Global Real Estate LLC',
        taxID: 'AE-TAX-123456789',
        vatID: 'AE-VAT-987654321'
      };
    }

    if (!config || config.awards !== undefined) {
      defaultConfig.awards = config?.awards || [
        {
          name: 'Best Real Estate Agency Dubai',
          year: '2023',
          awardingBody: 'Dubai Real Estate Awards'
        },
        {
          name: 'Excellence in Customer Service',
          year: '2022',
          awardingBody: 'UAE Business Excellence Awards'
        }
      ];
    }

    if (!config || config.certifications !== undefined) {
      defaultConfig.certifications = config?.certifications || [
        {
          name: 'RERA Licensed Real Estate Broker',
          issuingOrganization: 'Dubai Land Department',
          validFrom: '2020-01-01',
          validUntil: '2025-12-31'
        },
        {
          name: 'ISO 9001:2015 Quality Management',
          issuingOrganization: 'International Organization for Standardization',
          validFrom: '2021-01-01',
          validUntil: '2024-12-31'
        }
      ];
    }

    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Generate comprehensive Organization structured data
   * Optimized for real estate companies with business verification
   */
  generateOrganizationSchema(configOverride?: Partial<OrganizationConfig>): OrganizationStructuredDataSchema {
    const effectiveConfig = configOverride ? { ...this.config, ...configOverride } : this.config;
    const schema: OrganizationStructuredDataSchema = {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'RealEstateAgent'],
      '@id': `${effectiveConfig.url}#organization`,
      name: effectiveConfig.name,
      alternateName: effectiveConfig.businessVerification?.legalName,
      url: effectiveConfig.url,
      logo: {
        '@type': 'ImageObject',
        '@id': `${effectiveConfig.url}#logo`,
        url: effectiveConfig.logo,
        caption: `${effectiveConfig.name} Logo`,
        width: 300,
        height: 100,
        contentUrl: effectiveConfig.logo
      },
      description: effectiveConfig.description,
      foundingDate: effectiveConfig.foundingDate,
      address: {
        '@type': 'PostalAddress',
        '@id': `${effectiveConfig.url}#address`,
        streetAddress: effectiveConfig.address.streetAddress,
        addressLocality: effectiveConfig.address.addressLocality,
        addressRegion: effectiveConfig.address.addressRegion,
        postalCode: effectiveConfig.address.postalCode,
        addressCountry: effectiveConfig.address.addressCountry
      },
      contactPoint: {
        '@type': 'ContactPoint',
        '@id': `${effectiveConfig.url}#contact`,
        telephone: effectiveConfig.contactPoint.telephone,
        email: effectiveConfig.contactPoint.email,
        contactType: effectiveConfig.contactPoint.contactType,
        availableLanguage: effectiveConfig.contactPoint.availableLanguage,
        hoursAvailable: effectiveConfig.contactPoint.hoursAvailable ? {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: effectiveConfig.contactPoint.hoursAvailable.dayOfWeek,
          opens: effectiveConfig.contactPoint.hoursAvailable.opens,
          closes: effectiveConfig.contactPoint.hoursAvailable.closes
        } : undefined
      },
      sameAs: effectiveConfig.socialMedia,
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: '50-100',
        description: 'Experienced real estate professionals'
      },
      areaServed: [
        {
          '@type': 'City',
          name: 'Dubai',
          addressCountry: 'AE'
        },
        {
          '@type': 'AdministrativeArea',
          name: 'United Arab Emirates',
          alternateName: 'UAE'
        }
      ],
      knowsAbout: [
        'Real Estate',
        'Property Sales',
        'Property Rentals',
        'Luxury Properties',
        'Commercial Real Estate',
        'Property Investment',
        'Dubai Real Estate Market',
        'Property Management',
        'Real Estate Consulting',
        'Off-Plan Properties'
      ],
      slogan: 'Your Gateway to Dubai Real Estate Excellence'
    };

    // Add geographic coordinates
    if (effectiveConfig.geo) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        '@id': `${effectiveConfig.url}#geo`,
        latitude: effectiveConfig.geo.latitude,
        longitude: effectiveConfig.geo.longitude
      };
    }

    // Add awards if available
    if (effectiveConfig.awards) {
      if (effectiveConfig.awards.length > 0) {
        schema.awards = effectiveConfig.awards.map(award => ({
          '@type': 'Award',
          name: award.name,
          dateReceived: `${award.year}-12-31`,
          awardingBody: {
            '@type': 'Organization',
            name: award.awardingBody
          }
        }));
      } else {
        schema.awards = [];
      }
    }

    // Add certifications
    if (effectiveConfig.certifications) {
      if (effectiveConfig.certifications.length > 0) {
        schema.hasCredential = effectiveConfig.certifications.map(cert => ({
          '@type': 'EducationalOccupationalCredential',
          name: cert.name,
          credentialCategory: 'Professional Certification',
          recognizedBy: {
            '@type': 'Organization',
            name: cert.issuingOrganization
          },
          validFrom: cert.validFrom,
          validUntil: cert.validUntil
        }));
      } else {
        schema.hasCredential = [];
      }
    }

    // Add member organizations
    schema.memberOf = [
      {
        '@type': 'Organization',
        name: 'Real Estate Regulatory Agency (RERA)',
        url: 'https://www.dubailand.gov.ae'
      },
      {
        '@type': 'Organization',
        name: 'Dubai Chamber of Commerce',
        url: 'https://www.dubaichamber.com'
      }
    ];

    return schema;
  }

  /**
   * Generate LocalBusiness structured data with enhanced business details
   */
  generateLocalBusinessSchema(localConfig?: Partial<LocalBusinessConfig>): LocalBusinessStructuredDataSchema {
    const businessConfig: LocalBusinessConfig = {
      ...this.config,
      openingHours: {
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00'
      },
      priceRange: '$$$',
      currenciesAccepted: ['AED', 'USD', 'EUR'],
      paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer', 'Cheque'],
      aggregateRating: {
        ratingValue: '4.8',
        reviewCount: '150',
        bestRating: '5',
        worstRating: '1'
      },
      serviceArea: {
        type: 'GeoCircle',
        geoMidpoint: {
          latitude: 25.2048,
          longitude: 55.2708
        },
        geoRadius: '50000'
      },
      hasOfferCatalog: {
        name: 'Real Estate Services',
        itemListElement: [
          {
            name: 'Property Sales',
            description: 'Professional property sales services in Dubai',
            category: 'Real Estate Sales'
          },
          {
            name: 'Property Rentals',
            description: 'Comprehensive rental property management',
            category: 'Real Estate Rentals'
          },
          {
            name: 'Luxury Properties',
            description: 'Exclusive luxury property portfolio',
            category: 'Luxury Real Estate'
          },
          {
            name: 'Property Investment Consulting',
            description: 'Expert investment advice and market analysis',
            category: 'Real Estate Consulting'
          }
        ]
      },
      ...localConfig
    };

    const baseSchema = this.generateOrganizationSchema();

    const localBusinessSchema: LocalBusinessStructuredDataSchema = {
      ...baseSchema,
      '@type': ['LocalBusiness', 'RealEstateAgent'],
      telephone: businessConfig.contactPoint.telephone,
      email: businessConfig.contactPoint.email,
      image: businessConfig.logo,
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        '@id': `${businessConfig.url}#hours`,
        dayOfWeek: businessConfig.openingHours.dayOfWeek,
        opens: businessConfig.openingHours.opens,
        closes: businessConfig.openingHours.closes,
        validFrom: businessConfig.foundingDate,
        validThrough: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0]
      },
      priceRange: businessConfig.priceRange,
      currenciesAccepted: businessConfig.currenciesAccepted.join(', '),
      paymentAccepted: businessConfig.paymentAccepted.join(', ')
    };

    // Add service area
    if (businessConfig.serviceArea) {
      localBusinessSchema.serviceArea = {
        '@type': businessConfig.serviceArea.type,
        geoMidpoint: businessConfig.serviceArea.geoMidpoint ? {
          '@type': 'GeoCoordinates',
          latitude: businessConfig.serviceArea.geoMidpoint.latitude,
          longitude: businessConfig.serviceArea.geoMidpoint.longitude
        } : undefined,
        geoRadius: businessConfig.serviceArea.geoRadius,
        addressCountry: businessConfig.serviceArea.addressCountry,
        addressRegion: businessConfig.serviceArea.addressRegion
      };
    }

    // Add aggregate rating
    if (businessConfig.aggregateRating) {
      localBusinessSchema.aggregateRating = {
        '@type': 'AggregateRating',
        '@id': `${businessConfig.url}#rating`,
        ratingValue: businessConfig.aggregateRating.ratingValue,
        reviewCount: businessConfig.aggregateRating.reviewCount,
        bestRating: businessConfig.aggregateRating.bestRating,
        worstRating: businessConfig.aggregateRating.worstRating,
        ratingExplanation: 'Based on client reviews and service quality assessments'
      };
    }

    // Add offer catalog
    if (businessConfig.hasOfferCatalog) {
      localBusinessSchema.hasOfferCatalog = {
        '@type': 'OfferCatalog',
        '@id': `${businessConfig.url}#catalog`,
        name: businessConfig.hasOfferCatalog.name,
        itemListElement: businessConfig.hasOfferCatalog.itemListElement.map((item, index) => ({
          '@type': 'Offer',
          '@id': `${businessConfig.url}#offer-${index + 1}`,
          name: item.name,
          description: item.description,
          category: item.category,
          seller: {
            '@id': `${businessConfig.url}#organization`
          },
          areaServed: {
            '@type': 'City',
            name: 'Dubai',
            addressCountry: 'AE'
          }
        }))
      };

      // Add individual service offers
      localBusinessSchema.makesOffer = businessConfig.hasOfferCatalog.itemListElement.map((item, index) => ({
        '@type': 'Offer',
        '@id': `${businessConfig.url}#service-${index + 1}`,
        name: item.name,
        description: item.description,
        category: item.category,
        businessFunction: 'http://purl.org/goodrelations/v1#Sell',
        availability: 'https://schema.org/InStock',
        validFrom: businessConfig.foundingDate,
        seller: {
          '@id': `${businessConfig.url}#organization`
        }
      }));
    }

    return localBusinessSchema;
  }

  /**
   * Generate ProfessionalService structured data for specialized services
   */
  generateProfessionalServiceSchema(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${this.config.url}#professional-service`,
      name: `${this.config.name} - Professional Real Estate Services`,
      description: 'Professional real estate services including sales, rentals, and investment consulting in Dubai',
      url: this.config.url,
      provider: {
        '@id': `${this.config.url}#organization`
      },
      areaServed: {
        '@type': 'City',
        name: 'Dubai',
        addressCountry: 'AE'
      },
      serviceType: 'Real Estate Services',
      category: [
        'Real Estate Sales',
        'Property Rentals',
        'Real Estate Consulting',
        'Property Management',
        'Investment Advisory'
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Professional Real Estate Services',
        itemListElement: [
          {
            '@type': 'Service',
            name: 'Property Valuation',
            description: 'Professional property valuation services'
          },
          {
            '@type': 'Service',
            name: 'Market Analysis',
            description: 'Comprehensive real estate market analysis'
          },
          {
            '@type': 'Service',
            name: 'Investment Consulting',
            description: 'Expert real estate investment advice'
          }
        ]
      },
      audience: {
        '@type': 'Audience',
        audienceType: ['Property Buyers', 'Property Sellers', 'Real Estate Investors', 'Property Renters']
      }
    };
  }

  /**
   * Update organization configuration
   */
  updateConfig(newConfig: Partial<OrganizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): OrganizationConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const organizationStructuredData = new OrganizationStructuredData();