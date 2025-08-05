import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { SEOMetadataGenerator, PageContext } from '../metadata-generator';

// Mock the page meta actions to avoid database connection
mock.module('@/actions/page-meta-actions', () => ({
  getPageMetaByPath: mock(() => Promise.resolve(null))
}));

describe('SEOMetadataGenerator', () => {
  let generator: SEOMetadataGenerator;

  beforeEach(() => {
    generator = new SEOMetadataGenerator();
  });

  describe('generateMetadata', () => {
    it('should generate home page metadata', async () => {
      const context: PageContext = {
        path: '/',
        pageType: 'home'
      };

      const metadata = await generator.generateMetadata(context);

      expect(metadata.title).toContain('Dubai Real Estate');
      expect(metadata.description).toContain('Find the best properties');
      expect(metadata.alternates?.canonical).toBe('https://trpe.ae/');
      expect(metadata.openGraph?.type).toBe('website');
    });

    it('should generate property detail metadata', async () => {
      const mockProperty = {
        title: 'Luxury 3BR Apartment',
        slug: 'luxury-3br-apartment',
        bedrooms: 3,
        size: 2000,
        price: 2500000,
        type: { name: 'Apartment' },
        community: { name: 'Downtown Dubai' },
        offeringType: { name: 'Sale', slug: 'sale' },
        images: [{ crmUrl: 'https://example.com/image.jpg' }],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02'
      };

      const context: PageContext = {
        path: '/properties/sale/luxury-3br-apartment',
        pageType: 'property-detail',
        data: mockProperty
      };

      const metadata = await generator.generateMetadata(context);

      expect(metadata.title).toContain('Luxury 3BR Apartment');
      expect(metadata.title).toContain('Downtown Dubai');
      expect(metadata.description).toContain('3 bedroom');
      expect(metadata.description).toContain('Downtown Dubai');
      expect(metadata.description).toContain('2,500,000');
      expect(metadata.openGraph?.type).toBe('product');
      expect(metadata.openGraph?.images?.[0]?.url).toBe('https://example.com/image.jpg');
    });

    it('should generate properties listing metadata', async () => {
      const context: PageContext = {
        path: '/properties/sale',
        pageType: 'properties',
        data: { offeringType: 'Sale' }
      };

      const metadata = await generator.generateMetadata(context);

      expect(metadata.title).toContain('Sale');
      expect(metadata.description).toContain('sale');
      expect(metadata.openGraph?.type).toBe('website');
    });

    it('should handle missing data gracefully', async () => {
      const context: PageContext = {
        path: '/test-page',
        pageType: 'static'
      };

      const metadata = await generator.generateMetadata(context);

      expect(metadata.title).toBeDefined();
      expect(metadata.description).toBeDefined();
      expect(metadata.alternates?.canonical).toBe('https://trpe.ae/test-page');
    });

    it('should truncate long titles and descriptions', async () => {
      const longTitle = 'A'.repeat(100);
      const longDescription = 'B'.repeat(200);

      const mockProperty = {
        title: longTitle,
        description: longDescription,
        slug: 'test-property',
        type: { name: 'Apartment' },
        community: { name: 'Test Community' },
        offeringType: { name: 'Sale', slug: 'sale' },
        createdAt: '2024-01-01'
      };

      const context: PageContext = {
        path: '/properties/sale/test-property',
        pageType: 'property-detail',
        data: mockProperty
      };

      const metadata = await generator.generateMetadata(context);

      expect(typeof metadata.title === 'string' ? metadata.title.length : 0).toBeLessThanOrEqual(60);
      expect(typeof metadata.description === 'string' ? metadata.description.length : 0).toBeLessThanOrEqual(160);
    });

    it('should generate dynamic keywords based on property data', async () => {
      const mockProperty = {
        title: 'Modern Apartment',
        slug: 'modern-apartment',
        bedrooms: 2,
        type: { name: 'Apartment' },
        community: { name: 'Dubai Marina' },
        offeringType: { name: 'Sale', slug: 'sale' },
        createdAt: '2024-01-01'
      };

      const context: PageContext = {
        path: '/properties/sale/modern-apartment',
        pageType: 'property-detail',
        data: mockProperty
      };

      const metadata = await generator.generateMetadata(context);

      expect(metadata.keywords).toContain('Dubai Marina properties');
      expect(metadata.keywords).toContain('Apartment Dubai');
      expect(metadata.keywords).toContain('2 bedroom Apartment');
      expect(metadata.keywords).toContain('properties for sale Dubai');
    });

    it('should optimize Open Graph and Twitter Card metadata', async () => {
      const mockProperty = {
        title: 'Luxury Penthouse with Sea View',
        slug: 'luxury-penthouse',
        bedrooms: 4,
        price: 5000000,
        type: { name: 'Penthouse' },
        community: { name: 'Palm Jumeirah' },
        offeringType: { name: 'Sale', slug: 'sale' },
        images: [{ crmUrl: 'https://example.com/penthouse.jpg' }],
        createdAt: '2024-01-01'
      };

      const context: PageContext = {
        path: '/properties/sale/luxury-penthouse',
        pageType: 'property-detail',
        data: mockProperty
      };

      const metadata = await generator.generateMetadata(context);

      expect(metadata.openGraph?.title).toBeDefined();
      expect(metadata.openGraph?.title?.length).toBeLessThanOrEqual(55);
      expect(metadata.openGraph?.description).toBeDefined();
      expect(metadata.openGraph?.description?.length).toBeLessThanOrEqual(155);
      expect(metadata.twitter?.title).toBeDefined();
      expect(metadata.twitter?.description).toBeDefined();
    });
  });

  describe('robots configuration', () => {
    it('should set proper robots directives', async () => {
      const context: PageContext = {
        path: '/',
        pageType: 'home'
      };

      const metadata = await generator.generateMetadata(context);

      // Check that robots string is properly formatted
      expect(metadata.robots).toBeDefined();
      expect(typeof metadata.robots).toBe('string');
      
      // For home page with maxImagePreview, should contain that directive
      // Since index: true and follow: true are defaults, they won't appear unless explicitly set to false
      expect(metadata.robots).toContain('max-image-preview:large');
    });

    it('should handle noindex and nofollow directives', async () => {
      // Test with a page that might have restrictions
      const context: PageContext = {
        path: '/admin',
        pageType: 'static'
      };

      const metadata = await generator.generateMetadata(context);
      expect(metadata.robots).toBeDefined();
    });
  });

  describe('Open Graph optimization', () => {
    it('should include required Open Graph properties', async () => {
      const context: PageContext = {
        path: '/',
        pageType: 'home'
      };

      const metadata = await generator.generateMetadata(context);

      expect(metadata.openGraph?.title).toBeDefined();
      expect(metadata.openGraph?.description).toBeDefined();
      expect(metadata.openGraph?.url).toBeDefined();
      expect(metadata.openGraph?.siteName).toBeDefined();
      expect(metadata.openGraph?.images).toBeDefined();
      expect(metadata.openGraph?.locale).toBeDefined();
      expect(metadata.openGraph?.type).toBeDefined();
    });
  });

  describe('Twitter Card optimization', () => {
    it('should include required Twitter Card properties', async () => {
      const context: PageContext = {
        path: '/',
        pageType: 'home'
      };

      const metadata = await generator.generateMetadata(context);

      expect(metadata.twitter?.card).toBeDefined();
      expect(metadata.twitter?.title).toBeDefined();
      expect(metadata.twitter?.description).toBeDefined();
      expect(metadata.twitter?.images).toBeDefined();
      expect(metadata.twitter?.site).toBeDefined();
      expect(metadata.twitter?.creator).toBeDefined();
    });
  });
});