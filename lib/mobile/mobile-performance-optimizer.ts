/**
 * MobilePerformanceOptimizer - Device-specific performance optimizations
 * Handles mobile image optimization, resource loading strategies, and device-specific optimizations
 */

export interface DeviceCapabilities {
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  connectionType: 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'wifi' | 'unknown';
  memoryGB?: number;
  cpuCores?: number;
  isLowEndDevice: boolean;
  supportedFormats: string[];
}

export interface MobileImageConfig {
  maxWidth: number;
  quality: number;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  lazy: boolean;
  placeholder: 'blur' | 'empty' | 'skeleton';
  sizes: string;
  priority: boolean;
}

export interface ResourceLoadingStrategy {
  critical: string[];
  preload: string[];
  prefetch: string[];
  defer: string[];
  lazy: string[];
  conditional: Record<string, string[]>;
}

export interface MobileOptimizationConfig {
  images: MobileImageConfig;
  resources: ResourceLoadingStrategy;
  caching: {
    staticAssets: number;
    apiResponses: number;
    images: number;
  };
  compression: {
    enabled: boolean;
    level: number;
    formats: string[];
  };
  bundleOptimization: {
    splitChunks: boolean;
    treeShaking: boolean;
    minification: boolean;
    codeElimination: boolean;
  };
}

export interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  totalBlockingTime: number;
  speedIndex: number;
}

export interface OptimizationResult {
  config: MobileOptimizationConfig;
  estimatedImprovement: {
    lcp: number;
    fid: number;
    cls: number;
    bundleSize: number;
  };
  recommendations: string[];
  warnings: string[];
}

export class MobilePerformanceOptimizer {
  private readonly lowEndThresholds = {
    memory: 2, // GB
    cores: 4,
    screenWidth: 414
  };

  private readonly connectionSpeeds = {
    'slow-2g': { bandwidth: 50, rtt: 2000 },
    '2g': { bandwidth: 250, rtt: 1400 },
    '3g': { bandwidth: 1600, rtt: 400 },
    '4g': { bandwidth: 10000, rtt: 100 },
    '5g': { bandwidth: 50000, rtt: 20 },
    'wifi': { bandwidth: 25000, rtt: 50 },
    'unknown': { bandwidth: 1600, rtt: 400 }
  };

  /**
   * Detect device capabilities from user agent and connection info
   */
  detectDeviceCapabilities(userAgent: string, connection?: any): DeviceCapabilities {
    const screenWidth = this.extractScreenWidth(userAgent);
    const screenHeight = this.extractScreenHeight(userAgent);
    const pixelRatio = this.extractPixelRatio(userAgent);
    const connectionType = this.detectConnectionType(connection);
    const memoryGB = this.extractMemory(userAgent);
    const cpuCores = this.extractCPUCores(userAgent);
    
    const isLowEndDevice = this.isLowEndDevice({
      screenWidth,
      memoryGB,
      cpuCores,
      connectionType
    });

    const supportedFormats = this.detectSupportedFormats(userAgent);

    return {
      screenWidth,
      screenHeight,
      pixelRatio,
      connectionType,
      memoryGB,
      cpuCores,
      isLowEndDevice,
      supportedFormats
    };
  }

  /**
   * Generate mobile-optimized image configuration
   */
  generateMobileImageConfig(
    device: DeviceCapabilities,
    imageType: 'hero' | 'gallery' | 'thumbnail' | 'icon' = 'gallery'
  ): MobileImageConfig {
    const baseConfig = this.getBaseImageConfig(imageType);
    
    // Adjust for device capabilities
    const quality = this.calculateOptimalQuality(device, imageType);
    const format = this.selectOptimalFormat(device, imageType);
    const maxWidth = this.calculateOptimalWidth(device, imageType);
    const lazy = this.shouldLazyLoad(imageType);
    const priority = this.shouldPrioritize(imageType);
    
    return {
      ...baseConfig,
      maxWidth,
      quality,
      format,
      lazy,
      priority,
      sizes: this.generateSizesAttribute(device, imageType),
      placeholder: this.selectPlaceholderType(device, imageType)
    };
  }

  /**
   * Create device-specific resource loading strategy
   */
  generateResourceLoadingStrategy(
    device: DeviceCapabilities,
    pageType: string
  ): ResourceLoadingStrategy {
    const baseStrategy = this.getBaseResourceStrategy(pageType);
    
    // Adjust for connection speed
    if (this.isSlowConnection(device.connectionType)) {
      return this.optimizeForSlowConnection(baseStrategy, device);
    }
    
    // Adjust for low-end devices
    if (device.isLowEndDevice) {
      return this.optimizeForLowEndDevice(baseStrategy, device);
    }
    
    // Optimize for high-end devices
    return this.optimizeForHighEndDevice(baseStrategy, device);
  }

  /**
   * Generate complete mobile optimization configuration
   */
  optimizeForDevice(
    device: DeviceCapabilities,
    pageType: string,
    currentMetrics?: PerformanceMetrics
  ): OptimizationResult {
    const images = this.generateMobileImageConfig(device);
    const resources = this.generateResourceLoadingStrategy(device, pageType);
    const caching = this.generateCachingStrategy(device);
    const compression = this.generateCompressionConfig(device);
    const bundleOptimization = this.generateBundleOptimization(device);

    const config: MobileOptimizationConfig = {
      images,
      resources,
      caching,
      compression,
      bundleOptimization
    };

    const estimatedImprovement = this.estimatePerformanceImprovement(
      config,
      device,
      currentMetrics
    );

    const recommendations = this.generateRecommendations(config, device);
    const warnings = this.generateWarnings(config, device);

    return {
      config,
      estimatedImprovement,
      recommendations,
      warnings
    };
  }

  /**
   * Optimize images specifically for mobile devices
   */
  optimizeMobileImages(
    images: Array<{ src: string; alt: string; type: string }>,
    device: DeviceCapabilities
  ): Array<{
    src: string;
    srcSet: string;
    sizes: string;
    alt: string;
    loading: 'lazy' | 'eager';
    decoding: 'async' | 'sync';
    style: Record<string, string>;
  }> {
    return images.map(image => {
      const config = this.generateMobileImageConfig(device, image.type as any);
      
      return {
        src: this.generateOptimizedSrc(image.src, config),
        srcSet: this.generateSrcSet(image.src, device, config),
        sizes: config.sizes,
        alt: image.alt,
        loading: config.lazy ? 'lazy' : 'eager',
        decoding: 'async',
        style: this.generateImageStyles(config, device)
      };
    });
  }

  /**
   * Generate mobile-specific resource hints
   */
  generateMobileResourceHints(
    device: DeviceCapabilities,
    strategy: ResourceLoadingStrategy
  ): Array<{
    rel: string;
    href: string;
    as?: string;
    type?: string;
    media?: string;
  }> {
    const hints: Array<{
      rel: string;
      href: string;
      as?: string;
      type?: string;
      media?: string;
    }> = [];

    // Critical resources - preload
    strategy.critical.forEach(resource => {
      hints.push({
        rel: 'preload',
        href: resource,
        as: this.getResourceType(resource)
      });
    });

    // Preload resources
    strategy.preload.forEach(resource => {
      hints.push({
        rel: 'preload',
        href: resource,
        as: this.getResourceType(resource)
      });
    });

    // Prefetch for fast connections
    if (!this.isSlowConnection(device.connectionType)) {
      strategy.prefetch.forEach(resource => {
        hints.push({
          rel: 'prefetch',
          href: resource
        });
      });
    }

    // DNS prefetch for external resources
    const externalDomains = this.extractExternalDomains([
      ...strategy.critical,
      ...strategy.preload,
      ...strategy.prefetch
    ]);

    externalDomains.forEach(domain => {
      hints.push({
        rel: 'dns-prefetch',
        href: `//${domain}`
      });
    });

    return hints;
  }

  /**
   * Validate mobile optimization configuration
   */
  validateOptimization(config: MobileOptimizationConfig): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    score: number;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Validate image configuration
    if (config.images.quality > 85) {
      warnings.push('Image quality above 85% may not provide significant visual improvement');
      score -= 5;
    }

    if (config.images.maxWidth > 1920) {
      warnings.push('Image max width above 1920px may be unnecessary for mobile');
      score -= 10;
    }

    // Validate resource loading
    if (config.resources.critical.length > 5) {
      warnings.push('Too many critical resources may delay initial render');
      score -= 15;
    }

    if (config.resources.preload.length > 10) {
      warnings.push('Too many preload resources may compete for bandwidth');
      score -= 10;
    }

    // Validate caching
    if (config.caching.staticAssets < 86400) {
      warnings.push('Static asset cache duration below 1 day may impact performance');
      score -= 5;
    }

    // Validate compression
    if (!config.compression.enabled) {
      errors.push('Compression should be enabled for mobile optimization');
      score -= 20;
    }

    // Validate bundle optimization
    if (!config.bundleOptimization.splitChunks) {
      warnings.push('Code splitting recommended for better mobile performance');
      score -= 10;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: Math.max(0, score)
    };
  }

  // Private helper methods
  private extractScreenWidth(userAgent: string): number {
    // Simplified extraction - in real implementation, use more sophisticated detection
    if (userAgent.includes('iPhone')) return 375;
    if (userAgent.includes('iPad')) return 768;
    if (userAgent.includes('Android')) return 360;
    return 375; // Default mobile width
  }

  private extractScreenHeight(userAgent: string): number {
    if (userAgent.includes('iPhone')) return 667;
    if (userAgent.includes('iPad')) return 1024;
    if (userAgent.includes('Android')) return 640;
    return 667; // Default mobile height
  }

  private extractPixelRatio(userAgent: string): number {
    if (userAgent.includes('iPhone')) return 2;
    if (userAgent.includes('iPad')) return 2;
    if (userAgent.includes('Android')) return 2;
    return 1;
  }

  private detectConnectionType(connection?: any): DeviceCapabilities['connectionType'] {
    if (!connection) return 'unknown';
    
    const effectiveType = connection.effectiveType;
    if (effectiveType && ['slow-2g', '2g', '3g', '4g'].includes(effectiveType)) {
      return effectiveType;
    }
    
    return 'unknown';
  }

  private extractMemory(userAgent: string): number | undefined {
    // In real implementation, use navigator.deviceMemory if available
    return undefined;
  }

  private extractCPUCores(userAgent: string): number | undefined {
    // In real implementation, use navigator.hardwareConcurrency if available
    return undefined;
  }

  private isLowEndDevice(params: {
    screenWidth: number;
    memoryGB?: number;
    cpuCores?: number;
    connectionType: string;
  }): boolean {
    if (params.memoryGB && params.memoryGB < this.lowEndThresholds.memory) return true;
    if (params.cpuCores && params.cpuCores < this.lowEndThresholds.cores) return true;
    if (params.screenWidth < this.lowEndThresholds.screenWidth) return true;
    if (['slow-2g', '2g'].includes(params.connectionType)) return true;
    
    return false;
  }

  private detectSupportedFormats(userAgent: string): string[] {
    const formats = ['jpeg', 'png'];
    
    // Modern browsers support WebP
    if (!userAgent.includes('Safari') || userAgent.includes('Chrome')) {
      formats.push('webp');
    }
    
    // Very modern browsers support AVIF
    if (userAgent.includes('Chrome/') && parseInt(userAgent.split('Chrome/')[1]) >= 85) {
      formats.push('avif');
    }
    
    return formats;
  }

  private getBaseImageConfig(imageType: string): Partial<MobileImageConfig> {
    const configs = {
      hero: { quality: 80, lazy: false, priority: true },
      gallery: { quality: 75, lazy: true, priority: false },
      thumbnail: { quality: 70, lazy: true, priority: false },
      icon: { quality: 85, lazy: false, priority: false }
    };
    
    return configs[imageType as keyof typeof configs] || configs.gallery;
  }

  private calculateOptimalQuality(device: DeviceCapabilities, imageType: string): number {
    let baseQuality = 75;
    
    if (imageType === 'hero') baseQuality = 80;
    if (imageType === 'icon') baseQuality = 85;
    
    // Reduce quality for slow connections
    if (this.isSlowConnection(device.connectionType)) {
      baseQuality -= 10;
    }
    
    // Reduce quality for low-end devices
    if (device.isLowEndDevice) {
      baseQuality -= 5;
    }
    
    return Math.max(50, Math.min(95, baseQuality));
  }

  private selectOptimalFormat(device: DeviceCapabilities, imageType: string): MobileImageConfig['format'] {
    if (device.supportedFormats.includes('avif') && !this.isSlowConnection(device.connectionType)) {
      return 'avif';
    }
    
    if (device.supportedFormats.includes('webp')) {
      return 'webp';
    }
    
    return 'jpeg';
  }

  private calculateOptimalWidth(device: DeviceCapabilities, imageType: string): number {
    const baseWidth = device.screenWidth * device.pixelRatio;
    
    switch (imageType) {
      case 'hero':
        return Math.min(baseWidth, 1200);
      case 'gallery':
        return Math.min(baseWidth, 800);
      case 'thumbnail':
        return Math.min(baseWidth * 0.3, 300);
      case 'icon':
        return Math.min(baseWidth * 0.1, 100);
      default:
        return Math.min(baseWidth, 800);
    }
  }

  private shouldLazyLoad(imageType: string): boolean {
    return !['hero', 'icon'].includes(imageType);
  }

  private shouldPrioritize(imageType: string): boolean {
    return imageType === 'hero';
  }

  private generateSizesAttribute(device: DeviceCapabilities, imageType: string): string {
    switch (imageType) {
      case 'hero':
        return '100vw';
      case 'gallery':
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
      case 'thumbnail':
        return '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw';
      case 'icon':
        return '48px';
      default:
        return '100vw';
    }
  }

  private selectPlaceholderType(device: DeviceCapabilities, imageType: string): MobileImageConfig['placeholder'] {
    if (device.isLowEndDevice || this.isSlowConnection(device.connectionType)) {
      return 'empty';
    }
    
    if (imageType === 'hero') {
      return 'blur';
    }
    
    return 'skeleton';
  }

  private getBaseResourceStrategy(pageType: string): ResourceLoadingStrategy {
    const strategies: Record<string, ResourceLoadingStrategy> = {
      'property-detail': {
        critical: ['/css/critical.css', '/js/core.js'],
        preload: ['/css/property.css', '/js/property.js'],
        prefetch: ['/css/gallery.css', '/js/gallery.js'],
        defer: ['/js/analytics.js', '/js/chat.js'],
        lazy: ['/js/maps.js', '/js/social.js'],
        conditional: {
          'high-end': ['/js/animations.js', '/css/effects.css']
        }
      },
      'property-search': {
        critical: ['/css/critical.css', '/js/core.js'],
        preload: ['/css/search.css', '/js/search.js'],
        prefetch: ['/css/filters.css', '/js/filters.js'],
        defer: ['/js/analytics.js'],
        lazy: ['/js/maps.js'],
        conditional: {
          'fast-connection': ['/js/autocomplete.js']
        }
      },
      default: {
        critical: ['/css/critical.css', '/js/core.js'],
        preload: ['/css/main.css'],
        prefetch: ['/js/main.js'],
        defer: ['/js/analytics.js'],
        lazy: [],
        conditional: {}
      }
    };
    
    return strategies[pageType] || strategies.default;
  }

  private isSlowConnection(connectionType: string): boolean {
    return ['slow-2g', '2g', '3g'].includes(connectionType);
  }

  private optimizeForSlowConnection(
    strategy: ResourceLoadingStrategy,
    device: DeviceCapabilities
  ): ResourceLoadingStrategy {
    return {
      ...strategy,
      // Reduce preload resources
      preload: strategy.preload.slice(0, 2),
      // Remove prefetch for slow connections
      prefetch: [],
      // Move more resources to lazy loading
      lazy: [...strategy.lazy, ...strategy.prefetch],
      // Remove conditional resources
      conditional: {}
    };
  }

  private optimizeForLowEndDevice(
    strategy: ResourceLoadingStrategy,
    device: DeviceCapabilities
  ): ResourceLoadingStrategy {
    return {
      ...strategy,
      // Reduce critical resources
      critical: strategy.critical.slice(0, 2),
      // Limit preload resources
      preload: strategy.preload.slice(0, 3),
      // Move more to defer
      defer: [...strategy.defer, ...strategy.preload.slice(3)],
      // Remove heavy conditional resources
      conditional: {}
    };
  }

  private optimizeForHighEndDevice(
    strategy: ResourceLoadingStrategy,
    device: DeviceCapabilities
  ): ResourceLoadingStrategy {
    return {
      ...strategy,
      // Can handle more preload resources
      preload: [...strategy.preload, ...strategy.prefetch.slice(0, 2)],
      // Add conditional resources for high-end devices
      conditional: {
        ...strategy.conditional,
        'high-end': ['/js/animations.js', '/css/effects.css', '/js/advanced-features.js']
      }
    };
  }

  private generateCachingStrategy(device: DeviceCapabilities) {
    const base = {
      staticAssets: 86400 * 30, // 30 days
      apiResponses: 300, // 5 minutes
      images: 86400 * 7 // 7 days
    };

    if (device.isLowEndDevice) {
      return {
        ...base,
        staticAssets: 86400 * 7, // Shorter cache for low-end devices
        images: 86400 * 3
      };
    }

    return base;
  }

  private generateCompressionConfig(device: DeviceCapabilities) {
    return {
      enabled: true,
      level: device.isLowEndDevice ? 6 : 9, // Lower compression for low-end devices
      formats: ['gzip', 'br']
    };
  }

  private generateBundleOptimization(device: DeviceCapabilities) {
    return {
      splitChunks: true,
      treeShaking: true,
      minification: true,
      codeElimination: !device.isLowEndDevice // Skip for low-end devices to reduce processing
    };
  }

  private estimatePerformanceImprovement(
    config: MobileOptimizationConfig,
    device: DeviceCapabilities,
    currentMetrics?: PerformanceMetrics
  ) {
    // Simplified estimation - in real implementation, use more sophisticated modeling
    const baseImprovement = {
      lcp: 0.5, // 500ms improvement
      fid: 0.02, // 20ms improvement
      cls: 0.01, // 0.01 improvement
      bundleSize: 0.2 // 20% reduction
    };

    if (device.isLowEndDevice) {
      return {
        lcp: baseImprovement.lcp * 1.5,
        fid: baseImprovement.fid * 2,
        cls: baseImprovement.cls,
        bundleSize: baseImprovement.bundleSize * 1.3
      };
    }

    return baseImprovement;
  }

  private generateRecommendations(config: MobileOptimizationConfig, device: DeviceCapabilities): string[] {
    const recommendations: string[] = [];

    if (device.isLowEndDevice) {
      recommendations.push('Consider implementing progressive enhancement for low-end devices');
      recommendations.push('Use skeleton screens instead of loading spinners');
    }

    if (this.isSlowConnection(device.connectionType)) {
      recommendations.push('Implement offline-first caching strategy');
      recommendations.push('Consider reducing image quality further for slow connections');
    }

    if (config.images.format === 'jpeg') {
      recommendations.push('Consider upgrading to WebP or AVIF for better compression');
    }

    return recommendations;
  }

  private generateWarnings(config: MobileOptimizationConfig, device: DeviceCapabilities): string[] {
    const warnings: string[] = [];

    if (config.resources.critical.length > 5) {
      warnings.push('High number of critical resources may impact initial load time');
    }

    if (device.isLowEndDevice && config.bundleOptimization.codeElimination) {
      warnings.push('Code elimination may be too CPU-intensive for low-end devices');
    }

    return warnings;
  }

  private generateOptimizedSrc(src: string, config: MobileImageConfig): string {
    // In real implementation, integrate with image optimization service
    return `${src}?w=${config.maxWidth}&q=${config.quality}&f=${config.format}`;
  }

  private generateSrcSet(src: string, device: DeviceCapabilities, config: MobileImageConfig): string {
    const widths = [
      Math.floor(config.maxWidth * 0.5),
      Math.floor(config.maxWidth * 0.75),
      config.maxWidth,
      Math.floor(config.maxWidth * 1.5)
    ];

    return widths
      .map(width => `${src}?w=${width}&q=${config.quality}&f=${config.format} ${width}w`)
      .join(', ');
  }

  private generateImageStyles(config: MobileImageConfig, device: DeviceCapabilities): Record<string, string> {
    return {
      maxWidth: '100%',
      height: 'auto',
      objectFit: 'cover',
      backgroundColor: config.placeholder === 'skeleton' ? '#f0f0f0' : 'transparent'
    };
  }

  private getResourceType(resource: string): string {
    if (resource.endsWith('.css')) return 'style';
    if (resource.endsWith('.js')) return 'script';
    if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) return 'image';
    if (resource.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    return 'fetch';
  }

  private extractExternalDomains(resources: string[]): string[] {
    const domains = new Set<string>();
    
    resources.forEach(resource => {
      try {
        const url = new URL(resource, 'https://example.com');
        if (url.hostname !== 'example.com') {
          domains.add(url.hostname);
        }
      } catch {
        // Ignore invalid URLs
      }
    });
    
    return Array.from(domains);
  }
}

export const mobilePerformanceOptimizer = new MobilePerformanceOptimizer();