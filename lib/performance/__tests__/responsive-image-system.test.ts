/**
 * @jest-environment jsdom
 */

import {
  ResponsiveImageGenerator,
  LazyLoadManager,
  createResponsiveConfig,
  generateImageAttributes,
  getOptimalBreakpoints,
  isLazyLoadingSupported
} from '../responsive-image-system';

// Mock DOM APIs
const mockCanvas = {
  width: 0,
  height: 0,
  getContext: jest.fn(() => ({
    drawImage: jest.fn(),
    getImageData: jest.fn(() => ({
      data: [255, 128, 64, 255] // Mock RGBA values
    })),
    filter: ''
  })),
  toDataURL: jest.fn(() => 'data:image/jpeg;base64,mock-data')
};

const mockImage = {
  onload: null as any,
  onerror: null as any,
  src: '',
  width: 800,
  height: 600
};

Object.defineProperty(global, 'document', {
  value: {
    createElement: jest.fn((tagName: string) => {
      if (tagName === 'canvas') return mockCanvas;
      if (tagName === 'img') return mockImage;
      return {};
    }),
    querySelectorAll: jest.fn(() => [])
  }
});

Object.defineProperty(global, 'Image', {
  value: jest.fn(() => mockImage)
});

Object.defineProperty(global, 'IntersectionObserver', {
  value: jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
});

Object.defineProperty(global, 'requestAnimationFrame', {
  value: jest.fn((callback: Function) => setTimeout(callback, 0))
});

Object.defineProperty(global, 'btoa', {
  value: jest.fn((str: string) => Buffer.from(str).toString('base64'))
});

Object.defineProperty(global, 'window', {
  value: {
    IntersectionObserver: global.IntersectionObserver
  }
});

// Mock HTMLImageElement
class MockHTMLImageElement {
  loading = 'lazy';
  constructor() {
    return mockImage;
  }
}

Object.defineProperty(global, 'HTMLImageElement', {
  value: MockHTMLImageElement,
  configurable: true
});

describe('ResponsiveImageGenerator', () => {
  let generator: ResponsiveImageGenerator;

  beforeEach(() => {
    generator = ResponsiveImageGenerator.getInstance();
    jest.clearAllMocks();
  });

  describe('Responsive Image Set Generation', () => {
    it('should generate responsive image set with srcset', async () => {
      // Mock successful image load
      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload();
        }
      }, 0);

      const breakpoints = [
        { width: 320, quality: 0.75 },
        { width: 640, quality: 0.8 },
        { width: 1024, quality: 0.85 }
      ];

      const responsiveSet = await generator.generateResponsiveImageSet(
        'test-image.jpg',
        breakpoints,
        true
      );

      expect(responsiveSet.src).toBe('test-image.jpg');
      expect(responsiveSet.srcset).toContain('320w');
      expect(responsiveSet.srcset).toContain('640w');
      expect(responsiveSet.srcset).toContain('1024w');
      expect(responsiveSet.sizes).toBeTruthy();
      expect(responsiveSet.placeholder).toBeTruthy();
      expect(responsiveSet.aspectRatio).toBe(800 / 600);
    });

    it('should generate sizes attribute correctly', async () => {
      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload();
        }
      }, 0);

      const breakpoints = [
        { width: 320, quality: 0.75 },
        { width: 768, quality: 0.8 },
        { width: 1024, quality: 0.85 }
      ];

      const responsiveSet = await generator.generateResponsiveImageSet(
        'test-image.jpg',
        breakpoints,
        false
      );

      expect(responsiveSet.sizes).toContain('(max-width: 768px) 320px');
      expect(responsiveSet.sizes).toContain('(max-width: 1024px) 768px');
      expect(responsiveSet.sizes).toContain('1024px');
    });

    it('should handle image loading errors', async () => {
      setTimeout(() => {
        if (mockImage.onerror) {
          mockImage.onerror();
        }
      }, 0);

      await expect(
        generator.generateResponsiveImageSet('invalid-image.jpg', [], true)
      ).rejects.toThrow('Failed to load image: invalid-image.jpg');
    });

    it('should generate placeholder when requested', async () => {
      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload();
        }
      }, 0);

      const responsiveSet = await generator.generateResponsiveImageSet(
        'test-image.jpg',
        [{ width: 320, quality: 0.8 }],
        true
      );

      expect(responsiveSet.placeholder).toBeTruthy();
      expect(responsiveSet.placeholder).toContain('data:image/jpeg');
    });

    it('should not generate placeholder when not requested', async () => {
      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload();
        }
      }, 0);

      const responsiveSet = await generator.generateResponsiveImageSet(
        'test-image.jpg',
        [{ width: 320, quality: 0.8 }],
        false
      );

      expect(responsiveSet.placeholder).toBe('');
    });
  });

  describe('Placeholder Generation', () => {
    it('should generate color placeholder', async () => {
      const placeholder = await generator.generateColorPlaceholder(mockImage as HTMLImageElement);

      expect(placeholder.type).toBe('color');
      expect(placeholder.data).toContain('rgb(');
      expect(placeholder.width).toBe(800);
      expect(placeholder.height).toBe(600);
    });

    it('should generate skeleton placeholder', () => {
      const placeholder = generator.generateSkeletonPlaceholder(400, 300);

      expect(placeholder.type).toBe('skeleton');
      expect(placeholder.data).toContain('data:image/svg+xml');
      expect(placeholder.width).toBe(400);
      expect(placeholder.height).toBe(300);
    });
  });
});

describe('LazyLoadManager', () => {
  let manager: LazyLoadManager;
  let mockObserver: any;

  beforeEach(() => {
    manager = LazyLoadManager.getInstance();
    mockObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    };
    (global.IntersectionObserver as jest.Mock).mockImplementation(() => mockObserver);
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default config', () => {
      manager.initialize();
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );
    });

    it('should initialize with custom config', () => {
      manager.initialize({
        rootMargin: '100px',
        threshold: 0.2,
        fadeInDuration: 500
      });

      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          rootMargin: '100px',
          threshold: 0.2
        }
      );
    });
  });

  describe('Image Observation', () => {
    it('should observe image for lazy loading', () => {
      const mockImg = document.createElement('img') as HTMLImageElement;
      manager.initialize();
      manager.observe(mockImg);

      expect(mockObserver.observe).toHaveBeenCalledWith(mockImg);
    });

    it('should unobserve image', () => {
      const mockImg = document.createElement('img') as HTMLImageElement;
      manager.initialize();
      manager.unobserve(mockImg);

      expect(mockObserver.unobserve).toHaveBeenCalledWith(mockImg);
    });

    it('should disconnect observer', () => {
      manager.initialize();
      manager.disconnect();

      expect(mockObserver.disconnect).toHaveBeenCalled();
    });
  });

  describe('Statistics', () => {
    it('should return loading statistics', () => {
      const mockImages = [
        { dataset: { src: 'image1.jpg' } },
        { dataset: { srcset: 'image2.jpg 1x' } }
      ];
      const mockLoaded = [{ classList: { contains: () => true } }];
      const mockErrors = [];

      (document.querySelectorAll as jest.Mock)
        .mockReturnValueOnce(mockImages)
        .mockReturnValueOnce(mockLoaded)
        .mockReturnValueOnce(mockErrors);

      const stats = manager.getStats();

      expect(stats.observed).toBe(2);
      expect(stats.loaded).toBe(1);
      expect(stats.errors).toBe(0);
    });
  });
});

describe('Utility Functions', () => {
  describe('createResponsiveConfig', () => {
    it('should create default configuration', () => {
      const config = createResponsiveConfig();

      expect(config.breakpoints).toHaveLength(6);
      expect(config.lazyLoad.rootMargin).toBe('50px');
      expect(config.lazyLoad.threshold).toBe(0.1);
    });

    it('should merge custom configuration', () => {
      const customBreakpoints = [{ width: 500, quality: 0.9 }];
      const customLazyLoad = { rootMargin: '100px', threshold: 0.2 };

      const config = createResponsiveConfig(customBreakpoints, customLazyLoad);

      expect(config.breakpoints).toEqual(customBreakpoints);
      expect(config.lazyLoad.rootMargin).toBe('100px');
      expect(config.lazyLoad.threshold).toBe(0.2);
    });
  });

  describe('generateImageAttributes', () => {
    it('should generate correct image attributes', () => {
      const responsiveSet = {
        src: 'image.jpg',
        srcset: 'image-320.jpg 320w, image-640.jpg 640w',
        sizes: '(max-width: 640px) 320px, 640px',
        placeholder: 'data:image/jpeg;base64,placeholder',
        width: 800,
        height: 600,
        aspectRatio: 4/3
      };

      const attributes = generateImageAttributes(responsiveSet, 'Test image', 'custom-class');

      expect(attributes['data-src']).toBe('image.jpg');
      expect(attributes['data-srcset']).toBe('image-320.jpg 320w, image-640.jpg 640w');
      expect(attributes.sizes).toBe('(max-width: 640px) 320px, 640px');
      expect(attributes.alt).toBe('Test image');
      expect(attributes.class).toContain('lazy-image');
      expect(attributes.class).toContain('custom-class');
      expect(attributes.loading).toBe('lazy');
    });
  });

  describe('getOptimalBreakpoints', () => {
    it('should return hero breakpoints', () => {
      const breakpoints = getOptimalBreakpoints('hero');
      
      expect(breakpoints).toHaveLength(5);
      expect(breakpoints[0].width).toBe(768);
      expect(breakpoints[breakpoints.length - 1].width).toBe(2560);
    });

    it('should return gallery breakpoints', () => {
      const breakpoints = getOptimalBreakpoints('gallery');
      
      expect(breakpoints).toHaveLength(5);
      expect(breakpoints[0].width).toBe(320);
      expect(breakpoints[breakpoints.length - 1].width).toBe(1280);
    });

    it('should return thumbnail breakpoints', () => {
      const breakpoints = getOptimalBreakpoints('thumbnail');
      
      expect(breakpoints).toHaveLength(3);
      expect(breakpoints[0].width).toBe(150);
      expect(breakpoints[breakpoints.length - 1].width).toBe(450);
    });

    it('should return content breakpoints as default', () => {
      const breakpoints = getOptimalBreakpoints('content');
      const defaultBreakpoints = getOptimalBreakpoints();
      
      expect(breakpoints).toEqual(defaultBreakpoints);
    });
  });

  describe('isLazyLoadingSupported', () => {
    it('should detect lazy loading support', () => {
      // Mock HTMLImageElement with loading property in prototype
      const MockElement = class {};
      MockElement.prototype.loading = 'lazy';
      
      Object.defineProperty(global, 'HTMLImageElement', {
        value: MockElement,
        configurable: true
      });

      expect(isLazyLoadingSupported()).toBe(true);
    });

    it('should detect lack of lazy loading support', () => {
      // Mock HTMLImageElement without loading property in prototype
      const MockElement = class {};
      
      Object.defineProperty(global, 'HTMLImageElement', {
        value: MockElement,
        configurable: true
      });

      expect(isLazyLoadingSupported()).toBe(false);
    });
  });
});