import { PropertyType } from '@/types/property';

export interface PropertyStructuredDataConfig {
  baseUrl: string;
  organizationName: string;
  organizationUrl: string;
  organizationLogo: string;
}

export interface RealEstatePropertySchema {
  '@context': string;
  '@type': string | string[];
  '@id': string;
  name: string;
  description: string;
  url: string;
  identifier: string;
  sku: string;
  category?: string;
  additionalType: string;
  datePosted: string;
  dateModified: string;
  image?: any[];
  location?: any;
  offers?: any;
  floorSize?: any;
  numberOfRooms?: number;
  numberOfBedrooms?: number;
  numberOfBathroomsTotal?: number;
  amenityFeature?: any[];
  brand?: any;
  accommodationCategory?: string;
  occupancy?: any;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  yearBuilt?: number;
  floorLevel?: string;
  hasMap?: string;
  tourBookingPage?: string;
  leaseLength?: any;
  securityDeposit?: any;
  applicationFee?: any;
}

/**
 * PropertyStructuredData class for generating schema.org compliant structured data
 * specifically for real estate properties with Product, Accommodation, and Place schemas
 */
export class PropertyStructuredData {
  private config: PropertyStructuredDataConfig;

  constructor(config?: Partial<PropertyStructuredDataConfig>) {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_URL || 'https://trpe.ae',
      organizationName: 'TRPE Global',
      organizationUrl: process.env.NEXT_PUBLIC_URL || 'https://trpe.ae',
      organizationLogo: `${process.env.NEXT_PUBLIC_URL || 'https://trpe.ae'}/images/logo.png`,
      ...config
    };
  }

  /**
   * Generate comprehensive property structured data with Product schema
   * Optimized for real estate listings with enhanced property details
   */
  generateProductSchema(property: PropertyType): RealEstatePropertySchema {
    const propertyUrl = `${this.config.baseUrl}/properties/${property.offeringType?.slug || 'sale'}/${property.slug}`;
    
    const schema: RealEstatePropertySchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': propertyUrl,
      name: property.title,
      description: this.generateEnhancedDescription(property),
      url: propertyUrl,
      identifier: property.id,
      sku: property.referenceNumber || property.id,
      category: this.generatePropertyCategory(property),
      additionalType: 'https://schema.org/Residence',
      datePosted: property.createdAt,
      dateModified: property.updatedAt || property.createdAt
    };

    // Add enhanced image data with proper dimensions and captions
    if (property.images && property.images.length > 0) {
      schema.image = property.images.map((img, index) => ({
        '@type': 'ImageObject',
        url: img.crmUrl,
        caption: `${property.title} - Image ${index + 1}`,
        description: `${property.type?.name || 'Property'} in ${property.community?.name || 'Dubai'}`,
        width: 1200,
        height: 800,
        encodingFormat: 'image/jpeg',
        contentUrl: img.crmUrl,
        thumbnailUrl: img.crmUrl,
        representativeOfPage: index === 0
      }));
    }

    // Enhanced location data with Place schema
    if (property.community && property.community.name) {
      const communityName = property.community.name;
      schema.location = {
        '@type': 'Place',
        '@id': `${this.config.baseUrl}/communities/${property.community.slug || communityName.toLowerCase().replace(/\s+/g, '-')}`,
        name: communityName,
        description: `${communityName} community in Dubai`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: communityName,
          addressLocality: communityName,
          addressRegion: property.city?.name || 'Dubai',
          addressCountry: 'AE',
          postalCode: '00000'
        },
        containedInPlace: {
          '@type': 'City',
          name: property.city?.name || 'Dubai',
          addressCountry: 'AE'
        }
      };

      // Add precise coordinates if available
      if (property.latitude && property.longitude) {
        schema.location.geo = {
          '@type': 'GeoCoordinates',
          latitude: parseFloat(property.latitude),
          longitude: parseFloat(property.longitude),
          elevation: '0'
        };
      }

      // Add sub-community if available
      if (property.subCommunity) {
        schema.location.containedInPlace = {
          '@type': 'Place',
          name: property.subCommunity.name,
          containedInPlace: {
            '@type': 'Place',
            name: property.community.name,
            containedInPlace: {
              '@type': 'City',
              name: property.city?.name || 'Dubai',
              addressCountry: 'AE'
            }
          }
        };
      }
    }

    // Enhanced offers with detailed pricing information
    if (property.price) {
      const priceValue = typeof property.price === 'string' ? parseFloat(property.price) : property.price;
      
      schema.offers = {
        '@type': 'Offer',
        '@id': `${propertyUrl}#offer`,
        price: priceValue,
        priceCurrency: 'AED',
        availability: this.getAvailabilityStatus(property),
        priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        url: propertyUrl,
        validFrom: property.createdAt,
        businessFunction: 'http://purl.org/goodrelations/v1#Sell',
        eligibleRegion: {
          '@type': 'Country',
          name: 'United Arab Emirates',
          alternateName: 'UAE'
        },
        seller: this.generateSellerInfo(property)
      };

      // Add rental-specific information
      if (property.offeringType?.slug === 'rent') {
        schema.offers.businessFunction = 'http://purl.org/goodrelations/v1#LeaseOut';
        schema.offers.priceSpecification = {
          '@type': 'UnitPriceSpecification',
          price: priceValue,
          priceCurrency: 'AED',
          unitText: 'YEAR',
          referenceQuantity: {
            '@type': 'QuantitativeValue',
            value: 1,
            unitCode: 'ANN'
          }
        };

        // Add payment terms for rentals
        if (property.cheques) {
          schema.offers.eligibleTransactionVolume = {
            '@type': 'PriceSpecification',
            name: 'Payment Terms',
            description: `${property.cheques} cheques per year`
          };
        }
      }
    }

    // Enhanced property specifications
    this.addPropertySpecifications(schema, property);

    // Add brand information
    schema.brand = {
      '@type': 'Organization',
      '@id': `${this.config.baseUrl}#organization`,
      name: this.config.organizationName,
      url: this.config.organizationUrl,
      logo: {
        '@type': 'ImageObject',
        url: this.config.organizationLogo,
        width: 300,
        height: 100
      }
    };

    return schema;
  }

  /**
   * Generate Accommodation schema for rental properties
   */
  generateAccommodationSchema(property: PropertyType): RealEstatePropertySchema {
    const baseSchema = this.generateProductSchema(property);
    
    const accommodationSchema: RealEstatePropertySchema = {
      ...baseSchema,
      '@type': ['Product', 'Accommodation'],
      accommodationCategory: this.getAccommodationCategory(property),
      occupancy: {
        '@type': 'QuantitativeValue',
        maxValue: this.calculateMaxOccupancy(property),
        unitText: 'persons'
      },
      petsAllowed: false, // Default for Dubai properties
      smokingAllowed: false, // Default for Dubai properties
      hasMap: `${this.config.baseUrl}/properties/${property.offeringType?.slug || 'sale'}/${property.slug}#map`
    };

    // Add accommodation-specific amenities
    if (property.furnished) {
      accommodationSchema.amenityFeature = [
        ...(accommodationSchema.amenityFeature || []),
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Furnished',
          value: property.furnished === 'Yes' || property.furnished === 'Furnished'
        }
      ];
    }

    // Add lease information for rentals
    if (property.offeringType?.slug === 'rent') {
      accommodationSchema.leaseLength = {
        '@type': 'QuantitativeValue',
        value: 12,
        unitText: 'months'
      };

      if (property.serviceCharge) {
        accommodationSchema.securityDeposit = {
          '@type': 'MonetaryAmount',
          currency: 'AED',
          value: property.serviceCharge
        };
      }
    }

    return accommodationSchema;
  }

  /**
   * Generate Place schema for a property's community location
   */
  generatePlaceSchema(property: PropertyType): any {
    if (!property.community || !property.community.name) return null;

    const communityName = property.community.name;
    const placeUrl = `${this.config.baseUrl}/communities/${property.community.slug || communityName.toLowerCase().replace(/\s+/g, '-')}`;

    return {
      '@context': 'https://schema.org',
      '@type': 'Place',
      '@id': placeUrl,
      name: communityName,
      description: `${communityName} is a premium residential and commercial community in Dubai`,
      url: placeUrl,
      address: {
        '@type': 'PostalAddress',
        streetAddress: communityName,
        addressLocality: communityName,
        addressRegion: property.city?.name || 'Dubai',
        addressCountry: 'AE'
      },
      geo: property.latitude && property.longitude ? {
        '@type': 'GeoCoordinates',
        latitude: property.latitude,
        longitude: property.longitude
      } : undefined
    };
  }

  /**
   * Generate enhanced property description
   */
  private generateEnhancedDescription(property: PropertyType): string {
    if (property.description && property.description.trim()) {
      return property.description;
    }

    const parts = [];
    
    // Property type and size
    if (property.bedrooms) {
      parts.push(`${property.bedrooms} bedroom`);
    }
    
    if (property.type?.name) {
      parts.push(property.type.name.toLowerCase());
    }
    
    if (property.size) {
      parts.push(`spanning ${Math.round(property.size / 100)} sqft`);
    }
    
    // Location
    if (property.community?.name) {
      parts.push(`located in the prestigious ${property.community.name}`);
    }
    
    if (property.city?.name && property.city.name !== 'Dubai') {
      parts.push(`in ${property.city.name}`);
    } else {
      parts.push('in Dubai');
    }
    
    // Price and offering type
    if (property.price && property.offeringType?.name) {
      const priceValue = typeof property.price === 'string' ? parseFloat(property.price) : property.price;
      parts.push(`available for ${property.offeringType.name.toLowerCase()} at AED ${priceValue.toLocaleString()}`);
    }
    
    const baseDescription = parts.join(' ');
    
    // Add premium features
    const features = [];
    if (property.furnished === 'Yes' || property.furnished === 'Furnished') {
      features.push('fully furnished');
    }
    if (property.parking && property.parking !== '0') {
      features.push(`${property.parking} parking space${property.parking !== '1' ? 's' : ''}`);
    }
    if (property.floor) {
      features.push(`on floor ${property.floor}`);
    }
    
    const featuresText = features.length > 0 ? ` This premium property features ${features.join(', ')}.` : '';
    
    return `${baseDescription}.${featuresText} Perfect for those seeking luxury living in Dubai's dynamic real estate market.`;
  }

  /**
   * Generate property category based on type and offering
   */
  private generatePropertyCategory(property: PropertyType): string {
    const type = property.type?.name || 'Property';
    const offering = property.offeringType?.name || 'Sale';
    return `${type} for ${offering}`;
  }

  /**
   * Add detailed property specifications
   */
  private addPropertySpecifications(schema: RealEstatePropertySchema, property: PropertyType): void {
    // Floor size
    if (property.size) {
      schema.floorSize = {
        '@type': 'QuantitativeValue',
        value: property.size,
        unitText: 'sqft',
        unitCode: 'FTK'
      };
    }

    // Room counts
    if (property.bedrooms) {
      schema.numberOfRooms = property.bedrooms;
      schema.numberOfBedrooms = property.bedrooms;
    }

    if (property.bathrooms) {
      schema.numberOfBathroomsTotal = property.bathrooms;
    }

    // Building year
    if (property.buildYear) {
      schema.yearBuilt = parseInt(property.buildYear);
    }

    // Floor level
    if (property.floor) {
      schema.floorLevel = property.floor;
    }

    // Amenities with enhanced structure
    const amenities = [];
    
    // Property-specific amenities (if available)
    if ((property as any).amenities && (property as any).amenities.length > 0) {
      amenities.push(...(property as any).amenities.map((amenity: any) => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity.name,
        value: true,
        description: `${amenity.name} available in this property`
      })));
    }

    // Additional features
    if (property.parking && property.parking !== '0') {
      amenities.push({
        '@type': 'LocationFeatureSpecification',
        name: 'Parking',
        value: true,
        description: `${property.parking} parking space${property.parking !== '1' ? 's' : ''} included`
      });
    }

    if (property.furnished && property.furnished !== 'No') {
      amenities.push({
        '@type': 'LocationFeatureSpecification',
        name: 'Furnished',
        value: property.furnished === 'Yes' || property.furnished === 'Furnished',
        description: `Property is ${property.furnished.toLowerCase()}`
      });
    }

    if (amenities.length > 0) {
      schema.amenityFeature = amenities;
    }
  }

  /**
   * Get availability status based on property data
   */
  private getAvailabilityStatus(property: PropertyType): string {
    if (property.availabilityDate) {
      const availDate = new Date(property.availabilityDate);
      const now = new Date();
      
      if (availDate > now) {
        return 'https://schema.org/PreOrder';
      }
    }
    
    return 'https://schema.org/InStock';
  }

  /**
   * Generate seller information
   */
  private generateSellerInfo(property: PropertyType): any {
    if (property.agent) {
      return {
        '@type': 'RealEstateAgent',
        '@id': `${this.config.baseUrl}/agents/${property.agent.id || 'agent'}`,
        name: `${property.agent.firstName} ${property.agent.lastName}`,
        telephone: property.agent.phone,
        email: property.agent.email,
        worksFor: {
          '@type': 'RealEstateAgent',
          '@id': `${this.config.baseUrl}#organization`,
          name: this.config.organizationName,
          url: this.config.organizationUrl
        }
      };
    }

    return {
      '@type': 'RealEstateAgent',
      '@id': `${this.config.baseUrl}#organization`,
      name: this.config.organizationName,
      url: this.config.organizationUrl,
      logo: this.config.organizationLogo
    };
  }

  /**
   * Get accommodation category for rental properties
   */
  private getAccommodationCategory(property: PropertyType): string {
    const type = property.type?.name?.toLowerCase() || 'property';
    
    if (type.includes('townhouse')) {
      return 'Townhouse';
    } else if (type.includes('penthouse')) {
      return 'Penthouse';
    } else if (type.includes('studio')) {
      return 'Studio';
    } else if (type.includes('apartment') || type.includes('flat')) {
      return 'Apartment';
    } else if (type.includes('villa') || type.includes('house')) {
      return 'House';
    }
    
    return 'Residence';
  }

  /**
   * Calculate maximum occupancy based on bedrooms
   */
  private calculateMaxOccupancy(property: PropertyType): number {
    if (!property.bedrooms) return 2;
    
    // Estimate 2 people per bedroom + 2 for living areas
    return (property.bedrooms * 2) + 2;
  }

  /**
   * Generate location-specific features
   */
  private generateLocationFeatures(property: PropertyType): any[] {
    const features = [];
    
    if (property.community && property.community.name) {
      features.push({
        '@type': 'PropertyValue',
        name: 'Community',
        value: property.community.name
      });
    }

    if (property.subCommunity) {
      features.push({
        '@type': 'PropertyValue',
        name: 'Sub Community',
        value: property.subCommunity.name
      });
    }

    if (property.city) {
      features.push({
        '@type': 'PropertyValue',
        name: 'City',
        value: property.city.name
      });
    }

    return features;
  }
}

// Export singleton instance
export const propertyStructuredData = new PropertyStructuredData();