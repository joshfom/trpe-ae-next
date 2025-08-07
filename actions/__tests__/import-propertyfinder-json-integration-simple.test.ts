/**
 * Simplified Integration Tests for PropertyFinder JSON Import System
 * 
 * This test suite covers integration testing with mocked dependencies:
 * - Complete import process with sample JSON data (Requirements: 1.1, 1.2, 1.3, 1.4)
 * - Database record creation verification (Requirements: 1.1, 1.2, 1.3, 1.4)
 * - Image downloading and processing for luxury properties (Requirements: 3.3, 4.1, 4.2, 4.3)
 * - Error handling with malformed data (Requirements: 1.3, 4.4)
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';

// Mock the database and external dependencies
jest.mock('@/db/drizzle', () => ({
  db: {
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ id: 'test-job-id' }])
      })
    }),
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([])
      })
    }),
    query: {
      propertyTable: {
        findFirst: jest.fn().mockResolvedValue(null)
      }
    },
    execute: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined)
    })
  }
}));

jest.mock('@/lib/xml-import/image-utils', () => ({
  convertToWebp: jest.fn().mockResolvedValue({
    success: true,
    webpPath: '/tmp/test-image.webp'
  }),
  uploadPropertyImageToS3: jest.fn().mockResolvedValue({
    success: true,
    url: 'https://test-bucket.s3.amazonaws.com/test-image.webp'
  })
}));

// Mock all database schema imports
jest.mock('@/db/schema/property-table', () => ({
  propertyTable: {
    id: 'id',
    referenceNumber: 'referenceNumber',
    title: 'title',
    price: 'price',
    isLuxe: 'isLuxe'
  }
}));

jest.mock('@/db/schema/import-job-table', () => ({
  importJobTable: {
    id: 'id',
    status: 'status',
    createdAt: 'createdAt'
  }
}));

// Mock other schema tables
const mockSchemaTable = {
  id: 'id',
  name: 'name'
};

jest.mock('@/db/schema/employee-table', () => ({ employeeTable: mockSchemaTable }));
jest.mock('@/db/schema/community-table', () => ({ communityTable: mockSchemaTable }));
jest.mock('@/db/schema/property-type-table', () => ({ propertyTypeTable: mockSchemaTable }));
jest.mock('@/db/schema/offering-type-table', () => ({ offeringTypeTable: mockSchemaTable }));
jest.mock('@/db/schema/city-table', () => ({ cityTable: mockSchemaTable }));
jest.mock('@/db/schema/sub-community-table', () => ({ subCommunityTable: mockSchemaTable }));
jest.mock('@/db/schema/property-images-table', () => ({ propertyImagesTable: mockSchemaTable }));

// Mock external libraries
jest.mock('slugify', () => jest.fn((text) => text.toLowerCase().replace(/\s+/g, '-')));
jest.mock('@paralleldrive/cuid2', () => ({ createId: () => 'test-id-123' }));

// Test data interfaces
interface TestPropertyFinderData {
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

describe('PropertyFinder JSON Import - Simplified Integration Tests', () => {
  const originalJsonPath = path.join(process.cwd(), 'scripts', 'listings.json');
  const backupJsonPath = path.join(process.cwd(), 'scripts', 'listings.json.backup');

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up test files
    try {
      await fs.unlink(originalJsonPath);
    } catch {
      // File might not exist
    }
    
    try {
      await fs.access(backupJsonPath);
      await fs.copyFile(backupJsonPath, originalJsonPath);
      await fs.unlink(backupJsonPath);
    } catch {
      // Backup might not exist
    }
  });

  /**
   * Create sample test data
   */
  function createSampleTestData(): TestPropertyFinderData {
    return {
      metadata: {
        scrapedAt: '2024-01-01T00:00:00Z',
        totalProperties: 3,
        successfulScrapes: 3,
        failedScrapes: 0
      },
      properties: [
        // Luxury property with images
        {
          url: 'https://example.com/luxury-villa',
          title: 'Luxury Villa in Palm Jumeirah',
          price: '25,000,000 AED',
          description: 'Beautiful luxury villa',
          propertyDetails: {
            propertyType: 'Villa',
            propertySize: '5,000 sqft',
            bedrooms: '4',
            bathrooms: '5',
            reference: 'LUXE-001',
            zoneName: 'Palm Jumeirah',
            dldPermitNumber: 'DLD-123456'
          },
          agentName: 'John Doe',
          images: [
            'https://via.placeholder.com/800x600/0066cc/ffffff?text=Villa+Image+1',
            'https://via.placeholder.com/800x600/0066cc/ffffff?text=Villa+Image+2'
          ],
          scrapedAt: '2024-01-01T00:00:00Z'
        },
        // Standard property
        {
          url: 'https://example.com/standard-apartment',
          title: 'Modern Apartment in Marina',
          price: '1,500,000',
          description: 'Comfortable apartment',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '1,200 sqft',
            bedrooms: '2',
            bathrooms: '2',
            reference: 'STD-001',
            zoneName: 'Dubai Marina',
            dldPermitNumber: 'DLD-345678'
          },
          agentName: 'Jane Smith',
          images: [],
          scrapedAt: '2024-01-01T00:00:00Z'
        },
        // Studio apartment (edge case)
        {
          url: 'https://example.com/studio',
          title: 'Modern Studio',
          price: '800,000',
          description: 'Compact studio',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '600 sqft',
            bedrooms: 'Studio',
            bathrooms: '1',
            reference: 'STUDIO-001',
            zoneName: 'Business Bay',
            dldPermitNumber: 'DLD-789012'
          },
          agentName: 'Mike Johnson',
          images: [],
          scrapedAt: '2024-01-01T00:00:00Z'
        }
      ]
    };
  }

  /**
   * Create malformed test data
   */
  function createMalformedTestData(): any {
    return {
      metadata: {
        scrapedAt: '2024-01-01T00:00:00Z',
        totalProperties: 2,
        successfulScrapes: 1,
        failedScrapes: 1
      },
      properties: [
        // Valid property
        {
          url: 'https://example.com/valid',
          title: 'Valid Property',
          price: '1,000,000',
          description: 'Valid description',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '1,000 sqft',
            bedrooms: '2',
            bathrooms: '2',
            reference: 'VALID-001',
            zoneName: 'Test Community',
            dldPermitNumber: 'DLD-111111'
          },
          agentName: 'Test Agent',
          images: [],
          scrapedAt: '2024-01-01T00:00:00Z'
        },
        // Invalid property (missing required fields)
        {
          url: 'https://example.com/invalid',
          title: '', // Missing title
          price: 'invalid-price', // Invalid price
          description: 'Invalid property',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '1,000 sqft',
            bedrooms: '2',
            bathrooms: '2',
            reference: '', // Missing reference
            zoneName: 'Test Community',
            dldPermitNumber: 'DLD-222222'
          },
          agentName: '', // Missing agent name
          images: [],
          scrapedAt: '2024-01-01T00:00:00Z'
        }
      ]
    };
  }

  /**
   * Setup test JSON file
   */
  async function setupTestJsonFile(data: any): Promise<void> {
    // Backup original file if it exists
    try {
      await fs.access(originalJsonPath);
      await fs.copyFile(originalJsonPath, backupJsonPath);
    } catch {
      // Original file doesn't exist
    }

    // Write test data
    await fs.writeFile(originalJsonPath, JSON.stringify(data, null, 2));
  }

  describe('Complete Import Process with Sample JSON Data', () => {
    it('should successfully process valid PropertyFinder JSON data', async () => {
      // Requirements: 1.1, 1.2, 1.3, 1.4
      const testData = createSampleTestData();
      await setupTestJsonFile(testData);

      // Import the function after mocks are set up
      const { importPropertyFinderJson } = await import('../import-propertyfinder-json-action');
      
      const result = await importPropertyFinderJson();

      expect(result.success).toBe(true);
      expect(result.stats).toBeDefined();
      expect(result.jobId).toBeDefined();

      // Verify statistics
      const stats = result.stats!;
      expect(stats.totalProcessed).toBe(3);
      expect(stats.luxeProperties).toBe(1); // One luxury property in test data
      expect(stats.processingTime).toBeGreaterThan(0);

      console.log('✅ Import completed successfully with stats:', {
        totalProcessed: stats.totalProcessed,
        created: stats.created,
        updated: stats.updated,
        skipped: stats.skipped,
        failed: stats.failed,
        luxeProperties: stats.luxeProperties
      });
    }, 30000);

    it('should detect luxury properties correctly', async () => {
      // Requirements: 3.1, 3.2, 3.3
      const testData = createSampleTestData();
      await setupTestJsonFile(testData);

      const { importPropertyFinderJson } = await import('../import-propertyfinder-json-action');
      
      const result = await importPropertyFinderJson();

      expect(result.success).toBe(true);
      
      const stats = result.stats!;
      expect(stats.luxeProperties).toBe(1); // Villa at 25M AED should be luxury
      expect(stats.luxePropertiesWithImages).toBe(1); // Villa has images
      expect(stats.luxePropertiesWithoutImages).toBe(0);

      console.log('✅ Luxury property detection working correctly');
    }, 30000);

    it('should handle Studio bedroom parsing correctly', async () => {
      // Requirements: 7.1, 7.2, 7.3
      const testData = createSampleTestData();
      await setupTestJsonFile(testData);

      const { importPropertyFinderJson } = await import('../import-propertyfinder-json-action');
      
      const result = await importPropertyFinderJson();

      expect(result.success).toBe(true);
      
      // Studio should be processed successfully (bedroom count = 0)
      const stats = result.stats!;
      expect(stats.totalProcessed).toBe(3);
      expect(stats.created + stats.updated).toBeGreaterThan(0);

      console.log('✅ Studio bedroom parsing handled correctly');
    }, 30000);
  });

  describe('Error Handling with Malformed Data', () => {
    it('should handle malformed JSON data gracefully', async () => {
      // Requirements: 1.3, 4.4
      const malformedData = createMalformedTestData();
      await setupTestJsonFile(malformedData);

      const { importPropertyFinderJson } = await import('../import-propertyfinder-json-action');
      
      const result = await importPropertyFinderJson();

      expect(result.success).toBe(true); // Should complete despite errors
      
      const stats = result.stats!;
      expect(stats.totalProcessed).toBe(2);
      expect(stats.skipped).toBeGreaterThan(0); // Invalid property should be skipped

      console.log('✅ Malformed data handled gracefully:', {
        totalProcessed: stats.totalProcessed,
        created: stats.created,
        skipped: stats.skipped,
        failed: stats.failed
      });
    }, 30000);

    it('should handle missing JSON file gracefully', async () => {
      // Requirements: 1.3, 4.4
      // Don't create any JSON file to test missing file handling
      
      const { importPropertyFinderJson } = await import('../import-propertyfinder-json-action');
      
      const result = await importPropertyFinderJson();

      expect(result.success).toBe(false);
      expect(result.error).toContain('JSON file not found');
      expect(result.jobId).toBeDefined();

      console.log('✅ Missing JSON file handled gracefully');
    }, 15000);

    it('should handle invalid JSON format gracefully', async () => {
      // Requirements: 1.3, 4.4
      const invalidJson = '{ invalid json format }';
      await fs.writeFile(originalJsonPath, invalidJson);

      const { importPropertyFinderJson } = await import('../import-propertyfinder-json-action');
      
      const result = await importPropertyFinderJson();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid JSON format');
      expect(result.jobId).toBeDefined();

      console.log('✅ Invalid JSON format handled gracefully');
    }, 15000);
  });

  describe('Data Validation and Processing', () => {
    it('should validate required fields correctly', async () => {
      // Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8
      const testData = createSampleTestData();
      await setupTestJsonFile(testData);

      const { importPropertyFinderJson } = await import('../import-propertyfinder-json-action');
      
      const result = await importPropertyFinderJson();

      expect(result.success).toBe(true);
      
      const stats = result.stats!;
      expect(stats.totalProcessed).toBe(3);
      
      // All properties in sample data should be valid
      expect(stats.created + stats.updated).toBe(3);
      expect(stats.skipped).toBe(0);
      expect(stats.failed).toBe(0);

      console.log('✅ Required field validation working correctly');
    }, 30000);

    it('should generate comprehensive statistics', async () => {
      // Requirements: 1.4, 6.4
      const testData = createSampleTestData();
      await setupTestJsonFile(testData);

      const { importPropertyFinderJson } = await import('../import-propertyfinder-json-action');
      
      const result = await importPropertyFinderJson();

      expect(result.success).toBe(true);
      
      const stats = result.stats!;
      
      // Verify comprehensive statistics are provided
      expect(stats.totalProcessed).toBeGreaterThan(0);
      expect(stats.processingTime).toBeGreaterThan(0);
      expect(stats.successRate).toBeDefined();
      expect(stats.failureRate).toBeDefined();
      expect(stats.skipRate).toBeDefined();
      expect(stats.averageProcessingTimePerProperty).toBeGreaterThan(0);
      expect(stats.propertiesPerSecond).toBeGreaterThan(0);

      console.log('✅ Comprehensive statistics generated:', {
        successRate: stats.successRate,
        failureRate: stats.failureRate,
        skipRate: stats.skipRate,
        averageProcessingTime: stats.averageProcessingTimePerProperty,
        propertiesPerSecond: stats.propertiesPerSecond
      });
    }, 30000);
  });

  describe('Performance and Reliability', () => {
    it('should complete import within reasonable time limits', async () => {
      // Requirements: 1.4, 6.4
      const testData = createSampleTestData();
      await setupTestJsonFile(testData);

      const startTime = Date.now();
      
      const { importPropertyFinderJson } = await import('../import-propertyfinder-json-action');
      
      const result = await importPropertyFinderJson();
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(result.success).toBe(true);
      expect(totalTime).toBeLessThan(30000); // Should complete within 30 seconds for small dataset
      expect(result.stats!.processingTime).toBeGreaterThan(0);

      console.log('✅ Import completed within time limits:', {
        totalTime: totalTime,
        processingTime: result.stats!.processingTime,
        propertiesPerSecond: result.stats!.propertiesPerSecond
      });
    }, 35000);
  });
});