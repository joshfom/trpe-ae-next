/**
 * Responsive Image System with Lazy Loading
 * Provides srcset generation, intersection observer-based lazy loading, and placeholder generation
 */

export interface ResponsiveImageBreakpoint {
  width: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
}

export interface ResponsiveImageSet {
  src: string;
  srcset: string;
  sizes: string;
  placeholder: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export interface LazyLoadConfig {
  rootMargin: string;
  threshold: number;
  enablePlaceholder: boolean;
  fadeInDuration: number;
  retryAttempts: number;
}

export interface ImagePlaceholder {
  type: 'blur' | 'color' | 'skeleton';
  data: string;
  width: number;
  height: number;
}

/**
 * Responsive Image Generator
 */
export class ResponsiveImageGenerator {
  private static instance: ResponsiveImageGenerator;
  private defaultBreakpoints: ResponsiveImageBreakpoint[] = [
    { width: 320, quality: 0.75 },
    { width: 640, quality: 0.8 },
    { width: 768, quality: 0.8 },
    { width: 1024, quality: 0.85 },
    { width: 1280, quality: 0.85 },
    { width: 1920, quality: 0.9 },
    { width: 2560, quality: 0.9 }
  ];

  private constructor() {}

  public static getInstance(): ResponsiveImageGenerator {
    if (!ResponsiveImageGenerator.instance) {
      ResponsiveImageGenerator.instance = new ResponsiveImageGenerator();
    }
    return ResponsiveImageGenerator.instance;
  }

  /**
   * Generate responsive image set with srcset
   */
  public async generateResponsiveImageSet(
    originalSrc: string,
    breakpoints: ResponsiveImageBreakpoint[] = this.defaultBreakpoints,
    generatePlaceholder: boolean = true
  ): Promise<ResponsiveImageSet> {
    const img = await this.loadImage(originalSrc);
    const aspectRatio = img.width / img.height;

    // Generate srcset entries
    const srcsetEntries: string[] = [];
    let placeholder = '';

    for (const breakpoint of breakpoints) {
      const height = Math.round(breakpoint.width / aspectRatio);
      const optimizedSrc = await this.generateOptimizedImage(
        img,
        breakpoint.width,
        height,
        breakpoint.quality || 0.8,
        breakpoint.format
      );
      srcsetEntries.push(`${optimizedSrc} ${breakpoint.width}w`);
    }

    // Generate placeholder
    if (generatePlaceholder) {
      placeholder = await this.generateBlurPlaceholder(img);
    }

    // Generate sizes attribute
    const sizes = this.generateSizesAttribute(breakpoints);

    return {
      src: originalSrc,
      srcset: srcsetEntries.join(', '),
      sizes,
      placeholder,
      width: img.width,
      height: img.height,
      aspectRatio
    };
  }

  /**
   * Generate sizes attribute for responsive images
   */
  private generateSizesAttribute(breakpoints: ResponsiveImageBreakpoint[]): string {
    const sizeEntries: string[] = [];

    // Sort breakpoints by width
    const sortedBreakpoints = [...breakpoints].sort((a, b) => a.width - b.width);

    for (let i = 0; i < sortedBreakpoints.length - 1; i++) {
      const current = sortedBreakpoints[i];
      const next = sortedBreakpoints[i + 1];
      sizeEntries.push(`(max-width: ${next.width}px) ${current.width}px`);
    }

    // Add default size for largest breakpoint
    const largest = sortedBreakpoints[sortedBreakpoints.length - 1];
    sizeEntries.push(`${largest.width}px`);

    return sizeEntries.join(', ');
  }

  /**
   * Load image and return dimensions
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  /**
   * Generate optimized image for specific dimensions
   */
  private async generateOptimizedImage(
    img: HTMLImageElement,
    width: number,
    height: number,
    quality: number,
    format?: string
  ): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    if (ctx) {
      ctx.drawImage(img, 0, 0, width, height);
      
      const mimeType = format ? `image/${format}` : 'image/webp';
      return canvas.toDataURL(mimeType, quality);
    }

    throw new Error('Failed to create canvas context');
  }

  /**
   * Generate blur placeholder
   */
  private async generateBlurPlaceholder(img: HTMLImageElement): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Create small placeholder (20x20 pixels)
    canvas.width = 20;
    canvas.height = 20;

    if (ctx) {
      // Apply blur effect
      ctx.filter = 'blur(2px)';
      ctx.drawImage(img, 0, 0, 20, 20);
      return canvas.toDataURL('image/jpeg', 0.1);
    }

    return '';
  }

  /**
   * Generate color-based placeholder
   */
  public async generateColorPlaceholder(img: HTMLImageElement): Promise<ImagePlaceholder> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1;
    canvas.height = 1;

    if (ctx) {
      ctx.drawImage(img, 0, 0, 1, 1);
      const imageData = ctx.getImageData(0, 0, 1, 1);
      const [r, g, b] = imageData.data;
      
      return {
        type: 'color',
        data: `rgb(${r}, ${g}, ${b})`,
        width: img.width,
        height: img.height
      };
    }

    throw new Error('Failed to generate color placeholder');
  }

  /**
   * Generate skeleton placeholder
   */
  public generateSkeletonPlaceholder(width: number, height: number): ImagePlaceholder {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f0f0f0;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#e0e0e0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f0f0f0;stop-opacity:1" />
            <animateTransform attributeName="gradientTransform" type="translate" 
              values="-100 0;100 0;-100 0" dur="2s" repeatCount="indefinite"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#shimmer)" />
      </svg>
    `;

    return {
      type: 'skeleton',
      data: `data:image/svg+xml;base64,${btoa(svg)}`,
      width,
      height
    };
  }
}

/**
 * Lazy Loading Manager using Intersection Observer
 */
export class LazyLoadManager {
  private static instance: LazyLoadManager;
  private observer: IntersectionObserver | null = null;
  private config: LazyLoadConfig = {
    rootMargin: '50px',
    threshold: 0.1,
    enablePlaceholder: true,
    fadeInDuration: 300,
    retryAttempts: 3
  };

  private constructor() {}

  public static getInstance(): LazyLoadManager {
    if (!LazyLoadManager.instance) {
      LazyLoadManager.instance = new LazyLoadManager();
    }
    return LazyLoadManager.instance;
  }

  /**
   * Initialize lazy loading with custom config
   */
  public initialize(config: Partial<LazyLoadConfig> = {}): void {
    this.config = { ...this.config, ...config };
    this.createObserver();
  }

  /**
   * Create intersection observer
   */
  private createObserver(): void {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, falling back to immediate loading');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target as HTMLImageElement);
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: this.config.rootMargin,
        threshold: this.config.threshold
      }
    );
  }

  /**
   * Observe image for lazy loading
   */
  public observe(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.observe(img);
    } else {
      // Fallback: load immediately
      this.loadImage(img);
    }
  }

  /**
   * Unobserve image
   */
  public unobserve(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.unobserve(img);
    }
  }

  /**
   * Load image with retry logic
   */
  private async loadImage(img: HTMLImageElement, attempt: number = 1): Promise<void> {
    const dataSrc = img.dataset.src;
    const dataSrcset = img.dataset.srcset;

    if (!dataSrc && !dataSrcset) {
      return;
    }

    try {
      // Set loading state
      img.classList.add('loading');

      // Load the image
      await this.preloadImage(dataSrc || '');

      // Update src and srcset
      if (dataSrc) {
        img.src = dataSrc;
        img.removeAttribute('data-src');
      }

      if (dataSrcset) {
        img.srcset = dataSrcset;
        img.removeAttribute('data-srcset');
      }

      // Apply fade-in effect
      if (this.config.enablePlaceholder) {
        this.applyFadeInEffect(img);
      }

      // Remove loading state
      img.classList.remove('loading');
      img.classList.add('loaded');

    } catch (error) {
      console.error(`Failed to load image (attempt ${attempt}):`, error);

      // Retry if attempts remaining
      if (attempt < this.config.retryAttempts) {
        setTimeout(() => {
          this.loadImage(img, attempt + 1);
        }, 1000 * attempt); // Exponential backoff
      } else {
        img.classList.remove('loading');
        img.classList.add('error');
      }
    }
  }

  /**
   * Preload image to ensure it's ready
   */
  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload: ${src}`));
      img.src = src;
    });
  }

  /**
   * Apply fade-in effect
   */
  private applyFadeInEffect(img: HTMLImageElement): void {
    img.style.opacity = '0';
    img.style.transition = `opacity ${this.config.fadeInDuration}ms ease-in-out`;

    // Trigger fade-in
    requestAnimationFrame(() => {
      img.style.opacity = '1';
    });
  }

  /**
   * Disconnect observer
   */
  public disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Get loading statistics
   */
  public getStats(): { observed: number; loaded: number; errors: number } {
    const images = document.querySelectorAll('img[data-src], img[data-srcset]');
    const loaded = document.querySelectorAll('img.loaded');
    const errors = document.querySelectorAll('img.error');

    return {
      observed: images.length,
      loaded: loaded.length,
      errors: errors.length
    };
  }
}

/**
 * Utility functions for responsive images
 */

/**
 * Create responsive image configuration
 */
export function createResponsiveConfig(
  breakpoints?: ResponsiveImageBreakpoint[],
  lazyLoadConfig?: Partial<LazyLoadConfig>
): { breakpoints: ResponsiveImageBreakpoint[]; lazyLoad: LazyLoadConfig } {
  const defaultBreakpoints: ResponsiveImageBreakpoint[] = [
    { width: 320, quality: 0.75 },
    { width: 640, quality: 0.8 },
    { width: 768, quality: 0.8 },
    { width: 1024, quality: 0.85 },
    { width: 1280, quality: 0.85 },
    { width: 1920, quality: 0.9 }
  ];

  const defaultLazyLoad: LazyLoadConfig = {
    rootMargin: '50px',
    threshold: 0.1,
    enablePlaceholder: true,
    fadeInDuration: 300,
    retryAttempts: 3
  };

  return {
    breakpoints: breakpoints || defaultBreakpoints,
    lazyLoad: { ...defaultLazyLoad, ...lazyLoadConfig }
  };
}

/**
 * Generate responsive image HTML attributes
 */
export function generateImageAttributes(
  responsiveSet: ResponsiveImageSet,
  alt: string,
  className?: string
): Record<string, string> {
  return {
    'data-src': responsiveSet.src,
    'data-srcset': responsiveSet.srcset,
    sizes: responsiveSet.sizes,
    alt,
    width: responsiveSet.width.toString(),
    height: responsiveSet.height.toString(),
    style: `aspect-ratio: ${responsiveSet.aspectRatio}; background-image: url(${responsiveSet.placeholder}); background-size: cover; background-position: center;`,
    class: `lazy-image ${className || ''}`.trim(),
    loading: 'lazy'
  };
}

/**
 * Check if lazy loading is supported
 */
export function isLazyLoadingSupported(): boolean {
  return 'loading' in HTMLImageElement.prototype;
}

/**
 * Get optimal breakpoints for content type
 */
export function getOptimalBreakpoints(contentType: 'hero' | 'gallery' | 'thumbnail' | 'content'): ResponsiveImageBreakpoint[] {
  switch (contentType) {
    case 'hero':
      return [
        { width: 768, quality: 0.8 },
        { width: 1024, quality: 0.85 },
        { width: 1280, quality: 0.85 },
        { width: 1920, quality: 0.9 },
        { width: 2560, quality: 0.9 }
      ];

    case 'gallery':
      return [
        { width: 320, quality: 0.75 },
        { width: 640, quality: 0.8 },
        { width: 768, quality: 0.8 },
        { width: 1024, quality: 0.85 },
        { width: 1280, quality: 0.85 }
      ];

    case 'thumbnail':
      return [
        { width: 150, quality: 0.8 },
        { width: 300, quality: 0.85 },
        { width: 450, quality: 0.85 }
      ];

    case 'content':
    default:
      return [
        { width: 320, quality: 0.75 },
        { width: 640, quality: 0.8 },
        { width: 768, quality: 0.8 },
        { width: 1024, quality: 0.85 }
      ];
  }
}