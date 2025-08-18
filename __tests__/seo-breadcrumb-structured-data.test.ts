import { describe, it, expect, beforeEach } from '@jest/globals';
import { BreadcrumbStructuredData } from '@/lib/seo/breadcrumb-structured-data';

describe('BreadcrumbStructuredData', () => {
  let breadcrumbData: BreadcrumbStructuredData;

  beforeEach(() => {
    breadcrumbData = new BreadcrumbStructuredData({
      baseUrl: 'https://test.trpe.ae',
      includeHome: true,
      homeLabel: 'Home',
      homeUrl: '/',
      maxItems: 8,
      includeCurrentPage: true
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('should generate basic breadcrumb structured data', () => {
      const items = [
        { name: 'Properties', url: '/properties' },
        { name: 'Sale', url: '/properties/sale' },
        { name: 'Luxury Apartment', url: '/properties/sale/luxury-apartment', current: true }
      ];

      const schema = breadcrumbData.generateBreadcrumbSchema(items);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema['@id']).toBe('https://test.trpe.ae/properties/sale/luxury-apartment#breadcrumb');
      expect(schema.numberOfItems).toBe(4); // Including home
      expect(schema.itemListOrder).toBe('https://schema.org/ItemListOrderAscending');

      // Check home item
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[0].item.url).toBe('https://test.trpe.ae/');

      // Check last item
      const lastItem = schema.itemListElement[schema.itemListElement.length - 1];
      expect(lastItem.name).toBe('Luxury Apartment');
      expect(lastItem.item.url).toBe('https://test.trpe.ae/properties/sale/luxury-apartment');
    });

    it('should handle items with descriptions and images', () => {
      const items = [
        { 
          name: 'Properties', 
          url: '/properties',
          description: 'Browse all properties'
        },
        { 
          name: 'Downtown Dubai', 
          url: '/communities/downtown-dubai',
          description: 'Premium community',
          image: 'https://example.com/downtown.jpg'
        }
      ];

      const schema = breadcrumbData.generateBreadcrumbSchema(items);

      expect(schema.itemListElement[1].item.description).toBe('Browse all properties');
      expect(schema.itemListElement[2].item.description).toBe('Premium community');
      expect(schema.itemListElement[2].item.image).toBe('https://example.com/downtown.jpg');
    });

    it('should exclude home when includeHome is false', () => {
      const breadcrumbWithoutHome = new BreadcrumbStructuredData({
        baseUrl: 'https://test.trpe.ae',
        includeHome: false
      });

      const items = [
        { name: 'Properties', url: '/properties' },
        { name: 'Sale', url: '/properties/sale' }
      ];

      const schema = breadcrumbWithoutHome.generateBreadcrumbSchema(items);

      expect(schema.numberOfItems).toBe(2);
      expect(schema.itemListElement[0].name).toBe('Properties');
    });

    it('should exclude current page when includeCurrentPage is false', () => {
      const breadcrumbWithoutCurrent = new BreadcrumbStructuredData({
        baseUrl: 'https://test.trpe.ae',
        includeCurrentPage: false
      });

      const items = [
        { name: 'Properties', url: '/properties' },
        { name: 'Current Page', url: '/properties/current', current: true }
      ];

      const schema = breadcrumbWithoutCurrent.generateBreadcrumbSchema(items);

      expect(schema.numberOfItems).toBe(2); // Home + Properties only
      expect(schema.itemListElement.every(item => item.name !== 'Current Page')).toBe(true);
    });

    it('should limit items when maxItems is set', () => {
      const breadcrumbWithLimit = new BreadcrumbStructuredData({
        baseUrl: 'https://test.trpe.ae',
        maxItems: 3
      });

      const items = [
        { name: 'Properties', url: '/properties' },
        { name: 'Sale', url: '/properties/sale' },
        { name: 'Apartments', url: '/properties/sale/apartments' },
        { name: 'Downtown', url: '/properties/sale/apartments/downtown' },
        { name: 'Luxury Unit', url: '/properties/sale/apartments/downtown/luxury-unit' }
      ];

      const schema = breadcrumbWithLimit.generateBreadcrumbSchema(items);

      expect(schema.numberOfItems).toBe(3);
      expect(schema.itemListElement[0].name).toBe('Home'); // Always keep home
      expect(schema.itemListElement[1].name).toBe('Downtown'); // Keep last 2
      expect(schema.itemListElement[2].name).toBe('Luxury Unit');
    });
  });

  describe('generatePropertyBreadcrumbSchema', () => {
    it('should generate comprehensive property breadcrumb schema', () => {
      const property = {
        title: 'Luxury 3BR Apartment',
        slug: 'luxury-3br-apartment',
        description: 'Beautiful apartment with city views',
        image: 'https://example.com/apartment.jpg',
        offeringType: { 
          name: 'Sale', 
          slug: 'sale',
          description: 'Properties for sale in Dubai'
        },
        propertyType: { 
          name: 'Apartment', 
          slug: 'apartment',
          description: 'Apartment properties'
        },
        city: { 
          name: 'Dubai', 
          slug: 'dubai',
          description: 'Properties in Dubai'
        },
        community: { 
          name: 'Downtown Dubai', 
          slug: 'downtown-dubai',
          description: 'Premier business district',
          image: 'https://example.com/downtown.jpg'
        },
        subCommunity: { 
          name: 'Burj Khalifa District', 
          slug: 'burj-khalifa-district',
          description: 'Iconic tower district'
        }
      };

      const schema = breadcrumbData.generatePropertyBreadcrumbSchema(property);

      expect(schema.numberOfItems).toBe(8); // Home + Properties + Sale + Apartment + Dubai + Downtown + SubCommunity + Property
      
      // Check specific items
      const items = schema.itemListElement;
      expect(items[0].name).toBe('Home');
      expect(items[1].name).toBe('Properties');
      expect(items[2].name).toBe('Sale');
      expect(items[3].name).toBe('Apartment');
      expect(items[4].name).toBe('Dubai');
      expect(items[5].name).toBe('Downtown Dubai');
      expect(items[6].name).toBe('Burj Khalifa District');
      expect(items[7].name).toBe('Luxury 3BR Apartment');

      // Check URLs
      expect(items[2].item.url).toBe('https://test.trpe.ae/properties/sale');
      expect(items[5].item.url).toBe('https://test.trpe.ae/communities/downtown-dubai');
      expect(items[7].item.url).toBe('https://test.trpe.ae/properties/sale/luxury-3br-apartment');

      // Check descriptions and images
      expect(items[5].item.description).toBe('Premier business district');
      expect(items[5].item.image).toBe('https://example.com/downtown.jpg');
      expect(items[7].item.description).toBe('Beautiful apartment with city views');
      expect(items[7].item.image).toBe('https://example.com/apartment.jpg');
    });

    it('should handle minimal property data', () => {
      const minimalProperty = {
        title: 'Basic Property',
        slug: 'basic-property'
      };

      const schema = breadcrumbData.generatePropertyBreadcrumbSchema(minimalProperty);

      expect(schema.numberOfItems).toBe(3); // Home + Properties + Property
      expect(schema.itemListElement[2].name).toBe('Basic Property');
      expect(schema.itemListElement[2].item.url).toBe('https://test.trpe.ae/properties/sale/basic-property');
    });
  });

  describe('generateCommunityBreadcrumbSchema', () => {
    it('should generate community breadcrumb schema', () => {
      const community = {
        name: 'Marina',
        slug: 'marina',
        description: 'Waterfront community',
        image: 'https://example.com/marina.jpg',
        city: { 
          name: 'Dubai', 
          slug: 'dubai',
          description: 'Dubai communities'
        },
        parentCommunity: { 
          name: 'New Dubai', 
          slug: 'new-dubai',
          description: 'Modern Dubai district'
        }
      };

      const schema = breadcrumbData.generateCommunityBreadcrumbSchema(community);

      expect(schema.numberOfItems).toBe(5); // Home + Communities + Dubai + New Dubai + Marina
      
      const items = schema.itemListElement;
      expect(items[0].name).toBe('Home');
      expect(items[1].name).toBe('Communities');
      expect(items[2].name).toBe('Dubai');
      expect(items[3].name).toBe('New Dubai');
      expect(items[4].name).toBe('Marina');

      // Check URLs
      expect(items[1].item.url).toBe('https://test.trpe.ae/communities');
      expect(items[3].item.url).toBe('https://test.trpe.ae/communities/new-dubai');
      expect(items[4].item.url).toBe('https://test.trpe.ae/communities/marina');

      // Check final item details
      expect(items[4].item.description).toBe('Waterfront community');
      expect(items[4].item.image).toBe('https://example.com/marina.jpg');
    });

    it('should handle community without parent', () => {
      const community = {
        name: 'Standalone Community',
        slug: 'standalone-community'
      };

      const schema = breadcrumbData.generateCommunityBreadcrumbSchema(community);

      expect(schema.numberOfItems).toBe(3); // Home + Communities + Community
      expect(schema.itemListElement[2].name).toBe('Standalone Community');
    });
  });

  describe('generateInsightBreadcrumbSchema', () => {
    it('should generate insight breadcrumb schema', () => {
      const insight = {
        title: 'Dubai Market Trends 2024',
        slug: 'dubai-market-trends-2024',
        description: 'Analysis of Dubai real estate market',
        image: 'https://example.com/insight.jpg',
        category: {
          name: 'Market Analysis',
          slug: 'market-analysis',
          description: 'Real estate market insights'
        },
        author: {
          name: 'John Doe',
          slug: 'john-doe'
        }
      };

      const schema = breadcrumbData.generateInsightBreadcrumbSchema(insight);

      expect(schema.numberOfItems).toBe(5); // Home + Insights + Category + Author + Insight
      
      const items = schema.itemListElement;
      expect(items[0].name).toBe('Home');
      expect(items[1].name).toBe('Insights');
      expect(items[2].name).toBe('Market Analysis');
      expect(items[3].name).toBe('By John Doe');
      expect(items[4].name).toBe('Dubai Market Trends 2024');

      // Check URLs
      expect(items[2].item.url).toBe('https://test.trpe.ae/insights/category/market-analysis');
      expect(items[3].item.url).toBe('https://test.trpe.ae/insights/author/john-doe');
      expect(items[4].item.url).toBe('https://test.trpe.ae/insights/dubai-market-trends-2024');
    });

    it('should handle insight without category or author', () => {
      const insight = {
        title: 'Simple Insight',
        slug: 'simple-insight'
      };

      const schema = breadcrumbData.generateInsightBreadcrumbSchema(insight);

      expect(schema.numberOfItems).toBe(3); // Home + Insights + Insight
      expect(schema.itemListElement[2].name).toBe('Simple Insight');
    });
  });

  describe('generatePathBreadcrumbSchema', () => {
    it('should generate breadcrumb from URL path', () => {
      const path = '/properties/sale/apartments';
      const schema = breadcrumbData.generatePathBreadcrumbSchema(path);

      expect(schema.numberOfItems).toBe(4); // Home + Properties + Sale + Apartments
      
      const items = schema.itemListElement;
      expect(items[1].name).toBe('Properties');
      expect(items[2].name).toBe('Sale');
      expect(items[3].name).toBe('Apartments');

      expect(items[1].item.url).toBe('https://test.trpe.ae/properties');
      expect(items[2].item.url).toBe('https://test.trpe.ae/properties/sale');
      expect(items[3].item.url).toBe('https://test.trpe.ae/properties/sale/apartments');
    });

    it('should use custom page title and description', () => {
      const path = '/properties/sale/luxury-apartment';
      const pageTitle = 'Luxury Apartment for Sale';
      const pageDescription = 'Premium apartment in Dubai';

      const schema = breadcrumbData.generatePathBreadcrumbSchema(path, pageTitle, pageDescription);

      const lastItem = schema.itemListElement[schema.itemListElement.length - 1];
      expect(lastItem.name).toBe('Luxury Apartment for Sale');
      expect(lastItem.item.description).toBe('Premium apartment in Dubai');
    });

    it('should handle single segment path', () => {
      const path = '/about-us';
      const schema = breadcrumbData.generatePathBreadcrumbSchema(path);

      expect(schema.numberOfItems).toBe(2); // Home + About Us
      expect(schema.itemListElement[1].name).toBe('About Us');
      expect(schema.itemListElement[1].item.url).toBe('https://test.trpe.ae/about-us');
    });
  });

  describe('generateAgentBreadcrumbSchema', () => {
    it('should generate agent breadcrumb schema', () => {
      const agent = {
        name: 'Jane Smith',
        slug: 'jane-smith',
        description: 'Senior real estate consultant',
        image: 'https://example.com/jane.jpg',
        team: {
          name: 'Sales Team',
          slug: 'sales-team'
        }
      };

      const schema = breadcrumbData.generateAgentBreadcrumbSchema(agent);

      expect(schema.numberOfItems).toBe(4); // Home + Our Team + Sales Team + Jane Smith
      
      const items = schema.itemListElement;
      expect(items[1].name).toBe('Our Team');
      expect(items[2].name).toBe('Sales Team');
      expect(items[3].name).toBe('Jane Smith');

      expect(items[3].item.description).toBe('Senior real estate consultant');
      expect(items[3].item.image).toBe('https://example.com/jane.jpg');
    });

    it('should handle agent without team', () => {
      const agent = {
        name: 'John Doe',
        slug: 'john-doe'
      };

      const schema = breadcrumbData.generateAgentBreadcrumbSchema(agent);

      expect(schema.numberOfItems).toBe(3); // Home + Our Team + John Doe
      expect(schema.itemListElement[2].name).toBe('John Doe');
    });
  });

  describe('generateOffPlanBreadcrumbSchema', () => {
    it('should generate off-plan project breadcrumb schema', () => {
      const project = {
        name: 'Marina Heights',
        slug: 'marina-heights',
        description: 'Luxury waterfront development',
        image: 'https://example.com/marina-heights.jpg',
        developer: {
          name: 'Emaar Properties',
          slug: 'emaar-properties'
        },
        community: {
          name: 'Dubai Marina',
          slug: 'dubai-marina'
        }
      };

      const schema = breadcrumbData.generateOffPlanBreadcrumbSchema(project);

      expect(schema.numberOfItems).toBe(5); // Home + Off-Plan + Developer + Community + Project
      
      const items = schema.itemListElement;
      expect(items[1].name).toBe('Off-Plan Projects');
      expect(items[2].name).toBe('Emaar Properties');
      expect(items[3].name).toBe('Dubai Marina');
      expect(items[4].name).toBe('Marina Heights');

      expect(items[2].item.url).toBe('https://test.trpe.ae/developers/emaar-properties');
      expect(items[4].item.description).toBe('Luxury waterfront development');
    });
  });

  describe('configuration management', () => {
    it('should update configuration correctly', () => {
      const newConfig = {
        maxItems: 5,
        includeHome: false
      };

      breadcrumbData.updateConfig(newConfig);
      const config = breadcrumbData.getConfig();

      expect(config.maxItems).toBe(5);
      expect(config.includeHome).toBe(false);
      expect(config.baseUrl).toBe('https://test.trpe.ae'); // Should preserve existing
    });

    it('should return current configuration', () => {
      const config = breadcrumbData.getConfig();

      expect(config.baseUrl).toBe('https://test.trpe.ae');
      expect(config.includeHome).toBe(true);
      expect(config.homeLabel).toBe('Home');
    });
  });

  describe('URL normalization', () => {
    it('should normalize relative URLs to absolute', () => {
      const items = [
        { name: 'Properties', url: '/properties' },
        { name: 'External', url: 'https://external.com/page' }
      ];

      const schema = breadcrumbData.generateBreadcrumbSchema(items);

      expect(schema.itemListElement[1].item.url).toBe('https://test.trpe.ae/properties');
      expect(schema.itemListElement[2].item.url).toBe('https://external.com/page');
    });

    it('should handle URLs without leading slash', () => {
      const items = [
        { name: 'Properties', url: 'properties/sale' }
      ];

      const schema = breadcrumbData.generateBreadcrumbSchema(items);

      expect(schema.itemListElement[1].item.url).toBe('https://test.trpe.ae/properties/sale');
    });
  });

  describe('segment formatting', () => {
    it('should format URL segments correctly', () => {
      const path = '/off-plan-projects/luxury-developments';
      const schema = breadcrumbData.generatePathBreadcrumbSchema(path);

      const items = schema.itemListElement;
      expect(items[1].name).toBe('Off Plan Projects');
      expect(items[2].name).toBe('Luxury Developments');
    });

    it('should generate appropriate descriptions for known segments', () => {
      const path = '/properties/sale';
      const schema = breadcrumbData.generatePathBreadcrumbSchema(path);

      const items = schema.itemListElement;
      expect(items[1].item.description).toBe('Browse all properties for sale and rent in Dubai');
      expect(items[2].item.description).toBe('Properties for sale in Dubai');
    });

    it('should generate default descriptions for unknown segments', () => {
      const path = '/custom-section/unknown-page';
      const schema = breadcrumbData.generatePathBreadcrumbSchema(path);

      const items = schema.itemListElement;
      expect(items[1].item.description).toBe('Custom Section - TRPE Global');
      expect(items[2].item.description).toBe('Unknown Page - TRPE Global');
    });
  });

  describe('edge cases', () => {
    it('should handle empty items array', () => {
      const schema = breadcrumbData.generateBreadcrumbSchema([]);

      expect(schema.numberOfItems).toBe(1); // Only home
      expect(schema.itemListElement[0].name).toBe('Home');
    });

    it('should handle items with duplicate home URL', () => {
      const items = [
        { name: 'Home', url: '/' },
        { name: 'Properties', url: '/properties' }
      ];

      const schema = breadcrumbData.generateBreadcrumbSchema(items);

      expect(schema.numberOfItems).toBe(2); // Should not duplicate home
      expect(schema.itemListElement.filter(item => item.name === 'Home')).toHaveLength(1);
    });

    it('should handle very long paths with maxItems limit', () => {
      const longPath = '/a/b/c/d/e/f/g/h/i/j';
      const breadcrumbWithLimit = new BreadcrumbStructuredData({
        baseUrl: 'https://test.trpe.ae',
        maxItems: 4
      });

      const schema = breadcrumbWithLimit.generatePathBreadcrumbSchema(longPath);

      expect(schema.numberOfItems).toBe(4);
      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[3].name).toBe('J'); // Should keep the last items
    });
  });
});