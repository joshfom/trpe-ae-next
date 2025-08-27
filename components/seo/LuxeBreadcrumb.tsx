import React from 'react';
import { BreadcrumbNav, BreadcrumbItem } from '@/components/seo/BreadcrumbNav';
import { StructuredDataScript } from '@/components/seo/StructuredDataScript';
import { breadcrumbStructuredData } from '@/lib/seo/breadcrumb-structured-data';

export interface LuxeBreadcrumbProps {
  items?: BreadcrumbItem[];
  pageType?: 'home' | 'properties' | 'journals' | 'advisors' | 'property' | 'journal' | 'advisor';
  data?: {
    title?: string;
    slug?: string;
    description?: string;
    image?: string;
    author?: {
      name: string;
      slug?: string;
    };
    category?: {
      name: string;
      slug: string;
    };
    offeringType?: {
      name: string;
      slug: string;
    };
  };
  className?: string;
  showStructuredData?: boolean;
}

/**
 * Luxe-specific breadcrumb component with structured data
 */
export function LuxeBreadcrumb({ 
  items,
  pageType,
  data,
  className = '',
  showStructuredData = true
}: LuxeBreadcrumbProps) {
  let breadcrumbItems: BreadcrumbItem[] = [];
  let structuredData = null;

  // Generate breadcrumbs based on page type if items not provided
  if (!items && pageType) {
    switch (pageType) {
      case 'home':
        breadcrumbItems = [
          {
            name: 'Luxe',
            url: '/luxe',
            current: true
          }
        ];
        if (showStructuredData) {
          structuredData = breadcrumbStructuredData.generateLuxeHomeBreadcrumbSchema();
        }
        break;

      case 'properties':
        breadcrumbItems = [
          {
            name: 'Luxe',
            url: '/luxe'
          },
          {
            name: 'Properties',
            url: '/luxe/properties',
            current: true
          }
        ];
        if (showStructuredData) {
          structuredData = breadcrumbStructuredData.generateLuxePropertiesBreadcrumbSchema();
        }
        break;

      case 'property':
        if (data) {
          breadcrumbItems = [
            {
              name: 'Luxe',
              url: '/luxe'
            },
            {
              name: 'Properties',
              url: '/luxe/properties'
            }
          ];

          // Add offering type if available
          if (data.offeringType) {
            breadcrumbItems.push({
              name: `For ${data.offeringType.name}`,
              url: `/luxe/properties/${data.offeringType.slug}`
            });
          }

          // Add current property
          breadcrumbItems.push({
            name: data.title || 'Property',
            url: `/luxe/property/${data.slug}`,
            current: true
          });

          if (showStructuredData && data.title && data.slug) {
            structuredData = breadcrumbStructuredData.generateLuxePropertyBreadcrumbSchema({
              title: data.title,
              slug: data.slug,
              description: data.description,
              image: data.image,
              offeringType: data.offeringType
            });
          }
        }
        break;

      case 'journals':
        breadcrumbItems = [
          {
            name: 'Luxe',
            url: '/luxe'
          },
          {
            name: 'Journals',
            url: '/luxe/journals',
            current: true
          }
        ];
        if (showStructuredData) {
          structuredData = breadcrumbStructuredData.generateLuxeJournalsBreadcrumbSchema();
        }
        break;

      case 'journal':
        if (data) {
          breadcrumbItems = [
            {
              name: 'Luxe',
              url: '/luxe'
            },
            {
              name: 'Journals',
              url: '/luxe/journals'
            }
          ];

          // Add category if available
          if (data.category) {
            breadcrumbItems.push({
              name: data.category.name,
              url: `/luxe/journals/category/${data.category.slug}`
            });
          }

          // Add current journal
          breadcrumbItems.push({
            name: data.title || 'Journal',
            url: `/luxe/journals/${data.slug}`,
            current: true
          });

          if (showStructuredData && data.title && data.slug) {
            structuredData = breadcrumbStructuredData.generateLuxeJournalBreadcrumbSchema({
              title: data.title,
              slug: data.slug,
              description: data.description,
              image: data.image,
              author: data.author && data.author.slug ? data.author as { name: string; slug: string } : undefined,
              category: data.category
            });
          }
        }
        break;

      case 'advisors':
        breadcrumbItems = [
          {
            name: 'Luxe',
            url: '/luxe'
          },
          {
            name: 'Advisors',
            url: '/luxe/advisors',
            current: true
          }
        ];
        if (showStructuredData) {
          structuredData = breadcrumbStructuredData.generateLuxeAdvisorsBreadcrumbSchema();
        }
        break;

      case 'advisor':
        if (data) {
          breadcrumbItems = [
            {
              name: 'Luxe',
              url: '/luxe'
            },
            {
              name: 'Advisors',
              url: '/luxe/advisors'
            },
            {
              name: data.title || 'Advisor',
              url: `/luxe/advisors/${data.slug}`,
              current: true
            }
          ];

          if (showStructuredData && data.title && data.slug) {
            structuredData = breadcrumbStructuredData.generateLuxeAdvisorBreadcrumbSchema({
              name: data.title,
              slug: data.slug,
              description: data.description,
              image: data.image
            });
          }
        }
        break;

      default:
        breadcrumbItems = [];
    }
  } else if (items) {
    breadcrumbItems = items;
    if (showStructuredData) {
      structuredData = breadcrumbStructuredData.generateBreadcrumbSchema(items);
    }
  }

  return (
    <>
      {structuredData && <StructuredDataScript data={structuredData} />}
      
      <BreadcrumbNav 
        items={breadcrumbItems}
        className={className}
        showHome={false} // Don't show home since we start with Luxe
        showStructuredData={false} // We handle structured data above
      />
    </>
  );
}

/**
 * Helper function to generate luxe property breadcrumbs
 */
export function generateLuxePropertyBreadcrumbs(property: {
  title: string;
  slug: string;
  description?: string;
  image?: string;
  offeringType?: {
    name: string;
    slug: string;
  };
}): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: 'Luxe',
      url: '/luxe'
    },
    {
      name: 'Properties',
      url: '/luxe/properties'
    }
  ];

  if (property.offeringType) {
    breadcrumbs.push({
      name: `For ${property.offeringType.name}`,
      url: `/luxe/properties/${property.offeringType.slug}`
    });
  }

  breadcrumbs.push({
    name: property.title,
    url: `/luxe/property/${property.slug}`,
    current: true
  });

  return breadcrumbs;
}

/**
 * Helper function to generate luxe journal breadcrumbs
 */
export function generateLuxeJournalBreadcrumbs(journal: {
  title: string;
  slug: string;
  category?: {
    name: string;
    slug: string;
  };
}): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: 'Luxe',
      url: '/luxe'
    },
    {
      name: 'Journals',
      url: '/luxe/journals'
    }
  ];

  if (journal.category) {
    breadcrumbs.push({
      name: journal.category.name,
      url: `/luxe/journals/category/${journal.category.slug}`
    });
  }

  breadcrumbs.push({
    name: journal.title,
    url: `/luxe/journals/${journal.slug}`,
    current: true
  });

  return breadcrumbs;
}

/**
 * Helper function to generate luxe advisor breadcrumbs
 */
export function generateLuxeAdvisorBreadcrumbs(advisor: {
  name: string;
  slug: string;
}): BreadcrumbItem[] {
  return [
    {
      name: 'Luxe',
      url: '/luxe'
    },
    {
      name: 'Advisors',
      url: '/luxe/advisors'
    },
    {
      name: advisor.name,
      url: `/luxe/advisors/${advisor.slug}`,
      current: true
    }
  ];
}
