#!/usr/bin/env bun

/**
 * Test Data Generator for PropertyFinder JSON Import Integration Tests
 * 
 * This script generates sample PropertyFinder JSON data for testing purposes:
 * - Creates valid property data with various scenarios
 * - Generates malformed data for error testing
 * - Provides luxury and standard property examples
 * - Ensures comprehensive test coverage
 */

import fs from 'fs/promises';
import path from 'path';

interface PropertyFinderTestData {
  metadata: {
    scrapedAt: string;
    totalProperties: number;
    successfulScrapes: number;
    failedScrapes: number;
  };
  properties: Array<{
    url: string;
    title: string;
    price: string;
    description: string;
    propertyDetails: {
      propertyType: string;
      propertySize: string;
      bedrooms: string;
      bathrooms: string;
      reference: string;
      zoneName: string;
      dldPermitNumber: string;
    };
    agentName: string;
    images: string[];
    scrapedAt: string;
  }>;
}

class TestDataGenerator {
  /**
   * Generate comprehensive test data for integration testing
   */
  generateValidTestData(): PropertyFinderTestData {
    const timestamp = new Date().toISOString();
    
    return {
      metadata: {
        scrapedAt: timestamp,
        totalProperties: 6,
        successfulScrapes: 6,
        failedScrapes: 0
      },
      properties: [
        // Luxury villa with multiple images (above 20M threshold)
        {
          url: 'https://example.com/luxury-villa-palm',
          title: 'Stunning Luxury Villa in Palm Jumeirah with Private Beach',
          price: '45,000,000 AED',
          description: 'Exceptional 6-bedroom villa with private beach access, infinity pool, and panoramic views of Dubai skyline. Features include marble flooring, smart home automation, private cinema, and wine cellar.',
          propertyDetails: {
            propertyType: 'Villa',
            propertySize: '8,500 sqft / 789 sqm',
            bedrooms: '6',
            bathrooms: '7',
            reference: 'LUXE-VILLA-001',
            zoneName: 'Palm Jumeirah',
            dldPermitNumber: 'DLD-789456123'
          },
          agentName: 'Alexandra Thompson',
          images: [
            'https://via.placeholder.com/1200x800/0066cc/ffffff?text=Villa+Exterior',
            'https://via.placeholder.com/1200x800/0066cc/ffffff?text=Living+Room',
            'https://via.placeholder.com/1200x800/0066cc/ffffff?text=Master+Bedroom',
            'https://via.placeholder.com/1200x800/0066cc/ffffff?text=Kitchen',
            'https://via.placeholder.com/1200x800/0066cc/ffffff?text=Pool+Area'
          ],
          scrapedAt: timestamp
        },
        
        // Luxury apartment with images (above 20M threshold)
        {
          url: 'https://example.com/luxury-penthouse-downtown',
          title: 'Exclusive Penthouse in Burj Khalifa with Burj Views',
          price: '35,500,000',
          description: 'Rare penthouse opportunity in the iconic Burj Khalifa. Floor-to-ceiling windows, private elevator access, and unobstructed views of Dubai Fountain.',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '5,200 sqft / 483 sqm',
            bedrooms: '4',
            bathrooms: '5',
            reference: 'LUXE-PH-002',
            zoneName: 'Downtown Dubai',
            dldPermitNumber: 'DLD-456789012'
          },
          agentName: 'Mohammed Al-Rashid',
          images: [
            'https://via.placeholder.com/1200x800/cc6600/ffffff?text=Penthouse+View',
            'https://via.placeholder.com/1200x800/cc6600/ffffff?text=Dining+Area'
          ],
          scrapedAt: timestamp
        },
        
        // Luxury property without images (above 20M threshold)
        {
          url: 'https://example.com/luxury-mansion-emirates-hills',
          title: 'Palatial Mansion in Emirates Hills Golf Course',
          price: '28,750,000 AED',
          description: 'Magnificent 7-bedroom mansion on the golf course with private spa, gym, and staff quarters. Premium location in Dubai\'s most exclusive community.',
          propertyDetails: {
            propertyType: 'Villa',
            propertySize: '12,000 sqft / 1115 sqm',
            bedrooms: '7',
            bathrooms: '9',
            reference: 'LUXE-MANSION-003',
            zoneName: 'Emirates Hills',
            dldPermitNumber: 'DLD-123456789'
          },
          agentName: 'Sarah Mitchell',
          images: [], // No images to test luxury without images scenario
          scrapedAt: timestamp
        },
        
        // Standard property with images (below 20M threshold)
        {
          url: 'https://example.com/apartment-marina',
          title: 'Modern 2BR Apartment in Dubai Marina with Marina Views',
          price: '2,850,000',
          description: 'Bright and spacious 2-bedroom apartment with stunning marina views. Features include built-in wardrobes, modern kitchen, and balcony.',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '1,450 sqft / 135 sqm',
            bedrooms: '2',
            bathrooms: '2',
            reference: 'STD-MARINA-001',
            zoneName: 'Dubai Marina',
            dldPermitNumber: 'DLD-987654321'
          },
          agentName: 'James Wilson',
          images: [
            'https://via.placeholder.com/800x600/009900/ffffff?text=Marina+Apartment'
          ],
          scrapedAt: timestamp
        },
        
        // Standard property without images (below 20M threshold)
        {
          url: 'https://example.com/townhouse-jvc',
          title: 'Family Townhouse in Jumeirah Village Circle',
          price: '1,950,000 AED',
          description: 'Perfect family home with 3 bedrooms, private garden, and community amenities including pool and playground.',
          propertyDetails: {
            propertyType: 'Townhouse',
            propertySize: '2,100 sqft / 195 sqm',
            bedrooms: '3',
            bathrooms: '3',
            reference: 'STD-TH-002',
            zoneName: 'Jumeirah Village Circle',
            dldPermitNumber: 'DLD-555666777'
          },
          agentName: 'Lisa Chen',
          images: [],
          scrapedAt: timestamp
        },
        
        // Studio apartment (edge case for bedroom parsing)
        {
          url: 'https://example.com/studio-business-bay',
          title: 'Modern Studio in Business Bay with Canal Views',
          price: '850,000',
          description: 'Compact and efficient studio apartment with modern finishes and canal views. Perfect for young professionals.',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '650 sqft / 60 sqm',
            bedrooms: 'Studio',
            bathrooms: '1',
            reference: 'STD-STUDIO-003',
            zoneName: 'Business Bay',
            dldPermitNumber: 'DLD-111222333'
          },
          agentName: 'David Kumar',
          images: [
            'https://via.placeholder.com/800x600/660099/ffffff?text=Studio+Interior'
          ],
          scrapedAt: timestamp
        }
      ]
    };
  }

  /**
   * Generate malformed test data for error handling testing
   */
  generateMalformedTestData(): any {
    const timestamp = new Date().toISOString();
    
    return {
      metadata: {
        scrapedAt: timestamp,
        totalProperties: 5,
        successfulScrapes: 2,
        failedScrapes: 3
      },
      properties: [
        // Valid property for comparison
        {
          url: 'https://example.com/valid-property',
          title: 'Valid Property for Testing',
          price: '1,500,000',
          description: 'This property should be processed successfully',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '1,200 sqft',
            bedrooms: '2',
            bathrooms: '2',
            reference: 'VALID-TEST-001',
            zoneName: 'Test Community',
            dldPermitNumber: 'DLD-VALID-001'
          },
          agentName: 'Valid Agent',
          images: [],
          scrapedAt: timestamp
        },
        
        // Missing required fields
        {
          url: 'https://example.com/missing-fields',
          title: '', // Missing title
          price: '', // Missing price
          description: 'Property with missing required fields',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '1,000 sqft',
            bedrooms: '1',
            bathrooms: '1',
            reference: '', // Missing reference
            zoneName: '', // Missing zone name
            dldPermitNumber: 'DLD-MISSING-001'
          },
          agentName: '', // Missing agent name
          images: [],
          scrapedAt: timestamp
        },
        
        // Invalid price formats
        {
          url: 'https://example.com/invalid-price',
          title: 'Property with Invalid Price',
          price: 'Not a valid price', // Invalid price format
          description: 'Property with invalid price format',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '1,100 sqft',
            bedrooms: '2',
            bathrooms: '2',
            reference: 'INVALID-PRICE-001',
            zoneName: 'Test Community',
            dldPermitNumber: 'DLD-INVALID-001'
          },
          agentName: 'Test Agent',
          images: [],
          scrapedAt: timestamp
        },
        
        // Invalid bedroom/bathroom counts
        {
          url: 'https://example.com/invalid-rooms',
          title: 'Property with Invalid Room Counts',
          price: '2,000,000',
          description: 'Property with invalid bedroom and bathroom counts',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '1,300 sqft',
            bedrooms: 'Not a number', // Invalid bedroom count
            bathrooms: 'Also not a number', // Invalid bathroom count
            reference: 'INVALID-ROOMS-001',
            zoneName: 'Test Community',
            dldPermitNumber: 'DLD-INVALID-002'
          },
          agentName: 'Test Agent',
          images: [],
          scrapedAt: timestamp
        },
        
        // Missing propertyDetails object
        {
          url: 'https://example.com/missing-details',
          title: 'Property with Missing Details',
          price: '1,800,000',
          description: 'Property with missing propertyDetails object',
          // propertyDetails: missing entirely
          agentName: 'Test Agent',
          images: [],
          scrapedAt: timestamp
        }
      ]
    };
  }

  /**
   * Generate invalid JSON structure for JSON parsing error testing
   */
  generateInvalidJsonStructure(): any {
    return {
      // Missing metadata
      properties: [
        {
          url: 'https://example.com/test',
          title: 'Test Property',
          price: '1,000,000',
          description: 'Test description',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '1,000 sqft',
            bedrooms: '2',
            bathrooms: '2',
            reference: 'TEST-001',
            zoneName: 'Test Zone',
            dldPermitNumber: 'DLD-TEST-001'
          },
          agentName: 'Test Agent',
          images: [],
          scrapedAt: new Date().toISOString()
        }
      ]
    };
  }

  /**
   * Save test data to file
   */
  async saveTestData(data: any, filename: string): Promise<void> {
    const filePath = path.join(process.cwd(), 'scripts', filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Test data saved to: ${filePath}`);
  }

  /**
   * Generate all test data files
   */
  async generateAllTestData(): Promise<void> {
    console.log('🏗️ Generating test data files for integration testing...\n');

    try {
      // Generate valid test data
      const validData = this.generateValidTestData();
      await this.saveTestData(validData, 'test-listings-valid.json');

      // Generate malformed test data
      const malformedData = this.generateMalformedTestData();
      await this.saveTestData(malformedData, 'test-listings-malformed.json');

      // Generate invalid JSON structure
      const invalidStructure = this.generateInvalidJsonStructure();
      await this.saveTestData(invalidStructure, 'test-listings-invalid-structure.json');

      console.log('\n✅ All test data files generated successfully!');
      console.log('\nGenerated files:');
      console.log('  - test-listings-valid.json (6 properties with various scenarios)');
      console.log('  - test-listings-malformed.json (5 properties with validation errors)');
      console.log('  - test-listings-invalid-structure.json (invalid JSON structure)');

    } catch (error) {
      console.error('❌ Failed to generate test data:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const generator = new TestDataGenerator();
  await generator.generateAllTestData();
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Test data generation failed:', error);
    process.exit(1);
  });
}

export { TestDataGenerator };