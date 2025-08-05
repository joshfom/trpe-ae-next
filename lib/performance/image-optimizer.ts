/**
 * Advanced Image Optimization System
 * Supports WebP, AVIF, and automatic format selection based on browser support
 */

export interface ImageFormat {
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  quality: number;
  mimeType: string;
  extension: string;
}

export interface OptimizedImage {
  src: string;
  format: ImageFormat;
  width: number;
  height: number;
  size: number;
  placeholder?: string;
}

export interface ImageOptimizationConfig {
  formats: ImageFormat[];
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  generatePlaceholder: boolean;
  contentType?: 'photo' | 'graphic' | 'screenshot';
}

export interface BrowserSupport {
  webp: boolean;
  avif: boolean;
}

/**
 * Image Optimizer class for next-generation format support
 */
export class ImageOptimizer {
  private static instance: ImageOptimizer;
  private browserSupport: BrowserSupport | null = null;

  private constructor() {}

  public static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }

  /**
   * Detect browser support for modern image formats
   */
  public async detectBrowserSupport(): Promise<BrowserSupport> {
    if (this.browserSupport) {
      return this.browserSupport;
    }

    const support: BrowserSupport = {
      webp: false,
      avif: false
    };

    // Check WebP support
    try {
      const webpCanvas = document.createElement('canvas');
      webpCanvas.width = 1;
      webpCanvas.height = 1;
      support.webp = webpCanvas.toDataURL('image/webp').indexOf('webp') > 0;
    } catch (error) {
      console.warn('WebP detection failed:', error);
    }

    // Check AVIF support
    try {
      const avifImage = new Image();
      support.avif = await new Promise((resolve) => {
        avifImage.onload = () => resolve(true);
        avifImage.onerror = () => resolve(false);
        avifImage.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      });
    } catch (error) {
      console.warn('AVIF detection failed:', error);
    }

    this.browserSupport = support;
    return support;
  }

  /**
   * Get optimal image format based on browser support and content type
   */
  public async getOptimalFormat(contentType: 'photo' | 'graphic' | 'screenshot' = 'photo'): Promise<ImageFormat> {
    const support = await this.detectBrowserSupport();

    // AVIF provides best compression for photos
    if (support.avif && contentType === 'photo') {
      return {
        format: 'avif',
        quality: 0.75,
        mimeType: 'image/avif',
        extension: 'avif'
      };
    }

    // WebP is good for all content types
    if (support.webp) {
      return {
        format: 'webp',
        quality: contentType === 'photo' ? 0.8 : 0.85,
        mimeType: 'image/webp',
        extension: 'webp'
      };
    }

    // Fallback to JPEG for photos, PNG for graphics
    if (contentType === 'photo' || contentType === 'screenshot') {
      return {
        format: 'jpeg',
        quality: 0.85,
        mimeType: 'image/jpeg',
        extension: 'jpg'
      };
    }

    return {
      format: 'png',
      quality: 1.0,
      mimeType: 'image/png',
      extension: 'png'
    };
  }

  /**
   * Generate multiple format versions of an image
   */
  public async generateFormats(
    file: File,
    config: ImageOptimizationConfig
  ): Promise<OptimizedImage[]> {
    const optimizedImages: OptimizedImage[] = [];

    for (const format of config.formats) {
      try {
        const optimizedImage = await this.convertToFormat(file, format, config);
        optimizedImages.push(optimizedImage);
      } catch (error) {
        console.error(`Failed to convert to ${format.format}:`, error);
      }
    }

    return optimizedImages;
  }

  /**
   * Convert image to specific format
   */
  private async convertToFormat(
    file: File,
    format: ImageFormat,
    config: ImageOptimizationConfig
  ): Promise<OptimizedImage> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate optimized dimensions
          if (config.maxWidth || config.maxHeight) {
            const aspectRatio = width / height;

            if (config.maxWidth && width > config.maxWidth) {
              width = config.maxWidth;
              height = width / aspectRatio;
            }

            if (config.maxHeight && height > config.maxHeight) {
              height = config.maxHeight;
              width = height * aspectRatio;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Apply content-specific optimizations
          if (ctx) {
            this.applyContentOptimizations(ctx, config.contentType);
            ctx.drawImage(img, 0, 0, width, height);
          }

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedImage: OptimizedImage = {
                  src: URL.createObjectURL(blob),
                  format,
                  width,
                  height,
                  size: blob.size
                };

                // Generate placeholder if requested
                if (config.generatePlaceholder) {
                  optimizedImage.placeholder = this.generatePlaceholder(canvas);
                }

                resolve(optimizedImage);
              } else {
                reject(new Error(`Failed to convert to ${format.format}`));
              }
            },
            format.mimeType,
            format.quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Apply content-specific optimizations to canvas context
   */
  private applyContentOptimizations(
    ctx: CanvasRenderingContext2D,
    contentType?: 'photo' | 'graphic' | 'screenshot'
  ): void {
    switch (contentType) {
      case 'graphic':
        // Disable smoothing for graphics to maintain sharp edges
        ctx.imageSmoothingEnabled = false;
        break;
      case 'screenshot':
        // Use high-quality smoothing for screenshots
        ctx.imageSmoothingQuality = 'high';
        break;
      case 'photo':
      default:
        // Default smoothing for photos
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        break;
    }
  }

  /**
   * Generate low-quality placeholder for smooth loading
   */
  private generatePlaceholder(canvas: HTMLCanvasElement): string {
    const placeholderCanvas = document.createElement('canvas');
    const placeholderCtx = placeholderCanvas.getContext('2d');

    // Create small placeholder (10x10 pixels)
    placeholderCanvas.width = 10;
    placeholderCanvas.height = 10;

    if (placeholderCtx) {
      placeholderCtx.drawImage(canvas, 0, 0, 10, 10);
      return placeholderCanvas.toDataURL('image/jpeg', 0.1);
    }

    return '';
  }

  /**
   * Get quality settings based on content type and file size
   */
  public getQualitySettings(
    fileSize: number,
    contentType: 'photo' | 'graphic' | 'screenshot' = 'photo'
  ): number {
    const fileSizeMB = fileSize / (1024 * 1024);

    switch (contentType) {
      case 'photo':
        if (fileSizeMB > 5) return 0.7;
        if (fileSizeMB > 2) return 0.75;
        return 0.8;

      case 'graphic':
        if (fileSizeMB > 3) return 0.85;
        if (fileSizeMB > 1) return 0.9;
        return 0.95;

      case 'screenshot':
        if (fileSizeMB > 4) return 0.75;
        if (fileSizeMB > 2) return 0.8;
        return 0.85;

      default:
        return 0.8;
    }
  }

  /**
   * Get recommended formats based on content type and browser support
   */
  public async getRecommendedFormats(
    contentType: 'photo' | 'graphic' | 'screenshot' = 'photo'
  ): Promise<ImageFormat[]> {
    const support = await this.detectBrowserSupport();
    const formats: ImageFormat[] = [];

    // Add AVIF if supported (best compression)
    if (support.avif) {
      formats.push({
        format: 'avif',
        quality: this.getQualityForFormat('avif', contentType),
        mimeType: 'image/avif',
        extension: 'avif'
      });
    }

    // Add WebP if supported
    if (support.webp) {
      formats.push({
        format: 'webp',
        quality: this.getQualityForFormat('webp', contentType),
        mimeType: 'image/webp',
        extension: 'webp'
      });
    }

    // Add fallback format
    const fallbackFormat = contentType === 'graphic' ? 'png' : 'jpeg';
    formats.push({
      format: fallbackFormat,
      quality: this.getQualityForFormat(fallbackFormat, contentType),
      mimeType: `image/${fallbackFormat}`,
      extension: fallbackFormat === 'jpeg' ? 'jpg' : fallbackFormat
    });

    return formats;
  }

  /**
   * Get quality setting for specific format and content type
   */
  private getQualityForFormat(
    format: 'webp' | 'avif' | 'jpeg' | 'png',
    contentType: 'photo' | 'graphic' | 'screenshot'
  ): number {
    const qualityMap = {
      avif: {
        photo: 0.75,
        graphic: 0.8,
        screenshot: 0.75
      },
      webp: {
        photo: 0.8,
        graphic: 0.85,
        screenshot: 0.8
      },
      jpeg: {
        photo: 0.85,
        graphic: 0.9,
        screenshot: 0.85
      },
      png: {
        photo: 1.0,
        graphic: 1.0,
        screenshot: 1.0
      }
    };

    return qualityMap[format][contentType];
  }
}

/**
 * Utility functions for image optimization
 */

/**
 * Create optimized image configuration
 */
export function createImageConfig(
  contentType: 'photo' | 'graphic' | 'screenshot' = 'photo',
  maxWidth?: number,
  maxHeight?: number
): ImageOptimizationConfig {
  return {
    formats: [], // Will be populated by getRecommendedFormats
    quality: 0.8,
    maxWidth,
    maxHeight,
    generatePlaceholder: true,
    contentType
  };
}

/**
 * Get file extension from format
 */
export function getFileExtension(format: ImageFormat): string {
  return format.extension;
}

/**
 * Check if format is supported by browser
 */
export function isFormatSupported(format: string): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  try {
    return canvas.toDataURL(`image/${format}`).indexOf(format) > 0;
  } catch {
    return false;
  }
}