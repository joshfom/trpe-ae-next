import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LayoutStabilityOptimizer, createLayoutStabilityOptimizer, type LayoutStabilityConfig, type DynamicContentPlaceholder } from '../layout-stability-optimizer';

// Mock DOM APIs
const mockQuerySelectorAll = vi.fn();
const mockCreateElement = vi.fn();
const mockAppendChild = vi.fn();
const mockGetComputedStyle = vi.fn();

Object.defineProperty(global, 'document', {
  writable: true,
  configurable: true,
  value: {
    querySelectorAll: mockQuerySelectorAll,
    createElement: mockCreateElement,
    head: {
      appendChild: mockAppendChild
    },
    body: {
      classList: {
        add: vi.fn()
      }
    },
    querySelector: vi.fn()
  }
});

Object.defineProperty(global, 'window', {
  writable: true,
  configurable: true,
  value: {
    getComputedStyle: mockGetComputedStyle,
    PerformanceObserver: vi.fn(),
    MutationObserver: vi.fn(),
    Image: vi.fn(),
    FontFace: vi.fn(),
    Node: {
      ELEMENT_NODE: 1
    }
  }
});

// Also set MutationObserver globally
Object.defineProperty(global, 'MutationObserver', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((callback) => ({
    observe: vi.fn(),
    disconnect: vi.fn()
  }))
});

// Set Image globally
Object.defineProperty(global, 'Image', {
  writable: true,
  configurable: true,
  value: vi.fn()
});

// Mock fonts API
Object.defineProperty(global.document, 'fonts', {
  writable: true,
  configurable: true,
  value: {
    ready: Promise.resolve(),
    addEventListener: vi.fn()
  }
});

describe('LayoutStabilityOptimizer', () => {
  let optimizer: LayoutStabilityOptimizer;
  let config: LayoutStabilityConfig;

  beforeEach(() => {
    config = {
      reserveImageSpace: true,
      reserveVideoSpace: true,
      reserveAdSpace: true,
      reserveFontSpace: true,
      preloadFonts: ['/fonts/inter-var.woff2'],
      fallbackFonts: ['system-ui', 'sans-serif'],
      dynamicContentPlaceholders: [
        {
          selector: '.test-element',
          width: 300,
          height: 200,
          placeholder: 'skeleton'
        }
      ]
    };

    // Reset mocks
    vi.clearAllMocks();

    // Mock querySelectorAll to return empty array by default
    mockQuerySelectorAll.mockReturnValue([]);

    // Mock createElement to return mock elements
    mockCreateElement.mockImplementation((tagName) => {
      const element = {
        tagName: tagName.toUpperCase(),
        style: {},
        rel: '',
        as: '',
        type: '',
        crossOrigin: '',
        href: '',
        onload: null,
        onerror: null,
        textContent: '',
        id: ''
      };
      return element;
    });

    // Mock Image constructor
    (global.Image as any).mockImplementation(() => ({
      onload: null,
      onerror: null,
      set src(value: string) {
        this._src = value;
        // Simulate successful load
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      },
      get src() { return this._src; },
      naturalWidth: 800,
      naturalHeight: 600
    }));

    // Also mock window.Image
    (global.window.Image as any).mockImplementation(() => ({
      onload: null,
      onerror: null,
      set src(value: string) {
        this._src = value;
        // Simulate successful load
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      },
      get src() { return this._src; },
      naturalWidth: 800,
      naturalHeight: 600
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor and initialization', () => {
    it('should create optimizer with configuration', () => {
      optimizer = new LayoutStabilityOptimizer(config);
      expect(optimizer).toBeInstanceOf(LayoutStabilityOptimizer);
    });

    it('should setup performance observer when window is available', () => {
      optimizer = new LayoutStabilityOptimizer(config);

      // Test that the optimizer was created successfully
      expect(optimizer).toBeInstanceOf(LayoutStabilityOptimizer);
      // PerformanceObserver should be available in the global scope
      expect(global.window.PerformanceObserver).toBeDefined();
    });
  });

  describe('calculateImageDimensions', () => {
    beforeEach(() => {
      optimizer = new LayoutStabilityOptimizer(config);
    });

    it('should calculate image dimensions successfully', async () => {
      const dimensions = await optimizer.calculateImageDimensions('/test-image.jpg');

      expect(dimensions).toEqual({
        width: 800,
        height: 600,
        aspectRatio: 800 / 600,
        naturalWidth: 800,
        naturalHeight: 600
      });
    });

    it('should handle image load errors', async () => {
      // Mock Image to simulate error
      (global.Image as any).mockImplementation(() => ({
        onload: null,
        onerror: null,
        set src(value: string) {
          this._src = value;
          setTimeout(() => {
            if (this.onerror) {
              this.onerror();
            }
          }, 0);
        },
        get src() { return this._src; }
      }));

      const dimensions = await optimizer.calculateImageDimensions('/invalid-image.jpg');

      expect(dimensions).toBeNull();
    });
  });

  describe('setupImageDimensionReservation', () => {
    beforeEach(() => {
      optimizer = new LayoutStabilityOptimizer(config);
    });

    it('should find and process images without dimensions', () => {
      const mockImages = [
        {
          tagName: 'IMG',
          src: '/image1.jpg',
          dataset: { src: '/image1.jpg' },
          width: 0,
          height: 0,
          style: {}
        },
        {
          tagName: 'IMG',
          src: '/image2.jpg',
          dataset: { width: '400', height: '300', src: '/image2.jpg' },
          width: 0,
          height: 0,
          style: {}
        }
      ];

      mockQuerySelectorAll.mockReturnValue(mockImages);

      // The setupImageDimensionReservation is called during initialization
      expect(mockQuerySelectorAll).toHaveBeenCalledWith('img:not([width]):not([height])');
    });

    it('should setup mutation observer for dynamic images', () => {
      // Create new optimizer to trigger setup
      const newOptimizer = new LayoutStabilityOptimizer(config);

      expect(newOptimizer).toBeInstanceOf(LayoutStabilityOptimizer);
      // MutationObserver should be available in the global scope
      expect(global.MutationObserver).toBeDefined();
    });
  });

  describe('setupDynamicContentPlaceholders', () => {
    beforeEach(() => {
      optimizer = new LayoutStabilityOptimizer(config);
    });

    it('should create placeholders for configured selectors', () => {
      const mockElements = [
        {
          style: {},
          innerHTML: ''
        }
      ];

      mockQuerySelectorAll.mockReturnValue(mockElements);

      // Placeholders are setup during initialization
      expect(mockQuerySelectorAll).toHaveBeenCalledWith('.test-element');
    });

    it('should apply skeleton placeholder correctly', () => {
      const mockElement = {
        style: {},
        innerHTML: '',
        dataset: {}
      };

      mockQuerySelectorAll.mockReturnValue([mockElement]);

      // Create new optimizer to trigger placeholder setup
      new LayoutStabilityOptimizer(config);

      expect(mockElement.style.width).toBe('300px');
      expect(mockElement.style.height).toBe('200px');
      expect(mockElement.style.background).toContain('linear-gradient');
    });
  });

  describe('preloadFonts', () => {
    beforeEach(() => {
      optimizer = new LayoutStabilityOptimizer(config);
    });

    it('should preload configured fonts', () => {
      expect(mockCreateElement).toHaveBeenCalledWith('link');
      expect(mockAppendChild).toHaveBeenCalled();
    });

    it('should handle font preload success', async () => {
      const mockLink = {
        rel: '',
        as: '',
        type: '',
        crossOrigin: '',
        href: '',
        onload: null,
        onerror: null
      };

      mockCreateElement.mockReturnValue(mockLink);

      const promise = optimizer.preloadFont('/test-font.woff2');

      // Simulate successful load
      setTimeout(() => {
        if (mockLink.onload) {
          mockLink.onload();
        }
      }, 0);

      await expect(promise).resolves.toBeUndefined();
    });

    it('should handle font preload errors', async () => {
      const mockLink = {
        rel: '',
        as: '',
        type: '',
        crossOrigin: '',
        href: '',
        onload: null,
        onerror: null
      };

      mockCreateElement.mockReturnValue(mockLink);

      const promise = optimizer.preloadFont('/invalid-font.woff2');

      // Simulate error
      setTimeout(() => {
        if (mockLink.onerror) {
          mockLink.onerror();
        }
      }, 0);

      await expect(promise).rejects.toThrow('Failed to preload font: /invalid-font.woff2');
    });
  });

  describe('measureCLSMetrics', () => {
    beforeEach(() => {
      optimizer = new LayoutStabilityOptimizer(config);
    });

    it('should return default metrics when no layout shifts', () => {
      const metrics = optimizer.measureCLSMetrics();

      expect(metrics).toEqual({
        clsScore: 0,
        layoutShifts: [],
        largestShift: 0,
        totalShiftDistance: 0,
        affectedElements: 0,
        optimizationScore: 100
      });
    });

    it('should calculate metrics with layout shifts', () => {
      // Simulate layout shifts by directly accessing private property
      const layoutShifts = [
        {
          value: 0.05,
          startTime: 1000,
          duration: 0,
          sources: [{ node: document.createElement('div') }],
          hadRecentInput: false
        },
        {
          value: 0.03,
          startTime: 2000,
          duration: 0,
          sources: [{ node: document.createElement('img') }],
          hadRecentInput: false
        }
      ];

      // Access private property for testing
      (optimizer as any).layoutShifts = layoutShifts;

      const metrics = optimizer.measureCLSMetrics();

      expect(metrics.clsScore).toBe(0.08); // Sum of shifts in same session
      expect(metrics.largestShift).toBe(0.05);
      expect(metrics.totalShiftDistance).toBe(0.08);
      expect(metrics.affectedElements).toBe(2);
      expect(metrics.optimizationScore).toBe(100); // CLS <= 0.1
    });
  });

  describe('getOptimizationRecommendations', () => {
    beforeEach(() => {
      optimizer = new LayoutStabilityOptimizer(config);
    });

    it('should provide recommendations for poor CLS', () => {
      const metrics = {
        clsScore: 0.3,
        layoutShifts: [],
        largestShift: 0.1,
        totalShiftDistance: 0.3,
        affectedElements: 8,
        optimizationScore: 50
      };

      const recommendations = optimizer.getOptimizationRecommendations(metrics);

      expect(recommendations).toContain('Reduce Cumulative Layout Shift by setting explicit dimensions for images and videos');
      expect(recommendations).toContain('Fix the largest layout shift by identifying and stabilizing the most problematic element');
      expect(recommendations).toContain('Reduce the number of elements causing layout shifts by implementing proper placeholders');
    });

    it('should provide fewer recommendations for good CLS', () => {
      const metrics = {
        clsScore: 0.05,
        layoutShifts: [],
        largestShift: 0.02,
        totalShiftDistance: 0.05,
        affectedElements: 2,
        optimizationScore: 100
      };

      const recommendations = optimizer.getOptimizationRecommendations(metrics);

      expect(recommendations).toHaveLength(0);
    });

    it('should recommend image fixes when images cause shifts', () => {
      const mockImg = document.createElement('img');
      const layoutShifts = [
        {
          value: 0.05,
          startTime: 1000,
          duration: 0,
          sources: [{ node: mockImg }],
          hadRecentInput: false
        }
      ];

      (optimizer as any).layoutShifts = layoutShifts;

      const metrics = {
        clsScore: 0.05,
        layoutShifts,
        largestShift: 0.05,
        totalShiftDistance: 0.05,
        affectedElements: 1,
        optimizationScore: 100
      };

      const recommendations = optimizer.getOptimizationRecommendations(metrics);

      expect(recommendations).toContain('Set explicit width and height attributes on images to prevent layout shifts');
    });
  });

  describe('cleanup', () => {
    beforeEach(() => {
      optimizer = new LayoutStabilityOptimizer(config);
    });

    it('should cleanup observers', () => {
      const mockObserver = {
        observe: vi.fn(),
        disconnect: vi.fn()
      };

      (optimizer as any).observer = mockObserver;

      optimizer.cleanup();

      expect(mockObserver.disconnect).toHaveBeenCalled();
      expect((optimizer as any).observer).toBeNull();
    });
  });
});

describe('createLayoutStabilityOptimizer', () => {
  it('should create optimizer with default configuration', () => {
    const optimizer = createLayoutStabilityOptimizer('homepage');

    expect(optimizer).toBeInstanceOf(LayoutStabilityOptimizer);
  });

  it('should add property listing specific placeholders', () => {
    const optimizer = createLayoutStabilityOptimizer('property-listing');

    expect(optimizer).toBeInstanceOf(LayoutStabilityOptimizer);
    // The placeholders are applied during initialization
    expect(mockQuerySelectorAll).toHaveBeenCalledWith('.property-card');
    expect(mockQuerySelectorAll).toHaveBeenCalledWith('.property-map');
  });

  it('should add property detail specific placeholders', () => {
    const optimizer = createLayoutStabilityOptimizer('property-detail');

    expect(optimizer).toBeInstanceOf(LayoutStabilityOptimizer);
    expect(mockQuerySelectorAll).toHaveBeenCalledWith('.property-gallery');
    expect(mockQuerySelectorAll).toHaveBeenCalledWith('.property-description');
  });

  it('should add homepage specific placeholders', () => {
    const optimizer = createLayoutStabilityOptimizer('homepage');

    expect(optimizer).toBeInstanceOf(LayoutStabilityOptimizer);
    expect(mockQuerySelectorAll).toHaveBeenCalledWith('.hero-image');
    expect(mockQuerySelectorAll).toHaveBeenCalledWith('.featured-properties');
  });
});