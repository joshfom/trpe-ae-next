/**
 * Mobile-first viewport and SEO optimization utilities
 * Implements page-specific viewport configurations and mobile SEO enhancements
 */

export interface MobileViewportConfig {
  width: string;
  height?: string;
  initialScale: number;
  minimumScale: number;
  maximumScale: number;
  userScalable: boolean;
  viewportFit: 'auto' | 'contain' | 'cover';
  shrinkToFit?: boolean;
}

export interface MobileSEOConfig {
  title: string;
  description: string;
  canonical: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: string;
  };
  twitter: {
    card: 'summary_large_image' | 'summary';
    title: string;
    description: string;
    image: string;
  };
  structuredData: Record<string, any>;
}

/**
 * Generate mobile-optimized viewport configuration
 */
export const generateMobileViewport = (pageType: string): MobileViewportConfig => {
  const baseConfig: MobileViewportConfig = {
    width: 'device-width',
    initialScale: 1.0,
    minimumScale: 1.0,
    maximumScale: 5.0,
    userScalable: true,
    viewportFit: 'cover'
  };

  switch (pageType) {
    case 'property-search':
      return {
        ...baseConfig,
        userScalable: false, // Prevent zoom on form interactions
        maximumScale: 1.0,
        shrinkToFit: false
      };
    
    case 'property-detail':
      return {
        ...baseConfig,
        maximumScale: 3.0, // Allow zoom for property images
        viewportFit: 'contain',
        userScalable: true
      };
    
    case 'property-list':
      return {
        ...baseConfig,
        maximumScale: 2.0,
        viewportFit: 'cover'
      };
    
    case 'contact-form':
      return {
        ...baseConfig,
        initialScale: 1.0,
        minimumScale: 0.8, // Allow slight zoom out for form visibility
        userScalable: true
      };
    
    default:
      return baseConfig;
  }
};

/**
 * Generate mobile-optimized structured data
 */
export const generatePropertyStructuredData = (property: any, pageType: string) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstate",
    "name": property.title,
    "description": property.description,
    "image": property.images?.[0]?.s3Url,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dubai",
      "addressCountry": "AE"
    }
  };

  if (pageType === 'property-search' || pageType === 'property-list') {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "numberOfItems": property.length || 0,
      "itemListElement": property.map((item: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "RealEstate",
          "name": item.title,
          "url": `/properties/${item.slug}`
        }
      }))
    };
  }

  return baseSchema;
};

/**
 * Generate mobile-optimized meta tags
 */
export const generateMobileSEO = (
  pageData: any,
  pageType: string,
  baseUrl: string
): MobileSEOConfig => {
  const viewport = generateMobileViewport(pageType);
  
  return {
    title: pageData.metaTitle || pageData.title,
    description: pageData.metaDescription || pageData.description,
    canonical: `${baseUrl}${pageData.path}`,
    openGraph: {
      title: pageData.metaTitle || pageData.title,
      description: pageData.metaDescription || pageData.description,
      image: pageData.image || '/default-og-image.webp',
      type: pageType === 'property-detail' ? 'article' : 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.metaTitle || pageData.title,
      description: pageData.metaDescription || pageData.description,
      image: pageData.image || '/default-twitter-image.webp'
    },
    structuredData: generatePropertyStructuredData(pageData, pageType)
  };
};

/**
 * Mobile Core Web Vitals optimization
 */
export interface CoreWebVitalsConfig {
  LCP: {
    target: number; // ms
    preloadResources: string[];
  };
  FID: {
    target: number; // ms
    deferNonCritical: boolean;
  };
  CLS: {
    target: number;
    reserveSpace: boolean;
  };
}

export const getMobileCoreWebVitalsConfig = (): CoreWebVitalsConfig => ({
  LCP: {
    target: 2500, // 2.5s for mobile
    preloadResources: [
      '/fonts/inter-var.woff2',
      '/trpe-logo.webp'
    ]
  },
  FID: {
    target: 100, // 100ms for mobile
    deferNonCritical: true
  },
  CLS: {
    target: 0.1,
    reserveSpace: true
  }
});

/**
 * Mobile-specific critical CSS generation
 */
export const generateMobileCriticalCSS = (pageType: string): string => {
  const baseCSS = `
    /* Mobile-first base styles */
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
    .container { width: 100%; padding: 0 1rem; margin: 0 auto; }
    
    /* Mobile navigation */
    .mobile-nav { position: fixed; top: 0; width: 100%; z-index: 50; }
    .mobile-nav button { min-height: 44px; min-width: 44px; }
    
    /* Mobile grid */
    .grid { display: grid; gap: 1rem; }
    .grid-cols-1 { grid-template-columns: 1fr; }
    
    /* Mobile typography */
    h1 { font-size: 1.75rem; line-height: 1.2; margin: 0 0 1rem; }
    h2 { font-size: 1.5rem; line-height: 1.3; margin: 0 0 0.875rem; }
    p { font-size: 1rem; line-height: 1.6; margin: 0 0 1rem; }
  `;

  const pageSpecificCSS = {
    'property-search': `
      .search-bar { width: 100%; min-height: 44px; border-radius: 24px; }
      .filter-button { min-height: 44px; padding: 0.75rem 1rem; }
    `,
    'property-detail': `
      .property-image { width: 100%; height: 250px; object-fit: cover; }
      .property-info { padding: 1rem; }
    `,
    'property-list': `
      .property-card { margin-bottom: 1rem; border-radius: 12px; }
      .property-grid { grid-template-columns: 1fr; }
    `
  };

  return baseCSS + (pageSpecificCSS[pageType as keyof typeof pageSpecificCSS] || '');
};

/**
 * Mobile performance monitoring
 */
export const measureMobilePerformance = () => {
  if (typeof window === 'undefined') return;

  // Measure Core Web Vitals on mobile
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
      }
      if (entry.entryType === 'first-input') {
        const firstInputEntry = entry as PerformanceEventTiming;
        console.log('FID:', firstInputEntry.processingStart - firstInputEntry.startTime);
      }
      if (entry.entryType === 'layout-shift') {
        const layoutShiftEntry = entry as any; // CLS entries have value property
        console.log('CLS:', layoutShiftEntry.value);
      }
    }
  });

  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
};
