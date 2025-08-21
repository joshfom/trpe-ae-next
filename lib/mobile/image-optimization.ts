/**
 * Mobile-first image optimization utilities
 * Implements progressive loading, responsive images, and modern formats
 */

export interface MobileImageOptimizationConfig {
  priority: boolean;
  sizes: string;
  quality: number;
  format: 'webp' | 'avif' | 'auto';
  placeholder: 'blur' | 'empty';
  blurDataURL?: string;
  loading: 'lazy' | 'eager';
  aspectRatio?: string;
}

export const generateMobileImageSizes = (type: 'property-card' | 'property-hero' | 'property-gallery' | 'thumbnail'): string => {
  const sizeMap = {
    'property-card': '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
    'property-hero': '(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw',
    'property-gallery': '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    'thumbnail': '(max-width: 640px) 20vw, (max-width: 1024px) 15vw, 10vw'
  };
  
  return sizeMap[type];
};

export const getOptimalImageConfig = (
  type: 'property-card' | 'property-hero' | 'property-gallery' | 'thumbnail',
  priority: boolean = false
): MobileImageOptimizationConfig => {
  const baseConfig: MobileImageOptimizationConfig = {
    priority,
    sizes: generateMobileImageSizes(type),
    quality: 85,
    format: 'webp',
    placeholder: 'blur',
    loading: priority ? 'eager' : 'lazy',
    blurDataURL: generateBlurDataURL()
  };

  // Type-specific optimizations
  switch (type) {
    case 'property-hero':
      return {
        ...baseConfig,
        quality: 90,
        format: 'avif',
        aspectRatio: '16/9'
      };
    
    case 'property-card':
      return {
        ...baseConfig,
        quality: 80,
        aspectRatio: '4/3'
      };
    
    case 'property-gallery':
      return {
        ...baseConfig,
        quality: 85,
        aspectRatio: '4/3'
      };
    
    case 'thumbnail':
      return {
        ...baseConfig,
        quality: 70,
        aspectRatio: '1/1'
      };
    
    default:
      return baseConfig;
  }
};

export const generateBlurDataURL = (): string => {
  return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";
};

export interface LazyLoadingConfig {
  rootMargin: string;
  threshold: number;
  enableIntersectionObserver: boolean;
}

export const getMobileIntersectionConfig = (): LazyLoadingConfig => ({
  rootMargin: '50px 0px',
  threshold: 0.1,
  enableIntersectionObserver: true
});

/**
 * Core Web Vitals optimization for mobile images
 */
export const preloadCriticalImages = (imageUrls: string[], priority: number = 3) => {
  if (typeof window === 'undefined') return;
  
  imageUrls.slice(0, priority).forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.type = 'image/webp';
    document.head.appendChild(link);
  });
};

/**
 * Mobile-optimized image srcSet generation
 */
export const generateSrcSet = (baseUrl: string, widths: number[] = [320, 640, 768, 1024, 1280]): string => {
  return widths
    .map(width => `${baseUrl}?w=${width}&q=80&f=webp ${width}w`)
    .join(', ');
};

/**
 * Viewport-based image loading strategy
 */
export const shouldLoadImage = (elementTop: number, viewportHeight: number, buffer: number = 200): boolean => {
  return elementTop <= viewportHeight + buffer;
};

/**
 * Mobile performance monitoring
 */
export const measureImageLoadTime = (imageUrl: string, callback?: (loadTime: number) => void) => {
  if (typeof window === 'undefined') return;
  
  const startTime = performance.now();
  const img = new Image();
  
  img.onload = () => {
    const loadTime = performance.now() - startTime;
    console.log(`Image loaded in ${loadTime.toFixed(2)}ms: ${imageUrl}`);
    callback?.(loadTime);
  };
  
  img.onerror = () => {
    console.error(`Failed to load image: ${imageUrl}`);
  };
  
  img.src = imageUrl;
};
