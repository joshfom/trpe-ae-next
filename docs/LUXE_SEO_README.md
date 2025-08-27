# Luxe SEO Implementation

This documentation covers the comprehensive SEO implementation for the Luxe section of the TRPE website, including structured data (Schema.org) and breadcrumb navigation.

## Overview

The Luxe SEO implementation provides:
- **Structured Data**: Schema.org compliant JSON-LD for all luxe pages
- **Breadcrumb Navigation**: SEO-optimized breadcrumbs with structured data
- **Page-specific SEO**: Tailored components for each page type
- **Easy Integration**: Simple to use components that handle all SEO requirements

## Components

### Core Components

#### LuxeSEO
Main SEO component that handles structured data and breadcrumbs for all luxe pages.

```tsx
import { LuxeSEO } from '@/components/seo/LuxeSEO';

<LuxeSEO 
  pageType="properties" 
  data={{ properties }}
  showBreadcrumbs={true}
  breadcrumbClassName="max-w-7xl mx-auto px-4"
/>
```

#### LuxeBreadcrumb
Standalone breadcrumb component with structured data support.

```tsx
import { LuxeBreadcrumb } from '@/components/seo/LuxeBreadcrumb';

<LuxeBreadcrumb 
  pageType="property"
  data={{
    title: property.title,
    slug: property.slug,
    offeringType: property.offeringType
  }}
/>
```

### Page-specific Components

#### LuxeHomeSEO
```tsx
import { LuxeHomeSEO } from '@/components/seo/LuxeSEO';

<LuxeHomeSEO />
```

#### LuxePropertiesSEO
```tsx
import { LuxePropertiesSEO } from '@/components/seo/LuxeSEO';

<LuxePropertiesSEO 
  properties={properties}
  showBreadcrumbs={true}
/>
```

#### LuxePropertySEO
```tsx
import { LuxePropertySEO } from '@/components/seo/LuxeSEO';

<LuxePropertySEO property={property} />
```

#### LuxeJournalsSEO
```tsx
import { LuxeJournalsSEO } from '@/components/seo/LuxeSEO';

<LuxeJournalsSEO journals={journals} />
```

#### LuxeJournalSEO
```tsx
import { LuxeJournalSEO } from '@/components/seo/LuxeSEO';

<LuxeJournalSEO 
  journal={{
    title: journal.title,
    slug: journal.slug,
    description: journal.description,
    publishedAt: journal.publishedAt,
    author: journal.author,
    category: journal.category
  }}
/>
```

#### LuxeAdvisorsSEO
```tsx
import { LuxeAdvisorsSEO } from '@/components/seo/LuxeSEO';

<LuxeAdvisorsSEO advisors={advisors} />
```

#### LuxeAdvisorSEO
```tsx
import { LuxeAdvisorSEO } from '@/components/seo/LuxeSEO';

<LuxeAdvisorSEO 
  advisor={{
    name: advisor.name,
    slug: advisor.slug,
    title: advisor.title,
    bio: advisor.bio
  }}
/>
```

## Structured Data

### Schemas Generated

1. **LuxePageSchema**: For main luxe pages (home, collections)
2. **LuxeCollectionSchema**: For properties, journals, and advisors listing pages
3. **LuxePropertySchema**: For individual property pages
4. **LuxeJournalSchema**: For individual journal articles
5. **LuxeAdvisorSchema**: For individual advisor profiles
6. **BreadcrumbSchema**: For navigation breadcrumbs

### Example Structured Data Output

#### Property Schema
```json
{
  "@context": "https://schema.org",
  "@type": ["Product", "Accommodation", "LuxuryAccommodation"],
  "@id": "https://trpe.ae/luxe/property/luxury-villa-palm-jumeirah",
  "name": "Luxury Villa in Palm Jumeirah",
  "description": "Exquisite 5-bedroom villa with private beach access",
  "brand": {
    "@type": "Brand",
    "name": "TRPE Luxe"
  },
  "offers": {
    "@type": "Offer",
    "price": "15000000",
    "priceCurrency": "AED"
  }
}
```

#### Breadcrumb Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Luxe",
      "item": "https://trpe.ae/luxe"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Properties",
      "item": "https://trpe.ae/luxe/properties"
    }
  ]
}
```

## Implementation by Page

### Luxe Home Page (`/luxe`)
- **Breadcrumb**: Luxe (current)
- **Schema**: LuxePageSchema with WebSite markup
- **Component**: `<LuxeHomeSEO />`

### Luxe Properties (`/luxe/properties`)
- **Breadcrumb**: Luxe > Properties (current)
- **Schema**: LuxeCollectionSchema with property list
- **Component**: `<LuxePropertiesSEO properties={properties} />`

### Individual Property (`/luxe/property/[slug]`)
- **Breadcrumb**: Luxe > Properties > [Offering Type] > Property Name (current)
- **Schema**: LuxePropertySchema with full property details
- **Component**: `<LuxePropertySEO property={property} />`

### Luxe Journals (`/luxe/journals`)
- **Breadcrumb**: Luxe > Journals (current)
- **Schema**: LuxeCollectionSchema for articles
- **Component**: `<LuxeJournalsSEO journals={journals} />`

### Individual Journal (`/luxe/journals/[slug]`)
- **Breadcrumb**: Luxe > Journals > [Category] > Article Title (current)
- **Schema**: LuxeJournalSchema with article metadata
- **Component**: `<LuxeJournalSEO journal={journalData} />`

### Luxe Advisors (`/luxe/advisors`)
- **Breadcrumb**: Luxe > Advisors (current)
- **Schema**: LuxeCollectionSchema for team members
- **Component**: `<LuxeAdvisorsSEO advisors={advisors} />`

### Individual Advisor (`/luxe/advisors/[slug]`)
- **Breadcrumb**: Luxe > Advisors > Advisor Name (current)
- **Schema**: LuxeAdvisorSchema with person details
- **Component**: `<LuxeAdvisorSEO advisor={advisorData} />`

## Files Modified/Created

### New Files
- `/lib/seo/luxe-structured-data.ts` - Luxe-specific structured data generators
- `/components/seo/LuxeBreadcrumb.tsx` - Luxe breadcrumb component
- `/components/seo/LuxeSEO.tsx` - Main luxe SEO components
- `/components/seo/index.ts` - Export file for easy imports

### Modified Files
- `/lib/seo/breadcrumb-structured-data.ts` - Added luxe-specific breadcrumb functions
- `/app/luxe/page.tsx` - Added LuxeHomeSEO
- `/app/luxe/properties/page.tsx` - Added LuxePropertiesSEO
- `/app/luxe/property/[slug]/page.tsx` - Added LuxePropertySEO
- `/app/luxe/journals/page.tsx` - Added LuxeJournalsSEO
- `/app/luxe/journals/[slug]/page.tsx` - Added LuxeJournalSEO
- `/app/luxe/advisors/page.tsx` - Added LuxeAdvisorsSEO
- `/app/luxe/advisors/[slug]/page.tsx` - Added LuxeAdvisorSEO

## SEO Benefits

1. **Rich Snippets**: Properties, articles, and profiles appear with enhanced information in search results
2. **Knowledge Graph**: Better understanding by search engines of content relationships
3. **Breadcrumb Navigation**: Enhanced user navigation with structured data support
4. **Local SEO**: Improved Dubai real estate market visibility
5. **Mobile Optimization**: Breadcrumbs work seamlessly across all devices
6. **Performance**: Minimal overhead with server-side rendering

## Usage Guidelines

1. **Always include SEO components** at the top of page components
2. **Use page-specific components** instead of the generic LuxeSEO when possible
3. **Provide complete data** for better structured data quality
4. **Test breadcrumbs** with Google's Rich Results Test
5. **Keep descriptions under 160 characters** for optimal snippet display

## Testing

Use Google's [Rich Results Test](https://search.google.com/test/rich-results) to validate:
- Breadcrumb structured data
- Property structured data
- Article structured data
- Person structured data

## Future Enhancements

1. **FAQ Schema**: Add FAQ sections to property and advisor pages
2. **Review Schema**: Integrate client testimonials and reviews
3. **Event Schema**: Add schema for property viewings and events
4. **Video Schema**: Support for property tour videos
5. **LocalBusiness Schema**: Enhanced local business information
