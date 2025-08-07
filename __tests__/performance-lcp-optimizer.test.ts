import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LCPOptimizer, createLCPOptimizer, type LCPOptimizationConfig, type CriticalResource } from '../lcp-optimizer';

// Mock performance API
const mockPerformanceObserver = vi.fn();
const mockPerformanceGetEntriesByType = vi.fn();

Object.defineProperty(global, 'PerformanceObserver', {
  writable: true,
  value: vi.fn().mockImplementation((callback) => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
    callback
  }))
});

Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    getEntriesByType: mockPerformanceGetEntriesByType
  }
});

// Mock document
Object.defineProperty(global, 'document', {
  writable: true,
  value: {
    querySelectorAll: vi.fn()
  }
});

describe('LCPOptimizer', () => {
  let optimizer: LCPOptimizer;
  let config: LCPOptimizationConfig;

  beforeEach(() => {
    config = {
      criticalCSS: ['/globals.css', '/base.css'],
      preloadResources: [],
      aboveFoldImages: ['/hero-image.jpg'],
      criticalFonts: ['/fonts/inter-var.woff2'],
      inlineCSS: true,
      prefetchNextPage: true
    };
    optimizer = new LCPOptimizer(config);
    
    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('identifyCriticalResources', () => {
    it('should identify critical resources for property listing page', () => {
      const content = {
        heroImage: '/hero.jpg',
        properties: [
          { mainImage: '/property1.jpg' },
          { mainImage: '/property2.jpg' },
          { mainImage: '/property3.jpg' }
        ]
      };

      const resources = optimizer.identifyCriticalResources('property-listing', content);

      expect(resources).toHaveLength(8); // 3 base + 1 CSS + 1 hero + 3 property images
      expect(resources.some(r => r.url === '/property-listing.css')).toBe(true);
      expect(resources.some(r => r.url === '/hero.jpg')).toBe(true);
      expect(resources.some(r => r.url === '/property1.jpg')).toBe(true);
    });

    it('should identify critical resources for property detail page', () => {
      const content = {
        mainImage: '/main-property.jpg',
        gallery: ['/gallery1.jpg', '/gallery2.jpg', '/gallery3.jpg', '/gallery4.jpg']
      };

      const resources = optimizer.identifyCriticalResources('property-detail', content);

      expect(resources).toHaveLength(8); // 3 base + 1 CSS + 1 main + 3 gallery images
      expect(resources.some(r => r.url === '/property-detail.css')).toBe(true);
      expect(resources.some(r => r.url === '/main-property.jpg')).toBe(true);
      expect(resources.some(r => r.url === '/gallery1.jpg')).toBe(true);
      expect(resources.some(r => r.url === '/gallery4.jpg')).toBe(false); // Should be limited to first 3
    });

    it('should identify critical resources for homepage', () => {
      const content = {
        heroImage: '/homepage-hero.jpg',
        featuredProperties: [
          { mainImage: '/featured1.jpg' },
          { mainImage: '/featured2.jpg' },
          { mainImage: '/featured3.jpg' }
        ]
      };

      const resources = optimizer.identifyCriticalResources('homepage', content);

      expect(resources).toHaveLength(8); // 3 base + 1 CSS + 1 hero + 3 featured images
      expect(resources.some(r => r.url === '/homepage.css')).toBe(true);
      expect(resources.some(r => r.url === '/homepage-hero.jpg')).toBe(true);
      expect(resources.some(r => r.url === '/featured1.jpg')).toBe(true);
    });

    it('should return base resources for unknown page type', () => {
      const resources = optimizer.identifyCriticalResources('unknown-page');

      expect(resources).toHaveLength(3); // Only base resources
      expect(resources.every(r => ['css', 'font'].includes(r.type))).toBe(true);
    });

    it('should prioritize resources correctly', () => {
      const content = {
        heroImage: '/hero.jpg',
        properties: [{ mainImage: '/property1.jpg' }]
      };

      const resources = optimizer.identifyCriticalResources('property-listing', content);

      // High priority resources should come first
      const highPriorityResources = resources.filter(r => r.priority === 'high');
      const mediumPriorityResources = resources.filter(r => r.priority === 'medium');

      expect(highPriorityResources.length).toBeGreaterThan(0);
      expect(resources.indexOf(highPriorityResources[0])).toBeLessThan(
        resources.indexOf(mediumPriorityResources[0] || resources[resources.length - 1])
      );
    });
  });

  describe('extractCriticalCSS', () => {
    it('should extract critical CSS for property listing page', () => {
      const criticalCSS = optimizer.extractCriticalCSS('property-listing', 800);

      expect(criticalCSS).toContain('Critical CSS for property-listing');
      expect(criticalCSS).toContain('.property-grid');
      expect(criticalCSS).toContain('.property-card');
      expect(criticalCSS).toContain('min-height: 800px');
    });

    it('should extract critical CSS for property detail page', () => {
      const criticalCSS = optimizer.extractCriticalCSS('property-detail', 1000);

      expect(criticalCSS).toContain('Critical CSS for property-detail');
      expect(criticalCSS).toContain('.property-gallery');
      expect(criticalCSS).toContain('.property-info');
      expect(criticalCSS).toContain('min-height: 1000px');
    });

    it('should extract critical CSS for homepage', () => {
      const criticalCSS = optimizer.extractCriticalCSS('homepage');

      expect(criticalCSS).toContain('Critical CSS for homepage');
      expect(criticalCSS).toContain('.hero-section');
      expect(criticalCSS).toContain('.search-form');
      expect(criticalCSS).toContain('.featured-properties');
    });

    it('should include base selectors for all page types', () => {
      const criticalCSS = optimizer.extractCriticalCSS('any-page');

      expect(criticalCSS).toContain('body { margin: 0');
      expect(criticalCSS).toContain('.container {');
      expect(criticalCSS).toContain('.btn-primary {');
    });
  });

  describe('generateResourceHints', () => {
    it('should generate preload hints for critical resources', () => {
      const resources: CriticalResource[] = [
        {
          type: 'css',
          url: '/styles.css',
          priority: 'high',
          preload: true
        },
        {
          type: 'font',
          url: '/font.woff2',
          priority: 'high',
          preload: true,
          crossorigin: true
        },
        {
          type: 'image',
          url: '/hero.jpg',
          priority: 'high',
          preload: true
        },
        {
          type: 'script',
          url: '/script.js',
          priority: 'medium',
          preload: false // Should be filtered out
        }
      ];

      const hints = optimizer.generateResourceHints(resources);

      expect(hints).toHaveLength(3); // Only preload=true resources
      expect(hints[0]).toContain('rel="preload"');
      expect(hints[0]).toContain('href="/styles.css"');
      expect(hints[0]).toContain('as="style"');
      
      expect(hints[1]).toContain('href="/font.woff2"');
      expect(hints[1]).toContain('as="font"');
      expect(hints[1]).toContain('crossorigin');
      
      expect(hints[2]).toContain('href="/hero.jpg"');
      expect(hints[2]).toContain('as="image"');
    });

    it('should handle media queries in resource hints', () => {
      const resources: CriticalResource[] = [
        {
          type: 'css',
          url: '/mobile.css',
          priority: 'high',
          preload: true,
          media: '(max-width: 768px)'
        }
      ];

      const hints = optimizer.generateResourceHints(resources);

      expect(hints[0]).toContain('media="(max-width: 768px)"');
    });
  });

  describe('inlineCriticalCSS', () => {
    it('should wrap CSS in style tag with data attribute', () => {
      const css = 'body { margin: 0; }';
      const inlined = optimizer.inlineCriticalCSS(css);

      expect(inlined).toBe('<style data-critical-css>body { margin: 0; }</style>');
    });
  });

  describe('measureLCPPerformance', () => {
    it('should return default metrics on server side', async () => {
      // Simulate server-side environment
      const originalWindow = global.window;
      delete (global as any).window;

      const metrics = await optimizer.measureLCPPerformance();

      expect(metrics).toEqual({
        lcpTime: 0,
        fcpTime: 0,
        criticalResourcesLoaded: 0,
        aboveFoldImagesLoaded: 0,
        optimizationScore: 0
      });

      // Restore window
      (global as any).window = originalWindow;
    });

    it('should measure LCP performance in browser environment', async () => {
      // Mock browser environment
      (global as any).window = {};
      
      // Mock PerformanceObserver
      const mockObserver = {
        observe: vi.fn(),
        disconnect: vi.fn()
      };
      
      (global as any).PerformanceObserver = vi.fn().mockImplementation((callback) => {
        // Simulate LCP entry
        setTimeout(() => {
          callback({
            getEntries: () => [{ startTime: 2000 }]
          });
        }, 100);
        return mockObserver;
      });

      // Mock performance.getEntriesByType for FCP
      mockPerformanceGetEntriesByType.mockReturnValue([
        { name: 'first-contentful-paint', startTime: 1500 }
      ]);

      // Mock document.querySelectorAll for above-fold images
      (global.document.querySelectorAll as any).mockReturnValue([
        { complete: true },
        { complete: false }
      ]);

      const metrics = await optimizer.measureLCPPerformance();

      expect(metrics.lcpTime).toBe(2000);
      expect(metrics.fcpTime).toBe(1500);
      expect(metrics.optimizationScore).toBe(100); // LCP <= 2500ms
      expect(mockObserver.observe).toHaveBeenCalledWith({ entryTypes: ['largest-contentful-paint'] });
    });
  });

  describe('getOptimizationRecommendations', () => {
    it('should provide recommendations for poor LCP performance', () => {
      const metrics = {
        lcpTime: 5000, // Poor LCP
        fcpTime: 2000, // Poor FCP
        criticalResourcesLoaded: 2,
        aboveFoldImagesLoaded: 0,
        optimizationScore: 25
      };

      const recommendations = optimizer.getOptimizationRecommendations(metrics);

      expect(recommendations).toContain('Optimize Largest Contentful Paint by preloading critical resources');
      expect(recommendations).toContain('Add preload hints for above-the-fold images');
      expect(recommendations).toContain('Optimize First Contentful Paint by inlining critical CSS');
    });

    it('should provide fewer recommendations for good performance', () => {
      const metrics = {
        lcpTime: 2000, // Good LCP
        fcpTime: 1500, // Good FCP
        criticalResourcesLoaded: 5,
        aboveFoldImagesLoaded: 3,
        optimizationScore: 100
      };

      const recommendations = optimizer.getOptimizationRecommendations(metrics);

      expect(recommendations).toHaveLength(0);
    });
  });
});

describe('createLCPOptimizer', () => {
  it('should create optimizer with default configuration', () => {
    const optimizer = createLCPOptimizer('homepage');

    expect(optimizer).toBeInstanceOf(LCPOptimizer);
  });

  it('should identify critical resources for the specified page type', () => {
    const content = {
      heroImage: '/hero.jpg',
      featuredProperties: [{ mainImage: '/featured.jpg' }]
    };

    const optimizer = createLCPOptimizer('homepage', content);
    const resources = optimizer.identifyCriticalResources('homepage', content);

    expect(resources.length).toBeGreaterThan(3); // Should include page-specific resources
    expect(resources.some(r => r.url === '/homepage.css')).toBe(true);
  });
});