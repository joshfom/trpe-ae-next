import { describe, it, expect, beforeEach } from 'bun:test';
import { PropertyStructuredData } from '../property-structured-data';

describe('PropertyStructuredData', () => {
  let propertyStructuredData: PropertyStructuredData;

  beforeEach(() => {
    propertyStructuredData = new PropertyStructuredData({
      baseUrl: 'https://test.trpe.ae',
      organizationName: 'Test TRPE',
      organizationUrl: 'https://test.trpe.ae',
      organizationLogo: 'https://test.trpe.ae/logo.png'
    });
  });

  describe('generateProductSchema', () => {
    it('should generate comprehensive Product schema for sale property', () => {
      const mockProperty = {
        id: 'prop-123',
        title: 'Luxury 3BR Apartment in Downtown Dubai',
        slug: 'luxury-3br-apartment-downtown',
        description: 'Stunning apartment with panoramic city views',
        bedrooms: 3,
        bathrooms: 2,
        size: 2500,
        price: '3500000',
        buildYear: '2020',
        floor: '15',
        parking: '2',
        furnished: 'Yes',
        referenceNumber: 'TRPE-123456',
        type: { name: 'Apartment' },
        community: { 
          name: 'Downtown Dubai', 
          slug: 'downtown-dubai' 
        },
        subCommunity: {
          name: 'Burj Khalifa District'
        },
        city: { name: 'Dubai' },
        offeringType: { name: 'Sale', slug: 'sale' },
        images: [
          { crmUrl: 'https://example.com/image1.jpg' },
          { crmUrl: 'https://example.com/image2.jpg' }
        ],
        amenities: [
          { name: 'Swimming Pool' },
          { name: 'Gym' },
          { name: 'Concierge Service' }
        ],
        agent: {
          id: 'agent-456',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+971501234567',
          email: 'john@trpe.ae'
        },
        latitude: '25.1972',
        longitude: '55.2744',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      };

      const schema = propertyStructuredData.generateProductSchema(mockProperty);

      // Basic schema validation
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Product');
      expect(schema['@id']).toBe('https://test.trpe.ae/properties/sale/luxury-3br-apartment-downtown');
      expect(schema.name).toBe('Luxury 3BR Apartment in Downtown Dubai');
      expect(schema.identifier).toBe('prop-123');
      expect(schema.sku).toBe('TRPE-123456');
      expect(schema.category).toBe('Apartment for Sale');
      expect(schema.additionalType).toBe('https://schema.org/Residence');

      // Property specifications
      expect(schema.numberOfBedrooms).toBe(3);
      expect(schema.numberOfBathroomsTotal).toBe(2);
      expect(schema.floorSize?.value).toBe(2500);
      expect(schema.floorSize?.unitText).toBe('sqft');
      expect(schema.yearBuilt).toBe(2020);
      expect(schema.floorLevel).toBe('15');

      // Images validation
      expect(schema.image).toHaveLength(2);
      expect(schema.image?.[0]['@type']).toBe('ImageObject');
      expect(schema.image?.[0].url).toBe('https://example.com/image1.jpg');
      expect(schema.image?.[0].width).toBe(1200);
      expect(schema.image?.[0].height).toBe(800);
      expect(schema.image?.[0].representativeOfPage).toBe(true);

      // Location validation
      expect(schema.location?.['@type']).toBe('Place');
      expect(schema.location?.name).toBe('Downtown Dubai');
      expect(schema.location?.geo?.latitude).toBe(25.1972);
      expect(schema.location?.geo?.longitude).toBe(55.2744);
      expect(schema.location?.address?.addressCountry).toBe('AE');
      expect(schema.location?.containedInPlace?.name).toBe('Burj Khalifa District');

      // Offers validation
      expect(schema.offers?.['@type']).toBe('Offer');
      expect(schema.offers?.price).toBe(3500000);
      expect(schema.offers?.priceCurrency).toBe('AED');
      expect(schema.offers?.availability).toBe('https://schema.org/InStock');
      expect(schema.offers?.businessFunction).toBe('http://purl.org/goodrelations/v1#Sell');

      // Agent validation
      expect(schema.offers?.seller?.['@type']).toBe('RealEstateAgent');
      expect(schema.offers?.seller?.name).toBe('John Doe');
      expect(schema.offers?.seller?.telephone).toBe('+971501234567');
      expect(schema.offers?.seller?.email).toBe('john@trpe.ae');

      // Amenities validation
      expect(schema.amenityFeature).toHaveLength(5); // 3 amenities + parking + furnished
      expect(schema.amenityFeature?.[0].name).toBe('Swimming Pool');
      expect(schema.amenityFeature?.[0]['@type']).toBe('LocationFeatureSpecification');
      
      // Find parking amenity
      const parkingAmenity = schema.amenityFeature?.find(a => a.name === 'Parking');
      expect(parkingAmenity?.description).toBe('2 parking spaces included');

      // Brand validation
      expect(schema.brand?.['@type']).toBe('Organization');
      expect(schema.brand?.name).toBe('Test TRPE');
    });

    it('should generate Product schema for rental property with payment terms', () => {
      const mockRentalProperty = {
        id: 'prop-456',
        title: '2BR Apartment for Rent',
        slug: '2br-apartment-rent',
        bedrooms: 2,
        bathrooms: 2,
        price: '120000',
        cheques: '4',
        serviceCharge: '5000',
        type: { name: 'Apartment' },
        community: { name: 'Marina', slug: 'marina' },
        city: { name: 'Dubai' },
        offeringType: { name: 'Rent', slug: 'rent' },
        createdAt: '2024-01-01T00:00:00Z'
      };

      const schema = propertyStructuredData.generateProductSchema(mockRentalProperty);

      expect(schema.offers?.businessFunction).toBe('http://purl.org/goodrelations/v1#LeaseOut');
      expect(schema.offers?.priceSpecification?.['@type']).toBe('UnitPriceSpecification');
      expect(schema.offers?.priceSpecification?.unitText).toBe('YEAR');
      expect(schema.offers?.eligibleTransactionVolume?.description).toBe('4 cheques per year');
    });

    it('should handle minimal property data gracefully', () => {
      const minimalProperty = {
        id: 'prop-minimal',
        title: 'Basic Property',
        slug: 'basic-property',
        createdAt: '2024-01-01T00:00:00Z'
      };

      const schema = propertyStructuredData.generateProductSchema(minimalProperty);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema.name).toBe('Basic Property');
      expect(schema.identifier).toBe('prop-minimal');
      expect(schema.sku).toBe('prop-minimal'); // Falls back to ID
      expect(schema.offers).toBeUndefined();
      expect(schema.location).toBeUndefined();
      expect(schema.image).toBeUndefined();
    });

    it('should generate enhanced description when none provided', () => {
      const propertyWithoutDescription = {
        id: 'prop-no-desc',
        title: 'Property Without Description',
        slug: 'property-no-desc',
        bedrooms: 2,
        bathrooms: 1,
        size: 1500,
        price: '2000000',
        type: { name: 'Villa' },
        community: { name: 'Arabian Ranches', slug: 'arabian-ranches' },
        city: { name: 'Dubai' },
        offeringType: { name: 'Sale', slug: 'sale' },
        furnished: 'Yes',
        parking: '1',
        floor: 'Ground',
        createdAt: '2024-01-01T00:00:00Z'
      };

      const schema = propertyStructuredData.generateProductSchema(propertyWithoutDescription);

      expect(schema.description).toContain('2 bedroom villa spanning 1500 sqft');
      expect(schema.description).toContain('located in the prestigious Arabian Ranches');
      expect(schema.description).toContain('available for sale at AED 2,000,000');
      expect(schema.description).toContain('fully furnished');
      expect(schema.description).toContain('1 parking space');
      expect(schema.description).toContain('on floor Ground');
    });
  });

  describe('generateAccommodationSchema', () => {
    it('should generate Accommodation schema for rental property', () => {
      const mockRentalProperty = {
        id: 'rental-123',
        title: 'Furnished 1BR Apartment',
        slug: 'furnished-1br-apartment',
        bedrooms: 1,
        bathrooms: 1,
        price: '80000',
        furnished: 'Furnished',
        type: { name: 'Apartment' },
        community: { name: 'JBR', slug: 'jbr' },
        offeringType: { name: 'Rent', slug: 'rent' },
        serviceCharge: '3000',
        createdAt: '2024-01-01T00:00:00Z'
      };

      const schema = propertyStructuredData.generateAccommodationSchema(mockRentalProperty);

      expect(schema['@type']).toEqual(['Product', 'Accommodation']);
      expect(schema.accommodationCategory).toBe('Apartment');
      expect(schema.occupancy?.maxValue).toBe(4); // 1 bedroom * 2 + 2
      expect(schema.petsAllowed).toBe(false);
      expect(schema.smokingAllowed).toBe(false);
      expect(schema.hasMap).toContain('#map');

      // Lease information
      expect(schema.leaseLength?.value).toBe(12);
      expect(schema.leaseLength?.unitText).toBe('months');
      expect(schema.securityDeposit?.currency).toBe('AED');
      expect(schema.securityDeposit?.value).toBe('3000');

      // Furnished amenity
      const furnishedAmenity = schema.amenityFeature?.find(a => a.name === 'Furnished');
      expect(furnishedAmenity?.value).toBe(true);
    });

    it('should categorize different property types correctly', () => {
      const testCases = [
        { type: 'Villa', expected: 'House' },
        { type: 'Townhouse', expected: 'Townhouse' },
        { type: 'Penthouse', expected: 'Penthouse' },
        { type: 'Studio', expected: 'Studio' },
        { type: 'Office', expected: 'Residence' }
      ];

      testCases.forEach(({ type, expected }) => {
        const property = {
          id: 'test-prop',
          title: `Test ${type}`,
          slug: 'test-prop',
          type: { name: type },
          offeringType: { slug: 'rent' },
          createdAt: '2024-01-01T00:00:00Z'
        };

        const schema = propertyStructuredData.generateAccommodationSchema(property);
        expect(schema.accommodationCategory).toBe(expected);
      });
    });
  });

  describe('generatePlaceSchema', () => {
    it('should generate Place schema for property location', () => {
      const mockProperty = {
        id: 'prop-place',
        title: 'Property with Location',
        slug: 'property-location',
        community: { 
          name: 'Business Bay', 
          slug: 'business-bay' 
        },
        subCommunity: {
          name: 'Bay Square'
        },
        city: { name: 'Dubai' },
        latitude: '25.1865',
        longitude: '55.2652',
        createdAt: '2024-01-01T00:00:00Z'
      };

      const schema = propertyStructuredData.generatePlaceSchema(mockProperty);

      expect(schema?.['@context']).toBe('https://schema.org');
      expect(schema?.['@type']).toBe('Place');
      expect(schema?.['@id']).toBe('https://test.trpe.ae/communities/business-bay');
      expect(schema?.name).toBe('Business Bay');
      expect(schema?.description).toContain('premium residential and commercial community');
      
      expect(schema?.address?.addressLocality).toBe('Business Bay');
      expect(schema?.address?.addressCountry).toBe('AE');
      
      expect(schema?.geo?.latitude).toBe(25.1865);
      expect(schema?.geo?.longitude).toBe(55.2652);
      
      expect(schema?.containedInPlace?.name).toBe('Dubai');
      expect(schema?.hasMap).toContain('#map');

      // Additional properties
      expect(schema?.additionalProperty).toHaveLength(3);
      expect(schema?.additionalProperty?.[0].name).toBe('Community');
      expect(schema?.additionalProperty?.[1].name).toBe('Sub Community');
      expect(schema?.additionalProperty?.[2].name).toBe('City');
    });

    it('should return null for property without community', () => {
      const propertyWithoutCommunity = {
        id: 'prop-no-community',
        title: 'Property Without Community',
        slug: 'property-no-community',
        createdAt: '2024-01-01T00:00:00Z'
      };

      const schema = propertyStructuredData.generatePlaceSchema(propertyWithoutCommunity);
      expect(schema).toBeNull();
    });
  });

  describe('private helper methods', () => {
    it('should calculate max occupancy correctly', () => {
      const testCases = [
        { bedrooms: 0, expected: 2 },
        { bedrooms: 1, expected: 4 },
        { bedrooms: 2, expected: 6 },
        { bedrooms: 3, expected: 8 },
        { bedrooms: undefined, expected: 2 }
      ];

      testCases.forEach(({ bedrooms, expected }) => {
        const property = {
          id: 'test',
          title: 'Test',
          slug: 'test',
          bedrooms,
          createdAt: '2024-01-01T00:00:00Z'
        };

        const schema = propertyStructuredData.generateAccommodationSchema(property);
        expect(schema.occupancy?.maxValue).toBe(expected);
      });
    });

    it('should generate proper availability status', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const futureProperty = {
        id: 'future-prop',
        title: 'Future Property',
        slug: 'future-property',
        price: '1000000',
        availabilityDate: futureDate.toISOString(),
        createdAt: '2024-01-01T00:00:00Z'
      };

      const schema = propertyStructuredData.generateProductSchema(futureProperty);
      expect(schema.offers?.availability).toBe('https://schema.org/PreOrder');

      const availableProperty = {
        id: 'available-prop',
        title: 'Available Property',
        slug: 'available-property',
        price: '1000000',
        createdAt: '2024-01-01T00:00:00Z'
      };

      const availableSchema = propertyStructuredData.generateProductSchema(availableProperty);
      expect(availableSchema.offers?.availability).toBe('https://schema.org/InStock');
    });

    it('should handle seller information correctly', () => {
      // Property with agent
      const propertyWithAgent = {
        id: 'prop-agent',
        title: 'Property with Agent',
        slug: 'property-agent',
        price: '1000000',
        agent: {
          id: 'agent-123',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+971509876543',
          email: 'jane@trpe.ae'
        },
        createdAt: '2024-01-01T00:00:00Z'
      };

      const schemaWithAgent = propertyStructuredData.generateProductSchema(propertyWithAgent);
      expect(schemaWithAgent.offers?.seller?.name).toBe('Jane Smith');
      expect(schemaWithAgent.offers?.seller?.telephone).toBe('+971509876543');
      expect(schemaWithAgent.offers?.seller?.worksFor?.name).toBe('Test TRPE');

      // Property without agent
      const propertyWithoutAgent = {
        id: 'prop-no-agent',
        title: 'Property without Agent',
        slug: 'property-no-agent',
        price: '1000000',
        createdAt: '2024-01-01T00:00:00Z'
      };

      const schemaWithoutAgent = propertyStructuredData.generateProductSchema(propertyWithoutAgent);
      expect(schemaWithoutAgent.offers?.seller?.name).toBe('Test TRPE');
      expect(schemaWithoutAgent.offers?.seller?.url).toBe('https://test.trpe.ae');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle string and number price values', () => {
      const stringPriceProperty = {
        id: 'string-price',
        title: 'String Price Property',
        slug: 'string-price',
        price: '1500000',
        createdAt: '2024-01-01T00:00:00Z'
      };

      const numberPriceProperty = {
        id: 'number-price',
        title: 'Number Price Property',
        slug: 'number-price',
        price: 1500000,
        createdAt: '2024-01-01T00:00:00Z'
      };

      const stringSchema = propertyStructuredData.generateProductSchema(stringPriceProperty);
      const numberSchema = propertyStructuredData.generateProductSchema(numberPriceProperty);

      expect(stringSchema.offers?.price).toBe(1500000);
      expect(numberSchema.offers?.price).toBe(1500000);
    });

    it('should handle missing coordinates gracefully', () => {
      const propertyWithoutCoords = {
        id: 'no-coords',
        title: 'Property Without Coordinates',
        slug: 'no-coords',
        community: { name: 'Test Community', slug: 'test-community' },
        createdAt: '2024-01-01T00:00:00Z'
      };

      const schema = propertyStructuredData.generateProductSchema(propertyWithoutCoords);
      expect(schema.location?.geo).toBeUndefined();
    });

    it('should handle empty amenities array', () => {
      const propertyWithEmptyAmenities = {
        id: 'empty-amenities',
        title: 'Property with Empty Amenities',
        slug: 'empty-amenities',
        amenities: [],
        createdAt: '2024-01-01T00:00:00Z'
      };

      const schema = propertyStructuredData.generateProductSchema(propertyWithEmptyAmenities);
      expect(schema.amenityFeature).toBeUndefined();
    });
  });
});