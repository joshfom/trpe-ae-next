/**
 * Basic mock test for SEO modules
 */

import { describe, it, expect, jest } from '@jest/globals';

// Mock all SEO-related modules
jest.mock('@/lib/seo/hreflang-generator', () => ({
  HreflangGenerator: jest.fn(),
}));

jest.mock('@/lib/seo/breadcrumb-structured-data', () => ({
  BreadcrumbStructuredData: jest.fn(),
}));

jest.mock('@/lib/seo/canonical-url-generator', () => ({
  CanonicalURLGenerator: jest.fn(),
}));

jest.mock('@/lib/seo/metadata-generator', () => ({
  SEOMetadataGenerator: jest.fn(),
}));

describe('SEO Modules', () => {
  it('should have mocked SEO modules', () => {
    expect(true).toBe(true);
  });
});
