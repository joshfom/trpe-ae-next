'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  ResponsiveImageGenerator, 
  LazyLoadManager, 
  ResponsiveImageSet,
  ResponsiveImageBreakpoint,
  LazyLoadConfig,
  createResponsiveConfig,
  generateImageAttributes,
  getOptimalBreakpoints,
  isLazyLoadingSupported
} from '@/lib/performance/responsive-image-system';

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  contentType?: 'hero' | 'gallery' | 'thumbnail' | 'content';
  breakpoints?: ResponsiveImageBreakpoint[];
  lazyLoadConfig?: Partial<LazyLoadConfig>;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  placeholder?: 'blur' | 'color' | 'skeleton' | 'none';
  quality?: number;
  formats?: ('webp' | 'avif' | 'jpeg' | 'png')[];
}

/**
 * ResponsiveImage component with lazy loading and modern format support
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  contentType = 'content',
  breakpoints,
  lazyLoadConfig,
  onLoad,
  onError,
  placeholder = 'blur',
  quality = 0.8,
  formats = ['webp', 'jpeg']
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [responsiveSet, setResponsiveSet] = useState<ResponsiveImageSet | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(priority);

  // Initialize responsive image generator and lazy load manager
  const imageGenerator = ResponsiveImageGenerator.getInstance();
  const lazyLoadManager = LazyLoadManager.getInstance();

  useEffect(() => {
    // Initialize lazy loading if not priority
    if (!priority) {
      const config = createResponsiveConfig(
        breakpoints || getOptimalBreakpoints(contentType),
        lazyLoadConfig
      );
      lazyLoadManager.initialize(config.lazyLoad);
    }

    // Generate responsive image set
    const generateResponsiveSet = async () => {
      try {
        const optimalBreakpoints = breakpoints || getOptimalBreakpoints(contentType);
        const imageSet = await imageGenerator.generateResponsiveImageSet(
          src,
          optimalBreakpoints,
          placeholder !== 'none'
        );
        setResponsiveSet(imageSet);
      } catch (error) {
        console.error('Failed to generate responsive image set:', error);
        setHasError(true);
        onError?.(error as Error);
      }
    };

    generateResponsiveSet();
  }, [src, breakpoints, contentType, lazyLoadConfig, placeholder, priority, imageGenerator, lazyLoadManager, onError]);

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement || priority || !responsiveSet) return;

    // Set up intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: lazyLoadConfig?.rootMargin || '50px',
        threshold: lazyLoadConfig?.threshold || 0.1
      }
    );

    observer.observe(imgElement);

    return () => {
      observer.disconnect();
    };
  }, [responsiveSet, priority, lazyLoadConfig]);

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement || !isIntersecting || !responsiveSet) return;

    // Load the image when intersecting
    const loadImage = async () => {
      try {
        // Use native lazy loading if supported and not priority
        if (!priority && isLazyLoadingSupported()) {
          imgElement.loading = 'lazy';
        }

        // Set up load handlers
        const handleLoad = () => {
          setIsLoaded(true);
          onLoad?.();
        };

        const handleError = () => {
          setHasError(true);
          onError?.(new Error(`Failed to load image: ${src}`));
        };

        imgElement.addEventListener('load', handleLoad);
        imgElement.addEventListener('error', handleError);

        // Set image sources
        imgElement.src = responsiveSet.src;
        imgElement.srcset = responsiveSet.srcset;

        return () => {
          imgElement.removeEventListener('load', handleLoad);
          imgElement.removeEventListener('error', handleError);
        };
      } catch (error) {
        setHasError(true);
        onError?.(error as Error);
      }
    };

    loadImage();
  }, [isIntersecting, responsiveSet, src, priority, onLoad, onError]);

  // Generate placeholder styles
  const getPlaceholderStyles = (): React.CSSProperties => {
    if (!responsiveSet || placeholder === 'none') return {};

    const baseStyles: React.CSSProperties = {
      aspectRatio: responsiveSet.aspectRatio,
      width: width || '100%',
      height: height || 'auto'
    };

    if (placeholder === 'blur' && responsiveSet.placeholder) {
      return {
        ...baseStyles,
        backgroundImage: `url(${responsiveSet.placeholder})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(10px)',
        transition: 'filter 0.3s ease-in-out'
      };
    }

    if (placeholder === 'skeleton') {
      return {
        ...baseStyles,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite'
      };
    }

    if (placeholder === 'color') {
      return {
        ...baseStyles,
        backgroundColor: '#f0f0f0'
      };
    }

    return baseStyles;
  };

  // Generate image styles
  const getImageStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      width: width || '100%',
      height: height || 'auto',
      aspectRatio: responsiveSet?.aspectRatio,
      transition: 'opacity 0.3s ease-in-out',
      opacity: isLoaded ? 1 : 0
    };

    if (placeholder === 'blur' && !isLoaded) {
      baseStyles.filter = 'blur(10px)';
    }

    return baseStyles;
  };

  if (hasError) {
    return (
      <div 
        className={`responsive-image-error ${className}`}
        style={{
          width: width || '100%',
          height: height || 'auto',
          aspectRatio: responsiveSet?.aspectRatio,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666'
        }}
      >
        Failed to load image
      </div>
    );
  }

  if (!responsiveSet) {
    return (
      <div 
        className={`responsive-image-loading ${className}`}
        style={getPlaceholderStyles()}
      />
    );
  }

  return (
    <div className={`responsive-image-container ${className}`}>
      {/* Placeholder */}
      {!isLoaded && placeholder !== 'none' && (
        <div 
          className="responsive-image-placeholder"
          style={getPlaceholderStyles()}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        alt={alt}
        sizes={responsiveSet.sizes}
        width={width || responsiveSet.width}
        height={height || responsiveSet.height}
        className={`responsive-image ${isLoaded ? 'loaded' : 'loading'}`}
        style={getImageStyles()}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />

      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .responsive-image-container {
          position: relative;
          overflow: hidden;
        }
        
        .responsive-image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .responsive-image {
          position: relative;
          z-index: 2;
          display: block;
          max-width: 100%;
          height: auto;
        }
        
        .responsive-image.loaded {
          opacity: 1;
        }
        
        .responsive-image.loading {
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

/**
 * Hook for managing responsive images
 */
export const useResponsiveImage = (
  src: string,
  contentType: 'hero' | 'gallery' | 'thumbnail' | 'content' = 'content',
  breakpoints?: ResponsiveImageBreakpoint[]
) => {
  const [responsiveSet, setResponsiveSet] = useState<ResponsiveImageSet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const generateSet = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const imageGenerator = ResponsiveImageGenerator.getInstance();
        const optimalBreakpoints = breakpoints || getOptimalBreakpoints(contentType);
        
        const imageSet = await imageGenerator.generateResponsiveImageSet(
          src,
          optimalBreakpoints,
          true
        );
        
        setResponsiveSet(imageSet);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    generateSet();
  }, [src, contentType, breakpoints]);

  return { responsiveSet, isLoading, error };
};

export default ResponsiveImage;