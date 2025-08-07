import { describe, it, expect, beforeEach } from 'bun:test';
import { StructuredDataGenerator } from '../structured-data-generator';

describe('StructuredDataGenerator', () => {
  let generator: StructuredDataGenerator;

  beforeEach(() => {
    generator = new StructuredDataGenerator();
  });

  describe('generatePropertySchema', () => {
    it('should generate valid property structured data', () => {
      const mockProperty = {
        id: 'prop-123',
        title: 'Luxury 3BR Apartment',
        slug: 'luxury-3br-apartment',
        description: 'Beautiful apartment with stunning views',
        bedrooms: 3,
        bathrooms: 2,
        size: 2000,
        price: 2500000,
        type: { name: 'Apartment' },
        community: { name: 'Downtown Dubai', slug: 'downtown-dubai' },
        city: { name: 'Dubai' },
        offeringType: { name: 'Sale', slug: 'sale' },
        images: [
          { crmUrl: 'https://example.com/image1.jpg' },
          { crmUrl: 'https://example.com/image2.jpg' }
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
      };

      const schema = generator.generatePropertySchema(mockProperty);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toEqual(['Product', 'Accommodation', 'Residence']);
      expect(schema.name).toBe('Luxury 3BR Apartment');
      expect(schema.description).toContain('Beautiful apartment');
      expect(schema.identifier).toBe('prop-123');
      expect(schema.numberOfBedrooms).toBe(3);
      expect(schema.numberOfBathroomsTotal).toBe(2);
      expect(schema.floorSize.value).toBe(2000);
      expect(schema.floorSize.unitText).toBe('sqft');
      
      // Check offers
      expect(schema.offers.price).toBe(2500000);
      expect(schema.offers.priceCurrency).toBe('AED');
      expect(schema.offers.seller.name).toBe('John Doe');
      
      // Check location
      expect(schema.location.name).toBe('Downtown Dubai');
      expect(schema.location.geo.latitude).toBe(25.1972);
      expect(schema.location.geo.longitude).toBe(55.2744);
      
      // Check images
      expect(schema.image).toHaveLength(2);
      expect(schema.image[0].url).toBe('https://example.com/image1.jpg');
      
      // Check amenities
      expect(schema.amenityFeature).toHaveLength(3);
      expect(schema.amenityFeature[0].name).toBe('Swimming Pool');
    });

    it('should handle missing optional fields', () => {
      const minimalProperty = {
        id: 'prop-456',
        title: 'Basic Property',
        slug: 'basic-property',
        createdAt: '2024-01-01T00:00:00Z'
      };

      const schema = generator.generatePropertySchema(minimalProperty);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema.name).toBe('Basic Property');
      expect(schema.offers).toBeUndefined();
      expect(schema.location).toBeUndefined();
      expect(schema.image).toBeUndefined();
    });
  });

  describe('generateOrganizationSchema', () => {
    it('should generate valid organization structured data', () => {
      const schema = generator.generateOrganizationSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('RealEstateAgent');
      expect(schema.name).toBe('TRPE Global');
      expect(schema.url).toContain('trpe.ae');
      expect(schema.description).toContain('Leading real estate agency');
      expect(schema.address.addressCountry).toBe('AE');
      expect(schema.contactPoint.telephone).toBeDefined();
      expect(schema.sameAs).toBeInstanceOf(Array);
      expect(schema.sameAs.length).toBeGreaterThan(0);
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('should generate valid breadcrumb structured data', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://trpe.ae' },
        { name: 'Properties', url: 'https://trpe.ae/properties' },
        { name: 'Sale', url: 'https://trpe.ae/properties/sale' },
        { name: 'Luxury Apartment', url: 'https://trpe.ae/properties/sale/luxury-apartment' }
      ];

      const schema = generator.generateBreadcrumbSchema(breadcrumbs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(4);
      
      const firstItem = schema.itemListElement[0];
      expect(firstItem['@type']).toBe('ListItem');
      expect(firstItem.position).toBe(1);
      expect(firstItem.name).toBe('Home');
      expect(firstItem.item.url).toBe('https://trpe.ae');
    });
  });

  describe('generateFAQSchema', () => {
    it('should generate valid FAQ structured data', () => {
      const faqs = [
        {
          question: 'What is the price of this property?',
          answer: 'The property is priced at AED 2,500,000.'
        },
        {
          question: 'How many bedrooms does it have?',
          answer: 'This property has 3 bedrooms.'
        }
      ];

      const schema = generator.generateFAQSchema(faqs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
      
      const firstFAQ = schema.mainEntity[0];
      expect(firstFAQ['@type']).toBe('Question');
      expect(firstFAQ.name).toBe('What is the price of this property?');
      expect(firstFAQ.acceptedAnswer['@type']).toBe('Answer');
      expect(firstFAQ.acceptedAnswer.text).toContain('AED 2,500,000');
    });
  });

  describe('generateLocalBusinessSchema', () => {
    it('should generate valid local business structured data', () => {
      const schema = generator.generateLocalBusinessSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('LocalBusiness');
      expect(schema.name).toBe('TRPE Global');
      expect(schema.address.addressCountry).toBe('AE');
      expect(schema.geo.latitude).toBeDefined();
      expect(schema.geo.longitude).toBeDefined();
      expect(schema.openingHoursSpecification).toBeDefined();
      expect(schema.aggregateRating).toBeDefined();
    });
  });

  describe('generateWebsiteSchema', () => {
    it('should generate valid website structured data', () => {
      const schema = generator.generateWebsiteSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('TRPE Global');
      expect(schema.potentialAction['@type']).toBe('SearchAction');
      expect(schema.potentialAction.target.urlTemplate).toContain('search=');
      expect(schema.inLanguage).toEqual(['en', 'ar']);
    });
  });

  describe('generateArticleSchema', () => {
    it('should generate valid article structured data', () => {
      const mockArticle = {
        title: 'Dubai Real Estate Market Trends 2024',
        slug: 'dubai-market-trends-2024',
        excerpt: 'Analysis of the latest trends in Dubai real estate market',
        featuredImage: 'https://example.com/article-image.jpg',
        publishedAt: '2024-01-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        author: {
          name: 'Jane Smith',
          url: 'https://trpe.ae/authors/jane-smith'
        },
        tags: ['Dubai', 'Real Estate', 'Market Analysis'],
        content: 'A'.repeat(1500)
      };

      const schema = generator.generateArticleSchema(mockArticle);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Article');
      expect(schema.headline).toBe('Dubai Real Estate Market Trends 2024');
      expect(schema.description).toBe('Analysis of the latest trends in Dubai real estate market');
      expect(schema.author.name).toBe('Jane Smith');
      expect(schema.publisher.name).toBe('TRPE Global');
      expect(schema.keywords).toEqual(['Dubai', 'Real Estate', 'Market Analysis']);
      expect(schema.wordCount).toBe(1500);
    });
  });

  describe('generateCommunitySchema', () => {
    it('should generate valid community structured data', () => {
      const mockCommunity = {
        name: 'Downtown Dubai',
        slug: 'downtown-dubai',
        description: 'Premier business and residential district',
        image: 'https://example.com/downtown.jpg',
        latitude: 25.1972,
        longitude: 55.2744,
        amenities: [
          { name: 'Metro Station' },
          { name: 'Shopping Mall' }
        ]
      };

      const schema = generator.generateCommunitySchema(mockCommunity);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Place');
      expect(schema.name).toBe('Downtown Dubai');
      expect(schema.description).toBe('Premier business and residential district');
      expect(schema.geo.latitude).toBe(25.1972);
      expect(schema.geo.longitude).toBe(55.2744);
      expect(schema.containedInPlace.name).toBe('Dubai');
      expect(schema.additionalProperty).toHaveLength(2);
    });
  });
});