# SEO Infrastructure and Metadata Management System

This comprehensive SEO system provides enhanced metadata generation, structured data implementation, and meta tag optimization for the TRPE Global website.

## Features

- **Dynamic Metadata Generation**: Context-aware SEO metadata for all page types
- **Structured Data Support**: Schema.org compliant JSON-LD for properties, organizations, breadcrumbs, and more
- **Meta Tag Optimization**: Comprehensive meta tag generation with validation
- **Mobile-First SEO**: Optimized for mobile search and Core Web Vitals
- **Performance Integration**: Built-in resource hints and preloading
- **Type Safety**: Full TypeScript support with comprehensive interfaces

## Quick Start

### 1. Basic Page SEO

```typescript
import { generateStaticPageSEO } from '@/lib/seo/seo-utils';
import { SEOHead } from '@/components/seo/SEOHead';

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await generateStaticPageSEO('/about-us');
  return metadata;
}

export default function AboutPage() {
  return (
    <>
      <SEOHead metadata={{} as Metadata} />
      <div>Your page content</div>
    </>
  );
}
```

### 2. Property Page SEO

```typescript
import { generatePropertySEO } from '@/lib/seo/seo-utils';
import { SEOHead } from '@/components/seo/SEOHead';
import { BreadcrumbNav, generatePropertyBreadcrumbs } from '@/components/seo/BreadcrumbNav';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const property = await fetchProperty(params.slug);
  const { metadata } = await generatePropertySEO(property);
  return metadata;
}

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const property = await fetchProperty(params.slug);
  const { structuredData } = await generatePropertySEO(property);
  const breadcrumbs = generatePropertyBreadcrumbs(property);

  return (
    <>
      <SEOHead 
        metadata={{} as Metadata}
        structuredData={structuredData}
      />
      <BreadcrumbNav items={breadcrumbs} />
      <div>Your property content</div>
    </>
  );
}
```

## Core Components

### SEOMetadataGenerator

Generates comprehensive SEO metadata based on page context:

```typescript
import { seoMetadataGenerator, PageContext } from '@/lib/seo';

const context: PageContext = {
  path: '/properties/sale/luxury-apartment',
  pageType: 'property-detail',
  data: propertyData
};

const metadata = await seoMetadataGenerator.generateMetadata(context);
```

### StructuredDataGenerator

Creates Schema.org compliant structured data:

```typescript
import { structuredDataGenerator } from '@/lib/seo';

// Property structured data
const propertySchema = structuredDataGenerator.generatePropertySchema(property);

// Organization structured data
const orgSchema = structuredDataGenerator.generateOrganizationSchema();

// Breadcrumb structured data
const breadcrumbSchema = structuredDataGenerator.generateBreadcrumbSchema(breadcrumbs);
```

### MetaTagOptimizer

Optimizes meta tags for SEO performance:

```typescript
import { metaTagOptimizer } from '@/lib/seo';

const optimizedTags = metaTagOptimizer.generateOptimizedMetaTags(
  title,
  description,
  canonical,
  {
    keywords: ['Dubai real estate', 'properties'],
    openGraph: { /* OG data */ },
    twitterCard: { /* Twitter data */ }
  }
);
```

## Components

### SEOHead

Main SEO component for page head:

```typescript
<SEOHead 
  metadata={metadata}
  structuredData={[propertySchema, orgSchema]}
  preloadResources={[
    { href: '/critical.css', as: 'style' },
    { href: '/hero-image.jpg', as: 'image' }
  ]}
  prefetchUrls={['/next-page']}
/>
```

### StructuredDataScript

Injects structured data into pages:

```typescript
<StructuredDataScript data={structuredDataSchema} />
```

### BreadcrumbNav

SEO-optimized breadcrumb navigation:

```typescript
<BreadcrumbNav 
  items={breadcrumbs}
  showStructuredData={true}
  className="mb-6"
/>
```

## Utility Functions

### Pre-built SEO Generators

```typescript
// Property pages
const { metadata, structuredData } = await generatePropertySEO(property);

// Property listings
const { metadata, structuredData } = await generatePropertyListingSEO('sale');

// Community pages
const { metadata, structuredData } = await generateCommunitySEO(community);

// Insight articles
const { metadata, structuredData } = await generateInsightSEO(insight);

// Home page
const { metadata, structuredData } = await generateHomeSEO();

// Static pages
const { metadata, structuredData } = await generateStaticPageSEO('/about-us');
```

## Page Type Support

### Supported Page Types

- **Home**: Main landing page with business information
- **Properties**: Property listing pages with filtering
- **Property Detail**: Individual property pages with full details
- **Communities**: Community listing and detail pages
- **Insights**: Blog/article listing and detail pages
- **Static**: About, contact, and other static pages

### Context-Aware Metadata

The system automatically generates appropriate metadata based on:

- Page type and content
- Database content (when available)
- URL structure and parameters
- User locale and preferences

## Structured Data Schemas

### Supported Schema Types

- **Product**: For property listings
- **RealEstateAgent**: For organization information
- **LocalBusiness**: For local SEO
- **BreadcrumbList**: For navigation
- **Article**: For insights and blog posts
- **FAQPage**: For frequently asked questions
- **WebSite**: For site-wide information
- **Place**: For communities and locations

### Schema Validation

Development mode includes automatic schema validation:

```typescript
import { useStructuredDataValidation } from '@/components/seo/StructuredDataScript';

// Validates schemas in development
useStructuredDataValidation(structuredDataArray);
```

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_URL=https://trpe.ae
```

### Customization

Override default configurations:

```typescript
// Custom organization config
const customConfig: OrganizationConfig = {
  name: 'Your Company',
  url: 'https://yoursite.com',
  // ... other config
};

const generator = new StructuredDataGenerator(customConfig);
```

## Performance Features

### Resource Optimization

- **Preload Critical Resources**: CSS, fonts, hero images
- **Prefetch Next Pages**: Improve navigation performance
- **DNS Prefetch**: External domains and CDNs
- **Resource Hints**: Optimize loading priorities

### Core Web Vitals

- **LCP Optimization**: Critical resource preloading
- **CLS Prevention**: Proper image dimensions
- **FID Improvement**: Optimized JavaScript loading

## Testing

### Unit Tests

```bash
bun test lib/seo --run
```

### SEO Validation

```typescript
import { validateSEOImplementation } from '@/lib/seo/seo-utils';

const issues = validateSEOImplementation(metadata);
console.log('SEO Issues:', issues);
```

## Best Practices

### 1. Always Use generateMetadata

```typescript
// ✅ Good
export async function generateMetadata(): Promise<Metadata> {
  return await generateHomeSEO();
}

// ❌ Bad - hardcoded metadata
export const metadata: Metadata = { title: 'Home' };
```

### 2. Include Structured Data

```typescript
// ✅ Good - includes structured data
<SEOHead metadata={metadata} structuredData={schemas} />

// ❌ Bad - missing structured data
<SEOHead metadata={metadata} />
```

### 3. Use Breadcrumbs

```typescript
// ✅ Good - SEO breadcrumbs
<BreadcrumbNav items={breadcrumbs} showStructuredData={true} />

// ❌ Bad - no breadcrumbs
<div>Property > Details</div>
```

### 4. Optimize Images

```typescript
// ✅ Good - preload critical images
<SEOHead 
  preloadResources={[
    { href: heroImage, as: 'image', type: 'image/webp' }
  ]}
/>
```

## Migration Guide

### From Existing SEO

1. Replace manual meta tags with `SEOHead` component
2. Add structured data using generators
3. Implement breadcrumb navigation
4. Use utility functions for metadata generation

### Example Migration

```typescript
// Before
export const metadata: Metadata = {
  title: 'Property Details',
  description: 'View property details'
};

// After
export async function generateMetadata({ params }): Promise<Metadata> {
  const property = await fetchProperty(params.slug);
  const { metadata } = await generatePropertySEO(property);
  return metadata;
}
```

## Troubleshooting

### Common Issues

1. **Missing Metadata**: Ensure `generateMetadata` is exported
2. **Invalid Structured Data**: Check schema validation in development
3. **Performance Issues**: Use preload for critical resources
4. **Duplicate Meta Tags**: Use `SEOHead` component only once per page

### Debug Mode

Enable detailed logging in development:

```typescript
// Set NODE_ENV=development for validation warnings
process.env.NODE_ENV = 'development';
```

## API Reference

See individual component and utility documentation for detailed API information:

- [SEOMetadataGenerator](./metadata-generator.ts)
- [StructuredDataGenerator](./structured-data-generator.ts)
- [MetaTagOptimizer](./meta-tag-optimizer.ts)
- [SEO Utilities](./seo-utils.ts)