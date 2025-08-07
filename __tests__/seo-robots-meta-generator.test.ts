import { describe, it, expect, beforeEach } from 'bun:test';
import { RobotsMetaGenerator } from '../robots-meta-generator';

describe('RobotsMetaGenerator', () => {
  let generator: RobotsMetaGenerator;

  beforeEach(() => {
    generator = new RobotsMetaGenerator();
  });

  describe('generateRobotsMetaString', () => {
    it('should generate default robots meta for home page', () => {
      const robots = generator.generateRobotsMetaString('/');

      expect(robots).toContain('max-image-preview:large');
    });

    it('should block admin pages from indexing', () => {
      const robots = generator.generateRobotsMetaString('/admin/dashboard');

      expect(robots).toContain('noindex');
      expect(robots).toContain('nofollow');
    });

    it('should block CRM pages from indexing', () => {
      const robots = generator.generateRobotsMetaString('/crm/leads');

      expect(robots).toContain('noindex');
      expect(robots).toContain('nofollow');
    });

    it('should block API routes from indexing', () => {
      const robots = generator.generateRobotsMetaString('/api/properties');

      expect(robots).toContain('noindex');
      expect(robots).toContain('nofollow');
    });

    it('should allow property pages to be indexed', () => {
      const robots = generator.generateRobotsMetaString('/properties/sale/luxury-apartment');

      expect(robots).not.toContain('noindex');
      expect(robots).not.toContain('nofollow');
      expect(robots).toContain('max-image-preview:large');
    });

    it('should allow community pages to be indexed', () => {
      const robots = generator.generateRobotsMetaString('/communities/downtown-dubai');

      expect(robots).not.toContain('noindex');
      expect(robots).not.toContain('nofollow');
    });

    it('should allow insight pages to be indexed with larger snippets', () => {
      const robots = generator.generateRobotsMetaString('/insights/market-trends');

      expect(robots).not.toContain('noindex');
      expect(robots).not.toContain('nofollow');
      expect(robots).toContain('max-snippet:200');
    });

    it('should block login pages from indexing', () => {
      const robots = generator.generateRobotsMetaString('/login');

      expect(robots).toContain('noindex');
      expect(robots).toContain('nofollow');
    });

    it('should block thank you pages from indexing but allow following', () => {
      const robots = generator.generateRobotsMetaString('/contact-us/thank-you');

      expect(robots).toContain('noindex');
      expect(robots).not.toContain('nofollow');
    });
  });

  describe('generateRobotsConfig', () => {
    it('should return default config for unknown paths', () => {
      const config = generator.generateRobotsConfig('/unknown-path');

      expect(config.index).toBe(true);
      expect(config.follow).toBe(true);
      expect(config.maxImagePreview).toBe('large');
    });

    it('should apply custom config overrides', () => {
      const config = generator.generateRobotsConfig('/', {
        index: false,
        maxSnippet: 100
      });

      expect(config.index).toBe(false);
      expect(config.maxSnippet).toBe(100);
    });

    it('should prioritize higher priority rules', () => {
      const config = generator.generateRobotsConfig('/admin/properties');

      // Admin rule should take precedence over properties rule
      expect(config.index).toBe(false);
      expect(config.follow).toBe(false);
    });
  });

  describe('shouldIndex and shouldFollow', () => {
    it('should correctly identify indexable pages', () => {
      expect(generator.shouldIndex('/')).toBe(true);
      expect(generator.shouldIndex('/properties')).toBe(true);
      expect(generator.shouldIndex('/admin')).toBe(false);
    });

    it('should correctly identify followable pages', () => {
      expect(generator.shouldFollow('/')).toBe(true);
      expect(generator.shouldFollow('/properties')).toBe(true);
      expect(generator.shouldFollow('/admin')).toBe(false);
      expect(generator.shouldFollow('/thank-you')).toBe(true);
    });
  });

  describe('getApplicableRules', () => {
    it('should return applicable rules sorted by priority', () => {
      const rules = generator.getApplicableRules('/admin/properties');

      expect(rules.length).toBeGreaterThan(0);
      expect(rules[0].priority).toBeGreaterThanOrEqual(rules[rules.length - 1].priority);
    });

    it('should return empty array for paths with no rules', () => {
      const rules = generator.getApplicableRules('/some-random-path');

      expect(rules.length).toBe(0);
    });
  });

  describe('addPageRule and removePageRule', () => {
    it('should add custom page rule', () => {
      generator.addPageRule({
        pathPattern: '/custom-path',
        config: { index: false },
        priority: 200
      });

      const robots = generator.generateRobotsMetaString('/custom-path');
      expect(robots).toContain('noindex');
    });

    it('should remove page rule', () => {
      generator.addPageRule({
        pathPattern: '/temp-path',
        config: { index: false },
        priority: 200
      });

      generator.removePageRule('/temp-path');
      
      const config = generator.generateRobotsConfig('/temp-path');
      expect(config.index).toBe(true); // Should fall back to default
    });
  });

  describe('robots string formatting', () => {
    it('should format multiple directives correctly', () => {
      const robots = generator.generateRobotsMetaString('/admin', {
        noarchive: true,
        nosnippet: true,
        maxVideoPreview: 30
      });

      expect(robots).toContain('noindex');
      expect(robots).toContain('nofollow');
      expect(robots).toContain('noarchive');
      expect(robots).toContain('nosnippet');
      expect(robots).toContain('max-video-preview:30');
    });

    it('should handle unavailable_after directive', () => {
      const futureDate = new Date('2025-12-31');
      const robots = generator.generateRobotsMetaString('/', {
        unavailableAfter: futureDate
      });

      expect(robots).toContain('unavailable_after:2025-12-31');
    });

    it('should return default for no restrictions', () => {
      const robots = generator.generateRobotsMetaString('/simple-page', {
        index: true,
        follow: true,
        maxSnippet: undefined,
        maxImagePreview: undefined
      });

      expect(robots).toBe('index, follow');
    });
  });
});