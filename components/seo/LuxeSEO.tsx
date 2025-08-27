import React from 'react';
import { StructuredDataScript } from '@/components/seo/StructuredDataScript';
import { LuxeBreadcrumb } from '@/components/seo/LuxeBreadcrumb';
import { luxeStructuredData } from '@/lib/seo/luxe-structured-data';
import { PropertyType } from '@/types/property';

export interface LuxeSEOProps {
  pageType: 'home' | 'properties' | 'journals' | 'advisors' | 'property' | 'journal' | 'advisor';
  data?: {
    // Common fields
    title?: string;
    slug?: string;
    description?: string;
    image?: string;
    
    // Property-specific fields
    property?: PropertyType;
    properties?: PropertyType[];
    
    // Journal-specific fields
    journal?: {
      title: string;
      slug: string;
      description?: string;
      content?: string;
      publishedAt: string;
      updatedAt?: string;
      author?: {
        name: string;
        slug?: string;
      };
      category?: {
        name: string;
        slug: string;
      };
      image?: string;
      keywords?: string[];
    };
    journals?: any[];
    
    // Advisor-specific fields
    advisor?: {
      name: string;
      slug: string;
      title?: string;
      bio?: string;
      email?: string;
      phone?: string;
      avatarUrl?: string;
      expertise?: string[];
      languages?: string[];
    };
    advisors?: any[];
    
    // Breadcrumb-specific fields
    offeringType?: {
      name: string;
      slug: string;
    };
    category?: {
      name: string;
      slug: string;
    };
    author?: {
      name: string;
      slug?: string;
    };
  };
  showBreadcrumbs?: boolean;
  breadcrumbClassName?: string;
}

/**
 * Comprehensive SEO component for Luxe pages with structured data and breadcrumbs
 */
export function LuxeSEO({ 
  pageType, 
  data, 
  showBreadcrumbs = true, 
  breadcrumbClassName = '' 
}: LuxeSEOProps) {
  // Generate structured data based on page type
  let pageStructuredData = null;

  switch (pageType) {
    case 'home':
      pageStructuredData = luxeStructuredData.generateLuxeHomeSchema();
      break;

    case 'properties':
      pageStructuredData = luxeStructuredData.generateLuxePropertiesSchema(data?.properties);
      break;

    case 'property':
      if (data?.property) {
        pageStructuredData = luxeStructuredData.generateLuxePropertySchema(data.property);
      }
      break;

    case 'journals':
      pageStructuredData = luxeStructuredData.generateLuxeJournalsSchema(data?.journals?.length);
      break;

    case 'journal':
      if (data?.journal) {
        pageStructuredData = luxeStructuredData.generateLuxeJournalSchema(data.journal);
      }
      break;

    case 'advisors':
      pageStructuredData = luxeStructuredData.generateLuxeAdvisorsSchema(data?.advisors?.length);
      break;

    case 'advisor':
      if (data?.advisor) {
        pageStructuredData = luxeStructuredData.generateLuxeAdvisorSchema(data.advisor);
      }
      break;
  }

  // Prepare breadcrumb data
  const breadcrumbData = {
    title: data?.title || data?.property?.title || data?.journal?.title || data?.advisor?.name,
    slug: data?.slug || data?.property?.slug || data?.journal?.slug || data?.advisor?.slug,
    description: data?.description || data?.property?.description || data?.journal?.description || data?.advisor?.bio,
    image: data?.image || data?.journal?.image || data?.advisor?.avatarUrl,
    offeringType: data?.offeringType || data?.property?.offeringType,
    category: data?.category || data?.journal?.category,
    author: data?.author || data?.journal?.author
  };

  return (
    <>
      {/* Page-specific structured data */}
      {pageStructuredData && <StructuredDataScript data={pageStructuredData} />}
      
      {/* Breadcrumb navigation with structured data */}
      {showBreadcrumbs && (
        <LuxeBreadcrumb 
          pageType={pageType}
          data={breadcrumbData}
          className={breadcrumbClassName}
          showStructuredData={true}
        />
      )}
    </>
  );
}

/**
 * SEO component specifically for Luxe home page
 */
export function LuxeHomeSEO() {
  return <LuxeSEO pageType="home" />;
}

/**
 * SEO component specifically for Luxe properties page
 */
export function LuxePropertiesSEO({ 
  properties, 
  showBreadcrumbs = true,
  breadcrumbClassName = ''
}: { 
  properties?: PropertyType[];
  showBreadcrumbs?: boolean;
  breadcrumbClassName?: string;
}) {
  return (
    <LuxeSEO 
      pageType="properties" 
      data={{ properties }}
      showBreadcrumbs={showBreadcrumbs}
      breadcrumbClassName={breadcrumbClassName}
    />
  );
}

/**
 * SEO component specifically for Luxe property detail page
 */
export function LuxePropertySEO({ 
  property, 
  showBreadcrumbs = true,
  breadcrumbClassName = ''
}: { 
  property: PropertyType;
  showBreadcrumbs?: boolean;
  breadcrumbClassName?: string;
}) {
  return (
    <LuxeSEO 
      pageType="property" 
      data={{ property }}
      showBreadcrumbs={showBreadcrumbs}
      breadcrumbClassName={breadcrumbClassName}
    />
  );
}

/**
 * SEO component specifically for Luxe journals page
 */
export function LuxeJournalsSEO({ 
  journals, 
  showBreadcrumbs = true,
  breadcrumbClassName = ''
}: { 
  journals?: any[];
  showBreadcrumbs?: boolean;
  breadcrumbClassName?: string;
}) {
  return (
    <LuxeSEO 
      pageType="journals" 
      data={{ journals }}
      showBreadcrumbs={showBreadcrumbs}
      breadcrumbClassName={breadcrumbClassName}
    />
  );
}

/**
 * SEO component specifically for Luxe journal detail page
 */
export function LuxeJournalSEO({ 
  journal, 
  showBreadcrumbs = true,
  breadcrumbClassName = ''
}: { 
  journal: {
    title: string;
    slug: string;
    description?: string;
    content?: string;
    publishedAt: string;
    updatedAt?: string;
    author?: {
      name: string;
      slug?: string;
    };
    category?: {
      name: string;
      slug: string;
    };
    image?: string;
    keywords?: string[];
  };
  showBreadcrumbs?: boolean;
  breadcrumbClassName?: string;
}) {
  return (
    <LuxeSEO 
      pageType="journal" 
      data={{ journal }}
      showBreadcrumbs={showBreadcrumbs}
      breadcrumbClassName={breadcrumbClassName}
    />
  );
}

/**
 * SEO component specifically for Luxe advisors page
 */
export function LuxeAdvisorsSEO({ 
  advisors, 
  showBreadcrumbs = true,
  breadcrumbClassName = ''
}: { 
  advisors?: any[];
  showBreadcrumbs?: boolean;
  breadcrumbClassName?: string;
}) {
  return (
    <LuxeSEO 
      pageType="advisors" 
      data={{ advisors }}
      showBreadcrumbs={showBreadcrumbs}
      breadcrumbClassName={breadcrumbClassName}
    />
  );
}

/**
 * SEO component specifically for Luxe advisor detail page
 */
export function LuxeAdvisorSEO({ 
  advisor, 
  showBreadcrumbs = true,
  breadcrumbClassName = ''
}: { 
  advisor: {
    name: string;
    slug: string;
    title?: string;
    bio?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    expertise?: string[];
    languages?: string[];
  };
  showBreadcrumbs?: boolean;
  breadcrumbClassName?: string;
}) {
  return (
    <LuxeSEO 
      pageType="advisor" 
      data={{ advisor }}
      showBreadcrumbs={showBreadcrumbs}
      breadcrumbClassName={breadcrumbClassName}
    />
  );
}
