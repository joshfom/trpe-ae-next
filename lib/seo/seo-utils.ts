import { Metadata } from 'next';
import { seoMetadataGenerator, PageContext } from './metadata-generator';
import { structuredDataGenerator, StructuredDataSchema } from './structured-data-generator';
import { PropertyType } from '@/types/property';

/**
 * Generate complete SEO package for property pages
 */
export async function generatePropertySEO(property: PropertyType): Promise<{
  metadata: Metadata;
  structuredData: StructuredDataSchema[];
}> {
  const context: PageContext = {
    path: `/properties/${property.offeringType?.slug}/${property.slug}`,
    pageType: 'property-detail',
    data: property
  };

  const metadata = await seoMetadataGenerator.generateMetadata(context);
  
  const structuredData = [
    structuredDataGenerator.generatePropertySchema(property),
    structuredDataGenerator.generateOrganizationSchema(),
    structuredDataGenerator.generateBreadcrumbSchema([
      { name: 'Home', url: process.env.NEXT_PUBLIC_URL || 'https://trpe.ae' },
      { name: 'Properties', url: `${process.env.NEXT_PUBLIC_URL || 'https://trpe.ae'}/properties` },
      { 
        name: property.offeringType?.name || 'Properties', 
        url: `${process.env.NEXT_PUBLIC_URL || 'https://trpe.ae'}/properties/${property.offeringType?.slug}` 
      },
      { 
        name: property.title, 
        url: `${process.env.NEXT_PUBLIC_URL || 'https://trpe.ae'}/properties/${property.offeringType?.slug}/${property.slug}` 
      }
    ])
  ];

  return { metadata, structuredData };
}

/**
 * Generate complete SEO package for property listing pages
 */
export async function generatePropertyListingSEO(
  offeringType?: string,
  filters?: any
): Promise<{
  metadata: Metadata;
  structuredData: StructuredDataSchema[];
}> {
  const path = offeringType ? `/properties/${offeringType}` : '/properties';
  const context: PageContext = {
    path,
    pageType: 'properties',
    data: { offeringType: offeringType || 'Properties' }
  };

  const metadata = await seoMetadataGenerator.generateMetadata(context);
  
  const structuredData = [
    structuredDataGenerator.generateOrganizationSchema(),
    structuredDataGenerator.generateWebsiteSchema(),
    structuredDataGenerator.generateBreadcrumbSchema([
      { name: 'Home', url: process.env.NEXT_PUBLIC_URL || 'https://trpe.ae' },
      { name: 'Properties', url: `${process.env.NEXT_PUBLIC_URL || 'https://trpe.ae'}/properties` }
    ])
  ];

  return { metadata, structuredData };
}

/**
 * Generate complete SEO package for community pages
 */
export async function generateCommunitySEO(community: any): Promise<{
  metadata: Metadata;
  structuredData: StructuredDataSchema[];
}> {
  const context: PageContext = {
    path: `/communities/${community.slug}`,
    pageType: 'community-detail',
    data: community
  };

  const metadata = await seoMetadataGenerator.generateMetadata(context);
  
  const structuredData = [
    structuredDataGenerator.generateCommunitySchema(community),
    structuredDataGenerator.generateOrganizationSchema(),
    structuredDataGenerator.generateBreadcrumbSchema([
      { name: 'Home', url: process.env.NEXT_PUBLIC_URL || 'https://trpe.ae' },
      { name: 'Communities', url: `${process.env.NEXT_PUBLIC_URL || 'https://trpe.ae'}/communities` },
      { name: community.name, url: `${process.env.NEXT_PUBLIC_URL || 'https://trpe.ae'}/communities/${community.slug}` }
    ])
  ];

  return { metadata, structuredData };
}

/**
 * Generate complete SEO package for insight pages
 */
export async function generateInsightSEO(insight: any): Promise<{
  metadata: Metadata;
  structuredData: StructuredDataSchema[];
}> {
  const context: PageContext = {
    path: `/insights/${insight.slug}`,
    pageType: 'insight-detail',
    data: insight
  };

  const metadata = await seoMetadataGenerator.generateMetadata(context);
  
  const structuredData = [
    structuredDataGenerator.generateArticleSchema(insight),
    structuredDataGenerator.generateOrganizationSchema(),
    structuredDataGenerator.generateBreadcrumbSchema([
      { name: 'Home', url: process.env.NEXT_PUBLIC_URL || 'https://trpe.ae' },
      { name: 'Insights', url: `${process.env.NEXT_PUBLIC_URL || 'https://trpe.ae'}/insights` },
      { name: insight.title, url: `${process.env.NEXT_PUBLIC_URL || 'https://trpe.ae'}/insights/${insight.slug}` }
    ])
  ];

  return { metadata, structuredData };
}

/**
 * Generate complete SEO package for home page
 */
export async function generateHomeSEO(): Promise<{
  metadata: Metadata;
  structuredData: StructuredDataSchema[];
}> {
  const context: PageContext = {
    path: '/',
    pageType: 'home'
  };

  const metadata = await seoMetadataGenerator.generateMetadata(context);
  
  const structuredData = [
    structuredDataGenerator.generateOrganizationSchema(),
    structuredDataGenerator.generateLocalBusinessSchema(),
    structuredDataGenerator.generateWebsiteSchema()
  ];

  return { metadata, structuredData };
}

/**
 * Generate complete SEO package for static pages
 */
export async function generateStaticPageSEO(path: string): Promise<{
  metadata: Metadata;
  structuredData: StructuredDataSchema[];
}> {
  const context: PageContext = {
    path,
    pageType: 'static'
  };

  const metadata = await seoMetadataGenerator.generateMetadata(context);
  
  const structuredData = [
    structuredDataGenerator.generateOrganizationSchema(),
    structuredDataGenerator.generateBreadcrumbSchema([
      { name: 'Home', url: process.env.NEXT_PUBLIC_URL || 'https://trpe.ae' },
      ...generateBreadcrumbsFromPath(path)
    ])
  ];

  return { metadata, structuredData };
}

/**
 * Generate FAQ structured data from common property questions
 */
export function generatePropertyFAQs(property: PropertyType): Array<{ question: string; answer: string }> {
  const faqs = [];

  if (property.price) {
    faqs.push({
      question: `What is the price of this ${property.type?.name} in ${property.community?.name}?`,
      answer: `This ${property.type?.name} in ${property.community?.name} is priced at AED ${property.price.toLocaleString()}.`
    });
  }

  if (property.bedrooms) {
    faqs.push({
      question: `How many bedrooms does this property have?`,
      answer: `This property has ${property.bedrooms} bedroom${property.bedrooms !== 1 ? 's' : ''}.`
    });
  }

  if (property.size) {
    faqs.push({
      question: `What is the area size of this property?`,
      answer: `This property has an area of ${property.size} square feet.`
    });
  }

  if (property.community?.name) {
    faqs.push({
      question: `What community is this property located in?`,
      answer: `This property is located in ${property.community.name}, one of Dubai's premium residential areas.`
    });
  }

  if ((property as any).amenities && (property as any).amenities.length > 0) {
    faqs.push({
      question: `What amenities are available in this property?`,
      answer: `This property offers various amenities including ${(property as any).amenities.slice(0, 3).map((a: any) => a.name).join(', ')}${(property as any).amenities.length > 3 ? ' and more' : ''}.`
    });
  }

  return faqs;
}

/**
 * Generate breadcrumbs from URL path
 */
function generateBreadcrumbsFromPath(path: string): Array<{ name: string; url: string }> {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: Array<{ name: string; url: string }> = [];
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';

  segments.forEach((segment, index) => {
    const url = baseUrl + '/' + segments.slice(0, index + 1).join('/');
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({ name, url });
  });

  return breadcrumbs;
}

/**
 * Validate SEO implementation
 */
export function validateSEOImplementation(metadata: Metadata): Array<{ type: 'error' | 'warning'; message: string }> {
  const issues: Array<{ type: 'error' | 'warning'; message: string }> = [];

  // Check required fields
  if (!metadata.title) {
    issues.push({ type: 'error', message: 'Missing page title' });
  } else if (typeof metadata.title === 'string' && metadata.title.length > 60) {
    issues.push({ type: 'warning', message: 'Page title exceeds 60 characters' });
  }

  if (!metadata.description) {
    issues.push({ type: 'error', message: 'Missing meta description' });
  } else if (typeof metadata.description === 'string' && metadata.description.length > 160) {
    issues.push({ type: 'warning', message: 'Meta description exceeds 160 characters' });
  }

  if (!metadata.alternates?.canonical) {
    issues.push({ type: 'warning', message: 'Missing canonical URL' });
  }

  if (!metadata.openGraph) {
    issues.push({ type: 'warning', message: 'Missing Open Graph data' });
  }

  if (!metadata.twitter) {
    issues.push({ type: 'warning', message: 'Missing Twitter Card data' });
  }

  return issues;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
  
  return `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /crm/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow specific API endpoints for SEO
Allow: /api/sitemap
Allow: /api/robots

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for respectful crawling
Crawl-delay: 1`;
}

/**
 * Generate sitemap index content
 */
export function generateSitemapIndex(): string {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
  const lastmod = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-properties.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-communities.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-insights.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
}