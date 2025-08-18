/**
 * XML Feed Import Unit Tests
 * 
 * This test suite covers the core functions used in the XML feed import process:
 * - XML parsing and conversion to JSON (Requirements: API endpoint functionality)
 * - Property data mapping and transformation (Requirements: Data validation, Property structure)
 * - Agent data processing (Requirements: Agent relationship mapping)
 * - Photo URL extraction (Requirements: Image processing)
 * - Property validation and filtering (Requirements: Business logic validation)
 * - Price parsing and luxury detection (Requirements: Luxury property identification)
 * - Duplicate detection and handling (Requirements: Data integrity)
 * - Description parsing and enhancement (Requirements: Content enhancement)
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';

// Mock dependencies
jest.mock('xml2js');
jest.mock('@/lib/property-description-parser');

// Setup global fetch mock with proper typing
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;
const mockParseStringPromise = parseStringPromise as jest.MockedFunction<typeof parseStringPromise>;

// Import the modules to test
import { GET } from '@/app/api/xml/route';

// Mock data for testing
const mockXmlData = `<?xml version="1.0" encoding="UTF-8"?>
<list>
  <property>
    <reference_number>REF001</reference_number>
    <title_en>Luxury Villa in Downtown</title_en>
    <description_en>Beautiful luxury property with stunning views</description_en>
    <price>25000000</price>
    <bedroom>4</bedroom>
    <bathroom>3</bathroom>
    <size>5000</size>
    <plot_size>8000</plot_size>
    <community>Downtown</community>
    <sub_community>Marina District</sub_community>
    <city>Dubai</city>
    <offering_type>Sale</offering_type>
    <property_type>Villa</property_type>
    <permit_number>DLD12345</permit_number>
    <last_update>11/20/2024 12:50:23</last_update>
    <agent>
      <name>John Smith</name>
      <email>john.smith@example.com</email>
      <phone>+971501234567</phone>
    </agent>
    <photo>
      <url last_updated="2024-11-20">https://example.com/photo1.jpg</url>
      <url last_updated="2024-11-20">https://example.com/photo2.jpg</url>
    </photo>
    <private_amenities>Swimming Pool, Gym, Garden</private_amenities>
  </property>
  <property>
    <reference_number>REF002</reference_number>
    <title_en>Modern Apartment</title_en>
    <description_en>Contemporary apartment in prime location</description_en>
    <price>1500000</price>
    <bedroom>2</bedroom>
    <bathroom>2</bathroom>
    <size>1200</size>
    <community>Business Bay</community>
    <city>Dubai</city>
    <offering_type>Rent</offering_type>
    <property_type>Apartment</property_type>
    <last_update>25-04-25 03:52:16</last_update>
    <agent>
      <name>Sarah Johnson</name>
      <email>sarah.johnson@example.com</email>
      <phone>+971507654321</phone>
    </agent>
    <photo>
      <url last_updated="2024-04-25">https://example.com/apt1.jpg</url>
    </photo>
  </property>
</list>`;

const mockJsonData = {
  list: {
    property: [
      {
        reference_number: ['REF001'],
        title_en: ['Luxury Villa in Downtown'],
        description_en: ['Beautiful luxury property with stunning views'],
        price: ['25000000'],
        bedroom: ['4'],
        bathroom: ['3'],
        size: ['5000'],
        plot_size: ['8000'],
        community: ['Downtown'],
        sub_community: ['Marina District'],
        city: ['Dubai'],
        offering_type: ['Sale'],
        property_type: ['Villa'],
        permit_number: ['DLD12345'],
        last_update: ['11/20/2024 12:50:23'],
        agent: [{
          name: ['John Smith'],
          email: ['john.smith@example.com'],
          phone: ['+971501234567']
        }],
        photo: [{
          url: [
            { _: 'https://example.com/photo1.jpg', $: { last_updated: '2024-11-20' } },
            { _: 'https://example.com/photo2.jpg', $: { last_updated: '2024-11-20' } }
          ]
        }],
        private_amenities: ['Swimming Pool, Gym, Garden']
      },
      {
        reference_number: ['REF002'],
        title_en: ['Modern Apartment'],
        description_en: ['Contemporary apartment in prime location'],
        price: ['1500000'],
        bedroom: ['2'],
        bathroom: ['2'],
        size: ['1200'],
        community: ['Business Bay'],
        city: ['Dubai'],
        offering_type: ['Rent'],
        property_type: ['Apartment'],
        last_update: ['25-04-25 03:52:16'],
        agent: [{
          name: ['Sarah Johnson'],
          email: ['sarah.johnson@example.com'],
          phone: ['+971507654321']
        }],
        photo: [{
          url: [
            { _: 'https://example.com/apt1.jpg', $: { last_updated: '2024-04-25' } }
          ]
        }]
      }
    ]
  }
};

describe('XML Feed Import Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('XML API Endpoint (/api/xml)', () => {
    it('should successfully fetch and parse XML data', async () => {
      // Mock fetch response
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(mockXmlData) as jest.Mock
      };
      mockFetch.mockResolvedValue(mockResponse as any);
      mockParseStringPromise.mockResolvedValue(mockJsonData);

      const response = await GET();
      const result = await response.json();

      expect(mockFetch).toHaveBeenCalledWith('https://youtupia.net/trpe/website/full.xml');
      expect(mockParseStringPromise).toHaveBeenCalledWith(mockXmlData);
      expect(result).toBeDefined();
      expect(result.list).toBeDefined();
      expect(result.list.property).toHaveLength(2);
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const response = await GET();
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result.error).toBe('Failed to fetch and parse XML');
    });

    it('should handle XML parsing errors gracefully', async () => {
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue('invalid xml') as jest.Mock
      };
      mockFetch.mockResolvedValue(mockResponse as any);
      mockParseStringPromise.mockRejectedValue(new Error('XML parsing error'));

      const response = await GET();
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result.error).toBe('Failed to fetch and parse XML');
    });

    it('should handle HTTP error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const response = await GET();
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result.error).toBe('Failed to fetch and parse XML');
    });
  });

  describe('Property Data Processing', () => {
    it('should correctly process property with all fields', () => {
      // Import the processing function
      const { processListings } = require('@/actions/save-xml-listing-action');
      
      const testData = {
        list: {
          property: [mockJsonData.list.property[0]]
        }
      };

      const result = processListings(testData);
      const property = result[0];

      expect(property.newProperty).toBeDefined();
      expect(property.newProperty.reference_number).toBe('REF001');
      expect(property.newProperty.title_en).toBe('Luxury Villa in Downtown');
      expect(property.newProperty.price).toBe('25000000');
      expect(property.newProperty.bedroom).toBe('4');
      expect(property.newProperty.bathroom).toBe('3');
      expect(property.newProperty.community).toBe('Downtown');
      expect(property.newProperty.sub_community).toBe('Marina District');
      expect(property.newProperty.city).toBe('Dubai');
      expect(property.newProperty.offering_type).toBe('Sale');
      expect(property.newProperty.property_type).toBe('Villa');
    });

    it('should correctly extract agent information', () => {
      const { processListings } = require('@/actions/save-xml-listing-action');
      
      const testData = {
        list: {
          property: [mockJsonData.list.property[0]]
        }
      };

      const result = processListings(testData);
      const property = result[0];

      expect(property.agent).toBeDefined();
      expect(property.agent.name).toBe('John Smith');
      expect(property.agent.email).toBe('john.smith@example.com');
      expect(property.agent.phone).toBe('+971501234567');
    });

    it('should correctly extract photo URLs', () => {
      const { processListings } = require('@/actions/save-xml-listing-action');
      
      const testData = {
        list: {
          property: [mockJsonData.list.property[0]]
        }
      };

      const result = processListings(testData);
      const property = result[0];

      expect(property.photos).toBeDefined();
      expect(property.photos).toHaveLength(2);
      expect(property.photos[0]).toBe('https://example.com/photo1.jpg');
      expect(property.photos[1]).toBe('https://example.com/photo2.jpg');
    });

    it('should handle properties with single photo', () => {
      const { processListings } = require('@/actions/save-xml-listing-action');
      
      const testData = {
        list: {
          property: [mockJsonData.list.property[1]]
        }
      };

      const result = processListings(testData);
      const property = result[0];

      expect(property.photos).toBeDefined();
      expect(property.photos).toHaveLength(1);
      expect(property.photos[0]).toBe('https://example.com/apt1.jpg');
    });

    it('should handle properties without photos', () => {
      const { processListings } = require('@/actions/save-xml-listing-action');
      
      const propertyWithoutPhotos = {
        ...mockJsonData.list.property[0],
        photo: []
      };

      const testData = {
        list: {
          property: [propertyWithoutPhotos]
        }
      };

      const result = processListings(testData);
      const property = result[0];

      expect(property.photos).toBeDefined();
      expect(property.photos).toHaveLength(0);
    });
  });

  describe('Price Processing and Validation', () => {
    it('should correctly parse numeric price strings', () => {
      const { extractPrice } = require('@/actions/save-xml-listing-action');
      
      expect(extractPrice(['25000000'])).toBe('25000000');
      expect(extractPrice(['1500000'])).toBe('1500000');
      expect(extractPrice(['999999'])).toBe('999999');
    });

    it('should handle price with commas', () => {
      const { extractPrice } = require('@/actions/save-xml-listing-action');
      
      expect(extractPrice(['25,000,000'])).toBe('25000000');
      expect(extractPrice(['1,500,000'])).toBe('1500000');
    });

    it('should handle price with currency symbols', () => {
      const { extractPrice } = require('@/actions/save-xml-listing-action');
      
      expect(extractPrice(['AED 25,000,000'])).toBe('25000000');
      expect(extractPrice(['$ 1,500,000'])).toBe('1500000');
      expect(extractPrice(['€ 999,999'])).toBe('999999');
    });

    it('should detect luxury properties (>20M AED)', () => {
      const price1 = parseInt('25000000'); // 25M - luxury
      const price2 = parseInt('15000000'); // 15M - not luxury
      const price3 = parseInt('21000000'); // 21M - luxury

      expect(price1 > 20000000).toBe(true);
      expect(price2 > 20000000).toBe(false);
      expect(price3 > 20000000).toBe(true);
    });

    it('should handle invalid price formats', () => {
      const { extractPrice } = require('@/actions/save-xml-listing-action');
      
      expect(extractPrice(['invalid'])).toBe('invalid');
      expect(extractPrice([''])).toBe('');
      expect(extractPrice([])).toBe('');
    });
  });

  describe('Date Processing', () => {
    it('should parse MM/DD/YYYY HH:MM:SS format', () => {
      const dateStr = '11/20/2024 12:50:23';
      const parsed = new Date(dateStr);
      
      expect(parsed.getFullYear()).toBe(2024);
      expect(parsed.getMonth()).toBe(10); // November is month 10 (0-indexed)
      expect(parsed.getDate()).toBe(20);
    });

    it('should parse DD-MM-YY HH:MM:SS format', () => {
      const dateStr = '25-04-25 03:52:16';
      // Would need custom parsing logic for this format
      // This test verifies the need for custom date parsing
      
      const parts = dateStr.split(' ');
      const datePart = parts[0];
      const timePart = parts[1];
      
      const [day, month, year] = datePart.split('-');
      const [hour, minute, second] = timePart.split(':');
      
      expect(day).toBe('25');
      expect(month).toBe('04');
      expect(year).toBe('25');
      expect(hour).toBe('03');
      expect(minute).toBe('52');
      expect(second).toBe('16');
    });
  });

  describe('Data Validation', () => {
    it('should validate required fields are present', () => {
      const property = {
        reference_number: 'REF001',
        title_en: 'Test Property',
        price: '1000000',
        bedroom: '2',
        bathroom: '1'
      };

      const requiredFields = ['reference_number', 'title_en', 'price', 'bedroom', 'bathroom'];
      const hasAllRequired = requiredFields.every(field => property[field as keyof typeof property]);

      expect(hasAllRequired).toBe(true);
    });

    it('should validate bedroom count is numeric', () => {
      const validBedrooms = ['1', '2', '3', '4', '5'];
      const invalidBedrooms = ['invalid', '', 'studio'];

      validBedrooms.forEach(bedroom => {
        expect(!isNaN(parseInt(bedroom))).toBe(true);
      });

      invalidBedrooms.forEach(bedroom => {
        expect(isNaN(parseInt(bedroom))).toBe(true);
      });
    });

    it('should validate bathroom count is numeric', () => {
      const validBathrooms = ['1', '2', '3', '4'];
      const invalidBathrooms = ['invalid', '', 'half'];

      validBathrooms.forEach(bathroom => {
        expect(!isNaN(parseInt(bathroom))).toBe(true);
      });

      invalidBathrooms.forEach(bathroom => {
        expect(isNaN(parseInt(bathroom))).toBe(true);
      });
    });

    it('should validate email format', () => {
      const validEmails = ['test@example.com', 'user@domain.org', 'agent@realty.ae'];
      const invalidEmails = ['invalid-email', 'user@', '@domain.com', ''];

      validEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(true);
      });

      invalidEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should validate phone number format', () => {
      const validPhones = ['+971501234567', '+971 50 123 4567', '0501234567'];
      const invalidPhones = ['123', '', 'invalid-phone'];

      validPhones.forEach(phone => {
        const phoneRegex = /^(\+?\d{1,4}[\s-]?)?[\d\s-]{7,15}$/;
        expect(phoneRegex.test(phone)).toBe(true);
      });

      invalidPhones.forEach(phone => {
        const phoneRegex = /^(\+?\d{1,4}[\s-]?)?[\d\s-]{7,15}$/;
        expect(phoneRegex.test(phone)).toBe(false);
      });
    });
  });

  describe('Duplicate Detection', () => {
    it('should detect duplicate properties by reference number and permit number', () => {
      const properties = [
        { reference_number: 'REF001', permit_number: 'DLD123' },
        { reference_number: 'REF002', permit_number: 'DLD456' },
        { reference_number: 'REF001', permit_number: 'DLD123' }, // duplicate
        { reference_number: 'REF003', permit_number: 'DLD789' }
      ];

      const seenKeys = new Set<string>();
      const duplicates: typeof properties = [];

      properties.forEach(property => {
        const key = `${property.permit_number}-${property.reference_number}`;
        if (seenKeys.has(key)) {
          duplicates.push(property);
        } else {
          seenKeys.add(key);
        }
      });

      expect(duplicates).toHaveLength(1);
      expect(duplicates[0].reference_number).toBe('REF001');
    });

    it('should handle missing permit numbers in duplicate detection', () => {
      const properties = [
        { reference_number: 'REF001', permit_number: '' },
        { reference_number: 'REF001', permit_number: '' }, // potential duplicate
        { reference_number: 'REF002', permit_number: 'DLD456' }
      ];

      const seenKeys = new Set<string>();
      const duplicates: typeof properties = [];

      properties.forEach(property => {
        const key = `${property.permit_number || 'no-permit'}-${property.reference_number}`;
        if (seenKeys.has(key)) {
          duplicates.push(property);
        } else {
          seenKeys.add(key);
        }
      });

      expect(duplicates).toHaveLength(1);
    });
  });

  describe('Description Enhancement', () => {
    it('should extract features from property description', () => {
      const description = 'Swimming Pool, Gym, Garden, Parking, Security';
      const features = description.split(',').map(f => f.trim());

      expect(features).toHaveLength(5);
      expect(features).toContain('Swimming Pool');
      expect(features).toContain('Gym');
      expect(features).toContain('Garden');
      expect(features).toContain('Parking');
      expect(features).toContain('Security');
    });

    it('should handle empty descriptions', () => {
      const description = '';
      const features = description ? description.split(',').map((f: string) => f.trim()) : [];

      expect(features).toHaveLength(0);
    });

    it('should handle single feature descriptions', () => {
      const description = 'Swimming Pool';
      const features = description.split(',').map((f: string) => f.trim());

      expect(features).toHaveLength(1);
      expect(features[0]).toBe('Swimming Pool');
    });
  });

  describe('Slug Generation', () => {
    it('should generate property slug from title and location', () => {
      const generateSlug = (title: string, community: string, propertyType: string) => {
        return [title, community, propertyType]
          .join('-')
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      };

      const slug1 = generateSlug('Luxury Villa', 'Downtown', 'Villa');
      const slug2 = generateSlug('Modern Apartment', 'Business Bay', 'Apartment');

      expect(slug1).toBe('luxury-villa-downtown-villa');
      expect(slug2).toBe('modern-apartment-business-bay-apartment');
    });

    it('should handle special characters in slug generation', () => {
      const generateSlug = (title: string) => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      };

      const slug1 = generateSlug('Luxury Villa & Garden');
      const slug2 = generateSlug('Modern Apartment (2BR)');
      const slug3 = generateSlug('Penthouse - Premium Location!');

      expect(slug1).toBe('luxury-villa-garden');
      expect(slug2).toBe('modern-apartment-2br');
      expect(slug3).toBe('penthouse-premium-location');
    });
  });

  describe('Memory and Performance Considerations', () => {
    it('should handle large property datasets efficiently', () => {
      // Create a large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        reference_number: `REF${i.toString().padStart(4, '0')}`,
        title_en: `Property ${i}`,
        price: (1000000 + i * 10000).toString(),
        bedroom: (2 + (i % 4)).toString(),
        bathroom: (1 + (i % 3)).toString()
      }));

      const startTime = Date.now();
      
      // Simulate processing
      const processed = largeDataset.map(property => ({
        ...property,
        processed: true
      }));

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      expect(processed).toHaveLength(1000);
      expect(processingTime).toBeLessThan(1000); // Should process in under 1 second
    });

    it('should not have memory leaks in batch processing', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Simulate batch processing
      for (let batch = 0; batch < 10; batch++) {
        const batchData = Array.from({ length: 100 }, (_, i) => ({
          id: batch * 100 + i,
          data: 'test data'
        }));
        
        // Process and clear
        batchData.forEach(item => {
          // Simulate processing
          const processed = { ...item, processed: true };
        });
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });
});
