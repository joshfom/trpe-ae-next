/**
 * LCP (Largest Contentful Paint) Optimizer
 * Optimizes critical resource loading and above-the-fold content rendering
 */

export interface CriticalResource {
  type: 'css' | 'font' | 'image' | 'script';
  url: string;
  priority: 'high' | 'medium' | 'low';
  preload?: boolean;
  crossorigin?: boolean;
  media?: string;
}

export interface LCPOptimizationConfig {
  criticalCSS: string[];
  preloadResources: CriticalResource[];
  aboveFoldImages: string[];
  criticalFonts: string[];
  inlineCSS: boolean;
  prefetchNextPage?: boolean;
}

export interface LCPMetrics {
  lcpTime: number;
  fcpTime: number;
  criticalResourcesLoaded: number;
  aboveFoldImagesLoaded: number;
  optimizationScore: number;
}

export class LCPOptimizer {
  private config: LCPOptimizationConfig;
  private criticalResources: Map<string, CriticalResource> = new Map();

  constructor(config: LCPOptimizationConfig) {
    this.config = config;
    this.initializeCriticalResources();
  }

  /**
   * Initialize critical resources based on page type and content
   */
  private initializeCriticalResources(): void {
    // Add critical CSS files
    this.config.criticalCSS.forEach(css => {
      this.criticalResources.set(css, {
        type: 'css',
        url: css,
        priority: 'high',
        preload: true
      });
    });

    // Add critical fonts
    this.config.criticalFonts.forEach(font => {
      this.criticalResources.set(font, {
        type: 'font',
        url: font,
        priority: 'high',
        preload: true,
        crossorigin: true
      });
    });

    // Add above-fold images
    this.config.aboveFoldImages.forEach(image => {
      this.criticalResources.set(image, {
        type: 'image',
        url: image,
        priority: 'high',
        preload: true
      });
    });
  }

  /**
   * Identify critical resources for a specific page type
   */
  identifyCriticalResources(pageType: string, content?: any): CriticalResource[] {
    const resources: CriticalResource[] = [];

    switch (pageType) {
      case 'property-listing':
        resources.push(
          ...this.getPropertyListingResources(content),
          ...this.getBaseCriticalResources()
        );
        break;
      case 'property-detail':
        resources.push(
          ...this.getPropertyDetailResources(content),
          ...this.getBaseCriticalResources()
        );
        break;
      case 'community-listing':
        resources.push(
          ...this.getCommunityListingResources(content),
          ...this.getBaseCriticalResources()
        );
        break;
      case 'homepage':
        resources.push(
          ...this.getHomepageResources(content),
          ...this.getBaseCriticalResources()
        );
        break;
      default:
        resources.push(...this.getBaseCriticalResources());
    }

    return this.prioritizeResources(resources);
  }

  /**
   * Get base critical resources needed for all pages
   */
  private getBaseCriticalResources(): CriticalResource[] {
    return [
      {
        type: 'css',
        url: '/globals.css',
        priority: 'high',
        preload: true
      },
      {
        type: 'font',
        url: '/fonts/inter-var.woff2',
        priority: 'high',
        preload: true,
        crossorigin: true
      },
      {
        type: 'css',
        url: '/base.css',
        priority: 'high',
        preload: true
      }
    ];
  }

  /**
   * Get critical resources for property listing pages
   */
  private getPropertyListingResources(content?: any): CriticalResource[] {
    const resources: CriticalResource[] = [
      {
        type: 'css',
        url: '/property-listing.css',
        priority: 'high',
        preload: true
      }
    ];

    // Add hero image if available
    if (content?.heroImage) {
      resources.push({
        type: 'image',
        url: content.heroImage,
        priority: 'high',
        preload: true
      });
    }

    // Add first few property images
    if (content?.properties?.length > 0) {
      content.properties.slice(0, 6).forEach((property: any) => {
        if (property.mainImage) {
          resources.push({
            type: 'image',
            url: property.mainImage,
            priority: 'medium',
            preload: true
          });
        }
      });
    }

    return resources;
  }

  /**
   * Get critical resources for property detail pages
   */
  private getPropertyDetailResources(content?: any): CriticalResource[] {
    const resources: CriticalResource[] = [
      {
        type: 'css',
        url: '/property-detail.css',
        priority: 'high',
        preload: true
      }
    ];

    // Add main property image
    if (content?.mainImage) {
      resources.push({
        type: 'image',
        url: content.mainImage,
        priority: 'high',
        preload: true
      });
    }

    // Add gallery images (first 3)
    if (content?.gallery?.length > 0) {
      content.gallery.slice(0, 3).forEach((image: string) => {
        resources.push({
          type: 'image',
          url: image,
          priority: 'medium',
          preload: true
        });
      });
    }

    return resources;
  }

  /**
   * Get critical resources for community listing pages
   */
  private getCommunityListingResources(content?: any): CriticalResource[] {
    const resources: CriticalResource[] = [
      {
        type: 'css',
        url: '/community-listing.css',
        priority: 'high',
        preload: true
      }
    ];

    // Add community hero images
    if (content?.communities?.length > 0) {
      content.communities.slice(0, 4).forEach((community: any) => {
        if (community.heroImage) {
          resources.push({
            type: 'image',
            url: community.heroImage,
            priority: 'medium',
            preload: true
          });
        }
      });
    }

    return resources;
  }

  /**
   * Get critical resources for homepage
   */
  private getHomepageResources(content?: any): CriticalResource[] {
    const resources: CriticalResource[] = [
      {
        type: 'css',
        url: '/homepage.css',
        priority: 'high',
        preload: true
      }
    ];

    // Add hero image
    if (content?.heroImage) {
      resources.push({
        type: 'image',
        url: content.heroImage,
        priority: 'high',
        preload: true
      });
    }

    // Add featured property images
    if (content?.featuredProperties?.length > 0) {
      content.featuredProperties.slice(0, 3).forEach((property: any) => {
        if (property.mainImage) {
          resources.push({
            type: 'image',
            url: property.mainImage,
            priority: 'medium',
            preload: true
          });
        }
      });
    }

    return resources;
  }

  /**
   * Prioritize resources based on their importance and type
   */
  private prioritizeResources(resources: CriticalResource[]): CriticalResource[] {
    return resources.sort((a, b) => {
      // Priority order: high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;

      // Type order: css > font > image > script
      const typeOrder = { css: 4, font: 3, image: 2, script: 1 };
      return (typeOrder[b.type] || 0) - (typeOrder[a.type] || 0);
    });
  }

  /**
   * Extract critical CSS for above-the-fold content
   */
  extractCriticalCSS(pageType: string, viewportHeight: number = 800): string {
    const criticalSelectors = this.getCriticalSelectors(pageType);
    
    // This would typically integrate with a CSS extraction tool
    // For now, return a basic critical CSS structure
    return `
      /* Critical CSS for ${pageType} */
      body { margin: 0; font-family: Inter, sans-serif; }
      .header { position: sticky; top: 0; z-index: 100; }
      .hero { min-height: ${viewportHeight}px; }
      .above-fold { display: block; }
      .property-card { display: flex; flex-direction: column; }
      .property-image { aspect-ratio: 16/9; object-fit: cover; }
      ${criticalSelectors.join('\n')}
    `;
  }

  /**
   * Get critical CSS selectors for specific page types
   */
  private getCriticalSelectors(pageType: string): string[] {
    const baseSelectors = [
      '.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }',
      '.btn-primary { background: #0066cc; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; }',
      '.text-primary { color: #0066cc; }',
      '.grid { display: grid; gap: 1rem; }'
    ];

    switch (pageType) {
      case 'property-listing':
        return [
          ...baseSelectors,
          '.property-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }',
          '.property-card { border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; }',
          '.property-price { font-size: 1.25rem; font-weight: 600; color: #059669; }'
        ];
      case 'property-detail':
        return [
          ...baseSelectors,
          '.property-gallery { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; }',
          '.property-info { padding: 2rem; }',
          '.property-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }'
        ];
      case 'homepage':
        return [
          ...baseSelectors,
          '.hero-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }',
          '.search-form { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }',
          '.featured-properties { margin-top: 4rem; }'
        ];
      default:
        return baseSelectors;
    }
  }

  /**
   * Generate resource hints for preloading
   */
  generateResourceHints(resources: CriticalResource[]): string[] {
    return resources
      .filter(resource => resource.preload)
      .map(resource => {
        let hint = `<link rel="preload" href="${resource.url}"`;
        
        if (resource.type === 'font') {
          hint += ` as="font" type="font/woff2"`;
          if (resource.crossorigin) hint += ` crossorigin`;
        } else if (resource.type === 'css') {
          hint += ` as="style"`;
        } else if (resource.type === 'image') {
          hint += ` as="image"`;
        } else if (resource.type === 'script') {
          hint += ` as="script"`;
        }

        if (resource.media) {
          hint += ` media="${resource.media}"`;
        }

        hint += '>';
        return hint;
      });
  }

  /**
   * Inline critical CSS directly in HTML
   */
  inlineCriticalCSS(criticalCSS: string): string {
    return `<style data-critical-css>${criticalCSS}</style>`;
  }

  /**
   * Measure LCP performance
   */
  measureLCPPerformance(): Promise<LCPMetrics> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        // Server-side fallback
        resolve({
          lcpTime: 0,
          fcpTime: 0,
          criticalResourcesLoaded: 0,
          aboveFoldImagesLoaded: 0,
          optimizationScore: 0
        });
        return;
      }

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1] as any;
        
        const metrics: LCPMetrics = {
          lcpTime: lcpEntry?.startTime || 0,
          fcpTime: this.getFCPTime(),
          criticalResourcesLoaded: this.countLoadedCriticalResources(),
          aboveFoldImagesLoaded: this.countLoadedAboveFoldImages(),
          optimizationScore: this.calculateOptimizationScore(lcpEntry?.startTime || 0)
        };

        resolve(metrics);
        observer.disconnect();
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Fallback timeout
      setTimeout(() => {
        observer.disconnect();
        resolve({
          lcpTime: 0,
          fcpTime: 0,
          criticalResourcesLoaded: 0,
          aboveFoldImagesLoaded: 0,
          optimizationScore: 0
        });
      }, 5000);
    });
  }

  /**
   * Get First Contentful Paint time
   */
  private getFCPTime(): number {
    if (typeof window === 'undefined') return 0;
    
    const fcpEntry = performance.getEntriesByType('paint')
      .find(entry => entry.name === 'first-contentful-paint');
    
    return fcpEntry?.startTime || 0;
  }

  /**
   * Count loaded critical resources
   */
  private countLoadedCriticalResources(): number {
    if (typeof window === 'undefined') return 0;
    
    const resourceEntries = performance.getEntriesByType('resource');
    let loadedCount = 0;

    this.criticalResources.forEach((resource) => {
      const entry = resourceEntries.find(e => e.name.includes(resource.url));
      if (entry && entry.responseEnd > 0) {
        loadedCount++;
      }
    });

    return loadedCount;
  }

  /**
   * Count loaded above-fold images
   */
  private countLoadedAboveFoldImages(): number {
    if (typeof window === 'undefined') return 0;
    
    const images = document.querySelectorAll('img[data-above-fold="true"]');
    let loadedCount = 0;

    images.forEach((img) => {
      if ((img as HTMLImageElement).complete) {
        loadedCount++;
      }
    });

    return loadedCount;
  }

  /**
   * Calculate optimization score based on LCP time
   */
  private calculateOptimizationScore(lcpTime: number): number {
    if (lcpTime <= 2500) return 100; // Excellent
    if (lcpTime <= 4000) return 75;  // Good
    if (lcpTime <= 6000) return 50;  // Needs improvement
    return 25; // Poor
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(metrics: LCPMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.lcpTime > 2500) {
      recommendations.push('Optimize Largest Contentful Paint by preloading critical resources');
    }

    if (metrics.criticalResourcesLoaded < this.criticalResources.size) {
      recommendations.push('Ensure all critical resources are properly preloaded');
    }

    if (metrics.aboveFoldImagesLoaded === 0) {
      recommendations.push('Add preload hints for above-the-fold images');
    }

    if (metrics.fcpTime > 1800) {
      recommendations.push('Optimize First Contentful Paint by inlining critical CSS');
    }

    return recommendations;
  }
}

/**
 * Factory function to create LCP optimizer with default configuration
 */
export function createLCPOptimizer(pageType: string, content?: any): LCPOptimizer {
  const config: LCPOptimizationConfig = {
    criticalCSS: ['/globals.css', '/base.css'],
    preloadResources: [],
    aboveFoldImages: [],
    criticalFonts: ['/fonts/inter-var.woff2'],
    inlineCSS: true,
    prefetchNextPage: true
  };

  const optimizer = new LCPOptimizer(config);
  
  // Identify and add page-specific critical resources
  const criticalResources = optimizer.identifyCriticalResources(pageType, content);
  config.preloadResources = criticalResources;

  return new LCPOptimizer(config);
}