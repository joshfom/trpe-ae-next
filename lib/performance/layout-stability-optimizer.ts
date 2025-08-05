/**
 * Layout Stability Optimizer for CLS (Cumulative Layout Shift) prevention
 * Prevents layout shifts by reserving space for dynamic content
 */

export interface LayoutStabilityConfig {
  reserveImageSpace: boolean;
  reserveVideoSpace: boolean;
  reserveAdSpace: boolean;
  reserveFontSpace: boolean;
  preloadFonts: string[];
  fallbackFonts: string[];
  dynamicContentPlaceholders: DynamicContentPlaceholder[];
}

export interface DynamicContentPlaceholder {
  selector: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  minHeight?: number | string;
  placeholder?: 'skeleton' | 'spinner' | 'blur' | 'custom';
  customPlaceholder?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  naturalWidth?: number;
  naturalHeight?: number;
}

export interface FontLoadingConfig {
  fontFamily: string;
  fontWeight?: string | number;
  fontStyle?: string;
  fontDisplay?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
  fallback?: string[];
}

export interface CLSMetrics {
  clsScore: number;
  layoutShifts: LayoutShift[];
  largestShift: number;
  totalShiftDistance: number;
  affectedElements: number;
  optimizationScore: number;
}

export interface LayoutShift {
  value: number;
  startTime: number;
  duration: number;
  sources: LayoutShiftSource[];
  hadRecentInput: boolean;
}

export interface LayoutShiftSource {
  node: Element;
  previousRect: DOMRect;
  currentRect: DOMRect;
}

export class LayoutStabilityOptimizer {
  private config: LayoutStabilityConfig;
  private observer: PerformanceObserver | null = null;
  private layoutShifts: LayoutShift[] = [];
  private imageDimensionsCache: Map<string, ImageDimensions> = new Map();
  private fontLoadPromises: Map<string, Promise<void>> = new Map();

  constructor(config: LayoutStabilityConfig) {
    this.config = config;
    this.initializeOptimizations();
  }

  /**
   * Initialize layout stability optimizations
   */
  private initializeOptimizations(): void {
    if (typeof window !== 'undefined') {
      this.setupLayoutShiftObserver();
      this.preloadFonts();
      this.setupImageDimensionReservation();
      this.setupDynamicContentPlaceholders();
      this.optimizeFontLoading();
    }
  }

  /**
   * Setup layout shift observer to monitor CLS
   */
  private setupLayoutShiftObserver(): void {
    if (!('PerformanceObserver' in window)) return;

    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as any[];
      
      entries.forEach((entry) => {
        if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
          const layoutShift: LayoutShift = {
            value: entry.value,
            startTime: entry.startTime,
            duration: entry.duration || 0,
            sources: entry.sources || [],
            hadRecentInput: entry.hadRecentInput
          };
          
          this.layoutShifts.push(layoutShift);
          this.handleLayoutShift(layoutShift);
        }
      });
    });

    this.observer.observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Handle detected layout shift
   */
  private handleLayoutShift(shift: LayoutShift): void {
    // Log layout shift for debugging
    if (process.env.NODE_ENV === 'development') {
      console.warn('Layout shift detected:', {
        value: shift.value,
        startTime: shift.startTime,
        sources: shift.sources.map(source => ({
          element: source.node.tagName,
          className: source.node.className,
          id: source.node.id
        }))
      });
    }

    // Apply fixes for common layout shift causes
    shift.sources.forEach(source => {
      this.fixElementLayoutShift(source.node);
    });
  }

  /**
   * Fix layout shift for a specific element
   */
  private fixElementLayoutShift(element: Element): void {
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'img':
        this.fixImageLayoutShift(element as HTMLImageElement);
        break;
      case 'video':
        this.fixVideoLayoutShift(element as HTMLVideoElement);
        break;
      case 'iframe':
        this.fixIframeLayoutShift(element as HTMLIFrameElement);
        break;
      default:
        this.fixGenericLayoutShift(element as HTMLElement);
    }
  }

  /**
   * Fix image layout shifts by setting dimensions
   */
  private fixImageLayoutShift(img: HTMLImageElement): void {
    if (img.width && img.height) return; // Already has dimensions

    const src = img.src || img.dataset.src;
    if (!src) return;

    // Try to get dimensions from cache
    const cachedDimensions = this.imageDimensionsCache.get(src);
    if (cachedDimensions) {
      this.setImageDimensions(img, cachedDimensions);
      return;
    }

    // Calculate dimensions asynchronously
    this.calculateImageDimensions(src).then(dimensions => {
      if (dimensions) {
        this.imageDimensionsCache.set(src, dimensions);
        this.setImageDimensions(img, dimensions);
      }
    });
  }

  /**
   * Fix video layout shifts
   */
  private fixVideoLayoutShift(video: HTMLVideoElement): void {
    if (video.width && video.height) return;

    // Set default aspect ratio for videos
    const aspectRatio = video.dataset.aspectRatio || '16/9';
    video.style.aspectRatio = aspectRatio;
    video.style.width = '100%';
    video.style.height = 'auto';
  }

  /**
   * Fix iframe layout shifts
   */
  private fixIframeLayoutShift(iframe: HTMLIFrameElement): void {
    if (iframe.width && iframe.height) return;

    // Set default dimensions for iframes
    const aspectRatio = iframe.dataset.aspectRatio || '16/9';
    iframe.style.aspectRatio = aspectRatio;
    iframe.style.width = '100%';
    iframe.style.height = 'auto';
  }

  /**
   * Fix generic element layout shifts
   */
  private fixGenericLayoutShift(element: HTMLElement): void {
    // Add min-height to prevent collapse
    if (!element.style.minHeight && !element.style.height) {
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.height === 'auto' || computedStyle.height === '0px') {
        element.style.minHeight = '1px';
      }
    }
  }

  /**
   * Calculate image dimensions
   */
  calculateImageDimensions(src: string): Promise<ImageDimensions | null> {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        const dimensions: ImageDimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        };
        resolve(dimensions);
      };
      
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  /**
   * Set image dimensions to prevent layout shift
   */
  private setImageDimensions(img: HTMLImageElement, dimensions: ImageDimensions): void {
    // Set aspect ratio for modern browsers
    if ('aspectRatio' in img.style) {
      img.style.aspectRatio = dimensions.aspectRatio.toString();
    }

    // Set explicit dimensions as fallback
    if (!img.width) {
      img.width = dimensions.width;
    }
    if (!img.height) {
      img.height = dimensions.height;
    }

    // Ensure responsive behavior
    if (!img.style.maxWidth) {
      img.style.maxWidth = '100%';
    }
    if (!img.style.height || img.style.height === 'auto') {
      img.style.height = 'auto';
    }
  }

  /**
   * Setup image dimension reservation
   */
  private setupImageDimensionReservation(): void {
    if (!this.config.reserveImageSpace) return;

    // Find all images without dimensions
    const images = document.querySelectorAll('img:not([width]):not([height])');
    
    images.forEach((img) => {
      this.reserveImageSpace(img as HTMLImageElement);
    });

    // Setup mutation observer for dynamically added images
    this.setupImageMutationObserver();
  }

  /**
   * Reserve space for an image
   */
  private reserveImageSpace(img: HTMLImageElement): void {
    const src = img.src || img.dataset.src;
    if (!src) return;

    // Try to get dimensions from data attributes
    const dataWidth = img.dataset.width;
    const dataHeight = img.dataset.height;
    const dataAspectRatio = img.dataset.aspectRatio;

    if (dataWidth && dataHeight) {
      img.width = parseInt(dataWidth);
      img.height = parseInt(dataHeight);
      return;
    }

    if (dataAspectRatio) {
      img.style.aspectRatio = dataAspectRatio;
      img.style.width = '100%';
      img.style.height = 'auto';
      return;
    }

    // Calculate dimensions from image
    this.calculateImageDimensions(src).then(dimensions => {
      if (dimensions) {
        this.setImageDimensions(img, dimensions);
      }
    });
  }

  /**
   * Setup mutation observer for images
   */
  private setupImageMutationObserver(): void {
    if (!('MutationObserver' in window)) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check if it's an image
            if (element.tagName === 'IMG') {
              this.reserveImageSpace(element as HTMLImageElement);
            }
            
            // Check for images within the added element
            const images = element.querySelectorAll('img:not([width]):not([height])');
            images.forEach((img) => {
              this.reserveImageSpace(img as HTMLImageElement);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Setup dynamic content placeholders
   */
  private setupDynamicContentPlaceholders(): void {
    this.config.dynamicContentPlaceholders.forEach(placeholder => {
      this.createPlaceholder(placeholder);
    });
  }

  /**
   * Create placeholder for dynamic content
   */
  private createPlaceholder(config: DynamicContentPlaceholder): void {
    const elements = document.querySelectorAll(config.selector);
    
    elements.forEach((element) => {
      this.applyPlaceholder(element as HTMLElement, config);
    });
  }

  /**
   * Apply placeholder to element
   */
  private applyPlaceholder(element: HTMLElement, config: DynamicContentPlaceholder): void {
    // Set dimensions
    if (config.width) {
      element.style.width = typeof config.width === 'number' ? `${config.width}px` : config.width;
    }
    if (config.height) {
      element.style.height = typeof config.height === 'number' ? `${config.height}px` : config.height;
    }
    if (config.aspectRatio) {
      element.style.aspectRatio = config.aspectRatio;
    }
    if (config.minHeight) {
      element.style.minHeight = typeof config.minHeight === 'number' ? `${config.minHeight}px` : config.minHeight;
    }

    // Apply placeholder style
    switch (config.placeholder) {
      case 'skeleton':
        this.applySkeletonPlaceholder(element);
        break;
      case 'spinner':
        this.applySpinnerPlaceholder(element);
        break;
      case 'blur':
        this.applyBlurPlaceholder(element);
        break;
      case 'custom':
        if (config.customPlaceholder) {
          element.innerHTML = config.customPlaceholder;
        }
        break;
    }
  }

  /**
   * Apply skeleton placeholder
   */
  private applySkeletonPlaceholder(element: HTMLElement): void {
    element.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
    element.style.backgroundSize = '200% 100%';
    element.style.animation = 'skeleton-loading 1.5s infinite';
    
    // Add skeleton animation CSS if not already present
    this.addSkeletonCSS();
  }

  /**
   * Apply spinner placeholder
   */
  private applySpinnerPlaceholder(element: HTMLElement): void {
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.innerHTML = '<div class="spinner"></div>';
    
    // Add spinner CSS if not already present
    this.addSpinnerCSS();
  }

  /**
   * Apply blur placeholder
   */
  private applyBlurPlaceholder(element: HTMLElement): void {
    element.style.background = '#f0f0f0';
    element.style.filter = 'blur(4px)';
    element.style.transition = 'filter 0.3s ease';
  }

  /**
   * Add skeleton animation CSS
   */
  private addSkeletonCSS(): void {
    if (document.querySelector('#skeleton-css')) return;

    const style = document.createElement('style');
    style.id = 'skeleton-css';
    style.textContent = `
      @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Add spinner CSS
   */
  private addSpinnerCSS(): void {
    if (document.querySelector('#spinner-css')) return;

    const style = document.createElement('style');
    style.id = 'spinner-css';
    style.textContent = `
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Preload fonts to prevent layout shifts
   */
  private preloadFonts(): void {
    this.config.preloadFonts.forEach(fontUrl => {
      this.preloadFont(fontUrl);
    });
  }

  /**
   * Preload a single font
   */
  private preloadFont(fontUrl: string): Promise<void> {
    if (this.fontLoadPromises.has(fontUrl)) {
      return this.fontLoadPromises.get(fontUrl)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = fontUrl;
      
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload font: ${fontUrl}`));
      
      document.head.appendChild(link);
    });

    this.fontLoadPromises.set(fontUrl, promise);
    return promise;
  }

  /**
   * Optimize font loading to prevent layout shifts
   */
  private optimizeFontLoading(): void {
    if (!this.config.reserveFontSpace) return;

    // Apply font-display: swap to all fonts
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);

    // Setup font loading observer
    this.setupFontLoadingObserver();
  }

  /**
   * Setup font loading observer
   */
  private setupFontLoadingObserver(): void {
    if (!('FontFace' in window)) return;

    document.fonts.ready.then(() => {
      // All fonts have loaded, remove any fallback styles
      document.body.classList.add('fonts-loaded');
    });

    // Monitor individual font loads
    document.fonts.addEventListener('loadingdone', (event) => {
      console.log('Font loaded:', event);
    });

    document.fonts.addEventListener('loadingerror', (event) => {
      console.warn('Font failed to load:', event);
    });
  }

  /**
   * Measure CLS metrics
   */
  measureCLSMetrics(): CLSMetrics {
    const clsScore = this.calculateCLSScore();
    const largestShift = Math.max(...this.layoutShifts.map(shift => shift.value), 0);
    const totalShiftDistance = this.layoutShifts.reduce((total, shift) => total + shift.value, 0);
    const affectedElements = new Set(
      this.layoutShifts.flatMap(shift => shift.sources.map(source => source.node))
    ).size;

    return {
      clsScore,
      layoutShifts: [...this.layoutShifts],
      largestShift,
      totalShiftDistance,
      affectedElements,
      optimizationScore: this.calculateOptimizationScore(clsScore)
    };
  }

  /**
   * Calculate CLS score
   */
  private calculateCLSScore(): number {
    if (this.layoutShifts.length === 0) return 0;

    // Group layout shifts into sessions
    const sessions = this.groupLayoutShiftsIntoSessions();
    
    // Return the maximum session value
    return Math.max(...sessions.map(session => 
      session.reduce((sum, shift) => sum + shift.value, 0)
    ), 0);
  }

  /**
   * Group layout shifts into sessions (5-second windows)
   */
  private groupLayoutShiftsIntoSessions(): LayoutShift[][] {
    if (this.layoutShifts.length === 0) return [];

    const sessions: LayoutShift[][] = [];
    let currentSession: LayoutShift[] = [];
    let sessionStartTime = this.layoutShifts[0].startTime;

    this.layoutShifts.forEach(shift => {
      // If more than 5 seconds have passed, start a new session
      if (shift.startTime - sessionStartTime > 5000) {
        if (currentSession.length > 0) {
          sessions.push(currentSession);
        }
        currentSession = [shift];
        sessionStartTime = shift.startTime;
      } else {
        currentSession.push(shift);
      }
    });

    // Add the last session
    if (currentSession.length > 0) {
      sessions.push(currentSession);
    }

    return sessions;
  }

  /**
   * Calculate optimization score based on CLS
   */
  private calculateOptimizationScore(clsScore: number): number {
    if (clsScore <= 0.1) return 100; // Good
    if (clsScore <= 0.25) return 75;  // Needs improvement
    return 50; // Poor
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(metrics: CLSMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.clsScore > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift by setting explicit dimensions for images and videos');
    }

    if (metrics.largestShift > 0.05) {
      recommendations.push('Fix the largest layout shift by identifying and stabilizing the most problematic element');
    }

    if (metrics.affectedElements > 5) {
      recommendations.push('Reduce the number of elements causing layout shifts by implementing proper placeholders');
    }

    if (this.layoutShifts.some(shift => shift.sources.some(source => source.node.tagName === 'IMG'))) {
      recommendations.push('Set explicit width and height attributes on images to prevent layout shifts');
    }

    if (this.layoutShifts.some(shift => shift.sources.some(source => source.node.tagName === 'IFRAME'))) {
      recommendations.push('Reserve space for embedded content like iframes and ads');
    }

    return recommendations;
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 * Factory function to create layout stability optimizer with default configuration
 */
export function createLayoutStabilityOptimizer(pageType: string): LayoutStabilityOptimizer {
  const config: LayoutStabilityConfig = {
    reserveImageSpace: true,
    reserveVideoSpace: true,
    reserveAdSpace: true,
    reserveFontSpace: true,
    preloadFonts: [
      '/fonts/inter-var.woff2'
    ],
    fallbackFonts: [
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif'
    ],
    dynamicContentPlaceholders: []
  };

  // Add page-specific placeholders
  switch (pageType) {
    case 'property-listing':
      config.dynamicContentPlaceholders.push(
        {
          selector: '.property-card',
          aspectRatio: '4/3',
          placeholder: 'skeleton'
        },
        {
          selector: '.property-map',
          height: '400px',
          placeholder: 'spinner'
        }
      );
      break;
    case 'property-detail':
      config.dynamicContentPlaceholders.push(
        {
          selector: '.property-gallery',
          aspectRatio: '16/9',
          placeholder: 'blur'
        },
        {
          selector: '.property-description',
          minHeight: '200px',
          placeholder: 'skeleton'
        }
      );
      break;
    case 'homepage':
      config.dynamicContentPlaceholders.push(
        {
          selector: '.hero-image',
          aspectRatio: '21/9',
          placeholder: 'blur'
        },
        {
          selector: '.featured-properties',
          minHeight: '300px',
          placeholder: 'skeleton'
        }
      );
      break;
  }

  return new LayoutStabilityOptimizer(config);
}