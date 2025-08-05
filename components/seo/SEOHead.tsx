import React from 'react';
import { Metadata } from 'next';
import { StructuredDataScript, StructuredDataScripts } from './StructuredDataScript';
import { StructuredDataSchema } from '@/lib/seo/structured-data-generator';
import { HreflangConfig } from '@/lib/seo/hreflang-generator';

export interface SEOHeadProps {
  metadata: Metadata;
  structuredData?: StructuredDataSchema[];
  hreflangTags?: HreflangConfig[];
  preloadResources?: Array<{
    href: string;
    as: string;
    type?: string;
    crossorigin?: boolean;
  }>;
  prefetchUrls?: string[];
  customHead?: React.ReactNode;
  enableValidation?: boolean;
  fallbackMetadata?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

/**
 * Comprehensive SEO Head component that handles all metadata and structured data
 * This component should be used in layout files or page components
 */
export function SEOHead({ 
  metadata, 
  structuredData = [], 
  hreflangTags = [],
  preloadResources = [],
  prefetchUrls = [],
  customHead,
  enableValidation = false,
  fallbackMetadata
}: SEOHeadProps) {
  // Validate metadata and apply fallbacks
  const validatedMetadata = validateAndApplyFallbacks(metadata, fallbackMetadata);
  
  return (
    <>
      {/* Structured Data Scripts with optional validation */}
      {structuredData.length > 0 && (
        <StructuredDataScripts 
          schemas={structuredData} 
          validate={enableValidation}
        />
      )}
      
      {/* Hreflang Tags for Multi-language Support */}
      {hreflangTags.map((tag, index) => (
        <link
          key={`hreflang-${index}`}
          rel="alternate"
          hrefLang={tag.hreflang}
          href={tag.href}
        />
      ))}
      
      {/* Preload Critical Resources */}
      {preloadResources.map((resource, index) => (
        <link
          key={`preload-${index}`}
          rel="preload"
          href={resource.href}
          as={resource.as}
          type={resource.type}
          crossOrigin={resource.crossorigin ? 'anonymous' : undefined}
        />
      ))}
      
      {/* Prefetch Next Page Resources */}
      {prefetchUrls.map((url, index) => (
        <link key={`prefetch-${index}`} rel="prefetch" href={url} />
      ))}
      
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* Additional Performance Hints */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="TRPE Global" />
      
      {/* Theme Colors */}
      <meta name="theme-color" content="#1a365d" />
      <meta name="msapplication-TileColor" content="#1a365d" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Viewport Meta Tag for Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="TRPE Global" />
      <meta name="publisher" content="TRPE Global" />
      <meta name="copyright" content="TRPE Global" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Geo Location Tags for Dubai */}
      <meta name="geo.region" content="AE-DU" />
      <meta name="geo.placename" content="Dubai" />
      <meta name="geo.position" content="25.2048;55.2708" />
      <meta name="ICBM" content="25.2048, 55.2708" />
      
      {/* Custom Head Content */}
      {customHead}
    </>
  );
}

/**
 * Validate metadata and apply fallbacks where necessary
 */
function validateAndApplyFallbacks(
  metadata: Metadata, 
  fallbackMetadata?: { title?: string; description?: string; image?: string; }
): Metadata {
  const validated = { ...metadata };
  
  // Validate and fallback title
  if (!validated.title || (typeof validated.title === 'string' && validated.title.trim().length === 0)) {
    validated.title = fallbackMetadata?.title || 'TRPE Global - Dubai Real Estate';
    if (process.env.NODE_ENV === 'development') {
      console.warn('SEOHead: Missing or empty title, using fallback');
    }
  }
  
  // Validate and fallback description
  if (!validated.description || validated.description.trim().length === 0) {
    validated.description = fallbackMetadata?.description || 'Find the best properties for sale and rent in Dubai with TRPE Global, Dubai\'s leading real estate agency.';
    if (process.env.NODE_ENV === 'development') {
      console.warn('SEOHead: Missing or empty description, using fallback');
    }
  }
  
  // Validate Open Graph image
  if (validated.openGraph && (!validated.openGraph.images || (Array.isArray(validated.openGraph.images) && validated.openGraph.images.length === 0))) {
    const fallbackImage = fallbackMetadata?.image || `${process.env.NEXT_PUBLIC_URL || 'https://trpe.ae'}/images/og-default.jpg`;
    validated.openGraph.images = [
      {
        url: fallbackImage,
        width: 1200,
        height: 630,
        alt: typeof validated.title === 'string' ? validated.title : 'TRPE Global'
      }
    ];
    if (process.env.NODE_ENV === 'development') {
      console.warn('SEOHead: Missing Open Graph image, using fallback');
    }
  }
  
  // Validate Twitter image
  if (validated.twitter && (!validated.twitter.images || (Array.isArray(validated.twitter.images) && validated.twitter.images.length === 0))) {
    const fallbackImage = fallbackMetadata?.image || `${process.env.NEXT_PUBLIC_URL || 'https://trpe.ae'}/images/og-default.jpg`;
    validated.twitter.images = [fallbackImage];
    if (process.env.NODE_ENV === 'development') {
      console.warn('SEOHead: Missing Twitter image, using fallback');
    }
  }
  
  return validated;
}

/**
 * Generate SEO metadata for Next.js pages
 * This is a helper function to be used in generateMetadata functions
 */
export function generateSEOMetadata(options: {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  robots?: string;
  openGraph?: {
    title: string;
    description: string;
    image: string;
    type: 'website' | 'article' | 'product';
  };
  twitter?: {
    title: string;
    description: string;
    image: string;
  };
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
  const siteName = 'TRPE Global';
  
  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    robots: options.robots || 'index, follow, max-image-preview:large',
    alternates: {
      canonical: options.canonical || baseUrl,
    },
    openGraph: options.openGraph ? {
      title: options.openGraph.title,
      description: options.openGraph.description,
      url: options.canonical || baseUrl,
      siteName,
      images: [
        {
          url: options.openGraph.image,
          width: 1200,
          height: 630,
          alt: options.openGraph.title,
        }
      ],
      locale: 'en_US',
      type: options.openGraph.type === 'product' ? 'website' : options.openGraph.type,
    } : undefined,
    twitter: options.twitter ? {
      card: 'summary_large_image',
      title: options.twitter.title,
      description: options.twitter.description,
      images: [options.twitter.image],
      site: '@trpeglobal',
      creator: '@trpeglobal',
    } : undefined,
  };
}