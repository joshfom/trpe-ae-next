/**
 * @jest-environment jsdom
 */

import {
  ImageSEOOptimizer,
  createImageSEOData,
  createPropertyImageData,
  batchOptimizeImages,
  generateImageStructuredDataScript,
  ImageSEOData,
  PropertyImageData
} from '../image-seo-optimizer';

describe('ImageSEOOptimizer', () => {
  let optimizer: ImageSEOOptimizer;

  beforeEach(() => {
    optimizer = ImageSEOOptimizer.getInstance();
  });

  describe('Alt Text Generation', () => {
    it('should generate alt text for property images', () => {
      const imageData: ImageSEOData = {
        src: 'property.jpg',
        alt: '',
        contentType: 'property',
        width: 800,
        height: 600
      };

      const context = {
        propertyType: 'Villa',
        location: 'Dubai Marina',
        bedrooms: 3,
        bathrooms: 2
      };

      const altText = optimizer.generateAltText(imageData, context);

      expect(altText).toContain('Villa');
      expect(altText).toContain('Dubai Marina');
    });

    it('should use existing descriptive alt text', () => {
      const imageData: ImageSEOData = {
        src: 'property.jpg',
        alt: 'Luxury 3-bedroom villa with swimming pool in Dubai Marina',
        contentType: 'property',
        width: 800,
        height: 600
      };

      const altText = optimizer.generateAltText(imageData);

      expect(altText).toBe('Luxury 3-bedroom villa with swimming pool in Dubai Marina');
    });

    it('should replace generic alt text', () => {
      const imageData: ImageSEOData = {
        src: 'property.jpg',
        alt: 'image',
        contentType: 'property',
        width: 800,
        height: 600
      };

      const context = {
        propertyType: 'Apartment',
        location: 'Downtown Dubai'
      };

      const altText = optimizer.generateAltText(imageData, context);

      expect(altText).not.toBe('image');
      expect(altText).toContain('Apartment');
      expect(altText).toContain('Downtown Dubai');
    });

    it('should generate alt text for community images', () => {
      const imageData: ImageSEOData = {
        src: 'community.jpg',
        alt: '',
        contentType: 'community',
        width: 800,
        height: 600
      };

      const context = {
        communityName: 'Dubai Marina'
      };

      const altText = optimizer.generateAltText(imageData, context);

      expect(altText).toContain('Dubai Marina');
      expect(altText).toContain('community');
    });

    it('should generate alt text for agent images', () => {
      const imageData: ImageSEOData = {
        src: 'agent.jpg',
        alt: '',
        contentType: 'agent',
        width: 400,
        height: 400
      };

      const context = {
        agentName: 'John Smith'
      };

      const altText = optimizer.generateAltText(imageData, context);

      expect(altText).toContain('John Smith');
      expect(altText).toContain('Real Estate Agent');
    });
  });

  describe('Property Alt Text Generation', () => {
    it('should generate comprehensive property alt text', () => {
      const propertyData: PropertyImageData = {
        src: 'villa.jpg',
        alt: '',
        contentType: 'property',
        width: 1200,
        height: 800,
        propertyId: 'prop-123',
        propertyTitle: 'Luxury Villa in Emirates Hills',
        propertyType: 'Villa',
        location: 'Emirates Hills',
        bedrooms: 5,
        bathrooms: 6,
        area: 8000,
        price: 15000000
      };

      const altText = optimizer.generatePropertyAltText(propertyData);

      expect(altText).toContain('Villa');
      expect(altText).toContain('Emirates Hills');
      expect(altText.length).toBeGreaterThan(10);
    });
  });

  describe('Structured Data Generation', () => {
    it('should generate image structured data', () => {
      const imageData: ImageSEOData = {
        src: 'https://example.com/property.jpg',
        alt: 'Luxury villa in Dubai Marina',
        contentType: 'property',
        width: 1200,
        height: 800,
        title: 'Dubai Marina Villa',
        description: 'Beautiful villa with sea view'
      };

      const structuredData = optimizer.generateImageStructuredData(imageData);

      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('ImageObject');
      expect(structuredData.contentUrl).toBe('https://example.com/property.jpg');
      expect(structuredData.width).toBe(1200);
      expect(structuredData.height).toBe(800);
      expect(structuredData.name).toBe('Dubai Marina Villa');
      expect(structuredData.description).toBe('Beautiful villa with sea view');
      expect(structuredData.copyrightHolder?.name).toBe('The Real Property Exchange');
    });

    it('should generate structured data with author for insights', () => {
      const imageData: ImageSEOData = {
        src: 'insight.jpg',
        alt: 'Market analysis chart',
        contentType: 'insight',
        width: 800,
        height: 600
      };

      const context = {
        author: 'Jane Doe'
      };

      const structuredData = optimizer.generateImageStructuredData(imageData, context);

      expect(structuredData.author?.name).toBe('Jane Doe');
      expect(structuredData.author?.['@type']).toBe('Person');
    });

    it('should generate property gallery structured data', () => {
      const propertyImages: PropertyImageData[] = [
        {
          src: 'image1.jpg',
          alt: 'Living room',
          contentType: 'property',
          width: 800,
          height: 600,
          propertyId: 'prop-123',
          propertyTitle: 'Luxury Apartment',
          propertyType: 'Apartment',
          location: 'Dubai Marina'
        },
        {
          src: 'image2.jpg',
          alt: 'Bedroom',
          contentType: 'property',
          width: 800,
          height: 600,
          propertyId: 'prop-123',
          propertyTitle: 'Luxury Apartment',
          propertyType: 'Apartment',
          location: 'Dubai Marina'
        }
      ];

      const galleryData = optimizer.generatePropertyGalleryStructuredData(propertyImages);

      expect(galleryData['@type']).toBe('ImageGallery');
      expect(galleryData.name).toContain('Luxury Apartment');
      expect(galleryData.image).toHaveLength(2);
      expect(galleryData.image[0]['@type']).toBe('ImageObject');
    });
  });

  describe('Image Sitemap Generation', () => {
    it('should generate image sitemap entries', () => {
      const images: ImageSEOData[] = [
        {
          src: '/images/property1.jpg',
          alt: 'Villa exterior',
          contentType: 'property',
          width: 1200,
          height: 800,
          caption: 'Beautiful villa exterior'
        },
        {
          src: '/images/property2.jpg',
          alt: 'Villa interior',
          contentType: 'property',
          width: 1200,
          height: 800,
          title: 'Spacious living room'
        }
      ];

      const sitemapEntry = optimizer.generateImageSitemapEntries(
        'https://trpe.ae/properties/villa-123',
        images
      );

      expect(sitemapEntry.loc).toBe('https://trpe.ae/properties/villa-123');
      expect(sitemapEntry.images).toHaveLength(2);
      expect(sitemapEntry.images[0].image_loc).toBe('https://trpe.ae/images/property1.jpg');
      expect(sitemapEntry.images[0].image_caption).toBe('Beautiful villa exterior');
      expect(sitemapEntry.images[1].image_title).toBe('Spacious living room');
    });

    it('should generate complete image sitemap XML', () => {
      const sitemapEntries = [
        {
          loc: 'https://trpe.ae/properties/villa-123',
          images: [
            {
              image_loc: 'https://trpe.ae/images/villa1.jpg',
              image_caption: 'Luxury villa exterior',
              image_title: 'Villa in Dubai Marina',
              image_geo_location: 'Dubai Marina, Dubai, UAE',
              image_license: 'https://trpe.ae/terms-conditions'
            }
          ]
        }
      ];

      const sitemapXml = optimizer.generateImageSitemap(sitemapEntries);

      expect(sitemapXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemapXml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(sitemapXml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
      expect(sitemapXml).toContain('<image:loc>https://trpe.ae/images/villa1.jpg</image:loc>');
      expect(sitemapXml).toContain('<image:caption>Luxury villa exterior</image:caption>');
    });
  });

  describe('Image Metadata Optimization', () => {
    it('should optimize image metadata', () => {
      const imageData: ImageSEOData = {
        src: 'property.jpg',
        alt: '',
        contentType: 'property',
        width: 800,
        height: 600
      };

      const context = {
        propertyType: 'Apartment',
        location: 'Downtown Dubai'
      };

      const optimized = optimizer.optimizeImageMetadata(imageData, context);

      expect(optimized.alt).toBeTruthy();
      expect(optimized.alt).toContain('Apartment');
      expect(optimized.title).toBeTruthy();
      expect(optimized.description).toBeTruthy();
      expect(optimized.keywords).toBeTruthy();
      expect(optimized.keywords?.length).toBeGreaterThan(0);
    });
  });

  describe('Image SEO Validation', () => {
    it('should validate good image SEO', () => {
      const imageData: ImageSEOData = {
        src: 'property.jpg',
        alt: 'Luxury 3-bedroom villa with swimming pool in Dubai Marina',
        contentType: 'property',
        width: 1200,
        height: 800,
        title: 'Dubai Marina Villa',
        fileSize: 250000 // 250KB
      };

      const validation = optimizer.validateImageSEO(imageData);

      expect(validation.isValid).toBe(true);
      expect(validation.issues).toHaveLength(0);
    });

    it('should identify missing alt text', () => {
      const imageData: ImageSEOData = {
        src: 'property.jpg',
        alt: '',
        contentType: 'property',
        width: 800,
        height: 600
      };

      const validation = optimizer.validateImageSEO(imageData);

      expect(validation.isValid).toBe(false);
      expect(validation.issues).toContain('Missing alt text');
    });

    it('should identify generic alt text', () => {
      const imageData: ImageSEOData = {
        src: 'property.jpg',
        alt: 'image',
        contentType: 'property',
        width: 800,
        height: 600
      };

      const validation = optimizer.validateImageSEO(imageData);

      expect(validation.isValid).toBe(false);
      expect(validation.issues).toContain('Alt text is too generic');
    });

    it('should suggest improvements for short alt text', () => {
      const imageData: ImageSEOData = {
        src: 'property.jpg',
        alt: 'Villa',
        contentType: 'property',
        width: 800,
        height: 600
      };

      const validation = optimizer.validateImageSEO(imageData);

      expect(validation.suggestions).toContain('Alt text should be more descriptive (at least 10 characters)');
    });

    it('should suggest improvements for large file size', () => {
      const imageData: ImageSEOData = {
        src: 'property.jpg',
        alt: 'Beautiful villa in Dubai Marina',
        contentType: 'property',
        width: 800,
        height: 600,
        fileSize: 800000 // 800KB
      };

      const validation = optimizer.validateImageSEO(imageData);

      expect(validation.suggestions).toContain('Image file size should be optimized (under 500KB)');
    });
  });
});

describe('Utility Functions', () => {
  describe('createImageSEOData', () => {
    it('should create basic image SEO data', () => {
      const imageData = createImageSEOData(
        'property.jpg',
        'property',
        800,
        600,
        'Villa in Dubai'
      );

      expect(imageData.src).toBe('property.jpg');
      expect(imageData.contentType).toBe('property');
      expect(imageData.width).toBe(800);
      expect(imageData.height).toBe(600);
      expect(imageData.alt).toBe('Villa in Dubai');
    });
  });

  describe('createPropertyImageData', () => {
    it('should create property image data', () => {
      const propertyData = createPropertyImageData(
        'villa.jpg',
        'prop-123',
        'Luxury Villa',
        'Villa',
        'Dubai Marina',
        1200,
        800,
        {
          alt: 'Beautiful villa',
          bedrooms: 4,
          bathrooms: 5,
          area: 6000,
          price: 8000000
        }
      );

      expect(propertyData.propertyId).toBe('prop-123');
      expect(propertyData.propertyTitle).toBe('Luxury Villa');
      expect(propertyData.propertyType).toBe('Villa');
      expect(propertyData.location).toBe('Dubai Marina');
      expect(propertyData.bedrooms).toBe(4);
      expect(propertyData.bathrooms).toBe(5);
      expect(propertyData.area).toBe(6000);
      expect(propertyData.price).toBe(8000000);
    });
  });

  describe('batchOptimizeImages', () => {
    it('should optimize multiple images', () => {
      const images: ImageSEOData[] = [
        {
          src: 'image1.jpg',
          alt: '',
          contentType: 'property',
          width: 800,
          height: 600
        },
        {
          src: 'image2.jpg',
          alt: '',
          contentType: 'property',
          width: 800,
          height: 600
        }
      ];

      const context = {
        propertyType: 'Apartment',
        location: 'Downtown Dubai'
      };

      const optimized = batchOptimizeImages(images, context);

      expect(optimized).toHaveLength(2);
      expect(optimized[0].alt).toBeTruthy();
      expect(optimized[1].alt).toBeTruthy();
      expect(optimized[0].title).toBeTruthy();
      expect(optimized[1].title).toBeTruthy();
    });
  });

  describe('generateImageStructuredDataScript', () => {
    it('should generate structured data script', () => {
      const images: ImageSEOData[] = [
        {
          src: 'property.jpg',
          alt: 'Villa in Dubai',
          contentType: 'property',
          width: 800,
          height: 600
        }
      ];

      const script = generateImageStructuredDataScript(images);

      expect(script).toContain('<script type="application/ld+json">');
      expect(script).toContain('"@context": "https://schema.org"');
      expect(script).toContain('"@type": "ImageObject"');
      expect(script).toContain('</script>');
    });
  });
});