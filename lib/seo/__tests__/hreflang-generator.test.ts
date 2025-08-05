import { describe, it, expect, beforeEach } from 'bun:test';
import { HreflangGenerator } from '../hreflang-generator';

describe('HreflangGenerator', () => {
  let generator: HreflangGenerator;

  beforeEach(() => {
    generator = new HreflangGenerator({
      baseUrl: 'https://trpe.ae',
      defaultLanguage: 'en',
      languages: [
        {
          code: 'en',
          region: 'US',
          name: 'English',
          dir: 'ltr',
          enabled: true
        },
        {
          code: 'ar',
          region: 'AE',
          name: 'العربية',
          dir: 'rtl',
          enabled: true
        }
      ]
    });
  });

  describe('generateHreflangTags', () => {
    it('should generate hreflang tags for all enabled languages', () => {
      const tags = generator.generateHreflangTags('/properties');

      expect(tags).toHaveLength(3); // en-US, ar-AE, x-default
      
      const enTag = tags.find(tag => tag.hreflang === 'en-US');
      const arTag = tags.find(tag => tag.hreflang === 'ar-AE');
      const defaultTag = tags.find(tag => tag.hreflang === 'x-default');

      expect(enTag?.href).toBe('https://trpe.ae/properties');
      expect(arTag?.href).toBe('https://trpe.ae/ar/properties');
      expect(defaultTag?.href).toBe('https://trpe.ae/properties');
    });

    it('should handle root path correctly', () => {
      const tags = generator.generateHreflangTags('/');

      const enTag = tags.find(tag => tag.hreflang === 'en-US');
      const arTag = tags.find(tag => tag.hreflang === 'ar-AE');

      expect(enTag?.href).toBe('https://trpe.ae/');
      expect(arTag?.href).toBe('https://trpe.ae/ar/');
    });

    it('should handle deep paths correctly', () => {
      const tags = generator.generateHreflangTags('/properties/sale/luxury-apartment');

      const arTag = tags.find(tag => tag.hreflang === 'ar-AE');
      expect(arTag?.href).toBe('https://trpe.ae/ar/properties/sale/luxury-apartment');
    });
  });

  describe('extractLanguageFromPath', () => {
    it('should extract language from path with language prefix', () => {
      const result = generator.extractLanguageFromPath('/ar/properties');

      expect(result.language).toBe('ar');
      expect(result.cleanPath).toBe('/properties');
    });

    it('should return default language for path without prefix', () => {
      const result = generator.extractLanguageFromPath('/properties');

      expect(result.language).toBe('en');
      expect(result.cleanPath).toBe('/properties');
    });

    it('should handle root path correctly', () => {
      const result = generator.extractLanguageFromPath('/');

      expect(result.language).toBe('en');
      expect(result.cleanPath).toBe('/');
    });

    it('should handle language-prefixed root path', () => {
      const result = generator.extractLanguageFromPath('/ar');

      expect(result.language).toBe('ar');
      expect(result.cleanPath).toBe('/');
    });

    it('should ignore invalid language codes', () => {
      const result = generator.extractLanguageFromPath('/fr/properties');

      expect(result.language).toBe('en');
      expect(result.cleanPath).toBe('/fr/properties');
    });
  });

  describe('generateAlternateLanguages', () => {
    it('should generate alternate languages object for Next.js metadata', () => {
      const alternates = generator.generateAlternateLanguages('/properties');

      expect(alternates['en-US']).toBe('https://trpe.ae/properties');
      expect(alternates['ar-AE']).toBe('https://trpe.ae/ar/properties');
      expect(alternates['x-default']).toBe('https://trpe.ae/properties');
    });
  });

  describe('generateLanguageSwitcherData', () => {
    it('should generate language switcher data', () => {
      const data = generator.generateLanguageSwitcherData('/properties', 'en');

      expect(data).toHaveLength(2);
      
      const enData = data.find(item => item.code === 'en');
      const arData = data.find(item => item.code === 'ar');

      expect(enData?.active).toBe(true);
      expect(arData?.active).toBe(false);
      expect(enData?.href).toBe('https://trpe.ae/properties');
      expect(arData?.href).toBe('https://trpe.ae/ar/properties');
      expect(arData?.dir).toBe('rtl');
    });

    it('should handle language-prefixed current path', () => {
      const data = generator.generateLanguageSwitcherData('/ar/properties', 'ar');

      const enData = data.find(item => item.code === 'en');
      const arData = data.find(item => item.code === 'ar');

      expect(arData?.active).toBe(true);
      expect(enData?.active).toBe(false);
      expect(enData?.href).toBe('https://trpe.ae/properties');
      expect(arData?.href).toBe('https://trpe.ae/ar/properties');
    });
  });

  describe('language management', () => {
    it('should check if language is supported', () => {
      expect(generator.isLanguageSupported('en')).toBe(true);
      expect(generator.isLanguageSupported('ar')).toBe(true);
      expect(generator.isLanguageSupported('fr')).toBe(false);
    });

    it('should get language configuration', () => {
      const enConfig = generator.getLanguageConfig('en');
      const arConfig = generator.getLanguageConfig('ar');

      expect(enConfig?.name).toBe('English');
      expect(enConfig?.dir).toBe('ltr');
      expect(arConfig?.name).toBe('العربية');
      expect(arConfig?.dir).toBe('rtl');
    });

    it('should get enabled languages', () => {
      const enabled = generator.getEnabledLanguages();

      expect(enabled).toHaveLength(2);
      expect(enabled.every(lang => lang.enabled)).toBe(true);
    });

    it('should add new language', () => {
      generator.addLanguage({
        code: 'fr',
        region: 'FR',
        name: 'Français',
        dir: 'ltr',
        enabled: true
      });

      expect(generator.isLanguageSupported('fr')).toBe(true);
      expect(generator.getEnabledLanguages()).toHaveLength(3);
    });

    it('should remove language', () => {
      generator.removeLanguage('ar');

      expect(generator.isLanguageSupported('ar')).toBe(false);
      expect(generator.getEnabledLanguages()).toHaveLength(1);
    });

    it('should enable/disable language', () => {
      generator.setLanguageEnabled('ar', false);

      expect(generator.getLanguageConfig('ar')?.enabled).toBe(false);
      expect(generator.getEnabledLanguages()).toHaveLength(1);
    });
  });

  describe('validateHreflangTags', () => {
    it('should validate correct hreflang tags', () => {
      const tags = generator.generateHreflangTags('/properties');
      const validation = generator.validateHreflangTags(tags);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect duplicate hreflang codes', () => {
      const tags = [
        { hreflang: 'en-US', href: 'https://trpe.ae/properties' },
        { hreflang: 'en-US', href: 'https://trpe.ae/en/properties' }
      ];

      const validation = generator.validateHreflangTags(tags);

      expect(validation.valid).toBe(false);
      expect(validation.errors[0]).toContain('Duplicate hreflang codes');
    });

    it('should detect invalid URLs', () => {
      const tags = [
        { hreflang: 'en-US', href: 'not-a-valid-url' }
      ];

      const validation = generator.validateHreflangTags(tags);

      expect(validation.valid).toBe(false);
      expect(validation.errors[0]).toContain('Invalid URL');
    });

    it('should detect missing x-default', () => {
      const tags = [
        { hreflang: 'en-US', href: 'https://trpe.ae/properties' },
        { hreflang: 'ar-AE', href: 'https://trpe.ae/ar/properties' }
      ];

      const validation = generator.validateHreflangTags(tags);

      expect(validation.valid).toBe(false);
      expect(validation.errors[0]).toContain('Missing x-default');
    });
  });
});