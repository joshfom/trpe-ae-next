"use server";

export interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
  description?: string;
  image?: string;
}

export interface BreadcrumbConfig {
  baseUrl: string;
  includeHome: boolean;
  homeLabel: string;
  homeUrl: string;
  maxItems?: number;
  includeCurrentPage: boolean;
}

export interface BreadcrumbStructuredDataSchema {
  '@context': string;
  '@type': string;
  '@id': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: {
      '@type': string;
      '@id': string;
      url: string;
      name: string;
      description?: string;
      image?: string;
    };
  }>;
  numberOfItems: number;
  itemListOrder: string;
}

export interface PropertyBreadcrumbData {
  title: string;
  slug: string;
  description?: string;
  image?: string;
  offeringType?: { 
    name: string; 
    slug: string; 
    description?: string;
  };
  propertyType?: { 
    name: string; 
    slug: string; 
    description?: string;
  };
  community?: { 
    name: string; 
    slug: string; 
    description?: string;
    image?: string;
  };
  subCommunity?: { 
    name: string; 
    slug: string; 
    description?: string;
  };
  city?: { 
    name: string; 
    slug: string; 
    description?: string;
  };
}

export interface CommunityBreadcrumbData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCommunity?: { 
    name: string; 
    slug: string; 
    description?: string;
  };
  city?: { 
    name: string; 
    slug: string; 
    description?: string;
  };
}

export interface InsightBreadcrumbData {
  title: string;
  slug: string;
  description?: string;
  image?: string;
  category?: {
    name: string;
    slug: string;
    description?: string;
  };
  author?: {
    name: string;
    slug: string;
  };
}

/**
 * BreadcrumbStructuredData class for generating dynamic breadcrumb structured data
 * with enhanced SEO optimization and flexible path generation
 */
export class BreadcrumbStructuredData {
  private config: BreadcrumbConfig;

  constructor(config?: Partial<BreadcrumbConfig>) {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_URL || 'https://trpe.ae',
      includeHome: true,
      homeLabel: 'Home',
      homeUrl: '/',
      maxItems: 8,
      includeCurrentPage: true,
      ...config
    };
  }

  /**
   * Generate breadcrumb structured data from breadcrumb items
   */
  generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbStructuredDataSchema {
    // Prepare items with home if needed
    let breadcrumbItems = [...items];
    
    if (this.config.includeHome && !breadcrumbItems.some(item => item.url === this.config.homeUrl)) {
      breadcrumbItems.unshift({
        name: this.config.homeLabel,
        url: this.config.homeUrl,
        description: 'TRPE Global - Dubai Real Estate Home Page'
      });
    }

    // Filter out current page if not included
    if (!this.config.includeCurrentPage) {
      breadcrumbItems = breadcrumbItems.filter(item => !item.current);
    }

    // Limit items if maxItems is set
    if (this.config.maxItems && breadcrumbItems.length > this.config.maxItems) {
      breadcrumbItems = [
        breadcrumbItems[0], // Keep home
        ...breadcrumbItems.slice(-(this.config.maxItems - 1)) // Keep last N-1 items
      ];
    }

    // Ensure URLs are absolute
    const normalizedItems = breadcrumbItems.map(item => ({
      ...item,
      url: this.normalizeUrl(item.url)
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${normalizedItems[normalizedItems.length - 1]?.url}#breadcrumb`,
      itemListElement: normalizedItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: {
          '@type': 'WebPage',
          '@id': item.url,
          url: item.url,
          name: item.name,
          description: item.description,
          image: item.image
        }
      })),
      numberOfItems: normalizedItems.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending'
    };
  }

  /**
   * Generate property-specific breadcrumb structured data
   */
  generatePropertyBreadcrumbSchema(property: PropertyBreadcrumbData): BreadcrumbStructuredDataSchema {
    const breadcrumbs: BreadcrumbItem[] = [
      { 
        name: 'Properties', 
        url: '/properties',
        description: 'Browse all properties for sale and rent in Dubai'
      }
    ];

    // Add offering type (Sale/Rent)
    if (property.offeringType) {
      breadcrumbs.push({
        name: property.offeringType.name,
        url: `/properties/${property.offeringType.slug}`,
        description: property.offeringType.description || `Properties for ${property.offeringType.name.toLowerCase()} in Dubai`
      });
    }

    // Add property type if different from offering type
    if (property.propertyType && property.offeringType) {
      breadcrumbs.push({
        name: property.propertyType.name,
        url: `/properties/${property.offeringType.slug}/${property.propertyType.slug}`,
        description: property.propertyType.description || `${property.propertyType.name} properties for ${property.offeringType.name.toLowerCase()}`
      });
    }

    // Add city if available
    if (property.city) {
      breadcrumbs.push({
        name: property.city.name,
        url: `/dubai/${property.city.slug}`,
        description: property.city.description || `Properties in ${property.city.name}`
      });
    }

    // Add community
    if (property.community) {
      breadcrumbs.push({
        name: property.community.name,
        url: `/communities/${property.community.slug}`,
        description: property.community.description || `Properties in ${property.community.name} community`,
        image: property.community.image
      });
    }

    // Add sub-community if available
    if (property.subCommunity && property.community) {
      breadcrumbs.push({
        name: property.subCommunity.name,
        url: `/communities/${property.community.slug}/${property.subCommunity.slug}`,
        description: property.subCommunity.description || `Properties in ${property.subCommunity.name}`
      });
    }

    // Add current property
    breadcrumbs.push({
      name: property.title,
      url: `/properties/${property.offeringType?.slug || 'sale'}/${property.slug}`,
      description: property.description || `${property.title} - Property details`,
      image: property.image,
      current: true
    });

    return this.generateBreadcrumbSchema(breadcrumbs);
  }

  /**
   * Generate community-specific breadcrumb structured data
   */
  generateCommunityBreadcrumbSchema(community: CommunityBreadcrumbData): BreadcrumbStructuredDataSchema {
    const breadcrumbs: BreadcrumbItem[] = [
      { 
        name: 'Communities', 
        url: '/communities',
        description: 'Explore Dubai communities and neighborhoods'
      }
    ];

    // Add city if available
    if (community.city) {
      breadcrumbs.push({
        name: community.city.name,
        url: `/dubai/${community.city.slug}`,
        description: community.city.description || `Communities in ${community.city.name}`
      });
    }

    // Add parent community if available
    if (community.parentCommunity) {
      breadcrumbs.push({
        name: community.parentCommunity.name,
        url: `/communities/${community.parentCommunity.slug}`,
        description: community.parentCommunity.description || `${community.parentCommunity.name} community overview`
      });
    }

    // Add current community
    breadcrumbs.push({
      name: community.name,
      url: `/communities/${community.slug}`,
      description: community.description || `${community.name} community - Properties and amenities`,
      image: community.image,
      current: true
    });

    return this.generateBreadcrumbSchema(breadcrumbs);
  }

  /**
   * Generate insight/article-specific breadcrumb structured data
   */
  generateInsightBreadcrumbSchema(insight: InsightBreadcrumbData): BreadcrumbStructuredDataSchema {
    const breadcrumbs: BreadcrumbItem[] = [
      { 
        name: 'Insights', 
        url: '/insights',
        description: 'Dubai real estate market insights and analysis'
      }
    ];

    // Add category if available
    if (insight.category) {
      breadcrumbs.push({
        name: insight.category.name,
        url: `/insights/category/${insight.category.slug}`,
        description: insight.category.description || `${insight.category.name} insights and articles`
      });
    }

    // Add author if available
    if (insight.author) {
      breadcrumbs.push({
        name: `By ${insight.author.name}`,
        url: `/insights/author/${insight.author.slug}`,
        description: `Articles by ${insight.author.name}`
      });
    }

    // Add current insight
    breadcrumbs.push({
      name: insight.title,
      url: `/insights/${insight.slug}`,
      description: insight.description || `${insight.title} - Real estate insight`,
      image: insight.image,
      current: true
    });

    return this.generateBreadcrumbSchema(breadcrumbs);
  }

  /**
   * Generate breadcrumb structured data from URL path
   */
  generatePathBreadcrumbSchema(path: string, pageTitle?: string, pageDescription?: string): BreadcrumbStructuredDataSchema {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    segments.forEach((segment, index) => {
      const url = '/' + segments.slice(0, index + 1).join('/');
      const name = this.formatSegmentName(segment);
      const isLast = index === segments.length - 1;

      breadcrumbs.push({
        name: isLast && pageTitle ? pageTitle : name,
        url,
        description: isLast && pageDescription ? pageDescription : this.generateSegmentDescription(segment, name),
        current: isLast
      });
    });

    return this.generateBreadcrumbSchema(breadcrumbs);
  }

  /**
   * Generate agent-specific breadcrumb structured data
   */
  generateAgentBreadcrumbSchema(agent: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    team?: { name: string; slug: string };
  }): BreadcrumbStructuredDataSchema {
    const breadcrumbs: BreadcrumbItem[] = [
      { 
        name: 'Our Team', 
        url: '/our-team',
        description: 'Meet our professional real estate agents'
      }
    ];

    // Add team if available
    if (agent.team) {
      breadcrumbs.push({
        name: agent.team.name,
        url: `/our-team/${agent.team.slug}`,
        description: `${agent.team.name} team members`
      });
    }

    // Add current agent
    breadcrumbs.push({
      name: agent.name,
      url: `/our-team/${agent.slug}`,
      description: agent.description || `${agent.name} - Real estate agent profile`,
      image: agent.image,
      current: true
    });

    return this.generateBreadcrumbSchema(breadcrumbs);
  }

  /**
   * Generate off-plan project breadcrumb structured data
   */
  generateOffPlanBreadcrumbSchema(project: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    developer?: { name: string; slug: string };
    community?: { name: string; slug: string };
  }): BreadcrumbStructuredDataSchema {
    const breadcrumbs: BreadcrumbItem[] = [
      { 
        name: 'Off-Plan Projects', 
        url: '/off-plan',
        description: 'Explore new development projects in Dubai'
      }
    ];

    // Add developer if available
    if (project.developer) {
      breadcrumbs.push({
        name: project.developer.name,
        url: `/developers/${project.developer.slug}`,
        description: `Projects by ${project.developer.name}`
      });
    }

    // Add community if available
    if (project.community) {
      breadcrumbs.push({
        name: project.community.name,
        url: `/communities/${project.community.slug}`,
        description: `Off-plan projects in ${project.community.name}`
      });
    }

    // Add current project
    breadcrumbs.push({
      name: project.name,
      url: `/off-plan/${project.slug}`,
      description: project.description || `${project.name} - Off-plan project details`,
      image: project.image,
      current: true
    });

    return this.generateBreadcrumbSchema(breadcrumbs);
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<BreadcrumbConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): BreadcrumbConfig {
    return { ...this.config };
  }

  /**
   * Normalize URL to absolute format
   */
  private normalizeUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    
    if (url.startsWith('/')) {
      return `${this.config.baseUrl}${url}`;
    }
    
    return `${this.config.baseUrl}/${url}`;
  }

  /**
   * Format URL segment to readable name
   */
  private formatSegmentName(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Generate description for URL segment
   */
  private generateSegmentDescription(segment: string, name: string): string {
    const descriptions: Record<string, string> = {
      'properties': 'Browse all properties for sale and rent in Dubai',
      'communities': 'Explore Dubai communities and neighborhoods',
      'insights': 'Dubai real estate market insights and analysis',
      'off-plan': 'New development projects in Dubai',
      'developers': 'Leading real estate developers in Dubai',
      'our-team': 'Professional real estate agents and consultants',
      'about-us': 'About TRPE Global - Your trusted real estate partner',
      'contact-us': 'Contact TRPE Global for real estate services',
      'sale': 'Properties for sale in Dubai',
      'rent': 'Properties for rent in Dubai',
      'buy': 'Buy properties in Dubai',
      'dubai': 'Dubai real estate market and properties'
    };

    return descriptions[segment] || `${name} - TRPE Global`;
  }
}

// Export singleton instance
export const breadcrumbStructuredData = new BreadcrumbStructuredData();