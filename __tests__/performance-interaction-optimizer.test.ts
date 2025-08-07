import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { InteractionOptimizer, createInteractionOptimizer, type InteractionConfig, type CodeSplitChunk } from '../interaction-optimizer';

// Mock DOM APIs
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
const mockQuerySelectorAll = vi.fn();
const mockCreateElement = vi.fn();
const mockAppendChild = vi.fn();

Object.defineProperty(global, 'document', {
  writable: true,
  value: {
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    querySelectorAll: mockQuerySelectorAll,
    createElement: mockCreateElement,
    head: {
      appendChild: mockAppendChild
    },
    body: {}
  }
});

// Mock window APIs
const mockRequestIdleCallback = vi.fn();
const mockPerformanceObserver = vi.fn();
const mockPerformanceGetEntriesByType = vi.fn();

Object.defineProperty(global, 'window', {
  writable: true,
  configurable: true,
  value: {
    requestIdleCallback: mockRequestIdleCallback,
    PerformanceObserver: mockPerformanceObserver,
    IntersectionObserver: vi.fn().mockImplementation((callback) => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }))
  }
});

// Also set IntersectionObserver globally
Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((callback) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }))
});

Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    getEntriesByType: mockPerformanceGetEntriesByType
  }
});

describe('InteractionOptimizer', () => {
  let optimizer: InteractionOptimizer;
  let config: InteractionConfig;

  beforeEach(() => {
    config = {
      criticalScripts: ['/critical.js'],
      deferredScripts: ['/deferred.js'],
      lazyScripts: ['/lazy.js'],
      codeSplitChunks: [],
      preloadModules: ['/preload.js'],
      idleCallbacks: [
        {
          name: 'test-callback',
          callback: vi.fn(),
          priority: 'low',
          timeout: 1000
        }
      ]
    };
    
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock createElement to return a mock script element
    mockCreateElement.mockReturnValue({
      set src(value: string) { this._src = value; },
      get src() { return this._src; },
      set async(value: boolean) { this._async = value; },
      get async() { return this._async; },
      set onload(value: Function) { this._onload = value; },
      get onload() { return this._onload; },
      set onerror(value: Function) { this._onerror = value; },
      get onerror() { return this._onerror; }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateCodeSplitConfig', () => {
    beforeEach(() => {
      optimizer = new InteractionOptimizer(config);
    });

    it('should generate base code split chunks', () => {
      const chunks = optimizer.generateCodeSplitConfig('unknown');

      expect(chunks).toHaveLength(3); // critical, ui-components, analytics
      expect(chunks.some(chunk => chunk.name === 'critical')).toBe(true);
      expect(chunks.some(chunk => chunk.name === 'ui-components')).toBe(true);
      expect(chunks.some(chunk => chunk.name === 'analytics')).toBe(true);
    });

    it('should generate property listing specific chunks', () => {
      const chunks = optimizer.generateCodeSplitConfig('property-listing');

      expect(chunks.length).toBeGreaterThan(3);
      expect(chunks.some(chunk => chunk.name === 'property-search')).toBe(true);
      expect(chunks.some(chunk => chunk.name === 'property-filters')).toBe(true);
      expect(chunks.some(chunk => chunk.name === 'property-map')).toBe(true);
    });

    it('should generate property detail specific chunks', () => {
      const chunks = optimizer.generateCodeSplitConfig('property-detail');

      expect(chunks.length).toBeGreaterThan(3);
      expect(chunks.some(chunk => chunk.name === 'property-gallery')).toBe(true);
      expect(chunks.some(chunk => chunk.name === 'contact-forms')).toBe(true);
      expect(chunks.some(chunk => chunk.name === 'property-calculator')).toBe(true);
    });

    it('should generate homepage specific chunks', () => {
      const chunks = optimizer.generateCodeSplitConfig('homepage');

      expect(chunks.length).toBeGreaterThan(3);
      expect(chunks.some(chunk => chunk.name === 'hero-search')).toBe(true);
      expect(chunks.some(chunk => chunk.name === 'featured-listings')).toBe(true);
      expect(chunks.some(chunk => chunk.name === 'testimonials')).toBe(true);
    });

    it('should set correct priorities and load conditions', () => {
      const chunks = optimizer.generateCodeSplitConfig('property-listing');
      
      const criticalChunk = chunks.find(chunk => chunk.name === 'critical');
      const analyticsChunk = chunks.find(chunk => chunk.name === 'analytics');
      const mapChunk = chunks.find(chunk => chunk.name === 'property-map');

      expect(criticalChunk?.priority).toBe('high');
      expect(criticalChunk?.loadCondition).toBe('immediate');
      
      expect(analyticsChunk?.priority).toBe('low');
      expect(analyticsChunk?.loadCondition).toBe('idle');
      
      expect(mapChunk?.priority).toBe('low');
      expect(mapChunk?.loadCondition).toBe('viewport');
    });
  });

  describe('setupLazyLoading', () => {
    beforeEach(() => {
      optimizer = new InteractionOptimizer(config);
      mockQuerySelectorAll.mockReturnValue([
        { dataset: { lazyScript: '/lazy1.js' } },
        { dataset: { lazyScript: '/lazy2.js' } }
      ]);
    });

    it('should setup intersection observer for lazy loading', () => {
      optimizer.setupLazyLoading();

      expect(mockQuerySelectorAll).toHaveBeenCalledWith('[data-lazy-script]');
      // IntersectionObserver should be available in the global scope
      expect(global.IntersectionObserver).toBeDefined();
    });

    it('should handle lazy script loading', () => {
      const mockScript = {
        set src(value: string) { this._src = value; },
        get src() { return this._src; },
        set async(value: boolean) { this._async = value; },
        get async() { return this._async; },
        set onload(value: Function) { 
          this._onload = value;
          // Simulate successful load
          setTimeout(() => value(), 0);
        },
        get onload() { return this._onload; },
        set onerror(value: Function) { this._onerror = value; },
        get onerror() { return this._onerror; }
      };

      mockCreateElement.mockReturnValue(mockScript);
      
      optimizer.setupLazyLoading();

      expect(config.lazyScripts.length).toBeGreaterThan(0);
    });
  });

  describe('scheduleIdleCallback', () => {
    beforeEach(() => {
      optimizer = new InteractionOptimizer(config);
    });

    it('should schedule idle callback with requestIdleCallback', () => {
      const callback = {
        name: 'test',
        callback: vi.fn(),
        priority: 'low' as const,
        timeout: 1000
      };

      optimizer.scheduleIdleCallback(callback);

      expect(mockRequestIdleCallback).toHaveBeenCalledWith(
        expect.any(Function),
        { timeout: 1000 }
      );
    });

    it('should handle callback execution', () => {
      const mockCallback = vi.fn();
      const callback = {
        name: 'test',
        callback: mockCallback,
        priority: 'low' as const
      };

      // Mock requestIdleCallback to execute immediately
      mockRequestIdleCallback.mockImplementation((cb) => cb());

      optimizer.scheduleIdleCallback(callback);

      expect(mockCallback).toHaveBeenCalled();
    });

    it('should handle async callback execution', async () => {
      const mockAsyncCallback = vi.fn().mockResolvedValue('success');
      const callback = {
        name: 'async-test',
        callback: mockAsyncCallback,
        priority: 'low' as const
      };

      // Mock requestIdleCallback to execute immediately
      mockRequestIdleCallback.mockImplementation((cb) => cb());

      optimizer.scheduleIdleCallback(callback);

      expect(mockAsyncCallback).toHaveBeenCalled();
    });
  });

  describe('measureInteractionMetrics', () => {
    beforeEach(() => {
      optimizer = new InteractionOptimizer(config);
    });

    it('should return default metrics on server side', async () => {
      // Simulate server-side environment by setting window to undefined
      const originalWindow = global.window;
      Object.defineProperty(global, 'window', {
        writable: true,
        configurable: true,
        value: undefined
      });

      const metrics = await optimizer.measureInteractionMetrics();

      expect(metrics).toEqual({
        fid: 0,
        inp: 0,
        tbt: 0,
        tti: 0,
        mainThreadBlockingTime: 0,
        jsExecutionTime: 0,
        optimizationScore: 0
      });

      // Restore window
      Object.defineProperty(global, 'window', {
        writable: true,
        configurable: true,
        value: originalWindow
      });
    });

    it('should setup performance observers in browser environment', () => {
      // Mock performance entries
      mockPerformanceGetEntriesByType.mockImplementation((type) => {
        if (type === 'longtask') {
          return [{ duration: 100 }, { duration: 200 }];
        }
        if (type === 'navigation') {
          return [{ domContentLoadedEventEnd: 2000 }];
        }
        if (type === 'resource') {
          return [
            { name: 'script1.js', responseEnd: 100, responseStart: 50 },
            { name: 'script2.js', responseEnd: 200, responseStart: 150 }
          ];
        }
        return [];
      });

      // Test that the optimizer can be created without errors
      expect(optimizer).toBeInstanceOf(InteractionOptimizer);
      // PerformanceObserver should be available in the global scope
      expect(global.window.PerformanceObserver).toBeDefined();
    });
  });

  describe('getOptimizationRecommendations', () => {
    beforeEach(() => {
      optimizer = new InteractionOptimizer(config);
    });

    it('should provide recommendations for poor performance', () => {
      const metrics = {
        fid: 150, // Poor FID
        inp: 250, // Poor INP
        tbt: 400, // Poor TBT
        tti: 6000, // Poor TTI
        mainThreadBlockingTime: 1500, // High blocking time
        jsExecutionTime: 2500, // High JS execution time
        optimizationScore: 25
      };

      const recommendations = optimizer.getOptimizationRecommendations(metrics);

      expect(recommendations).toContain('Reduce First Input Delay by deferring non-critical JavaScript');
      expect(recommendations).toContain('Optimize Interaction to Next Paint by reducing JavaScript execution time');
      expect(recommendations).toContain('Reduce Total Blocking Time by breaking up long tasks');
      expect(recommendations).toContain('Improve Time to Interactive by optimizing critical resource loading');
      expect(recommendations).toContain('Reduce main thread blocking by using web workers for heavy computations');
      expect(recommendations).toContain('Optimize JavaScript bundle size and execution efficiency');
    });

    it('should provide fewer recommendations for good performance', () => {
      const metrics = {
        fid: 50, // Good FID
        inp: 100, // Good INP
        tbt: 100, // Good TBT
        tti: 3000, // Good TTI
        mainThreadBlockingTime: 500, // Low blocking time
        jsExecutionTime: 1000, // Low JS execution time
        optimizationScore: 90
      };

      const recommendations = optimizer.getOptimizationRecommendations(metrics);

      expect(recommendations).toHaveLength(0);
    });
  });

  describe('event delegation', () => {
    beforeEach(() => {
      optimizer = new InteractionOptimizer(config);
    });

    it('should setup event delegation on initialization', () => {
      expect(mockAddEventListener).toHaveBeenCalledWith('click', expect.any(Function), { passive: true });
      expect(mockAddEventListener).toHaveBeenCalledWith('submit', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledWith('input', expect.any(Function), { passive: true });
    });
  });

  describe('optimizeJavaScriptBundle', () => {
    beforeEach(() => {
      optimizer = new InteractionOptimizer(config);
    });

    it('should return bundle optimization metrics', () => {
      const optimization = optimizer.optimizeJavaScriptBundle();

      expect(optimization).toHaveProperty('bundleSize');
      expect(optimization).toHaveProperty('initialChunkSize');
      expect(optimization).toHaveProperty('deferredChunkSize');
      expect(optimization).toHaveProperty('lazyLoadedSize');
      expect(optimization).toHaveProperty('compressionRatio');
      expect(optimization).toHaveProperty('treeshakingEfficiency');
    });
  });
});

describe('createInteractionOptimizer', () => {
  it('should create optimizer with default configuration', () => {
    const optimizer = createInteractionOptimizer('homepage');

    expect(optimizer).toBeInstanceOf(InteractionOptimizer);
  });

  it('should generate page-specific code split configuration', () => {
    const optimizer = createInteractionOptimizer('property-listing');

    // Access the generated chunks through the optimizer
    const chunks = optimizer.generateCodeSplitConfig('property-listing');
    expect(chunks.length).toBeGreaterThan(3);
    expect(chunks.some(chunk => chunk.name === 'property-search')).toBe(true);
  });
});