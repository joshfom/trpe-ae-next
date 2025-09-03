import { Metadata } from 'next';
import { PropertyType } from '@/types/property';
import { getPageMetaByPath } from '@/actions/page-meta-actions';
import { canonicalURLGenerator } from './canonical-url-generator';
import { robotsMetaGenerator } from './robots-meta-generator';
import { hreflangGenerator } from './hreflang-generator';

export interface SEOMetadata {
  title: string;
  description: string;
  canonical: string;
  openGraph: OpenGraphData;
  twitterCard: TwitterCardData;
  robots: RobotsConfig;
  keywords?: string[];
  hreflang?: HreflangConfig[];
}

export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'website' | 'article' | 'product';
  siteName: string;
  locale?: string;
  alternateLocale?: string[];
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  image: string;
  site?: string;
  creator?: string;
}

export interface RobotsConfig {
  index: boolean;
  follow: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
}

export interface HreflangConfig {
  hreflang: string;
  href: string;
}

export interface PageContext {
  path: string;
  pageType: 'home' | 'properties' | 'property-detail' | 'communities' | 'community-detail' | 'insights' | 'insight-detail' | 'static';
  data?: any;
  locale?: string;
}

export class SEOMetadataGenerator {
  private baseUrl: string;
  private siteName: string;
  private defaultImage: string;
  private twitterHandle: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
    this.siteName = 'TRPE Global - Dubai Real Estate';
    this.defaultImage = `${this.baseUrl}/images/og-default.jpg`;
    this.twitterHandle = '@trpeglobal';
  }

  /**
   * Generate comprehensive SEO metadata for any page type
   */
  async generateMetadata(context: PageContext): Promise<Metadata> {
    const seoData = await this.generateSEOData(context);
    
    return {
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords,
      robots: robotsMetaGenerator.generateRobotsMetaString(context.path, seoData.robots),
      alternates: {
        canonical: seoData.canonical,
        languages: seoData.hreflang?.reduce((acc, lang) => {
          acc[lang.hreflang] = lang.href;
          return acc;
        }, {} as Record<string, string>)
      },
      openGraph: {
        title: seoData.openGraph.title,
        description: seoData.openGraph.description,
        url: seoData.openGraph.url,
        siteName: seoData.openGraph.siteName,
        images: [
          {
            url: seoData.openGraph.image,
            width: 1200,
            height: 630,
            alt: seoData.openGraph.title,
          }
        ],
        locale: seoData.openGraph.locale || 'en_US',
        type: seoData.openGraph.type === 'product' ? 'website' : seoData.openGraph.type,
      },
      twitter: {
        card: seoData.twitterCard.card,
        title: seoData.twitterCard.title,
        description: seoData.twitterCard.description,
        images: [seoData.twitterCard.image],
        site: seoData.twitterCard.site,
        creator: seoData.twitterCard.creator,
      },
      other: {
        'og:image:width': '1200',
        'og:image:height': '630',
        'twitter:image:alt': seoData.openGraph.title,
      }
    };
  }

  /**
   * Generate SEO data based on page context
   */
  private async generateSEOData(context: PageContext): Promise<SEOMetadata> {
    // First check for custom page meta from database
    const pageMeta = await getPageMetaByPath(context.path);
    
    // Generate context-specific metadata
    const contextMetadata = await this.generateContextSpecificMetadata(context);
    
    // Generate canonical URL using the canonical URL generator
    const canonical = canonicalURLGenerator.generateCanonicalURL({ path: context.path });
    
    // Generate robots configuration using the robots meta generator
    const robotsConfig = robotsMetaGenerator.generateRobotsConfig(context.path, {
      ...contextMetadata.robots,
      index: !pageMeta?.noIndex && contextMetadata.robots.index,
      follow: !pageMeta?.noFollow && contextMetadata.robots.follow
    });

    // Generate hreflang tags if multi-language support is needed
    const hreflangTags = context.locale ? hreflangGenerator.generateHreflangTags(context.path, context.locale) : undefined;

    // Merge database meta with generated metadata (database takes precedence)
    return {
      title: pageMeta?.metaTitle || contextMetadata.title,
      description: pageMeta?.metaDescription || contextMetadata.description,
      canonical,
      keywords: pageMeta?.metaKeywords?.split(',').map(k => k.trim()) || contextMetadata.keywords,
      robots: robotsConfig,
      hreflang: hreflangTags,
      openGraph: {
        title: pageMeta?.metaTitle || contextMetadata.openGraph.title,
        description: pageMeta?.metaDescription || contextMetadata.openGraph.description,
        url: canonical,
        siteName: this.siteName,
        type: contextMetadata.openGraph.type,
        image: contextMetadata.openGraph.image,
        locale: context.locale || 'en_US'
      },
      twitterCard: {
        card: contextMetadata.twitterCard.card,
        title: pageMeta?.metaTitle || contextMetadata.twitterCard.title,
        description: pageMeta?.metaDescription || contextMetadata.twitterCard.description,
        image: contextMetadata.twitterCard.image,
        site: this.twitterHandle,
        creator: this.twitterHandle
      }
    };
  }

  /**
   * Generate metadata based on page type and context
   */
  private async generateContextSpecificMetadata(context: PageContext): Promise<Omit<SEOMetadata, 'canonical'>> {
    switch (context.pageType) {
      case 'home':
        return this.generateHomeMetadata();
      
      case 'properties':
        return this.generatePropertiesListingMetadata(context);
      
      case 'property-detail':
        return this.generatePropertyDetailMetadata(context.data as PropertyType);
      
      case 'communities':
        return this.generateCommunitiesListingMetadata(context);
      
      case 'community-detail':
        return this.generateCommunityDetailMetadata(context.data);
      
      case 'insights':
        return this.generateInsightsListingMetadata(context);
      
      case 'insight-detail':
        return this.generateInsightDetailMetadata(context.data);
      
      case 'static':
      default:
        return this.generateStaticPageMetadata(context);
    }
  }

  /**
   * Truncate title to optimal length for SEO (50-60 characters)
   */
  private truncateTitle(title: string, maxLength: number = 60): string {
    if (title.length <= maxLength) return title;
    
    // Find the last space before the limit to avoid cutting words
    const truncated = title.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated.substring(0, maxLength - 3) + '...';
  }

  /**
   * Truncate description to optimal length for SEO (150-160 characters)
   */
  private truncateDescription(description: string, maxLength: number = 160): string {
    if (description.length <= maxLength) return description;
    
    // Find the last space before the limit to avoid cutting words
    const truncated = description.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated.substring(0, maxLength - 3) + '...';
  }

  /**
   * Generate dynamic keywords based on content
   */
  private generateDynamicKeywords(baseKeywords: string[], data?: any): string[] {
    const keywords = [...baseKeywords];
    
    if (data) {
      // Add location-based keywords
      if (data.community?.name) {
        keywords.push(`${data.community.name} properties`);
        keywords.push(`${data.community.name} Dubai`);
      }
      
      // Add property type keywords
      if (data.type?.name) {
        keywords.push(`${data.type.name} Dubai`);
        keywords.push(`Dubai ${data.type.name.toLowerCase()}`);
      }
      
      // Add bedroom count keywords
      if (data.bedrooms) {
        keywords.push(`${data.bedrooms} bedroom ${data.type?.name || 'property'}`);
      }
      
      // Add offering type keywords
      if (data.offeringType?.name) {
        keywords.push(`properties for ${data.offeringType.name.toLowerCase()} Dubai`);
      }
    }
    
    return [...new Set(keywords)]; // Remove duplicates
  }

  private generateHomeMetadata(): Omit<SEOMetadata, 'canonical'> {
    return {
      title: 'Dubai Real Estate | Properties for Sale & Rent | TRPE Global',
      description: 'Find the best properties for sale and rent in Dubai. Browse luxury apartments, villas, and commercial properties with TRPE Global, Dubai\'s leading real estate agency.',
      keywords: ['Dubai real estate', 'properties for sale Dubai', 'Dubai apartments', 'Dubai villas', 'real estate agency Dubai'],
      robots: { index: true, follow: true, maxImagePreview: 'large' },
      openGraph: {
        title: 'TRPE Global - Dubai\'s Premier Real Estate Agency',
        description: 'Discover premium properties in Dubai with TRPE Global. Expert guidance for buying, selling, and renting properties in Dubai\'s most sought-after locations.',
        image: this.defaultImage,
        url: this.baseUrl,
        type: 'website',
        siteName: this.siteName
      },
      twitterCard: {
        card: 'summary_large_image',
        title: 'TRPE Global - Dubai Real Estate',
        description: 'Find your dream property in Dubai with TRPE Global',
        image: this.defaultImage
      }
    };
  }

  private generatePropertiesListingMetadata(context: PageContext): Omit<SEOMetadata, 'canonical'> {
    const offeringType = context.data?.offeringType || 'Properties';
    const community = context.data?.community;
    const propertyType = context.data?.propertyType;
    
    // Dynamic title based on filters
    let titleParts = [offeringType];
    if (propertyType) titleParts.unshift(propertyType);
    if (community) titleParts.push(`in ${community}`);
    titleParts.push('Dubai | TRPE Global');
    
    const baseTitle = titleParts.join(' ');
    const title = this.truncateTitle(baseTitle);
    
    // Dynamic description
    let descriptionParts = [`Browse ${offeringType.toLowerCase()}`];
    if (propertyType) descriptionParts[0] = `Browse ${propertyType.toLowerCase()} ${offeringType.toLowerCase()}`;
    descriptionParts.push('for sale and rent in Dubai');
    if (community) descriptionParts.push(`in ${community}`);
    descriptionParts.push('Find apartments, villas, and commercial properties with detailed information and high-quality images.');
    
    const baseDescription = descriptionParts.join(' ');
    const description = this.truncateDescription(baseDescription);
    
    const baseKeywords = [
      `Dubai ${offeringType.toLowerCase()}`,
      `${offeringType} for sale Dubai`,
      `${offeringType} for rent Dubai`
    ];
    const keywords = this.generateDynamicKeywords(baseKeywords, context.data);
    
    const ogTitle = this.truncateTitle(`${offeringType} in Dubai | TRPE Global`, 55);
    const ogDescription = this.truncateDescription(
      `Explore premium ${offeringType.toLowerCase()} in Dubai's most desirable locations${community ? ` including ${community}` : ''}`,
      155
    );
    
    return {
      title,
      description,
      keywords,
      robots: { 
        index: true, 
        follow: true, 
        maxImagePreview: 'large',
        maxSnippet: 160
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        image: this.defaultImage,
        url: `${this.baseUrl}${context.path}`,
        type: 'website',
        siteName: this.siteName
      },
      twitterCard: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        image: this.defaultImage
      }
    };
  }

  private generatePropertyDetailMetadata(property: PropertyType): Omit<SEOMetadata, 'canonical'> {
    const baseTitle = `${property.title} | ${property.community?.name} | TRPE Global`;
    const title = this.truncateTitle(baseTitle);
    
    const baseDescription = `${property.bedrooms} bedroom ${property.type?.name} for ${property.offeringType?.name?.toLowerCase()} in ${property.community?.name}, Dubai. ${property.size ? `${Math.round(property.size / 100)} sqft` : ''} ${property.price ? `- AED ${property.price.toLocaleString()}` : ''}`;
    const description = this.truncateDescription(baseDescription);
    
    const image = property.images?.[0]?.crmUrl || this.defaultImage;
    
    const baseKeywords = [
      'Dubai real estate',
      `${property.type?.name} Dubai`,
      `properties for ${property.offeringType?.name?.toLowerCase()} Dubai`
    ];
    const keywords = this.generateDynamicKeywords(baseKeywords, property);
    
    // Enhanced Open Graph for property listings
    const openGraphTitle = this.truncateTitle(`${property.title} - ${property.community?.name}`, 55);
    const openGraphDescription = this.truncateDescription(
      `${property.bedrooms}BR ${property.type?.name} in ${property.community?.name}. ${property.price ? `AED ${property.price.toLocaleString()}` : 'Contact for price'}`,
      155
    );
    
    return {
      title,
      description,
      keywords,
      robots: { 
        index: true, 
        follow: true, 
        maxImagePreview: 'large',
        maxSnippet: 160
      },
      openGraph: {
        title: openGraphTitle,
        description: openGraphDescription,
        image,
        url: `${this.baseUrl}/properties/${property.offeringType?.slug}/${property.slug}`,
        type: 'product',
        siteName: this.siteName
      },
      twitterCard: {
        card: 'summary_large_image',
        title: openGraphTitle,
        description: openGraphDescription,
        image
      }
    };
  }

  private generateCommunitiesListingMetadata(context: PageContext): Omit<SEOMetadata, 'canonical'> {
    return {
      title: 'Dubai Communities & Neighborhoods | Property Areas | TRPE Global',
      description: 'Explore Dubai\'s most prestigious communities and neighborhoods. Find properties in prime locations including Downtown Dubai, Dubai Marina, Palm Jumeirah, and more.',
      keywords: ['Dubai communities', 'Dubai neighborhoods', 'Dubai areas', 'Dubai locations', 'property areas Dubai'],
      robots: { index: true, follow: true, maxImagePreview: 'large' },
      openGraph: {
        title: 'Dubai Communities & Neighborhoods | TRPE Global',
        description: 'Discover Dubai\'s premium communities and find your perfect neighborhood',
        image: this.defaultImage,
        url: `${this.baseUrl}${context.path}`,
        type: 'website',
        siteName: this.siteName
      },
      twitterCard: {
        card: 'summary_large_image',
        title: 'Dubai Communities | TRPE Global',
        description: 'Explore Dubai\'s most desirable neighborhoods',
        image: this.defaultImage
      }
    };
  }

  private generateCommunityDetailMetadata(community: any): Omit<SEOMetadata, 'canonical'> {
    const baseTitle = `${community.name} Properties | Dubai Real Estate | TRPE Global`;
    const title = this.truncateTitle(baseTitle);
    
    const baseDescription = `Find properties for sale and rent in ${community.name}, Dubai. Browse apartments, villas, and commercial properties in this premium Dubai community.${community.description ? ` ${community.description}` : ''}`;
    const description = this.truncateDescription(baseDescription);
    
    const baseKeywords = [
      `${community.name} properties`,
      `${community.name} Dubai`,
      `properties in ${community.name}`,
      'Dubai real estate'
    ];
    const keywords = this.generateDynamicKeywords(baseKeywords, community);
    
    const ogTitle = this.truncateTitle(`${community.name} - Dubai Community | TRPE Global`, 55);
    const ogDescription = this.truncateDescription(
      `Discover ${community.name}, one of Dubai's premier communities. Find luxury properties and learn about amenities, location, and lifestyle.`,
      155
    );
    
    return {
      title,
      description,
      keywords,
      robots: { 
        index: true, 
        follow: true, 
        maxImagePreview: 'large',
        maxSnippet: 160
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        image: community.image || this.defaultImage,
        url: `${this.baseUrl}/communities/${community.slug}`,
        type: 'website',
        siteName: this.siteName
      },
      twitterCard: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        image: community.image || this.defaultImage
      }
    };
  }

  private generateInsightsListingMetadata(context: PageContext): Omit<SEOMetadata, 'canonical'> {
    return {
      title: 'Dubai Real Estate Insights & Market News | TRPE Global',
      description: 'Stay updated with the latest Dubai real estate market insights, property trends, investment opportunities, and expert analysis from TRPE Global.',
      keywords: ['Dubai real estate news', 'property market insights', 'Dubai property trends', 'real estate investment Dubai'],
      robots: { index: true, follow: true, maxImagePreview: 'large' },
      openGraph: {
        title: 'Dubai Real Estate Insights | TRPE Global',
        description: 'Expert insights and analysis on Dubai\'s real estate market',
        image: this.defaultImage,
        url: `${this.baseUrl}${context.path}`,
        type: 'website',
        siteName: this.siteName
      },
      twitterCard: {
        card: 'summary_large_image',
        title: 'Dubai Real Estate Insights',
        description: 'Latest market trends and expert analysis',
        image: this.defaultImage
      }
    };
  }

  private generateInsightDetailMetadata(insight: any): Omit<SEOMetadata, 'canonical'> {
    const baseTitle = `${insight.title} | Dubai Real Estate Insights | TRPE Global`;
    const title = this.truncateTitle(baseTitle);
    
    const baseDescription = insight.excerpt || `Read the latest insights about Dubai real estate market trends, investment opportunities, and expert analysis from TRPE Global.`;
    const description = this.truncateDescription(baseDescription);
    
    const baseKeywords = [
      'Dubai real estate',
      'property insights',
      'market analysis',
      'Dubai property market',
      'real estate investment Dubai'
    ];
    
    // Add insight-specific keywords
    if (insight.tags) {
      baseKeywords.push(...insight.tags);
    }
    if (insight.category) {
      baseKeywords.push(insight.category);
    }
    
    const keywords = [...new Set(baseKeywords)];
    
    const ogTitle = this.truncateTitle(insight.title, 55);
    const ogDescription = this.truncateDescription(
      insight.excerpt || `Expert insights on Dubai real estate market trends and investment opportunities.`,
      155
    );
    
    return {
      title,
      description,
      keywords,
      robots: { 
        index: true, 
        follow: true, 
        maxImagePreview: 'large',
        maxSnippet: 160
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        image: insight.featuredImage || this.defaultImage,
        url: `${this.baseUrl}/insights/${insight.slug}`,
        type: 'article',
        siteName: this.siteName
      },
      twitterCard: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        image: insight.featuredImage || this.defaultImage
      }
    };
  }

  private generateStaticPageMetadata(context: PageContext): Omit<SEOMetadata, 'canonical'> {
    const pathSegments = context.path.split('/').filter(Boolean);
    const pageName = pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ') || 'Page';
    const title = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} | TRPE Global`;
    
    return {
      title,
      description: `Learn more about TRPE Global and our services in Dubai real estate.`,
      keywords: ['TRPE Global', 'Dubai real estate', pageName],
      robots: { index: true, follow: true },
      openGraph: {
        title,
        description: `${title} - TRPE Global Dubai Real Estate`,
        image: this.defaultImage,
        url: `${this.baseUrl}${context.path}`,
        type: 'website',
        siteName: this.siteName
      },
      twitterCard: {
        card: 'summary',
        title,
        description: `${title} - TRPE Global`,
        image: this.defaultImage
      }
    };
  }

  private formatRobotsString(robots: RobotsConfig): string {
    const directives: string[] = [];
    
    if (!robots.index) directives.push('noindex');
    if (!robots.follow) directives.push('nofollow');
    if (robots.noarchive) directives.push('noarchive');
    if (robots.nosnippet) directives.push('nosnippet');
    if (robots.noimageindex) directives.push('noimageindex');
    if (robots.maxSnippet) directives.push(`max-snippet:${robots.maxSnippet}`);
    if (robots.maxImagePreview) directives.push(`max-image-preview:${robots.maxImagePreview}`);
    if (robots.maxVideoPreview) directives.push(`max-video-preview:${robots.maxVideoPreview}`);
    
    return directives.length > 0 ? directives.join(', ') : 'index, follow';
  }
}

// Export singleton instance
export const seoMetadataGenerator = new SEOMetadataGenerator();