import { db } from "@/db/drizzle";
import { NextResponse } from "next/server";

// For static export compatibility - generate at build time
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// Define type for PromiseSettledResult
type PromiseSettledResultType<T> = PromiseSettledResult<T>; 

export async function GET() {
  try {
    // Fetch data for all required entities
    const [properties, articles, propertyTypes, developers, communities, offplans] = 
    await Promise.allSettled([
      db.query.propertyTable.findMany({
        with: { offeringType: true },
      }).catch(() => []),
      db.query.insightTable.findMany().catch(() => []),
      db.query.propertyTypeTable.findMany().catch(() => []),
      db.query.developerTable.findMany().catch(() => []),
      db.query.communityTable.findMany().catch(() => []),
      db.query.offplanTable.findMany().catch(() => []),
    ]);

    // Function to get values from Promise results with proper typing
    const getValues = <T>(result: PromiseSettledResultType<T>): T => 
      result.status === 'fulfilled' ? result.value : [] as unknown as T;

    // Extract values from Promise results
    const propertiesData = getValues(properties);
    const articlesData = getValues(articles);
    const propertyTypesData = getValues(propertyTypes);
    const developersData = getValues(developers);
    const communitiesData = getValues(communities);
    const offplansData = getValues(offplans);

    // Start building urls array with static URLs
    let urls = [
      buildUrl('/', { changefreq: 'monthly', priority: '1.0' }),
      buildUrl('/about-us', { changefreq: 'monthly', priority: '0.8' }),
      buildUrl('/contact-us', { changefreq: 'monthly', priority: '0.8' }),
      buildUrl('/insights', { changefreq: 'daily', priority: '0.8' }),
      buildUrl('/list-with-us', { changefreq: 'monthly', priority: '0.8' }),
      buildUrl('/off-plans', { changefreq: 'daily', priority: '0.8' }),
      buildUrl('/properties/for-sale', { changefreq: 'weekly', priority: '0.8' }),
      buildUrl('/properties/commercial-rent', { changefreq: 'weekly', priority: '0.8' }),
      buildUrl('/properties/commercial-sale', { changefreq: 'weekly', priority: '0.8' }),
      buildUrl('/buying-property-process', { changefreq: 'monthly', priority: '0.8' }),
      buildUrl('/selling-property-process', { changefreq: 'monthly', priority: '0.8' }),
      buildUrl('/renting-property-process', { changefreq: 'monthly', priority: '0.8' }),
      buildUrl('/properties/for-rent', { changefreq: 'monthly', priority: '0.8' }),
      // Add more static URLs from your original sitemap
      buildUrl('/join-us', { changefreq: 'monthly', priority: '0.8' }),
      buildUrl('/our-team', { changefreq: 'monthly', priority: '0.8' }),
    ];

    // Add all the common property type and offering type combinations from your original sitemap
    const propertyTypesSlugs = ['apartments', 'villas', 'townhouses', 'duplexes', 'offices', 'retails', 'penthouses', 'warehouses'];
    const offeringTypes = ['for-sale', 'for-rent', 'commercial-rent', 'commercial-sale'];
    
    propertyTypesSlugs.forEach(propertyType => {
      offeringTypes.forEach(offeringType => {
        urls.push(buildUrl(`/property-types/${propertyType}/${offeringType}`, { 
          changefreq: 'weekly', 
          priority: '0.8' 
        }));
      });
    });

    // Add dynamic URLs based on database data
    // Properties
    if (propertiesData.length > 0) {
      propertiesData.forEach(property => {
        if (property.slug && property.offeringType?.slug) {
          urls.push(
            buildUrl(`/properties/${property.offeringType.slug}/${property.slug}`, {
              lastmod: new Date(property.createdAt).toISOString(),
              changefreq: 'daily',
              priority: '0.8'
            })
          );
        }
      });
    }

    // Articles/Insights
    if (articlesData.length > 0) {
      articlesData.forEach(article => {
        if (article.slug) {
          urls.push(
            buildUrl(`/insights/${article.slug}`, {
              lastmod: new Date(article.createdAt).toISOString(),
              changefreq: 'daily',
              priority: '0.8'
            })
          );
        }
      });
    }

    // Property Types
    if (propertyTypesData.length > 0) {
      propertyTypesData.forEach(propertyType => {
        if (propertyType.slug) {
          urls.push(
            buildUrl(`/property-types/${propertyType.slug}`, {
              lastmod: new Date(propertyType.createdAt).toISOString(),
              changefreq: 'weekly',
              priority: '0.6'
            })
          );
        }
      });
    }

    // Developers
    if (developersData.length > 0) {
      developersData.forEach(developer => {
        if (developer.slug) {
          urls.push(
            buildUrl(`/developers/${developer.slug}`, {
              lastmod: new Date(developer.createdAt).toISOString(),
              changefreq: 'weekly',
              priority: '0.6'
            })
          );
        }
      });
    }

    // Communities
    if (communitiesData.length > 0) {
      communitiesData.forEach(community => {
        if (community.slug) {
          urls.push(
            buildUrl(`/communities/${community.slug}`, {
              lastmod: new Date(community.createdAt).toISOString(),
              changefreq: 'weekly',
              priority: '0.6'
            })
          );
        }
      });
    }

    // Offplans
    if (offplansData.length > 0) {
      offplansData.forEach(offplan => {
        if (offplan.slug) {
          urls.push(
            buildUrl(`/off-plans/${offplan.slug}`, {
              lastmod: new Date(offplan.createdAt).toISOString(),
              changefreq: 'weekly',
              priority: '0.8'
            })
          );
        }
      });
    }

    // Generate XML with caching headers (cache for 1 hour)
    const xml = generateSitemapXml(urls);
    
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600" // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return a basic sitemap with just the home page in case of errors
    const fallbackXml = generateSitemapXml([
      buildUrl('/', { changefreq: 'daily', priority: '1.0' })
    ]);
    
    return new NextResponse(fallbackXml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}

// Define URL options interface for type safety
interface UrlOptions {
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

// Helper function to build URL objects
function buildUrl(path: string, options: UrlOptions): string {
  const { lastmod, changefreq, priority } = options;
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://yourwebsite.com';
  
  return `
    <url>
      <loc>${baseUrl}${path}</loc>
      ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
      ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
      ${priority ? `<priority>${priority}</priority>` : ''}
    </url>`;
}

// Helper function to generate the complete XML
function generateSitemapXml(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('')}
</urlset>`;
}