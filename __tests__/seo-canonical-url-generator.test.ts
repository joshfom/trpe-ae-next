import { describe, it, expect, beforeEach } from 'bun:test';
import { CanonicalURLGenerator } from '../canonical-url-generator';

describe('CanonicalURLGenerator', () => {
  let generator: CanonicalURLGenerator;

  beforeEach(() => {
    generator = new CanonicalURLGenerator('https://trpe.ae');
  });

  describe('generateCanonicalURL', () => {
    it('should generate basic canonical URL', () => {
      const url = generator.generateCanonicalURL({
        path: '/properties'
      });

      expect(url).toBe('https://trpe.ae/properties');
    });

    it('should remove trailing slash by default', () => {
      const url = generator.generateCanonicalURL({
        path: '/properties/'
      });

      expect(url).toBe('https://trpe.ae/properties');
    });

    it('should preserve root path trailing slash', () => {
      const url = generator.generateCanonicalURL({
        path: '/'
      });

      expect(url).toBe('https://trpe.ae/');
    });

    it('should remove query parameters by default', () => {
      const url = generator.generateCanonicalURL({
        path: '/properties?page=2&sort=price'
      });

      expect(url).toBe('https://trpe.ae/properties');
    });

    it('should preserve specified query parameters', () => {
      const url = generator.generateCanonicalURL({
        path: '/properties?page=2&sort=price&utm_source=google',
        removeQueryParams: false,
        preserveQueryParams: ['page']
      });

      expect(url).toBe('https://trpe.ae/properties?page=2');
    });

    it('should force HTTPS', () => {
      const httpGenerator = new CanonicalURLGenerator('http://trpe.ae');
      const url = httpGenerator.generateCanonicalURL({
        path: '/properties',
        forceHttps: true
      });

      expect(url).toBe('https://trpe.ae/properties');
    });

    it('should normalize double slashes', () => {
      const url = generator.generateCanonicalURL({
        path: '//properties//sale//apartment'
      });

      expect(url).toBe('https://trpe.ae/properties/sale/apartment');
    });

    it('should handle paths without leading slash', () => {
      const url = generator.generateCanonicalURL({
        path: 'properties/sale'
      });

      expect(url).toBe('https://trpe.ae/properties/sale');
    });
  });

  describe('generatePropertyCanonicalURL', () => {
    it('should generate property canonical URL', () => {
      const url = generator.generatePropertyCanonicalURL('sale', 'luxury-apartment');

      expect(url).toBe('https://trpe.ae/properties/sale/luxury-apartment');
    });
  });

  describe('generateCommunityCanonicalURL', () => {
    it('should generate community canonical URL', () => {
      const url = generator.generateCommunityCanonicalURL('downtown-dubai');

      expect(url).toBe('https://trpe.ae/communities/downtown-dubai');
    });
  });

  describe('generateInsightCanonicalURL', () => {
    it('should generate insight canonical URL', () => {
      const url = generator.generateInsightCanonicalURL('dubai-market-trends');

      expect(url).toBe('https://trpe.ae/insights/dubai-market-trends');
    });
  });

  describe('generateListingCanonicalURL', () => {
    it('should generate listing URL without pagination', () => {
      const url = generator.generateListingCanonicalURL('/properties');

      expect(url).toBe('https://trpe.ae/properties');
    });

    it('should generate listing URL with pagination', () => {
      const url = generator.generateListingCanonicalURL('/properties', 2);

      expect(url).toBe('https://trpe.ae/properties?page=2');
    });

    it('should not add page parameter for page 1', () => {
      const url = generator.generateListingCanonicalURL('/properties', 1);

      expect(url).toBe('https://trpe.ae/properties');
    });
  });

  describe('isValidCanonicalURL', () => {
    it('should validate correct HTTPS URLs', () => {
      expect(generator.isValidCanonicalURL('https://trpe.ae/properties')).toBe(true);
    });

    it('should reject HTTP URLs', () => {
      expect(generator.isValidCanonicalURL('http://trpe.ae/properties')).toBe(false);
    });

    it('should reject URLs with double slashes', () => {
      expect(generator.isValidCanonicalURL('https://trpe.ae//properties')).toBe(false);
    });

    it('should reject invalid URLs', () => {
      expect(generator.isValidCanonicalURL('not-a-url')).toBe(false);
    });

    it('should reject URLs without hostname', () => {
      expect(generator.isValidCanonicalURL('https:///')).toBe(false);
    });
  });

  describe('URL normalization edge cases', () => {
    it('should handle special characters in path', () => {
      const url = generator.generateCanonicalURL({
        path: '/properties/sale/apartment with spaces'
      });

      expect(url).toContain('https://trpe.ae/properties/sale/apartment');
    });

    it('should handle encoded characters', () => {
      const url = generator.generateCanonicalURL({
        path: '/properties/sale/apartment%20name'
      });

      expect(url).toBe('https://trpe.ae/properties/sale/apartment name');
    });
  });
});