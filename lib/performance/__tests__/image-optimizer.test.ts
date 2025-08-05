/**
 * @jest-environment jsdom
 */

import { ImageOptimizer, createImageConfig, getFileExtension, isFormatSupported } from '../image-optimizer';

// Mock canvas and image APIs
const mockCanvas = {
  width: 0,
  height: 0,
  getContext: jest.fn(() => ({
    drawImage: jest.fn(),
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'medium'
  })),
  toDataURL: jest.fn(),
  toBlob: jest.fn()
};

const mockImage = {
  onload: null as any,
  onerror: null as any,
  src: '',
  width: 800,
  height: 600
};

// Mock DOM APIs
Object.defineProperty(global, 'document', {
  value: {
    createElement: jest.fn((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas;
      }
      if (tagName === 'img') {
        return mockImage;
      }
      return {};
    })
  }
});

Object.defineProperty(global, 'Image', {
  value: jest.fn(() => mockImage)
});

Object.defineProperty(global, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'blob:mock-url'),
    revokeObjectURL: jest.fn()
  }
});

describe('ImageOptimizer', () => {
  let optimizer: ImageOptimizer;

  beforeEach(() => {
    optimizer = ImageOptimizer.getInstance();
    // Reset browser support cache
    (optimizer as any).browserSupport = null;
    jest.clearAllMocks();
    
    // Reset canvas mock
    mockCanvas.toDataURL.mockReturnValue('data:image/jpeg;base64,mock-data');
    mockCanvas.toBlob.mockImplementation((callback, type, quality) => {
      const mockBlob = new Blob(['mock-image-data'], { type });
      setTimeout(() => callback(mockBlob), 0);
    });
  });

  describe('Browser Support Detection', () => {
    it('should detect WebP support correctly', async () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/webp;base64,mock-webp-data');
      
      // Mock Image constructor to immediately call onload
      const mockImageInstance = { ...mockImage };
      (global.Image as jest.Mock).mockImplementation(() => {
        setTimeout(() => {
          if (mockImageInstance.onload) {
            mockImageInstance.onload();
          }
        }, 0);
        return mockImageInstance;
      });
      
      const support = await optimizer.detectBrowserSupport();
      
      expect(support.webp).toBe(true);
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/webp');
    });

    it('should detect lack of WebP support', async () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/png;base64,mock-png-data');
      
      // Mock Image constructor to immediately call onload
      const mockImageInstance = { ...mockImage };
      (global.Image as jest.Mock).mockImplementation(() => {
        setTimeout(() => {
          if (mockImageInstance.onload) {
            mockImageInstance.onload();
          }
        }, 0);
        return mockImageInstance;
      });
      
      const support = await optimizer.detectBrowserSupport();
      
      expect(support.webp).toBe(false);
    });

    it('should handle WebP detection errors gracefully', async () => {
      mockCanvas.toDataURL.mockImplementation(() => {
        throw new Error('Canvas error');
      });
      
      // Mock Image constructor to immediately call onload
      const mockImageInstance = { ...mockImage };
      (global.Image as jest.Mock).mockImplementation(() => {
        setTimeout(() => {
          if (mockImageInstance.onload) {
            mockImageInstance.onload();
          }
        }, 0);
        return mockImageInstance;
      });
      
      const support = await optimizer.detectBrowserSupport();
      
      expect(support.webp).toBe(false);
    });

    it('should detect AVIF support correctly', async () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/webp;base64,mock-webp-data');
      
      // Mock Image constructor to immediately call onload for AVIF
      const mockImageInstance = { ...mockImage };
      (global.Image as jest.Mock).mockImplementation(() => {
        setTimeout(() => {
          if (mockImageInstance.onload) {
            mockImageInstance.onload();
          }
        }, 0);
        return mockImageInstance;
      });
      
      const support = await optimizer.detectBrowserSupport();
      
      expect(support.avif).toBe(true);
    });

    it('should detect lack of AVIF support', async () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/webp;base64,mock-webp-data');
      
      // Mock Image constructor to immediately call onerror for AVIF
      const mockImageInstance = { ...mockImage };
      (global.Image as jest.Mock).mockImplementation(() => {
        setTimeout(() => {
          if (mockImageInstance.onerror) {
            mockImageInstance.onerror();
          }
        }, 0);
        return mockImageInstance;
      });
      
      const support = await optimizer.detectBrowserSupport();
      
      expect(support.avif).toBe(false);
    });
  });

  describe('Optimal Format Selection', () => {
    it('should prefer AVIF for photos when supported', async () => {
      // Mock AVIF support
      jest.spyOn(optimizer, 'detectBrowserSupport').mockResolvedValue({
        webp: true,
        avif: true
      });
      
      const format = await optimizer.getOptimalFormat('photo');
      
      expect(format.format).toBe('avif');
      expect(format.mimeType).toBe('image/avif');
      expect(format.quality).toBe(0.75);
    });

    it('should use WebP for graphics when AVIF not supported', async () => {
      jest.spyOn(optimizer, 'detectBrowserSupport').mockResolvedValue({
        webp: true,
        avif: false
      });
      
      const format = await optimizer.getOptimalFormat('graphic');
      
      expect(format.format).toBe('webp');
      expect(format.mimeType).toBe('image/webp');
      expect(format.quality).toBe(0.85);
    });

    it('should fallback to JPEG for photos when modern formats not supported', async () => {
      jest.spyOn(optimizer, 'detectBrowserSupport').mockResolvedValue({
        webp: false,
        avif: false
      });
      
      const format = await optimizer.getOptimalFormat('photo');
      
      expect(format.format).toBe('jpeg');
      expect(format.mimeType).toBe('image/jpeg');
      expect(format.quality).toBe(0.85);
    });

    it('should fallback to PNG for graphics when modern formats not supported', async () => {
      jest.spyOn(optimizer, 'detectBrowserSupport').mockResolvedValue({
        webp: false,
        avif: false
      });
      
      const format = await optimizer.getOptimalFormat('graphic');
      
      expect(format.format).toBe('png');
      expect(format.mimeType).toBe('image/png');
      expect(format.quality).toBe(1.0);
    });
  });

  describe('Quality Settings', () => {
    it('should adjust quality based on file size for photos', () => {
      const largeFileSize = 6 * 1024 * 1024; // 6MB
      const mediumFileSize = 3 * 1024 * 1024; // 3MB
      const smallFileSize = 1 * 1024 * 1024; // 1MB
      
      expect(optimizer.getQualitySettings(largeFileSize, 'photo')).toBe(0.7);
      expect(optimizer.getQualitySettings(mediumFileSize, 'photo')).toBe(0.75);
      expect(optimizer.getQualitySettings(smallFileSize, 'photo')).toBe(0.8);
    });

    it('should use higher quality for graphics', () => {
      const largeFileSize = 4 * 1024 * 1024; // 4MB
      const mediumFileSize = 2 * 1024 * 1024; // 2MB
      const smallFileSize = 0.5 * 1024 * 1024; // 0.5MB
      
      expect(optimizer.getQualitySettings(largeFileSize, 'graphic')).toBe(0.85);
      expect(optimizer.getQualitySettings(mediumFileSize, 'graphic')).toBe(0.9);
      expect(optimizer.getQualitySettings(smallFileSize, 'graphic')).toBe(0.95);
    });

    it('should use appropriate quality for screenshots', () => {
      const largeFileSize = 5 * 1024 * 1024; // 5MB
      const mediumFileSize = 3 * 1024 * 1024; // 3MB
      const smallFileSize = 1 * 1024 * 1024; // 1MB
      
      expect(optimizer.getQualitySettings(largeFileSize, 'screenshot')).toBe(0.75);
      expect(optimizer.getQualitySettings(mediumFileSize, 'screenshot')).toBe(0.8);
      expect(optimizer.getQualitySettings(smallFileSize, 'screenshot')).toBe(0.85);
    });
  });

  describe('Recommended Formats', () => {
    it('should recommend AVIF and WebP when both supported', async () => {
      jest.spyOn(optimizer, 'detectBrowserSupport').mockResolvedValue({
        webp: true,
        avif: true
      });
      
      const formats = await optimizer.getRecommendedFormats('photo');
      
      expect(formats).toHaveLength(3);
      expect(formats[0].format).toBe('avif');
      expect(formats[1].format).toBe('webp');
      expect(formats[2].format).toBe('jpeg');
    });

    it('should recommend WebP and fallback when AVIF not supported', async () => {
      jest.spyOn(optimizer, 'detectBrowserSupport').mockResolvedValue({
        webp: true,
        avif: false
      });
      
      const formats = await optimizer.getRecommendedFormats('graphic');
      
      expect(formats).toHaveLength(2);
      expect(formats[0].format).toBe('webp');
      expect(formats[1].format).toBe('png');
    });

    it('should recommend only fallback when modern formats not supported', async () => {
      jest.spyOn(optimizer, 'detectBrowserSupport').mockResolvedValue({
        webp: false,
        avif: false
      });
      
      const formats = await optimizer.getRecommendedFormats('photo');
      
      expect(formats).toHaveLength(1);
      expect(formats[0].format).toBe('jpeg');
    });
  });

  describe('Format Generation', () => {
    it('should generate multiple format versions', async () => {
      const mockFile = new File(['mock-image'], 'test.jpg', { type: 'image/jpeg' });
      const config = createImageConfig('photo', 1920, 1080);
      config.formats = [
        { format: 'webp', quality: 0.8, mimeType: 'image/webp', extension: 'webp' },
        { format: 'jpeg', quality: 0.85, mimeType: 'image/jpeg', extension: 'jpg' }
      ];

      // Mock Image constructor for format conversion
      const mockImageInstance = { ...mockImage };
      (global.Image as jest.Mock).mockImplementation(() => {
        setTimeout(() => {
          if (mockImageInstance.onload) {
            mockImageInstance.onload();
          }
        }, 0);
        return mockImageInstance;
      });

      const optimizedImages = await optimizer.generateFormats(mockFile, config);

      expect(optimizedImages).toHaveLength(2);
      expect(optimizedImages[0].format.format).toBe('webp');
      expect(optimizedImages[1].format.format).toBe('jpeg');
    });

    it('should handle format conversion errors gracefully', async () => {
      const mockFile = new File(['mock-image'], 'test.jpg', { type: 'image/jpeg' });
      const config = createImageConfig('photo');
      config.formats = [
        { format: 'webp', quality: 0.8, mimeType: 'image/webp', extension: 'webp' }
      ];

      // Mock canvas toBlob failure
      mockCanvas.toBlob.mockImplementation((callback) => {
        setTimeout(() => callback(null), 0);
      });

      // Mock Image constructor
      const mockImageInstance = { ...mockImage };
      (global.Image as jest.Mock).mockImplementation(() => {
        setTimeout(() => {
          if (mockImageInstance.onload) {
            mockImageInstance.onload();
          }
        }, 0);
        return mockImageInstance;
      });

      const optimizedImages = await optimizer.generateFormats(mockFile, config);

      expect(optimizedImages).toHaveLength(0);
    });
  });
});

describe('Utility Functions', () => {
  describe('createImageConfig', () => {
    it('should create default config for photos', () => {
      const config = createImageConfig('photo', 1920, 1080);
      
      expect(config.contentType).toBe('photo');
      expect(config.maxWidth).toBe(1920);
      expect(config.maxHeight).toBe(1080);
      expect(config.generatePlaceholder).toBe(true);
      expect(config.quality).toBe(0.8);
    });

    it('should create config without dimensions', () => {
      const config = createImageConfig('graphic');
      
      expect(config.contentType).toBe('graphic');
      expect(config.maxWidth).toBeUndefined();
      expect(config.maxHeight).toBeUndefined();
    });
  });

  describe('getFileExtension', () => {
    it('should return correct extension for format', () => {
      const webpFormat = { format: 'webp' as const, quality: 0.8, mimeType: 'image/webp', extension: 'webp' };
      const jpegFormat = { format: 'jpeg' as const, quality: 0.85, mimeType: 'image/jpeg', extension: 'jpg' };
      
      expect(getFileExtension(webpFormat)).toBe('webp');
      expect(getFileExtension(jpegFormat)).toBe('jpg');
    });
  });

  describe('isFormatSupported', () => {
    it('should detect format support', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/webp;base64,mock-data');
      
      expect(isFormatSupported('webp')).toBe(true);
    });

    it('should detect lack of format support', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/png;base64,mock-data');
      
      expect(isFormatSupported('avif')).toBe(false);
    });

    it('should handle errors gracefully', () => {
      mockCanvas.toDataURL.mockImplementation(() => {
        throw new Error('Canvas error');
      });
      
      expect(isFormatSupported('webp')).toBe(false);
    });
  });
});