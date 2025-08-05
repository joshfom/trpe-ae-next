// Main SEO exports
export { SEOMetadataGenerator, seoMetadataGenerator } from './metadata-generator';
export { StructuredDataGenerator, structuredDataGenerator } from './structured-data-generator';
export { MetaTagOptimizer, metaTagOptimizer } from './meta-tag-optimizer';

// Types
export type {
  SEOMetadata,
  OpenGraphData,
  TwitterCardData,
  RobotsConfig,
  HreflangConfig,
  PageContext
} from './metadata-generator';

export type {
  StructuredDataSchema,
  BreadcrumbItem,
  FAQItem,
  OrganizationConfig
} from './structured-data-generator';

export type {
  MetaTag,
  OptimizedMetaTags,
  LinkTag,
  MetaOptimizationConfig
} from './meta-tag-optimizer';

// Re-export from existing structured-data.ts for backward compatibility
export {
  generatePropertyStructuredData,
  generateBreadcrumbStructuredData,
  generateOrganizationStructuredData,
  generateLocalBusinessStructuredData,
  generatePropertyFAQStructuredData,
  generateBreadcrumbSchema,
  StructuredDataScript
} from '../structured-data';

// Utility functions
export * from './seo-utils';