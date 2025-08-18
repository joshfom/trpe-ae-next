import { describe, it, expect } from '@jest/globals';
import { generateSEOMetadata } from '@/components/SEOHead';
import { Metadata } from 'next';

// Test the generateSEOMetadata function since we can't easily test React components without a testing library

describe('generateSEOMetadata', () => {
  it('should generate basic SEO metadata', () => {
    const metadata = generateSEOMetadata({
      title: 'Test Page',
      description: 'Test description',
      canonical: 'https://trpe.ae/test',
      keywords: ['test', 'seo'],
      robots: 'index, follow',
      openGraph: {
        title: 'Test OG Title',
        description: 'Test OG Description',
        image: 'https://trpe.ae/test.jpg',
        type: 'website'
      },
      twitter: {
        title: 'Test Twitter Title',
        description: 'Test Twitter Description',
        image: 'https://trpe.ae/test.jpg'
      }
    });

    expect(metadata.title).toBe('Test Page');
    expect(metadata.description).toBe('Test description');
    expect(metadata.keywords).toEqual(['test', 'seo']);
    expect(metadata.robots).toBe('index, follow');
    expect(metadata.alternates?.canonical).toBe('https://trpe.ae/test');
    expect(metadata.openGraph?.title).toBe('Test OG Title');
    expect(metadata.twitter?.title).toBe('Test Twitter Title');
  });

  it('should use default values when optional fields are missing', () => {
    const metadata = generateSEOMetadata({
      title: 'Test Page',
      description: 'Test description'
    });

    expect(metadata.title).toBe('Test Page');
    expect(metadata.description).toBe('Test description');
    expect(metadata.robots).toBe('index, follow, max-image-preview:large');
    expect(metadata.alternates?.canonical).toBe('https://trpe.ae');
  });

  it('should generate proper Open Graph metadata', () => {
    const metadata = generateSEOMetadata({
      title: 'Test Page',
      description: 'Test description',
      openGraph: {
        title: 'OG Title',
        description: 'OG Description',
        image: 'https://trpe.ae/og-image.jpg',
        type: 'article'
      }
    });

    expect(metadata.openGraph?.title).toBe('OG Title');
    expect(metadata.openGraph?.type).toBe('article');
    expect(metadata.openGraph?.siteName).toBe('TRPE Global');
    expect(metadata.openGraph?.images?.[0]?.url).toBe('https://trpe.ae/og-image.jpg');
    expect(metadata.openGraph?.images?.[0]?.width).toBe(1200);
    expect(metadata.openGraph?.images?.[0]?.height).toBe(630);
  });

  it('should generate proper Twitter Card metadata', () => {
    const metadata = generateSEOMetadata({
      title: 'Test Page',
      description: 'Test description',
      twitter: {
        title: 'Twitter Title',
        description: 'Twitter Description',
        image: 'https://trpe.ae/twitter-image.jpg'
      }
    });

    expect(metadata.twitter?.card).toBe('summary_large_image');
    expect(metadata.twitter?.title).toBe('Twitter Title');
    expect(metadata.twitter?.site).toBe('@trpeglobal');
    expect(metadata.twitter?.creator).toBe('@trpeglobal');
    expect(metadata.twitter?.images).toEqual(['https://trpe.ae/twitter-image.jpg']);
  });
});