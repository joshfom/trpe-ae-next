// Export all luxe SEO components for easier importing
export { LuxeBreadcrumb } from './LuxeBreadcrumb';
export type { LuxeBreadcrumbProps } from './LuxeBreadcrumb';

export { 
  LuxeSEO,
  LuxeHomeSEO,
  LuxePropertiesSEO,
  LuxePropertySEO,
  LuxeJournalsSEO,
  LuxeJournalSEO,
  LuxeAdvisorsSEO,
  LuxeAdvisorSEO
} from './LuxeSEO';
export type { LuxeSEOProps } from './LuxeSEO';

// Re-export helper functions for generating breadcrumbs
export {
  generateLuxePropertyBreadcrumbs,
  generateLuxeJournalBreadcrumbs,
  generateLuxeAdvisorBreadcrumbs
} from './LuxeBreadcrumb';

// Export structured data generators
export { luxeStructuredData } from '@/lib/seo/luxe-structured-data';
export type {
  LuxePageSchema,
  LuxeCollectionSchema,
  LuxeAdvisorSchema,
  LuxeJournalSchema
} from '@/lib/seo/luxe-structured-data';

// Export breadcrumb functions from the main library
export { breadcrumbStructuredData } from '@/lib/seo/breadcrumb-structured-data';
