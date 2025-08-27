export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

export interface OptimizedMetaTags {
  title: string;
  metaTags: MetaTag[];
  linkTags: LinkTag[];
}

export interface LinkTag {
  rel: string;
  href: string;
  hreflang?: string;
  type?: string;
  sizes?: string;
  media?: string;
}

export interface MetaOptimizationConfig {
  includeViewport: boolean;
  includeCharset: boolean;
  includeRobots: boolean;
  includeOpenGraph: boolean;
  includeTwitterCard: boolean;
  includeCanonical: boolean;
  includeFavicon: boolean;
  includeAppleTouchIcon: boolean;
  includeManifest: boolean;
  includeThemeColor: boolean;
}

export class MetaTagOptimizer {
  private baseUrl: string;
  private siteName: string;
  private themeColor: string;
  private defaultConfig: MetaOptimizationConfig;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
    this.siteName = 'TRPE Global';
    this.themeColor = '#1a365d';
    this.defaultConfig = {
      includeViewport: true,
      includeCharset: true,
      includeRobots: true,
      includeOpenGraph: true,
      includeTwitterCard: true,
      includeCanonical: true,
      includeFavicon: true,
      includeAppleTouchIcon: true,
      includeManifest: true,
      includeThemeColor: true
    };
  }

  /**
   * Generate optimized meta tags for a page
   */
  generateOptimizedMetaTags(
    title: string,
    description: string,
    canonical: string,
    options: {
      keywords?: string[];
      robots?: string;
      openGraph?: {
        title: string;
        description: string;
        image: string;
        type: string;
        url: string;
        siteName: string;
        locale?: string;
      };
      twitterCard?: {
        card: string;
        title: string;
        description: string;
        image: string;
        site?: string;
        creator?: string;
      };
      hreflang?: Array<{ hreflang: string; href: string }>;
      customMeta?: MetaTag[];
      config?: Partial<MetaOptimizationConfig>;
    } = {}
  ): OptimizedMetaTags {
    const config = { ...this.defaultConfig, ...options.config };
    const metaTags: MetaTag[] = [];
    const linkTags: LinkTag[] = [];

    // Basic meta tags
    if (config.includeCharset) {
      metaTags.push({ httpEquiv: 'Content-Type', content: 'text/html; charset=utf-8' });
    }

    if (config.includeViewport) {
      metaTags.push({
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      });
    }

    // SEO meta tags
    metaTags.push({ name: 'description', content: this.truncateDescription(description) });

    if (options.keywords && options.keywords.length > 0) {
      metaTags.push({
        name: 'keywords',
        content: options.keywords.slice(0, 10).join(', ')
      });
    }

    if (config.includeRobots) {
      metaTags.push({
        name: 'robots',
        content: options.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      });
    }

    // Additional SEO meta tags
    metaTags.push({ name: 'author', content: this.siteName });
    metaTags.push({ name: 'generator', content: 'Next.js' });
    metaTags.push({ name: 'referrer', content: 'origin-when-cross-origin' });
    metaTags.push({ name: 'format-detection', content: 'telephone=no' });

    // Open Graph meta tags
    if (config.includeOpenGraph && options.openGraph) {
      const og = options.openGraph;
      metaTags.push(
        { property: 'og:type', content: og.type },
        { property: 'og:title', content: this.truncateTitle(og.title) },
        { property: 'og:description', content: this.truncateDescription(og.description) },
        { property: 'og:url', content: og.url },
        { property: 'og:site_name', content: og.siteName },
        { property: 'og:image', content: og.image },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: og.title },
        { property: 'og:locale', content: og.locale || 'en_US' }
      );

      // Add article-specific Open Graph tags
      if (og.type === 'article') {
        metaTags.push(
          { property: 'article:publisher', content: this.baseUrl },
          { property: 'article:author', content: this.siteName },
          { property: 'article:section', content: 'Real Estate' },
          { property: 'article:tag', content: options.keywords?.join(', ') || 'Dubai Real Estate' }
        );
      }
    }

    // Twitter Card meta tags
    if (config.includeTwitterCard && options.twitterCard) {
      const twitter = options.twitterCard;
      metaTags.push(
        { name: 'twitter:card', content: twitter.card },
        { name: 'twitter:title', content: this.truncateTitle(twitter.title) },
        { name: 'twitter:description', content: this.truncateDescription(twitter.description) },
        { name: 'twitter:image', content: twitter.image },
        { name: 'twitter:image:alt', content: twitter.title }
      );

      if (twitter.site) {
        metaTags.push({ name: 'twitter:site', content: twitter.site });
      }

      if (twitter.creator) {
        metaTags.push({ name: 'twitter:creator', content: twitter.creator });
      }
    }

    // Theme and app meta tags
    if (config.includeThemeColor) {
      metaTags.push(
        { name: 'theme-color', content: this.themeColor },
        { name: 'msapplication-TileColor', content: this.themeColor },
        { name: 'msapplication-config', content: '/browserconfig.xml' }
      );
    }

    // Apple-specific meta tags
    metaTags.push(
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: this.siteName }
    );

    // Link tags
    if (config.includeCanonical) {
      linkTags.push({ rel: 'canonical', href: canonical });
    }

    if (config.includeFavicon) {
      linkTags.push(
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'shortcut icon', href: '/favicon.ico' }
      );
    }

    if (config.includeAppleTouchIcon) {
      linkTags.push(
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-152x152.png', sizes: '152x152' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-144x144.png', sizes: '144x144' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-120x120.png', sizes: '120x120' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-114x114.png', sizes: '114x114' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-76x76.png', sizes: '76x76' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-72x72.png', sizes: '72x72' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-60x60.png', sizes: '60x60' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-57x57.png', sizes: '57x57' }
      );
    }

    if (config.includeManifest) {
      linkTags.push({ rel: 'manifest', href: '/site.webmanifest' });
    }

    // Hreflang tags
    if (options.hreflang && options.hreflang.length > 0) {
      options.hreflang.forEach(lang => {
        linkTags.push({
          rel: 'alternate',
          hreflang: lang.hreflang,
          href: lang.href
        });
      });
    }

    // DNS prefetch and preconnect for performance
    linkTags.push(
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
      { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' }
    );

    // Add custom meta tags
    if (options.customMeta && options.customMeta.length > 0) {
      metaTags.push(...options.customMeta);
    }

    return {
      title: this.optimizeTitle(title),
      metaTags: this.deduplicateMetaTags(metaTags),
      linkTags: this.deduplicateLinkTags(linkTags)
    };
  }

  /**
   * Generate structured data script tag
   */
  generateStructuredDataScript(structuredData: any): string {
    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 0)}</script>`;
  }

  /**
   * Generate preload tags for critical resources
   */
  generatePreloadTags(resources: Array<{
    href: string;
    as: string;
    type?: string;
    crossorigin?: boolean;
    media?: string;
  }>): LinkTag[] {
    return resources.map(resource => ({
      rel: 'preload',
      ...resource
    }));
  }

  /**
   * Generate prefetch tags for next-page resources
   */
  generatePrefetchTags(urls: string[]): LinkTag[] {
    return urls.map(url => ({
      rel: 'prefetch',
      href: url
    }));
  }

  /**
   * Optimize title for SEO (length, keywords, branding)
   */
  private optimizeTitle(title: string): string {
    const maxLength = 60;
    const brandSuffix = ` | ${this.siteName}`;
    
    // If title already includes brand, don't add it again
    if (title.includes(this.siteName)) {
      return this.truncateTitle(title);
    }
    
    // If adding brand would exceed limit, truncate title
    if (title.length + brandSuffix.length > maxLength) {
      const truncatedTitle = title.substring(0, maxLength - brandSuffix.length - 3) + '...';
      return truncatedTitle + brandSuffix;
    }
    
    return title + brandSuffix;
  }

  /**
   * Truncate title to optimal length
   */
  private truncateTitle(title: string): string {
    const maxLength = 60;
    return title.length > maxLength ? title.substring(0, maxLength - 3) + '...' : title;
  }

  /**
   * Truncate description to optimal length
   */
  private truncateDescription(description: string): string {
    const maxLength = 160;
    return description.length > maxLength ? description.substring(0, maxLength - 3) + '...' : description;
  }

  /**
   * Remove duplicate meta tags (keep last occurrence)
   */
  private deduplicateMetaTags(metaTags: MetaTag[]): MetaTag[] {
    const seen = new Set<string>();
    const result: MetaTag[] = [];
    
    // Process in reverse to keep last occurrence
    for (let i = metaTags.length - 1; i >= 0; i--) {
      const tag = metaTags[i];
      const key = tag.name || tag.property || tag.httpEquiv || '';
      
      if (!seen.has(key)) {
        seen.add(key);
        result.unshift(tag);
      }
    }
    
    return result;
  }

  /**
   * Remove duplicate link tags
   */
  private deduplicateLinkTags(linkTags: LinkTag[]): LinkTag[] {
    const seen = new Set<string>();
    const result: LinkTag[] = [];
    
    for (let i = linkTags.length - 1; i >= 0; i--) {
      const tag = linkTags[i];
      const key = `${tag.rel}-${tag.href}-${tag.hreflang || ''}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        result.unshift(tag);
      }
    }
    
    return result;
  }

  /**
   * Validate meta tags for common issues
   */
  validateMetaTags(metaTags: MetaTag[]): Array<{ type: 'warning' | 'error'; message: string }> {
    const issues: Array<{ type: 'warning' | 'error'; message: string }> = [];
    
    // Check for required meta tags
    const hasDescription = metaTags.some(tag => tag.name === 'description');
    if (!hasDescription) {
      issues.push({ type: 'error', message: 'Missing meta description' });
    }
    
    const hasViewport = metaTags.some(tag => tag.name === 'viewport');
    if (!hasViewport) {
      issues.push({ type: 'warning', message: 'Missing viewport meta tag' });
    }
    
    // Check description length
    const descriptionTag = metaTags.find(tag => tag.name === 'description');
    if (descriptionTag && descriptionTag.content.length > 160) {
      issues.push({ type: 'warning', message: 'Meta description exceeds 160 characters' });
    }
    
    // Check for duplicate meta tags
    const names = metaTags.map(tag => tag.name || tag.property).filter(Boolean);
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      issues.push({ type: 'warning', message: `Duplicate meta tags found: ${duplicates.join(', ')}` });
    }
    
    return issues;
  }
}

// Export singleton instance
export const metaTagOptimizer = new MetaTagOptimizer();