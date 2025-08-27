import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { StructuredDataScript } from './StructuredDataScript';
import { breadcrumbStructuredData } from '@/lib/seo/breadcrumb-structured-data';

export interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
}

export interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  showStructuredData?: boolean;
  separator?: React.ReactNode;
}

/**
 * SEO-optimized breadcrumb navigation component with structured data
 */
export function BreadcrumbNav({ 
  items, 
  className = '',
  showHome = true,
  showStructuredData = true,
  separator = <ChevronRight className="h-4 w-4 text-gray-500" />
}: BreadcrumbNavProps) {
  // Prepare breadcrumb items with home if needed
  const breadcrumbItems = showHome 
    ? [{ name: 'Home', url: '/' }, ...items]
    : items;

  // Generate structured data
  const structuredData = showStructuredData 
    ? breadcrumbStructuredData.generateBreadcrumbSchema(breadcrumbItems)
    : null;

  return (
    <>
      {structuredData && <StructuredDataScript data={structuredData} />}
      
      <nav 
        className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-1">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isHome = index === 0 && showHome;
            
            return (
              <li key={item.url} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2" aria-hidden="true">
                    {separator}
                  </span>
                )}
                
                {isLast ? (
                  <span 
                    className="font-medium text-gray-900"
                    aria-current="page"
                  >
                    {isHome ? (
                      <Home className="h-4 w-4" aria-label={item.name} />
                    ) : (
                      item.name
                    )}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-gray-900 transition-colors duration-200"
                    title={`Go to ${item.name}`}
                  >
                    {isHome ? (
                      <Home className="h-4 w-4" aria-label={item.name} />
                    ) : (
                      item.name
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * Generate breadcrumb items for property pages
 */
export function generatePropertyBreadcrumbs(property: {
  title: string;
  slug: string;
  offeringType?: { name: string; slug: string };
  community?: { name: string; slug: string };
}): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Properties', url: '/properties' }
  ];

  if (property.offeringType) {
    breadcrumbs.push({
      name: property.offeringType.name,
      url: `/properties/${property.offeringType.slug}`
    });
  }

  if (property.community) {
    breadcrumbs.push({
      name: property.community.name,
      url: `/communities/${property.community.slug}`
    });
  }

  breadcrumbs.push({
    name: property.title,
    url: `/properties/${property.offeringType?.slug}/${property.slug}`,
    current: true
  });

  return breadcrumbs;
}

/**
 * Generate breadcrumb items for community pages
 */
export function generateCommunityBreadcrumbs(community: {
  name: string;
  slug: string;
  parentCommunity?: { name: string; slug: string };
}): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Communities', url: '/communities' }
  ];

  if (community.parentCommunity) {
    breadcrumbs.push({
      name: community.parentCommunity.name,
      url: `/communities/${community.parentCommunity.slug}`
    });
  }

  breadcrumbs.push({
    name: community.name,
    url: `/communities/${community.slug}`,
    current: true
  });

  return breadcrumbs;
}

/**
 * Generate breadcrumb items for insight pages
 */
export function generateInsightBreadcrumbs(insight: {
  title: string;
  slug: string;
  category?: string;
}): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Insights', url: '/insights' }
  ];

  if (insight.category) {
    breadcrumbs.push({
      name: insight.category,
      url: `/insights?category=${insight.category.toLowerCase()}`
    });
  }

  breadcrumbs.push({
    name: insight.title,
    url: `/insights/${insight.slug}`,
    current: true
  });

  return breadcrumbs;
}

/**
 * Generate breadcrumb items from URL path
 */
export function generateBreadcrumbsFromPath(path: string): BreadcrumbItem[] {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  segments.forEach((segment, index) => {
    const url = '/' + segments.slice(0, index + 1).join('/');
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      name,
      url,
      current: index === segments.length - 1
    });
  });

  return breadcrumbs;
}