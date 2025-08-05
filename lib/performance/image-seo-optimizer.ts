/**
 * Image SEO Optimization System
 * Provides automatic alt text generation, image structured data, and image sitemap generation
 */

export interface ImageSEOData {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  description?: string;
  keywords?: string[];
  contentType: 'property' | 'community' | 'agent' | 'insight' | 'general';
  width: number;
  height: number;
  fileSize?: number;
  format?: string;
}

export interface ImageStructuredData {
  '@context': string;
  '@type': string;
  contentUrl: string;
  width: number;
  height: number;
  caption?: string;
  description?: string;
  name?: string;
  author?: {
    '@type': string;
    name: string;
  };
  copyrightHolder?: {
    '@type': string;
    name: string;
  };
  license?: string;
  acquireLicensePage?: string;
  creditText?: string;
}

export interface PropertyImageData extends ImageSEOData {
  propertyId: string;
  propertyTitle: string;
  propertyType: string;
  location: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

export interface ImageSitemapEntry {
  loc: string;
  images: {
    image_loc: string;
    image_caption?: string;
    image_title?: string;
    image_geo_location?: string;
    image_license?: string;
  }[];
}

/**
 * Image SEO Optimizer class
 */
export class ImageSEOOptimizer {
  private static instance: ImageSEOOptimizer;
  private altTextTemplates: Record<string, string[]> = {
    property: [
      '{propertyType} in {location}',
      '{bedrooms} bedroom {propertyType} in {location}',
      'Luxury {propertyType} for sale in {location}',
      '{propertyType} with {bathrooms} bathrooms in {location}',
      '{area} sqft {propertyType} in {location}'
    ],
    community: [
      '{communityName} community in Dubai',
      'Properties in {communityName}',
      '{communityName} residential area',
      'Real estate in {communityName}'
    ],
    agent: [
      '{agentName} - Real Estate Agent',
      '{agentName} - Property Specialist',
      'Contact {agentName} for properties'
    ],
    insight: [
      '{title} - Real Estate Insight',
      '{title} - Property Market Analysis',
      'Dubai Real Estate: {title}'
    ],
    general: [
      'Dubai Real Estate',
      'Property in Dubai',
      'Real Estate Investment'
    ]
  };

  private constructor() {}

  public static getInstance(): ImageSEOOptimizer {
    if (!ImageSEOOptimizer.instance) {
      ImageSEOOptimizer.instance = new ImageSEOOptimizer();
    }
    return ImageSEOOptimizer.instance;
  }

  /**
   * Generate optimized alt text for images
   */
  public generateAltText(imageData: ImageSEOData, context?: Record<string, any>): string {
    const templates = this.altTextTemplates[imageData.contentType] || this.altTextTemplates.general;
    
    // If alt text is already provided and descriptive, use it
    if (imageData.alt && imageData.alt.length > 10 && !this.isGenericAltText(imageData.alt)) {
      return imageData.alt;
    }

    // Select appropriate template based on available context
    let selectedTemplate = templates[0];
    
    if (context) {
      // Find the best template that matches available context data
      for (const template of templates) {
        const requiredFields = this.extractTemplateFields(template);
        const hasAllFields = requiredFields.every(field => context[field]);
        
        if (hasAllFields) {
          selectedTemplate = template;
          break;
        }
      }
    }

    // Replace template variables with actual values
    return this.replaceTemplateVariables(selectedTemplate, context || {});
  }

  /**
   * Generate property-specific alt text
   */
  public generatePropertyAltText(propertyData: PropertyImageData): string {
    const context = {
      propertyType: propertyData.propertyType,
      location: propertyData.location,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      area: propertyData.area,
      price: propertyData.price
    };

    return this.generateAltText(propertyData, context);
  }

  /**
   * Generate structured data for images
   */
  public generateImageStructuredData(imageData: ImageSEOData, context?: Record<string, any>): ImageStructuredData {
    const structuredData: ImageStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: imageData.src,
      width: imageData.width,
      height: imageData.height
    };

    // Add caption if available
    if (imageData.caption) {
      structuredData.caption = imageData.caption;
    }

    // Add description
    if (imageData.description) {
      structuredData.description = imageData.description;
    } else {
      structuredData.description = this.generateImageDescription(imageData, context);
    }

    // Add name/title
    if (imageData.title) {
      structuredData.name = imageData.title;
    } else {
      structuredData.name = this.generateAltText(imageData, context);
    }

    // Add author information for content images
    if (imageData.contentType === 'insight' && context?.author) {
      structuredData.author = {
        '@type': 'Person',
        name: context.author
      };
    }

    // Add copyright holder
    structuredData.copyrightHolder = {
      '@type': 'Organization',
      name: 'The Real Property Exchange'
    };

    // Add license information
    structuredData.license = 'https://trpe.ae/terms-conditions';
    structuredData.acquireLicensePage = 'https://trpe.ae/contact-us';
    structuredData.creditText = 'The Real Property Exchange';

    return structuredData;
  }

  /**
   * Generate property gallery structured data
   */
  public generatePropertyGalleryStructuredData(propertyImages: PropertyImageData[]): any {
    const imageObjects = propertyImages.map(imageData => 
      this.generateImageStructuredData(imageData, {
        propertyType: imageData.propertyType,
        location: imageData.location,
        bedrooms: imageData.bedrooms,
        bathrooms: imageData.bathrooms,
        area: imageData.area
      })
    );

    return {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: `${propertyImages[0]?.propertyTitle} - Property Gallery`,
      description: `Photo gallery of ${propertyImages[0]?.propertyType} in ${propertyImages[0]?.location}`,
      image: imageObjects
    };
  }

  /**
   * Generate image sitemap entries
   */
  public generateImageSitemapEntries(
    pageUrl: string,
    images: ImageSEOData[],
    context?: Record<string, any>
  ): ImageSitemapEntry {
    const imageEntries = images.map(imageData => ({
      image_loc: this.getAbsoluteImageUrl(imageData.src),
      image_caption: imageData.caption || this.generateAltText(imageData, context),
      image_title: imageData.title || this.generateAltText(imageData, context),
      image_geo_location: this.getGeoLocation(imageData, context),
      image_license: 'https://trpe.ae/terms-conditions'
    }));

    return {
      loc: pageUrl,
      images: imageEntries
    };
  }

  /**
   * Optimize image metadata for SEO
   */
  public optimizeImageMetadata(imageData: ImageSEOData, context?: Record<string, any>): ImageSEOData {
    const optimized = { ...imageData };

    // Generate optimized alt text
    optimized.alt = this.generateAltText(imageData, context);

    // Generate title if not provided
    if (!optimized.title) {
      optimized.title = this.generateImageTitle(imageData, context);
    }

    // Generate description if not provided
    if (!optimized.description) {
      optimized.description = this.generateImageDescription(imageData, context);
    }

    // Generate keywords if not provided
    if (!optimized.keywords || optimized.keywords.length === 0) {
      optimized.keywords = this.generateImageKeywords(imageData, context);
    }

    return optimized;
  }

  /**
   * Validate image SEO compliance
   */
  public validateImageSEO(imageData: ImageSEOData): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check alt text
    if (!imageData.alt || imageData.alt.trim().length === 0) {
      issues.push('Missing alt text');
    } else if (imageData.alt.length < 10) {
      suggestions.push('Alt text should be more descriptive (at least 10 characters)');
    } else if (imageData.alt.length > 125) {
      suggestions.push('Alt text should be shorter (under 125 characters)');
    }

    // Check for generic alt text
    if (this.isGenericAltText(imageData.alt)) {
      issues.push('Alt text is too generic');
    }

    // Check image dimensions
    if (imageData.width < 300 || imageData.height < 200) {
      suggestions.push('Image dimensions should be at least 300x200 for better SEO');
    }

    // Check file size (if available)
    if (imageData.fileSize && imageData.fileSize > 500000) { // 500KB
      suggestions.push('Image file size should be optimized (under 500KB)');
    }

    // Check title
    if (!imageData.title) {
      suggestions.push('Consider adding a title attribute for better accessibility');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * Generate bulk image sitemap
   */
  public generateImageSitemap(sitemapEntries: ImageSitemapEntry[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
    const urlsetClose = '</urlset>';

    const urlEntries = sitemapEntries.map(entry => {
      const imageEntries = entry.images.map(image => `
    <image:image>
      <image:loc>${this.escapeXml(image.image_loc)}</image:loc>
      ${image.image_caption ? `<image:caption>${this.escapeXml(image.image_caption)}</image:caption>` : ''}
      ${image.image_title ? `<image:title>${this.escapeXml(image.image_title)}</image:title>` : ''}
      ${image.image_geo_location ? `<image:geo_location>${this.escapeXml(image.image_geo_location)}</image:geo_location>` : ''}
      ${image.image_license ? `<image:license>${this.escapeXml(image.image_license)}</image:license>` : ''}
    </image:image>`).join('');

      return `
  <url>
    <loc>${this.escapeXml(entry.loc)}</loc>${imageEntries}
  </url>`;
    }).join('');

    return `${xmlHeader}\n${urlsetOpen}${urlEntries}\n${urlsetClose}`;
  }

  // Private helper methods

  private isGenericAltText(alt: string): boolean {
    const genericTerms = ['image', 'photo', 'picture', 'img', 'untitled', 'default'];
    const lowerAlt = alt.toLowerCase();
    return genericTerms.some(term => lowerAlt.includes(term) && lowerAlt.length < 20);
  }

  private extractTemplateFields(template: string): string[] {
    const matches = template.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  }

  private replaceTemplateVariables(template: string, context: Record<string, any>): string {
    return template.replace(/\{([^}]+)\}/g, (match, key) => {
      return context[key] ? String(context[key]) : match;
    });
  }

  private generateImageTitle(imageData: ImageSEOData, context?: Record<string, any>): string {
    if (imageData.contentType === 'property' && context) {
      return `${context.propertyType} in ${context.location} - Property Image`;
    }
    return this.generateAltText(imageData, context);
  }

  private generateImageDescription(imageData: ImageSEOData, context?: Record<string, any>): string {
    const baseDescription = this.generateAltText(imageData, context);
    
    switch (imageData.contentType) {
      case 'property':
        return `High-quality image of ${baseDescription}. View more property details and photos.`;
      case 'community':
        return `Explore ${baseDescription} with detailed photos and property listings.`;
      case 'insight':
        return `Visual content for ${baseDescription}. Read the full article for more insights.`;
      default:
        return `${baseDescription} - Dubai Real Estate`;
    }
  }

  private generateImageKeywords(imageData: ImageSEOData, context?: Record<string, any>): string[] {
    const baseKeywords = ['Dubai', 'real estate', 'property'];
    
    switch (imageData.contentType) {
      case 'property':
        const propertyKeywords = ['property for sale', 'Dubai properties'];
        if (context?.propertyType) propertyKeywords.push(context.propertyType);
        if (context?.location) propertyKeywords.push(context.location);
        return [...baseKeywords, ...propertyKeywords];
        
      case 'community':
        return [...baseKeywords, 'community', 'neighborhood', 'residential'];
        
      case 'insight':
        return [...baseKeywords, 'market analysis', 'investment', 'trends'];
        
      default:
        return baseKeywords;
    }
  }

  private getAbsoluteImageUrl(src: string): string {
    if (src.startsWith('http')) {
      return src;
    }
    return `https://trpe.ae${src.startsWith('/') ? src : '/' + src}`;
  }

  private getGeoLocation(imageData: ImageSEOData, context?: Record<string, any>): string | undefined {
    if (imageData.contentType === 'property' && context?.location) {
      return `${context.location}, Dubai, UAE`;
    }
    return 'Dubai, UAE';
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

/**
 * Utility functions for image SEO
 */

/**
 * Create image SEO data from basic image information
 */
export function createImageSEOData(
  src: string,
  contentType: 'property' | 'community' | 'agent' | 'insight' | 'general',
  width: number,
  height: number,
  alt?: string
): ImageSEOData {
  return {
    src,
    alt: alt || '',
    contentType,
    width,
    height
  };
}

/**
 * Create property image data
 */
export function createPropertyImageData(
  src: string,
  propertyId: string,
  propertyTitle: string,
  propertyType: string,
  location: string,
  width: number,
  height: number,
  options?: {
    alt?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    price?: number;
  }
): PropertyImageData {
  return {
    src,
    alt: options?.alt || '',
    contentType: 'property',
    width,
    height,
    propertyId,
    propertyTitle,
    propertyType,
    location,
    bedrooms: options?.bedrooms,
    bathrooms: options?.bathrooms,
    area: options?.area,
    price: options?.price
  };
}

/**
 * Batch optimize images for SEO
 */
export function batchOptimizeImages(
  images: ImageSEOData[],
  context?: Record<string, any>
): ImageSEOData[] {
  const optimizer = ImageSEOOptimizer.getInstance();
  return images.map(image => optimizer.optimizeImageMetadata(image, context));
}

/**
 * Generate image structured data script
 */
export function generateImageStructuredDataScript(
  images: ImageSEOData[],
  context?: Record<string, any>
): string {
  const optimizer = ImageSEOOptimizer.getInstance();
  const structuredDataArray = images.map(image => 
    optimizer.generateImageStructuredData(image, context)
  );

  return `<script type="application/ld+json">
${JSON.stringify(structuredDataArray, null, 2)}
</script>`;
}