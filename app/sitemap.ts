import {MetadataRoute} from 'next'
import {db} from "@/db/drizzle";
import { eq } from 'drizzle-orm';
import {pageMetaTable} from "@/db/schema/page-meta-table";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const properties = await db.query.propertyTable.findMany({
    with: {
      offeringType: true,
    }
  });
  const articles = await db.query.insightTable.findMany();

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
    ...propertyUrls, // Add property URLs to the sitemap
    ...articleUrls, // Add article URLs to the sitemap
    ...developerUrls, // Add developer URLs to the sitemap
    ...propertyTypeUrls, // Add property type URLs to
    ...communitiesUrl, // Add community URLs to the sitemap
    ...offplanUrls, // Add offplan URLs to the sitemap
  ];
}