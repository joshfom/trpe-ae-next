import { describe, it, expect, beforeEach } from 'bun:test';
import { OrganizationStructuredData } from '../organization-structured-data';

describe('OrganizationStructuredData', () => {
  let organizationData: OrganizationStructuredData;

  beforeEach(() => {
    organizationData = new OrganizationStructuredData({
      name: 'Test TRPE',
      url: 'https://test.trpe.ae',
      logo: 'https://test.trpe.ae/logo.png',
      description: 'Test real estate agency',
      foundingDate: '2020-01-01',
      address: {
        streetAddress: 'Test Street',
        addressLocality: 'Test Area',
        addressRegion: 'Dubai',
        postalCode: '12345',
        addressCountry: 'AE'
      },
      contactPoint: {
        telephone: '+971-4-123-4567',
        email: 'test@trpe.ae',
        contactType: 'customer service',
        availableLanguage: ['en', 'ar']
      },
      socialMedia: [
        'https://facebook.com/testtrpe',
        'https://instagram.com/testtrpe'
      ],
      geo: {
        latitude: 25.1972,
        longitude: 55.2744
      }
    });
  });

  describe('generateOrganizationSchema', () => {
    it('should generate comprehensive Organization structured data', () => {
      const schema = organizationData.generateOrganizationSchema();

      // Basic schema validation
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toEqual(['Organization', 'RealEstateAgent']);
      expect(schema['@id']).toBe('https://test.trpe.ae#organization');
      expect(schema.name).toBe('Test TRPE');
      expect(schema.url).toBe('https://test.trpe.ae');
      expect(schema.description).toBe('Test real estate agency');
      expect(schema.foundingDate).toBe('2020-01-01');

      // Logo validation
      expect(schema.logo['@type']).toBe('ImageObject');
      expect(schema.logo.url).toBe('https://test.trpe.ae/logo.png');
      expect(schema.logo.width).toBe(300);
      expect(schema.logo.height).toBe(100);

      // Address validation
      expect(schema.address['@type']).toBe('PostalAddress');
      expect(schema.address.streetAddress).toBe('Test Street');
      expect(schema.address.addressLocality).toBe('Test Area');
      expect(schema.address.addressRegion).toBe('Dubai');
      expect(schema.address.addressCountry).toBe('AE');

      // Contact point validation
      expect(schema.contactPoint['@type']).toBe('ContactPoint');
      expect(schema.contactPoint.telephone).toBe('+971-4-123-4567');
      expect(schema.contactPoint.email).toBe('test@trpe.ae');
      expect(schema.contactPoint.contactType).toBe('customer service');
      expect(schema.contactPoint.availableLanguage).toEqual(['en', 'ar']);

      // Geographic coordinates
      expect(schema.geo?.['@type']).toBe('GeoCoordinates');
      expect(schema.geo?.latitude).toBe(25.1972);
      expect(schema.geo?.longitude).toBe(55.2744);

      // Social media
      expect(schema.sameAs).toEqual([
        'https://facebook.com/testtrpe',
        'https://instagram.com/testtrpe'
      ]);

      // Business details
      expect(schema.numberOfEmployees?.value).toBe('50-100');
      expect(schema.areaServed).toHaveLength(2);
      expect(schema.areaServed?.[0].name).toBe('Dubai');
      expect(schema.knowsAbout).toContain('Real Estate');
      expect(schema.knowsAbout).toContain('Dubai Real Estate Market');
      expect(schema.slogan).toBe('Your Gateway to Dubai Real Estate Excellence');

      // Member organizations
      expect(schema.memberOf).toHaveLength(2);
      expect(schema.memberOf?.[0].name).toBe('Real Estate Regulatory Agency (RERA)');
    });

    it('should include awards when provided', () => {
      const orgWithAwards = new OrganizationStructuredData({
        name: 'Award Winning TRPE',
        url: 'https://test.trpe.ae',
        awards: [
          {
            name: 'Best Agency 2023',
            year: '2023',
            awardingBody: 'Dubai Awards'
          },
          {
            name: 'Excellence Award',
            year: '2022',
            awardingBody: 'UAE Business Awards'
          }
        ]
      });

      const schema = orgWithAwards.generateOrganizationSchema();

      expect(schema.awards).toHaveLength(2);
      expect(schema.awards?.[0]['@type']).toBe('Award');
      expect(schema.awards?.[0].name).toBe('Best Agency 2023');
      expect(schema.awards?.[0].dateReceived).toBe('2023-12-31');
      expect(schema.awards?.[0].awardingBody.name).toBe('Dubai Awards');
    });

    it('should include certifications when provided', () => {
      const orgWithCerts = new OrganizationStructuredData({
        name: 'Certified TRPE',
        url: 'https://test.trpe.ae',
        certifications: [
          {
            name: 'RERA License',
            issuingOrganization: 'Dubai Land Department',
            validFrom: '2020-01-01',
            validUntil: '2025-12-31'
          }
        ]
      });

      const schema = orgWithCerts.generateOrganizationSchema();

      expect(schema.hasCredential).toHaveLength(1);
      expect(schema.hasCredential?.[0]['@type']).toBe('EducationalOccupationalCredential');
      expect(schema.hasCredential?.[0].name).toBe('RERA License');
      expect(schema.hasCredential?.[0].recognizedBy.name).toBe('Dubai Land Department');
      expect(schema.hasCredential?.[0].validFrom).toBe('2020-01-01');
      expect(schema.hasCredential?.[0].validUntil).toBe('2025-12-31');
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalOrg = new OrganizationStructuredData({
        name: 'Minimal TRPE',
        url: 'https://minimal.trpe.ae'
      });

      const schema = minimalOrg.generateOrganizationSchema();

      expect(schema.name).toBe('Minimal TRPE');
      expect(schema.url).toBe('https://minimal.trpe.ae');
      expect(schema.awards).toBeUndefined();
      expect(schema.hasCredential).toBeUndefined();
      expect(schema.geo).toBeUndefined();
    });
  });

  describe('generateLocalBusinessSchema', () => {
    it('should generate comprehensive LocalBusiness structured data', () => {
      const schema = organizationData.generateLocalBusinessSchema();

      // Basic schema validation
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toEqual(['LocalBusiness', 'RealEstateAgent']);
      expect(schema.name).toBe('Test TRPE');
      expect(schema.telephone).toBe('+971-4-123-4567');
      expect(schema.email).toBe('test@trpe.ae');
      expect(schema.image).toBe('https://test.trpe.ae/logo.png');

      // Opening hours validation
      expect(schema.openingHoursSpecification['@type']).toBe('OpeningHoursSpecification');
      expect(schema.openingHoursSpecification.dayOfWeek).toContain('Monday');
      expect(schema.openingHoursSpecification.opens).toBe('09:00');
      expect(schema.openingHoursSpecification.closes).toBe('18:00');

      // Business details
      expect(schema.priceRange).toBe('$$$');
      expect(schema.currenciesAccepted).toContain('AED');
      expect(schema.paymentAccepted).toContain('Credit Card');

      // Service area
      expect(schema.serviceArea?.['@type']).toBe('GeoCircle');
      expect(schema.serviceArea?.geoMidpoint?.latitude).toBe(25.2048);
      expect(schema.serviceArea?.geoRadius).toBe('50000');

      // Aggregate rating
      expect(schema.aggregateRating?.['@type']).toBe('AggregateRating');
      expect(schema.aggregateRating?.ratingValue).toBe('4.8');
      expect(schema.aggregateRating?.reviewCount).toBe('150');

      // Offer catalog
      expect(schema.hasOfferCatalog?.['@type']).toBe('OfferCatalog');
      expect(schema.hasOfferCatalog?.name).toBe('Real Estate Services');
      expect(schema.hasOfferCatalog?.itemListElement).toHaveLength(4);

      // Service offers
      expect(schema.makesOffer).toHaveLength(4);
      expect(schema.makesOffer?.[0]['@type']).toBe('Offer');
      expect(schema.makesOffer?.[0].name).toBe('Property Sales');
      expect(schema.makesOffer?.[0].businessFunction).toBe('http://purl.org/goodrelations/v1#Sell');
    });

    it('should allow custom local business configuration', () => {
      const customConfig = {
        priceRange: '$$$$',
        currenciesAccepted: ['AED', 'USD'],
        aggregateRating: {
          ratingValue: '4.9',
          reviewCount: '200',
          bestRating: '5',
          worstRating: '1'
        }
      };

      const schema = organizationData.generateLocalBusinessSchema(customConfig);

      expect(schema.priceRange).toBe('$$$$');
      expect(schema.currenciesAccepted).toBe('AED, USD');
      expect(schema.aggregateRating?.ratingValue).toBe('4.9');
      expect(schema.aggregateRating?.reviewCount).toBe('200');
    });

    it('should include all organization schema properties', () => {
      const schema = organizationData.generateLocalBusinessSchema();

      // Should inherit all organization properties
      expect(schema.description).toBe('Test real estate agency');
      expect(schema.foundingDate).toBe('2020-01-01');
      expect(schema.address).toBeDefined();
      expect(schema.contactPoint).toBeDefined();
      expect(schema.sameAs).toEqual([
        'https://facebook.com/testtrpe',
        'https://instagram.com/testtrpe'
      ]);
    });
  });

  describe('generateProfessionalServiceSchema', () => {
    it('should generate ProfessionalService structured data', () => {
      const schema = organizationData.generateProfessionalServiceSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('ProfessionalService');
      expect(schema['@id']).toBe('https://test.trpe.ae#professional-service');
      expect(schema.name).toContain('Professional Real Estate Services');
      expect(schema.description).toContain('Professional real estate services');
      expect(schema.serviceType).toBe('Real Estate Services');

      // Provider reference
      expect(schema.provider['@id']).toBe('https://test.trpe.ae#organization');

      // Area served
      expect(schema.areaServed.name).toBe('Dubai');
      expect(schema.areaServed.addressCountry).toBe('AE');

      // Service categories
      expect(schema.category).toContain('Real Estate Sales');
      expect(schema.category).toContain('Property Management');

      // Offer catalog
      expect(schema.hasOfferCatalog['@type']).toBe('OfferCatalog');
      expect(schema.hasOfferCatalog.itemListElement).toHaveLength(3);
      expect(schema.hasOfferCatalog.itemListElement[0].name).toBe('Property Valuation');

      // Audience
      expect(schema.audience['@type']).toBe('Audience');
      expect(schema.audience.audienceType).toContain('Property Buyers');
      expect(schema.audience.audienceType).toContain('Real Estate Investors');
    });
  });

  describe('configuration management', () => {
    it('should update configuration correctly', () => {
      const newConfig = {
        name: 'Updated TRPE',
        description: 'Updated description'
      };

      organizationData.updateConfig(newConfig);
      const updatedConfig = organizationData.getConfig();

      expect(updatedConfig.name).toBe('Updated TRPE');
      expect(updatedConfig.description).toBe('Updated description');
      expect(updatedConfig.url).toBe('https://test.trpe.ae'); // Should preserve existing values
    });

    it('should return current configuration', () => {
      const config = organizationData.getConfig();

      expect(config.name).toBe('Test TRPE');
      expect(config.url).toBe('https://test.trpe.ae');
      expect(config.contactPoint.email).toBe('test@trpe.ae');
    });

    it('should not mutate original config when getting config', () => {
      const config1 = organizationData.getConfig();
      config1.name = 'Modified Name';
      
      const config2 = organizationData.getConfig();
      expect(config2.name).toBe('Test TRPE'); // Should not be modified
    });
  });

  describe('edge cases and validation', () => {
    it('should handle empty social media array', () => {
      const orgWithoutSocial = new OrganizationStructuredData({
        name: 'No Social TRPE',
        url: 'https://test.trpe.ae',
        socialMedia: []
      });

      const schema = orgWithoutSocial.generateOrganizationSchema();
      expect(schema.sameAs).toEqual([]);
    });

    it('should handle missing geo coordinates', () => {
      const orgWithoutGeo = new OrganizationStructuredData({
        name: 'No Geo TRPE',
        url: 'https://test.trpe.ae'
      });

      const schema = orgWithoutGeo.generateOrganizationSchema();
      expect(schema.geo).toBeUndefined();
    });

    it('should handle empty awards and certifications arrays', () => {
      const orgWithEmptyArrays = new OrganizationStructuredData({
        name: 'Empty Arrays TRPE',
        url: 'https://test.trpe.ae',
        awards: [],
        certifications: []
      });

      const schema = orgWithEmptyArrays.generateOrganizationSchema();
      expect(schema.awards).toEqual([]);
      expect(schema.hasCredential).toEqual([]);
    });

    it('should generate valid opening hours specification', () => {
      const schema = organizationData.generateLocalBusinessSchema();
      
      expect(schema.openingHoursSpecification.validFrom).toBe('2020-01-01');
      expect(schema.openingHoursSpecification.validThrough).toMatch(/^\d{4}-12-31$/);
    });

    it('should handle custom service area configuration', () => {
      const customServiceArea = {
        serviceArea: {
          type: 'AdministrativeArea' as const,
          addressCountry: 'AE',
          addressRegion: 'Dubai'
        }
      };

      const schema = organizationData.generateLocalBusinessSchema(customServiceArea);
      
      expect(schema.serviceArea?.['@type']).toBe('AdministrativeArea');
      expect(schema.serviceArea?.addressCountry).toBe('AE');
      expect(schema.serviceArea?.addressRegion).toBe('Dubai');
      expect(schema.serviceArea?.geoMidpoint).toBeUndefined();
    });
  });

  describe('business verification and compliance', () => {
    it('should include business verification data when provided', () => {
      const verifiedOrg = new OrganizationStructuredData({
        name: 'Verified TRPE',
        url: 'https://test.trpe.ae',
        businessVerification: {
          legalName: 'TRPE Global Real Estate LLC',
          taxID: 'AE-TAX-123456789',
          vatID: 'AE-VAT-987654321',
          duns: 'DUNS-123456789'
        }
      });

      const schema = verifiedOrg.generateOrganizationSchema();
      expect(schema.alternateName).toBe('TRPE Global Real Estate LLC');
    });

    it('should include contact hours when available', () => {
      const orgWithHours = new OrganizationStructuredData({
        name: 'Hours TRPE',
        url: 'https://test.trpe.ae',
        contactPoint: {
          telephone: '+971-4-123-4567',
          email: 'test@trpe.ae',
          contactType: 'customer service',
          availableLanguage: ['en'],
          hoursAvailable: {
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday'],
            opens: '08:00',
            closes: '17:00'
          }
        }
      });

      const schema = orgWithHours.generateOrganizationSchema();
      expect(schema.contactPoint.hoursAvailable?.['@type']).toBe('OpeningHoursSpecification');
      expect(schema.contactPoint.hoursAvailable?.opens).toBe('08:00');
      expect(schema.contactPoint.hoursAvailable?.closes).toBe('17:00');
    });
  });
});