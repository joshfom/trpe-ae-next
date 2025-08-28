import {MetadataRoute} from 'next'
import {db} from "@/db/drizzle";
import { eq, and } from 'drizzle-orm';
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {insightTable} from "@/db/schema/insight-table";
import {propertyTable} from "@/db/schema/property-table";

// For static export compatibility
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  try {
    const properties = await db.query.propertyTable.findMany({
      with: {
        offeringType: true,
      }
    });
    const articles = await db.query.insightTable.findMany();
    
    // Fetch luxe journals (insights with isLuxe: true)
    const luxeJournals = await db.query.insightTable.findMany({
      where: and(
        eq(insightTable.isLuxe, true),
        eq(insightTable.isPublished, "yes")
      ),
      with: {
        author: true
      }
    });
    
    // Fetch luxe properties (properties with isLuxe: true)
    const luxeProperties = await db.query.propertyTable.findMany({
      where: eq(propertyTable.isLuxe, true),
      with: {
        offeringType: true,
      }
    });

    const propertyTypes = await db.query.propertyTypeTable.findMany();
    const developers = await db.query.developerTable.findMany();
    const communities = await db.query.communityTable.findMany();
    const offplans = await db.query.offplanTable.findMany();
    const pages = await db.query.pageMetaTable.findMany({
      where: (eq(pageMetaTable.includeInSitemap, true))
    })

    const propertyUrls = properties.map(property => ({
      url: `${process.env.NEXT_PUBLIC_URL}/properties/${property.offeringType?.slug}/${property.slug}`,
      lastModified: new Date(property.createdAt),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));


  const articleUrls = articles.map(article => ({
    url: `${process.env.NEXT_PUBLIC_URL}/insights/${article.slug}`,
    lastModified: new Date(article.createdAt),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Generate URLs for luxe journals
  const luxeJournalUrls = luxeJournals.map(journal => ({
    url: `${process.env.NEXT_PUBLIC_URL}/luxe/journals/${journal.slug}`,
    lastModified: new Date(journal.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Generate URLs for luxe properties
  const luxePropertyUrls = luxeProperties.map(property => ({
    url: `${process.env.NEXT_PUBLIC_URL}/luxe/properties/${property.offeringType?.slug}/${property.slug}`,
    lastModified: new Date(property.createdAt),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));


  const developerUrls = developers.map(developer => ({
    url: `${process.env.NEXT_PUBLIC_URL}/developers/${developer.slug}`,
    lastModified: new Date(developer.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));


  const communitiesUrl = communities.map(community => ({
    url: `${process.env.NEXT_PUBLIC_URL}/communities/${community.slug}`,
    lastModified: new Date(community.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const propertyTypeUrls = propertyTypes.map(propertyType => ({
    url: `${process.env.NEXT_PUBLIC_URL}/property-types/${propertyType.slug}`,
    lastModified: new Date(propertyType.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const offplanUrls = offplans.map(offplan => ({
    url: `${process.env.NEXT_PUBLIC_URL}/off-plans/${offplan.slug}`,
    lastModified: new Date(offplan.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

    const pageUrls = pages.map(page => ({
        url: `${process.env.NEXT_PUBLIC_URL}/${page.path}`,
        lastModified: new Date(page.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));


  return [
    {
      url: `${process.env.NEXT_PUBLIC_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/luxe`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/luxe/journals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/luxe/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/luxe/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/luxe/advisors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/luxe/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/luxe/list-with-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/luxe/dubai/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/insights`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/list-with-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/off-plans`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/properties/for-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },


    {
      url: `${process.env.NEXT_PUBLIC_URL}/properties/commercial-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/properties/commercial-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/buying-property-process`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/selling-property-process`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/renting-property-process`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/properties/for-rent`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/apartments/for-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/villas/for-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/townhouses/for-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/duplexes/for-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/offices/for-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/retails/for-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/penthouses/for-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/warehouses/for-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/apartments/for-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/villas/for-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/townhouses/for-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/duplexes/for-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/offices/for-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/retails/for-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/penthouses/for-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/warehouses/for-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/apartments/commercial-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/villas/commercial-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/townhouses/commercial-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/duplexes/commercial-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/offices/commercial-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/retails/commercial-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/penthouses/commercial-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/warehouses/commercial-rent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/apartments/commercial-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/villas/commercial-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/townhouses/commercial-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/duplexes/commercial-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/offices/commercial-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/retails/commercial-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/penthouses/commercial-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/property-types/warehouses/commercial-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/join-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/our-team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/landing/enlgish-form`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    ...propertyUrls, // Add property URLs to the sitemap
    ...articleUrls, // Add article URLs to the sitemap
    ...luxeJournalUrls, // Add luxe journal URLs to the sitemap
    ...luxePropertyUrls, // Add luxe property URLs to the sitemap
    ...developerUrls, // Add developer URLs to the sitemap
    ...propertyTypeUrls, // Add property type URLs to
    ...communitiesUrl, // Add community URLs to the sitemap
    ...offplanUrls, // Add offplan URLs to the sitemap
    ...pageUrls, // Add page URLs to the sitemap
  ];
  } catch (error) {
    console.warn('Database unavailable during sitemap generation, returning basic sitemap:', error);
    // Return a basic sitemap when database is unavailable (e.g., during build)
    return [
      {
        url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/about-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/contact-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
    ];
  }
}