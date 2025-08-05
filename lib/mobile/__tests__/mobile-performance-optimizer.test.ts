import { describe, it, expect, beforeEach } from 'vitest';
import { 
  MobilePerformanceOptimizer,
  type DeviceCapabilities,
  type PerformanceMetrics
} from '../mobile-performance-optimizer';

describe('MobilePerformanceOptimizer', () => {
  let optimizer: MobilePerformanceOptimizer;

  beforeEach(() => {
    optimizer = new MobilePerformanceOptimizer();
  });

  describe('detectDeviceCapabilities', () => {
    it('should detect iPhone capabilities', () => {
      const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15';
      const capabilities = optimizer.detectDeviceCapabilities(userAgent);
      
      expect(capabilities.screenWidth).toBe(375);
      expect(capabilities.screenHeight).toBe(667);
      expect(capabilities.pixelRatio).toBe(2);
      expect(capabilities.supportedFormats).toContain('webp');
    });

    it('should detect Android capabilities', () => {
      const userAgent = 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 Chrome/91.0.4472.120';
      const capabilities = optimizer.detectDeviceCapabilities(userAgent);
      
      expect(capabilities.screenWidth).toBe(360);
      expect(capabilities.screenHeight).toBe(640);
      expect(capabilities.pixelRatio).toBe(2);
      expect(capabilities.supportedFormats).toContain('webp');
    });

    it('should detect iPad capabilities', () => {
      const userAgent = 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15';
      const capabilities = optimizer.detectDeviceCapabilities(userAgent);
      
      expect(capabilities.screenWidth).toBe(768);
      expect(capabilities.screenHeight).toBe(1024);
      expect(capabilities.pixelRatio).toBe(2);
    });

    it('should detect low-end device based on screen width', () => {
      const userAgent = 'Mozilla/5.0 (Linux; Android 8.0; SM-J330F)';
      const connection = { effectiveType: '2g' };
      const capabilities = optimizer.detectDeviceCapabilities(userAgent, connection);
      
      expect(capabilities.isLowEndDevice).toBe(true);
      expect(capabilities.connectionType).toBe('2g');
    });

    it('should detect connection type from connection API', () => {
      const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)';
      const connection = { effectiveType: '4g' };
      const capabilities = optimizer.detectDeviceCapabilities(userAgent, connection);
      
      expect(capabilities.connectionType).toBe('4g');
    });

    it('should handle unknown connection type', () => {
      const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)';
      const capabilities = optimizer.detectDeviceCapabilities(userAgent);
      
      expect(capabilities.connectionType).toBe('unknown');
    });
  });

  describe('generateMobileImageConfig', () => {
    let device: DeviceCapabilities;

    beforeEach(() => {
      device = {
        screenWidth: 375,
        screenHeight: 667,
        pixelRatio: 2,
        connectionType: '4g',
        isLowEndDevice: false,
        supportedFormats: ['jpeg', 'png', 'webp']
      };
    });

    it('should generate hero image configuration', () => {
      const config = optimizer.generateMobileImageConfig(device, 'hero');
      
      expect(config.priority).toBe(true);
      expect(config.lazy).toBe(false);
      expect(config.quality).toBeGreaterThan(75);
      expect(config.format).toBe('webp');
      expect(config.sizes).toBe('100vw');
    });

    it('should generate gallery image configuration', () => {
      const config = optimizer.generateMobileImageConfig(device, 'gallery');
      
      expect(config.priority).toBe(false);
      expect(config.lazy).toBe(true);
      expect(config.quality).toBeLessThanOrEqual(80);
      expect(config.sizes).toContain('100vw');
    });

    it('should generate thumbnail image configuration', () => {
      const config = optimizer.generateMobileImageConfig(device, 'thumbnail');
      
      expect(config.lazy).toBe(true);
      expect(config.maxWidth).toBeLessThanOrEqual(300);
      expect(config.sizes).toContain('50vw');
    });

    it('should generate icon image configuration', () => {
      const config = optimizer.generateMobileImageConfig(device, 'icon');
      
      expect(config.lazy).toBe(false);
      expect(config.maxWidth).toBeLessThanOrEqual(100);
      expect(config.quality).toBeGreaterThanOrEqual(80);
      expect(config.sizes).toBe('48px');
    });

    it('should adjust quality for slow connections', () => {
      const slowDevice = { ...device, connectionType: '2g' as const };
      const config = optimizer.generateMobileImageConfig(slowDevice, 'gallery');
      
      expect(config.quality).toBeLessThan(75);
    });

    it('should adjust quality for low-end devices', () => {
      const lowEndDevice = { ...device, isLowEndDevice: true };
      const config = optimizer.generateMobileImageConfig(lowEndDevice, 'gallery');
      
      expect(config.quality).toBeLessThan(75);
    });

    it('should select optimal format based on support', () => {
      const avifDevice = { ...device, supportedFormats: ['jpeg', 'png', 'webp', 'avif'] };
      const config = optimizer.generateMobileImageConfig(avifDevice, 'gallery');
      
      expect(config.format).toBe('avif');
    });

    it('should fallback to JPEG for unsupported formats', () => {
      const basicDevice = { ...device, supportedFormats: ['jpeg', 'png'] };
      const config = optimizer.generateMobileImageConfig(basicDevice, 'gallery');
      
      expect(config.format).toBe('jpeg');
    });

    it('should select appropriate placeholder type', () => {
      const slowDevice = { ...device, connectionType: '2g' as const, isLowEndDevice: true };
      const config = optimizer.generateMobileImageConfig(slowDevice, 'gallery');
      
      expect(config.placeholder).toBe('empty');
    });
  });

  describe('generateResourceLoadingStrategy', () => {
    let device: DeviceCapabilities;

    beforeEach(() => {
      device = {
        screenWidth: 375,
        screenHeight: 667,
        pixelRatio: 2,
        connectionType: '4g',
        isLowEndDevice: false,
        supportedFormats: ['jpeg', 'png', 'webp']
      };
    });

    it('should generate strategy for property detail page', () => {
      const strategy = optimizer.generateResourceLoadingStrategy(device, 'property-detail');
      
      expect(strategy.critical).toContain('/css/critical.css');
      expect(strategy.preload).toContain('/css/property.css');
      expect(strategy.defer).toContain('/js/analytics.js');
    });

    it('should optimize for slow connections', () => {
      const slowDevice = { ...device, connectionType: '2g' as const };
      const strategy = optimizer.generateResourceLoadingStrategy(slowDevice, 'property-detail');
      
      expect(strategy.preload.length).toBeLessThanOrEqual(2);
      expect(strategy.prefetch).toHaveLength(0);
      expect(strategy.lazy.length).toBeGreaterThan(0);
    });

    it('should optimize for low-end devices', () => {
      const lowEndDevice = { ...device, isLowEndDevice: true };
      const strategy = optimizer.generateResourceLoadingStrategy(lowEndDevice, 'property-detail');
      
      expect(strategy.critical.length).toBeLessThanOrEqual(2);
      expect(strategy.preload.length).toBeLessThanOrEqual(3);
      expect(strategy.conditional).toEqual({});
    });

    it('should optimize for high-end devices', () => {
      const highEndDevice = { ...device, connectionType: '5g' as const };
      const strategy = optimizer.generateResourceLoadingStrategy(highEndDevice, 'property-detail');
      
      expect(strategy.preload.length).toBeGreaterThan(2);
      expect(strategy.conditional['high-end']).toBeDefined();
    });

    it('should handle unknown page types', () => {
      const strategy = optimizer.generateResourceLoadingStrategy(device, 'unknown-page');
      
      expect(strategy.critical).toContain('/css/critical.css');
      expect(strategy.critical).toContain('/js/core.js');
    });
  });

  describe('optimizeForDevice', () => {
    let device: DeviceCapabilities;
    let currentMetrics: PerformanceMetrics;

    beforeEach(() => {
      device = {
        screenWidth: 375,
        screenHeight: 667,
        pixelRatio: 2,
        connectionType: '4g',
        isLowEndDevice: false,
        supportedFormats: ['jpeg', 'png', 'webp']
      };

      currentMetrics = {
        lcp: 3.0,
        fid: 0.15,
        cls: 0.05,
        fcp: 2.0,
        ttfb: 0.8,
        totalBlockingTime: 300,
        speedIndex: 2.5
      };
    });

    it('should generate complete optimization configuration', () => {
      const result = optimizer.optimizeForDevice(device, 'property-detail', currentMetrics);
      
      expect(result.config.images).toBeDefined();
      expect(result.config.resources).toBeDefined();
      expect(result.config.caching).toBeDefined();
      expect(result.config.compression).toBeDefined();
      expect(result.config.bundleOptimization).toBeDefined();
    });

    it('should provide performance improvement estimates', () => {
      const result = optimizer.optimizeForDevice(device, 'property-detail', currentMetrics);
      
      expect(result.estimatedImprovement.lcp).toBeGreaterThan(0);
      expect(result.estimatedImprovement.fid).toBeGreaterThan(0);
      expect(result.estimatedImprovement.cls).toBeGreaterThan(0);
      expect(result.estimatedImprovement.bundleSize).toBeGreaterThan(0);
    });

    it('should provide higher improvements for low-end devices', () => {
      const lowEndDevice = { ...device, isLowEndDevice: true };
      const result = optimizer.optimizeForDevice(lowEndDevice, 'property-detail', currentMetrics);
      
      expect(result.estimatedImprovement.lcp).toBeGreaterThan(0.5);
      expect(result.estimatedImprovement.fid).toBeGreaterThan(0.02);
    });

    it('should generate relevant recommendations', () => {
      const result = optimizer.optimizeForDevice(device, 'property-detail', currentMetrics);
      
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('should generate warnings when appropriate', () => {
      const result = optimizer.optimizeForDevice(device, 'property-detail', currentMetrics);
      
      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe('optimizeMobileImages', () => {
    let device: DeviceCapabilities;

    beforeEach(() => {
      device = {
        screenWidth: 375,
        screenHeight: 667,
        pixelRatio: 2,
        connectionType: '4g',
        isLowEndDevice: false,
        supportedFormats: ['jpeg', 'png', 'webp']
      };
    });

    it('should optimize array of images', () => {
      const images = [
        { src: '/image1.jpg', alt: 'Image 1', type: 'hero' },
        { src: '/image2.jpg', alt: 'Image 2', type: 'gallery' }
      ];

      const optimized = optimizer.optimizeMobileImages(images, device);
      
      expect(optimized).toHaveLength(2);
      expect(optimized[0].loading).toBe('eager'); // Hero image
      expect(optimized[1].loading).toBe('lazy'); // Gallery image
    });

    it('should generate srcSet for responsive images', () => {
      const images = [{ src: '/image.jpg', alt: 'Test image', type: 'gallery' }];
      const optimized = optimizer.optimizeMobileImages(images, device);
      
      expect(optimized[0].srcSet).toContain('w');
      expect(optimized[0].srcSet.split(',').length).toBeGreaterThan(1);
    });

    it('should set appropriate decoding attribute', () => {
      const images = [{ src: '/image.jpg', alt: 'Test image', type: 'gallery' }];
      const optimized = optimizer.optimizeMobileImages(images, device);
      
      expect(optimized[0].decoding).toBe('async');
    });

    it('should generate appropriate styles', () => {
      const images = [{ src: '/image.jpg', alt: 'Test image', type: 'gallery' }];
      const optimized = optimizer.optimizeMobileImages(images, device);
      
      expect(optimized[0].style.maxWidth).toBe('100%');
      expect(optimized[0].style.height).toBe('auto');
      expect(optimized[0].style.objectFit).toBe('cover');
    });
  });

  describe('generateMobileResourceHints', () => {
    let device: DeviceCapabilities;

    beforeEach(() => {
      device = {
        screenWidth: 375,
        screenHeight: 667,
        pixelRatio: 2,
        connectionType: '4g',
        isLowEndDevice: false,
        supportedFormats: ['jpeg', 'png', 'webp']
      };
    });

    it('should generate preload hints for critical resources', () => {
      const strategy = {
        critical: ['/css/critical.css', '/js/core.js'],
        preload: ['/css/main.css'],
        prefetch: ['/js/extra.js'],
        defer: [],
        lazy: [],
        conditional: {}
      };

      const hints = optimizer.generateMobileResourceHints(device, strategy);
      
      const preloadHints = hints.filter(hint => hint.rel === 'preload');
      expect(preloadHints.length).toBeGreaterThanOrEqual(3);
    });

    it('should generate prefetch hints for fast connections', () => {
      const strategy = {
        critical: [],
        preload: [],
        prefetch: ['/js/extra.js'],
        defer: [],
        lazy: [],
        conditional: {}
      };

      const hints = optimizer.generateMobileResourceHints(device, strategy);
      
      const prefetchHints = hints.filter(hint => hint.rel === 'prefetch');
      expect(prefetchHints.length).toBeGreaterThan(0);
    });

    it('should skip prefetch hints for slow connections', () => {
      const slowDevice = { ...device, connectionType: '2g' as const };
      const strategy = {
        critical: [],
        preload: [],
        prefetch: ['/js/extra.js'],
        defer: [],
        lazy: [],
        conditional: {}
      };

      const hints = optimizer.generateMobileResourceHints(slowDevice, strategy);
      
      const prefetchHints = hints.filter(hint => hint.rel === 'prefetch');
      expect(prefetchHints.length).toBe(0);
    });

    it('should generate DNS prefetch hints for external domains', () => {
      const strategy = {
        critical: ['https://cdn.example.com/css/critical.css'],
        preload: ['https://fonts.googleapis.com/css2?family=Inter'],
        prefetch: [],
        defer: [],
        lazy: [],
        conditional: {}
      };

      const hints = optimizer.generateMobileResourceHints(device, strategy);
      
      const dnsPrefetchHints = hints.filter(hint => hint.rel === 'dns-prefetch');
      expect(dnsPrefetchHints.length).toBeGreaterThan(0);
      expect(dnsPrefetchHints.some(hint => hint.href.includes('cdn.example.com'))).toBe(true);
    });

    it('should set appropriate resource types', () => {
      const strategy = {
        critical: ['/css/critical.css', '/js/core.js'],
        preload: [],
        prefetch: [],
        defer: [],
        lazy: [],
        conditional: {}
      };

      const hints = optimizer.generateMobileResourceHints(device, strategy);
      
      const cssHint = hints.find(hint => hint.href.includes('.css'));
      const jsHint = hints.find(hint => hint.href.includes('.js'));
      
      expect(cssHint?.as).toBe('style');
      expect(jsHint?.as).toBe('script');
    });
  });

  describe('validateOptimization', () => {
    let validConfig: any;

    beforeEach(() => {
      validConfig = {
        images: {
          maxWidth: 800,
          quality: 75,
          format: 'webp',
          lazy: true,
          placeholder: 'blur',
          sizes: '100vw',
          priority: false
        },
        resources: {
          critical: ['/css/critical.css', '/js/core.js'],
          preload: ['/css/main.css'],
          prefetch: ['/js/extra.js'],
          defer: ['/js/analytics.js'],
          lazy: [],
          conditional: {}
        },
        caching: {
          staticAssets: 86400 * 30,
          apiResponses: 300,
          images: 86400 * 7
        },
        compression: {
          enabled: true,
          level: 9,
          formats: ['gzip', 'br']
        },
        bundleOptimization: {
          splitChunks: true,
          treeShaking: true,
          minification: true,
          codeElimination: true
        }
      };
    });

    it('should validate correct configuration', () => {
      const validation = optimizer.validateOptimization(validConfig);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.score).toBeGreaterThan(80);
    });

    it('should warn about high image quality', () => {
      validConfig.images.quality = 90;
      const validation = optimizer.validateOptimization(validConfig);
      
      expect(validation.warnings.some(w => w.includes('quality above 85%'))).toBe(true);
      expect(validation.score).toBeLessThan(100);
    });

    it('should warn about excessive image width', () => {
      validConfig.images.maxWidth = 2000;
      const validation = optimizer.validateOptimization(validConfig);
      
      expect(validation.warnings.some(w => w.includes('above 1920px'))).toBe(true);
    });

    it('should warn about too many critical resources', () => {
      validConfig.resources.critical = new Array(10).fill('/css/critical.css');
      const validation = optimizer.validateOptimization(validConfig);
      
      expect(validation.warnings.some(w => w.includes('Too many critical resources'))).toBe(true);
    });

    it('should error when compression is disabled', () => {
      validConfig.compression.enabled = false;
      const validation = optimizer.validateOptimization(validConfig);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.includes('Compression should be enabled'))).toBe(true);
    });

    it('should warn about missing code splitting', () => {
      validConfig.bundleOptimization.splitChunks = false;
      const validation = optimizer.validateOptimization(validConfig);
      
      expect(validation.warnings.some(w => w.includes('Code splitting recommended'))).toBe(true);
    });

    it('should calculate appropriate score', () => {
      // Add multiple issues
      validConfig.images.quality = 90; // -5
      validConfig.resources.critical = new Array(10).fill('/css/critical.css'); // -15
      validConfig.bundleOptimization.splitChunks = false; // -10
      
      const validation = optimizer.validateOptimization(validConfig);
      
      expect(validation.score).toBe(70); // 100 - 5 - 15 - 10
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle invalid user agents gracefully', () => {
      const capabilities = optimizer.detectDeviceCapabilities('');
      
      expect(capabilities.screenWidth).toBe(375);
      expect(capabilities.connectionType).toBe('unknown');
    });

    it('should handle empty image arrays', () => {
      const device: DeviceCapabilities = {
        screenWidth: 375,
        screenHeight: 667,
        pixelRatio: 2,
        connectionType: '4g',
        isLowEndDevice: false,
        supportedFormats: ['jpeg', 'png', 'webp']
      };

      const optimized = optimizer.optimizeMobileImages([], device);
      
      expect(optimized).toHaveLength(0);
    });

    it('should handle missing connection information', () => {
      const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)';
      const capabilities = optimizer.detectDeviceCapabilities(userAgent, null);
      
      expect(capabilities.connectionType).toBe('unknown');
    });

    it('should handle unknown image types', () => {
      const device: DeviceCapabilities = {
        screenWidth: 375,
        screenHeight: 667,
        pixelRatio: 2,
        connectionType: '4g',
        isLowEndDevice: false,
        supportedFormats: ['jpeg', 'png', 'webp']
      };

      const config = optimizer.generateMobileImageConfig(device, 'unknown' as any);
      
      expect(config).toBeDefined();
      expect(config.quality).toBeGreaterThan(0);
    });
  });
});