/**
 * Interaction Optimizer for FID (First Input Delay) and INP (Interaction to Next Paint)
 * Optimizes JavaScript loading and execution to minimize input delay
 */

export interface InteractionConfig {
  criticalScripts: string[];
  deferredScripts: string[];
  lazyScripts: string[];
  codeSplitChunks: CodeSplitChunk[];
  preloadModules: string[];
  idleCallbacks: IdleCallback[];
}

export interface CodeSplitChunk {
  name: string;
  modules: string[];
  priority: 'high' | 'medium' | 'low';
  loadCondition?: 'immediate' | 'interaction' | 'viewport' | 'idle';
  dependencies?: string[];
}

export interface IdleCallback {
  name: string;
  callback: () => void | Promise<void>;
  timeout?: number;
  priority: 'high' | 'medium' | 'low';
}

export interface InteractionMetrics {
  fid: number;
  inp: number;
  tbt: number; // Total Blocking Time
  tti: number; // Time to Interactive
  mainThreadBlockingTime: number;
  jsExecutionTime: number;
  optimizationScore: number;
}

export interface JavaScriptOptimization {
  bundleSize: number;
  initialChunkSize: number;
  deferredChunkSize: number;
  lazyLoadedSize: number;
  compressionRatio: number;
  treeshakingEfficiency: number;
}

export class InteractionOptimizer {
  private config: InteractionConfig;
  private loadedChunks: Set<string> = new Set();
  private pendingInteractions: Map<string, number> = new Map();
  private idleCallbackQueue: IdleCallback[] = [];

  constructor(config: InteractionConfig) {
    this.config = config;
    this.initializeOptimizations();
  }

  /**
   * Initialize interaction optimizations
   */
  private initializeOptimizations(): void {
    if (typeof window !== 'undefined') {
      this.setupIdleCallbacks();
      this.setupEventDelegation();
      this.measureInteractionMetrics();
    }
  }

  /**
   * Generate code splitting configuration for minimal initial JavaScript
   */
  generateCodeSplitConfig(pageType: string): CodeSplitChunk[] {
    const baseChunks: CodeSplitChunk[] = [
      {
        name: 'critical',
        modules: ['react', 'react-dom', 'next/router'],
        priority: 'high',
        loadCondition: 'immediate'
      },
      {
        name: 'ui-components',
        modules: ['@/components/ui/*'],
        priority: 'medium',
        loadCondition: 'interaction',
        dependencies: ['critical']
      },
      {
        name: 'analytics',
        modules: ['@/lib/gtm', '@/lib/analytics'],
        priority: 'low',
        loadCondition: 'idle'
      }
    ];

    // Add page-specific chunks
    switch (pageType) {
      case 'property-listing':
        return [
          ...baseChunks,
          {
            name: 'property-search',
            modules: ['@/features/search/*', '@/components/property-card'],
            priority: 'high',
            loadCondition: 'immediate'
          },
          {
            name: 'property-filters',
            modules: ['@/features/properties/filters/*'],
            priority: 'medium',
            loadCondition: 'interaction'
          },
          {
            name: 'property-map',
            modules: ['@/components/map/*', 'mapbox-gl'],
            priority: 'low',
            loadCondition: 'viewport'
          }
        ];

      case 'property-detail':
        return [
          ...baseChunks,
          {
            name: 'property-gallery',
            modules: ['@/components/gallery/*', 'swiper'],
            priority: 'high',
            loadCondition: 'immediate'
          },
          {
            name: 'contact-forms',
            modules: ['@/components/ContactForm', '@/components/EnhancedContactForm'],
            priority: 'medium',
            loadCondition: 'interaction'
          },
          {
            name: 'property-calculator',
            modules: ['@/features/calculator/*'],
            priority: 'low',
            loadCondition: 'viewport'
          }
        ];

      case 'homepage':
        return [
          ...baseChunks,
          {
            name: 'hero-search',
            modules: ['@/components/search/*'],
            priority: 'high',
            loadCondition: 'immediate'
          },
          {
            name: 'featured-listings',
            modules: ['@/components/property-card', '@/features/properties/featured'],
            priority: 'medium',
            loadCondition: 'viewport'
          },
          {
            name: 'testimonials',
            modules: ['@/components/testimonials/*'],
            priority: 'low',
            loadCondition: 'idle'
          }
        ];

      default:
        return baseChunks;
    }
  }

  /**
   * Implement lazy loading for non-critical JavaScript
   */
  setupLazyLoading(): void {
    if (typeof window === 'undefined') return;

    // Lazy load non-critical scripts
    this.config.lazyScripts.forEach(script => {
      this.lazyLoadScript(script);
    });

    // Setup intersection observer for viewport-based loading
    this.setupViewportBasedLoading();
  }

  /**
   * Lazy load a script when needed
   */
  private lazyLoadScript(src: string, condition: 'idle' | 'interaction' | 'viewport' = 'idle'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedChunks.has(src)) {
        resolve();
        return;
      }

      const loadScript = () => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
          this.loadedChunks.add(src);
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      };

      switch (condition) {
        case 'idle':
          this.requestIdleCallback(loadScript);
          break;
        case 'interaction':
          this.loadOnFirstInteraction(loadScript);
          break;
        case 'viewport':
          this.loadOnViewport(loadScript);
          break;
        default:
          loadScript();
      }
    });
  }

  /**
   * Setup viewport-based loading using Intersection Observer
   */
  private setupViewportBasedLoading(): void {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const scriptSrc = element.dataset.lazyScript;
          if (scriptSrc) {
            this.lazyLoadScript(scriptSrc);
            observer.unobserve(element);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    // Observe elements with lazy script data attributes
    document.querySelectorAll('[data-lazy-script]').forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Load script on first user interaction
   */
  private loadOnFirstInteraction(callback: () => void): void {
    const events = ['click', 'touchstart', 'keydown', 'scroll'];
    
    const loadOnce = () => {
      callback();
      events.forEach(event => {
        document.removeEventListener(event, loadOnce);
      });
    };

    events.forEach(event => {
      document.addEventListener(event, loadOnce, { passive: true });
    });
  }

  /**
   * Load script when element enters viewport
   */
  private loadOnViewport(callback: () => void): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback();
          observer.disconnect();
        }
      });

      // Observe a trigger element or create one
      const trigger = document.querySelector('[data-viewport-trigger]') || document.body;
      observer.observe(trigger);
    } else {
      // Fallback for browsers without IntersectionObserver
      callback();
    }
  }

  /**
   * Setup idle callbacks for non-critical tasks
   */
  private setupIdleCallbacks(): void {
    this.config.idleCallbacks.forEach(idleCallback => {
      this.scheduleIdleCallback(idleCallback);
    });
  }

  /**
   * Schedule a callback to run during idle time
   */
  scheduleIdleCallback(idleCallback: IdleCallback): void {
    this.requestIdleCallback(() => {
      try {
        const result = idleCallback.callback();
        if (result instanceof Promise) {
          result.catch(error => {
            console.warn(`Idle callback ${idleCallback.name} failed:`, error);
          });
        }
      } catch (error) {
        console.warn(`Idle callback ${idleCallback.name} failed:`, error);
      }
    }, idleCallback.timeout);
  }

  /**
   * Request idle callback with fallback
   */
  private requestIdleCallback(callback: () => void, timeout: number = 5000): void {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(callback, { timeout });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(callback, 1);
    }
  }

  /**
   * Setup event delegation to reduce event listeners
   */
  private setupEventDelegation(): void {
    // Delegate common events to reduce memory usage and improve performance
    document.addEventListener('click', this.handleDelegatedClick.bind(this), { passive: true });
    document.addEventListener('submit', this.handleDelegatedSubmit.bind(this));
    document.addEventListener('input', this.handleDelegatedInput.bind(this), { passive: true });
  }

  /**
   * Handle delegated click events
   */
  private handleDelegatedClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Handle property card clicks
    if (target.closest('[data-property-card]')) {
      this.handlePropertyCardClick(target.closest('[data-property-card]') as HTMLElement);
    }
    
    // Handle filter clicks
    if (target.closest('[data-filter-toggle]')) {
      this.handleFilterToggle(target.closest('[data-filter-toggle]') as HTMLElement);
    }
    
    // Handle lazy loading triggers
    if (target.closest('[data-lazy-load]')) {
      this.handleLazyLoadTrigger(target.closest('[data-lazy-load]') as HTMLElement);
    }
  }

  /**
   * Handle delegated form submissions
   */
  private handleDelegatedSubmit(event: Event): void {
    const form = event.target as HTMLFormElement;
    
    if (form.dataset.contactForm) {
      this.handleContactFormSubmit(form, event);
    }
    
    if (form.dataset.searchForm) {
      this.handleSearchFormSubmit(form, event);
    }
  }

  /**
   * Handle delegated input events
   */
  private handleDelegatedInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.dataset.searchInput) {
      this.debounce(() => this.handleSearchInput(input), 300)();
    }
    
    if (input.dataset.filterInput) {
      this.debounce(() => this.handleFilterInput(input), 150)();
    }
  }

  /**
   * Debounce function to limit rapid function calls
   */
  private debounce(func: Function, wait: number): () => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Handle property card interactions
   */
  private handlePropertyCardClick(element: HTMLElement): void {
    // Lazy load property details if not already loaded
    const propertyId = element.dataset.propertyId;
    if (propertyId && !this.loadedChunks.has(`property-${propertyId}`)) {
      this.lazyLoadScript(`/api/property/${propertyId}/details.js`);
      this.loadedChunks.add(`property-${propertyId}`);
    }
  }

  /**
   * Handle filter toggle interactions
   */
  private handleFilterToggle(element: HTMLElement): void {
    // Lazy load filter components if not already loaded
    if (!this.loadedChunks.has('advanced-filters')) {
      this.lazyLoadScript('/chunks/advanced-filters.js');
      this.loadedChunks.add('advanced-filters');
    }
  }

  /**
   * Handle lazy load triggers
   */
  private handleLazyLoadTrigger(element: HTMLElement): void {
    const chunkName = element.dataset.lazyLoad;
    if (chunkName && !this.loadedChunks.has(chunkName)) {
      this.lazyLoadScript(`/chunks/${chunkName}.js`);
      this.loadedChunks.add(chunkName);
    }
  }

  /**
   * Handle contact form submissions
   */
  private handleContactFormSubmit(form: HTMLFormElement, event: Event): void {
    // Lazy load form validation and submission logic
    if (!this.loadedChunks.has('form-handler')) {
      event.preventDefault();
      this.lazyLoadScript('/chunks/form-handler.js').then(() => {
        // Re-trigger form submission after script loads
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      });
      this.loadedChunks.add('form-handler');
    }
  }

  /**
   * Handle search form submissions
   */
  private handleSearchFormSubmit(form: HTMLFormElement, event: Event): void {
    // Lazy load search logic if not already loaded
    if (!this.loadedChunks.has('search-handler')) {
      event.preventDefault();
      this.lazyLoadScript('/chunks/search-handler.js').then(() => {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      });
      this.loadedChunks.add('search-handler');
    }
  }

  /**
   * Handle search input changes
   */
  private handleSearchInput(input: HTMLInputElement): void {
    // Lazy load autocomplete functionality
    if (!this.loadedChunks.has('autocomplete')) {
      this.lazyLoadScript('/chunks/autocomplete.js');
      this.loadedChunks.add('autocomplete');
    }
  }

  /**
   * Handle filter input changes
   */
  private handleFilterInput(input: HTMLInputElement): void {
    // Update filters without blocking main thread
    this.requestIdleCallback(() => {
      // Filter update logic would go here
      console.log('Filter updated:', input.value);
    });
  }

  /**
   * Measure interaction metrics
   */
  measureInteractionMetrics(): Promise<InteractionMetrics> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve({
          fid: 0,
          inp: 0,
          tbt: 0,
          tti: 0,
          mainThreadBlockingTime: 0,
          jsExecutionTime: 0,
          optimizationScore: 0
        });
        return;
      }

      const metrics: Partial<InteractionMetrics> = {};

      // Measure FID
      this.measureFID().then(fid => {
        metrics.fid = fid;
        
        // Measure INP
        this.measureINP().then(inp => {
          metrics.inp = inp;
          
          // Calculate other metrics
          metrics.tbt = this.calculateTotalBlockingTime();
          metrics.tti = this.calculateTimeToInteractive();
          metrics.mainThreadBlockingTime = this.calculateMainThreadBlockingTime();
          metrics.jsExecutionTime = this.calculateJSExecutionTime();
          metrics.optimizationScore = this.calculateInteractionScore(metrics as InteractionMetrics);
          
          resolve(metrics as InteractionMetrics);
        });
      });
    });
  }

  /**
   * Measure First Input Delay
   */
  private measureFID(): Promise<number> {
    return new Promise((resolve) => {
      if (!('PerformanceObserver' in window)) {
        resolve(0);
        return;
      }

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fidEntry = entries[0] as any;
        resolve(fidEntry?.processingStart - fidEntry?.startTime || 0);
        observer.disconnect();
      });

      observer.observe({ entryTypes: ['first-input'] });

      // Fallback timeout
      setTimeout(() => {
        observer.disconnect();
        resolve(0);
      }, 10000);
    });
  }

  /**
   * Measure Interaction to Next Paint
   */
  private measureINP(): Promise<number> {
    return new Promise((resolve) => {
      if (!('PerformanceObserver' in window)) {
        resolve(0);
        return;
      }

      let maxINP = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            const inp = entry.processingStart - entry.startTime;
            maxINP = Math.max(maxINP, inp);
          }
        });
      });

      observer.observe({ entryTypes: ['event'] });

      // Return max INP after 5 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve(maxINP);
      }, 5000);
    });
  }

  /**
   * Calculate Total Blocking Time
   */
  private calculateTotalBlockingTime(): number {
    if (typeof window === 'undefined') return 0;

    const longTasks = performance.getEntriesByType('longtask');
    return longTasks.reduce((total, task) => {
      const blockingTime = Math.max(0, task.duration - 50); // Tasks over 50ms are blocking
      return total + blockingTime;
    }, 0);
  }

  /**
   * Calculate Time to Interactive
   */
  private calculateTimeToInteractive(): number {
    if (typeof window === 'undefined') return 0;

    // Simplified TTI calculation
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigationEntry?.domContentLoadedEventEnd || 0;
  }

  /**
   * Calculate main thread blocking time
   */
  private calculateMainThreadBlockingTime(): number {
    if (typeof window === 'undefined') return 0;

    const longTasks = performance.getEntriesByType('longtask');
    return longTasks.reduce((total, task) => total + task.duration, 0);
  }

  /**
   * Calculate JavaScript execution time
   */
  private calculateJSExecutionTime(): number {
    if (typeof window === 'undefined') return 0;

    const scriptEntries = performance.getEntriesByType('resource')
      .filter(entry => entry.name.endsWith('.js'));
    
    return scriptEntries.reduce((total, entry) => {
      return total + (entry.responseEnd - entry.responseStart);
    }, 0);
  }

  /**
   * Calculate interaction optimization score
   */
  private calculateInteractionScore(metrics: InteractionMetrics): number {
    let score = 100;

    // Penalize high FID
    if (metrics.fid > 100) score -= 30;
    else if (metrics.fid > 50) score -= 15;

    // Penalize high INP
    if (metrics.inp > 200) score -= 25;
    else if (metrics.inp > 100) score -= 10;

    // Penalize high TBT
    if (metrics.tbt > 300) score -= 20;
    else if (metrics.tbt > 150) score -= 10;

    // Penalize long TTI
    if (metrics.tti > 5000) score -= 15;
    else if (metrics.tti > 3000) score -= 8;

    return Math.max(0, score);
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(metrics: InteractionMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.fid > 100) {
      recommendations.push('Reduce First Input Delay by deferring non-critical JavaScript');
    }

    if (metrics.inp > 200) {
      recommendations.push('Optimize Interaction to Next Paint by reducing JavaScript execution time');
    }

    if (metrics.tbt > 300) {
      recommendations.push('Reduce Total Blocking Time by breaking up long tasks');
    }

    if (metrics.tti > 5000) {
      recommendations.push('Improve Time to Interactive by optimizing critical resource loading');
    }

    if (metrics.mainThreadBlockingTime > 1000) {
      recommendations.push('Reduce main thread blocking by using web workers for heavy computations');
    }

    if (metrics.jsExecutionTime > 2000) {
      recommendations.push('Optimize JavaScript bundle size and execution efficiency');
    }

    return recommendations;
  }

  /**
   * Optimize JavaScript bundle
   */
  optimizeJavaScriptBundle(): JavaScriptOptimization {
    // This would integrate with build tools to analyze and optimize bundles
    return {
      bundleSize: 0,
      initialChunkSize: 0,
      deferredChunkSize: 0,
      lazyLoadedSize: 0,
      compressionRatio: 0,
      treeshakingEfficiency: 0
    };
  }
}

/**
 * Factory function to create interaction optimizer with default configuration
 */
export function createInteractionOptimizer(pageType: string): InteractionOptimizer {
  const config: InteractionConfig = {
    criticalScripts: ['/chunks/critical.js'],
    deferredScripts: ['/chunks/deferred.js'],
    lazyScripts: ['/chunks/lazy.js'],
    codeSplitChunks: [],
    preloadModules: [],
    idleCallbacks: [
      {
        name: 'analytics-init',
        callback: () => {
          // Initialize analytics during idle time
          console.log('Analytics initialized during idle time');
        },
        priority: 'low',
        timeout: 5000
      }
    ]
  };

  const optimizer = new InteractionOptimizer(config);
  
  // Generate page-specific code split configuration
  config.codeSplitChunks = optimizer.generateCodeSplitConfig(pageType);
  
  return new InteractionOptimizer(config);
}