"use server";

export interface HreflangConfig {
  hreflang: string;
  href: string;
}

export interface LanguageConfig {
  code: string; // ISO 639-1 language code (e.g., 'en', 'ar')
  region?: string; // ISO 3166-1 country code (e.g., 'US', 'AE')
  name: string; // Display name
  dir: 'ltr' | 'rtl'; // Text direction
  enabled: boolean;
}

export interface HreflangGeneratorConfig {
  baseUrl: string;
  defaultLanguage: string;
  languages: LanguageConfig[];
}

export class HreflangGenerator {
  private config: HreflangGeneratorConfig;

  constructor(config?: Partial<HreflangGeneratorConfig>) {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_URL || 'https://trpe.ae',
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
      ],
      ...config
    };
  }

  /**
   * Generate hreflang tags for a given path
   */
  generateHreflangTags(path: string, currentLanguage?: string): HreflangConfig[] {
    const hreflangTags: HreflangConfig[] = [];
    const enabledLanguages = this.config.languages.filter(lang => lang.enabled);

    // Generate hreflang for each enabled language
    for (const language of enabledLanguages) {
      const hreflangCode = this.formatHreflangCode(language);
      const href = this.generateLanguageURL(path, language.code);
      
      hreflangTags.push({
        hreflang: hreflangCode,
        href
      });
    }

    // Add x-default for the default language
    const defaultLang = enabledLanguages.find(lang => lang.code === this.config.defaultLanguage);
    if (defaultLang) {
      const defaultHref = this.generateLanguageURL(path, this.config.defaultLanguage);
      hreflangTags.push({
        hreflang: 'x-default',
        href: defaultHref
      });
    }

    return hreflangTags;
  }

  /**
   * Format hreflang code (language-region)
   */
  private formatHreflangCode(language: LanguageConfig): string {
    if (language.region) {
      return `${language.code}-${language.region}`;
    }
    return language.code;
  }

  /**
   * Generate URL for specific language
   */
  private generateLanguageURL(path: string, languageCode: string): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    
    // If it's the default language, don't add language prefix
    if (languageCode === this.config.defaultLanguage) {
      return `${baseUrl}${path}`;
    }

    // Add language prefix for non-default languages
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}/${languageCode}${cleanPath}`;
  }

  /**
   * Extract language from path
   */
  extractLanguageFromPath(path: string): { language: string; cleanPath: string } {
    const pathSegments = path.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) {
      return { language: this.config.defaultLanguage, cleanPath: '/' };
    }

    const firstSegment = pathSegments[0];
    const language = this.config.languages.find(lang => lang.code === firstSegment);

    if (language && language.enabled) {
      const cleanPath = '/' + pathSegments.slice(1).join('/');
      return { language: language.code, cleanPath: cleanPath === '/' ? '/' : cleanPath };
    }

    return { language: this.config.defaultLanguage, cleanPath: path };
  }

  /**
   * Generate alternate URLs object for Next.js metadata
   */
  generateAlternateLanguages(path: string): Record<string, string> {
    const hreflangTags = this.generateHreflangTags(path);
    const alternates: Record<string, string> = {};

    for (const tag of hreflangTags) {
      alternates[tag.hreflang] = tag.href;
    }

    return alternates;
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(languageCode: string): boolean {
    return this.config.languages.some(lang => 
      lang.code === languageCode && lang.enabled
    );
  }

  /**
   * Get language configuration
   */
  getLanguageConfig(languageCode: string): LanguageConfig | undefined {
    return this.config.languages.find(lang => lang.code === languageCode);
  }

  /**
   * Get all enabled languages
   */
  getEnabledLanguages(): LanguageConfig[] {
    return this.config.languages.filter(lang => lang.enabled);
  }

  /**
   * Get default language
   */
  getDefaultLanguage(): string {
    return this.config.defaultLanguage;
  }

  /**
   * Generate language switcher data
   */
  generateLanguageSwitcherData(currentPath: string, currentLanguage: string): Array<{
    code: string;
    name: string;
    href: string;
    dir: 'ltr' | 'rtl';
    active: boolean;
  }> {
    const { cleanPath } = this.extractLanguageFromPath(currentPath);
    
    return this.getEnabledLanguages().map(language => ({
      code: language.code,
      name: language.name,
      href: this.generateLanguageURL(cleanPath, language.code),
      dir: language.dir,
      active: language.code === currentLanguage
    }));
  }

  /**
   * Validate hreflang configuration
   */
  validateHreflangTags(tags: HreflangConfig[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for duplicate hreflang codes
    const hreflangCodes = tags.map(tag => tag.hreflang);
    const duplicates = hreflangCodes.filter((code, index) => hreflangCodes.indexOf(code) !== index);
    
    if (duplicates.length > 0) {
      errors.push(`Duplicate hreflang codes found: ${duplicates.join(', ')}`);
    }

    // Check for valid URLs
    for (const tag of tags) {
      try {
        new URL(tag.href);
      } catch (e) {
        errors.push(`Invalid URL for hreflang ${tag.hreflang}: ${tag.href}`);
      }
    }

    // Check for x-default presence
    const hasXDefault = tags.some(tag => tag.hreflang === 'x-default');
    if (!hasXDefault && tags.length > 1) {
      errors.push('Missing x-default hreflang tag');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Add new language configuration
   */
  addLanguage(language: LanguageConfig): void {
    const existingIndex = this.config.languages.findIndex(lang => lang.code === language.code);
    
    if (existingIndex >= 0) {
      this.config.languages[existingIndex] = language;
    } else {
      this.config.languages.push(language);
    }
  }

  /**
   * Remove language configuration
   */
  removeLanguage(languageCode: string): void {
    this.config.languages = this.config.languages.filter(lang => lang.code !== languageCode);
  }

  /**
   * Enable/disable language
   */
  setLanguageEnabled(languageCode: string, enabled: boolean): void {
    const language = this.config.languages.find(lang => lang.code === languageCode);
    if (language) {
      language.enabled = enabled;
    }
  }
}

// Export singleton instance
export const hreflangGenerator = new HreflangGenerator();