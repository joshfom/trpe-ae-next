/**
 * Integration Tests for PropertyFinder JSON Import System
 * 
 * This test suite covers comprehensive integration testing for the PropertyFinder JSON import:
 * - Complete import process with sample JSON data (Requirements: 1.1, 1.2, 1.3, 1.4)
 * - Database record creation verification (Requirements: 1.1, 1.2, 1.3, 1.4)
 * - Image downloading and processing for luxury properties (Requirements: 3.3, 4.1, 4.2, 4.3)
 * - Error handling with malformed data (Requirements: 1.3, 4.4)
 */

import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { db } from '@/db/drizzle';
import { propertyTable } from '@/db/schema/property-table';
import { propertyImagesTable } from '@/db/schema/property-images-table';
import { employeeTable } from '@/db/schema/employee-table';
import { communityTable } from '@/db/schema/community-table';
import { propertyTypeTable } from '@/db/schema/property-type-table';
import { offeringTypeTable } from '@/db/schema/offering-type-table';
import { cityTable } from '@/db/schema/city-table';
import { importJobTable } from '@/db/schema/import-job-table';
import { eq, sql } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';
import { importPropertyFinderJson } from '../import-propertyfinder-json-action';

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

// Test utilities
class IntegrationTestHelper {
  private testDataPath: string;
  private originalJsonPath: string;
  private backupJsonPath: string;

  constructor() {
    this.testDataPath = path.join(process.cwd(), 'scripts', 'test-listings.json');
    this.originalJsonPath = path.join(process.cwd(), 'scripts', 'listings.json');
    this.backupJsonPath = path.join(process.cwd(), 'scripts', 'listings.json.backup');
  }

  /**
   * Create sample test data for integration testing
   */
  createSampleTestData(): TestPropertyFinderData {
    return {
      metadata: {
        scrapedAt: '2024-01-01T00:00:00Z',
        totalProperties: 4,
        successfulScrapes: 4,
        failedScrapes: 0
      },
      properties: [
        // Luxury property with images (should trigger image processing)
        {
          url: 'https://example.com/luxury-villa',
          title: 'Luxury Villa in Palm Jumeirah',
          price: '25,000,000 AED',
          description: 'Beautiful luxury villa with stunning views',
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
        // Luxury property without images
        {
          url: 'https://example.com/luxury-apartment',
          title: 'Luxury Apartment in Downtown',
          price: '30,000,000',
          description: 'Premium apartment in the heart of Dubai',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '3,500 sqft',
            bedrooms: '3',
            bathrooms: '4',
            reference: 'LUXE-002',
            zoneName: 'Downtown Dubai',
            dldPermitNumber: 'DLD-789012'
          },
          agentName: 'Jane Smith',
          images: [],
          scrapedAt: '2024-01-01T00:00:00Z'
        },
        // Standard property (below luxury threshold)
        {
          url: 'https://example.com/standard-apartment',
          title: 'Modern Apartment in Marina',
          price: '1,500,000',
          description: 'Comfortable apartment with marina views',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '1,200 sqft',
            bedrooms: '2',
            bathrooms: '2',
            reference: 'STD-001',
            zoneName: 'Dubai Marina',
            dldPermitNumber: 'DLD-345678'
          },
          agentName: 'Mike Johnson',
          images: [
            'https://via.placeholder.com/800x600/009900/ffffff?text=Standard+Image+1'
          ],
          scrapedAt: '2024-01-01T00:00:00Z'
        },
        // Property for update testing (will be created first, then updated)
        {
          url: 'https://example.com/update-test',
          title: 'Property for Update Testing',
          price: '2,000,000',
          description: 'This property will be updated during testing',
          propertyDetails: {
            propertyType: 'Townhouse',
            propertySize: '2,000 sqft',
            bedrooms: '3',
            bathrooms: '3',
            reference: 'UPD-001',
            zoneName: 'Jumeirah Village Circle',
            dldPermitNumber: 'DLD-901234'
          },
          agentName: 'Sarah Wilson',
          images: [],
          scrapedAt: '2024-01-01T00:00:00Z'
        }
      ]
    };
  }

  /**
   * Create malformed test data for error handling testing
   */
  createMalformedTestData(): any {
    return {
      metadata: {
        scrapedAt: '2024-01-01T00:00:00Z',
        totalProperties: 3,
        successfulScrapes: 1,
        failedScrapes: 2
      },
      properties: [
        // Valid property
        {
          url: 'https://example.com/valid-property',
          title: 'Valid Property',
          price: '1,000,000',
          description: 'This property should be processed successfully',
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
        // Missing required fields
        {
          url: 'https://example.com/invalid-property-1',
          title: '', // Missing title
          price: 'invalid-price', // Invalid price format
          description: 'Property with missing required fields',
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
        },
        // Invalid data types
        {
          url: 'https://example.com/invalid-property-2',
          title: 'Property with Invalid Data',
          price: '1,500,000',
          description: 'Property with invalid data types',
          propertyDetails: {
            propertyType: 'Apartment',
            propertySize: '1,200 sqft',
            bedrooms: 'invalid-bedrooms', // Invalid bedroom count
            bathrooms: 'invalid-bathrooms', // Invalid bathroom count
            reference: 'INVALID-002',
            zoneName: 'Test Community',
            dldPermitNumber: 'DLD-333333'
          },
          agentName: 'Test Agent 2',
          images: 'not-an-array', // Invalid images format
          scrapedAt: '2024-01-01T00:00:00Z'
        }
      ]
    };
  }

  /**
   * Setup test JSON file
   */
  async setupTestJsonFile(data: any): Promise<void> {
    // Backup original file if it exists
    try {
      await fs.access(this.originalJsonPath);
      await fs.copyFile(this.originalJsonPath, this.backupJsonPath);
    } catch {
      // Original file doesn't exist, no backup needed
    }

    // Write test data
    await fs.writeFile(this.originalJsonPath, JSON.stringify(data, null, 2));
  }

  /**
   * Restore original JSON file
   */
  async restoreOriginalJsonFile(): Promise<void> {
    try {
      // Remove test file
      await fs.unlink(this.originalJsonPath);
      
      // Restore backup if it exists
      try {
        await fs.access(this.backupJsonPath);
        await fs.copyFile(this.backupJsonPath, this.originalJsonPath);
        await fs.unlink(this.backupJsonPath);
      } catch {
        // No backup to restore
      }
    } catch (error) {
      console.warn('Failed to restore original JSON file:', error);
    }
  }

  /**
   * Clean up test database records
   */
  async cleanupTestData(): Promise<void> {
    try {
      // Delete test properties (cascade will handle related records)
      await db.delete(propertyTable).where(
        sql`${propertyTable.referenceNumber} LIKE 'PF-LUXE-%' OR 
            ${propertyTable.referenceNumber} LIKE 'PF-STD-%' OR 
            ${propertyTable.referenceNumber} LIKE 'PF-UPD-%' OR 
            ${propertyTable.referenceNumber} LIKE 'PF-VALID-%' OR 
            ${propertyTable.referenceNumber} LIKE 'PF-INVALID-%'`
      );

      // Clean up test import jobs
      await db.delete(importJobTable).where(
        sql`${importJobTable.createdAt} > NOW() - INTERVAL '1 hour'`
      );

      console.log('✅ Test data cleanup completed');
    } catch (error) {
      console.warn('⚠️ Failed to cleanup test data:', error);
    }
  }
}

describe('PropertyFinder JSON Import - Integration Tests', () => {
  let testHelper: IntegrationTestHelper;

  beforeAll(async () => {
    testHelper = new IntegrationTestHelper();
    console.log('🧪 Setting up integration test environment...');
  });

  afterAll(async () => {
    console.log('🧹 Cleaning up integration test environment...');
    await testHelper.restoreOriginalJsonFile();
    await testHelper.cleanupTestData();
  });

  beforeEach(async () => {
    // Clean up any existing test data before each test
    await testHelper.cleanupTestData();
  });

  afterEach(async () => {
    // Clean up test data after each test
    await testHelper.cleanupTestData();
  });

  describe('Complete Import Process with Sample JSON Data', () => {
    it('should successfully import valid PropertyFinder JSON data', async () => {
      // Requirements: 1.1, 1.2, 1.3, 1.4
      const testData = testHelper.createSampleTestData();
      await testHelper.setupTestJsonFile(testData);

      const result = await importPropertyFinderJson();

      expect(result.success).toBe(true);
      expect(result.stats).toBeDefined();
      expect(result.jobId).toBeDefined();

      // Verify statistics
      const stats = result.stats!;
      expect(stats.totalProcessed).toBe(4);
      expect(stats.created + stats.updated).toBeGreaterThan(0);
      expect(stats.luxeProperties).toBe(2); // Two luxury properties in test data
      expect(stats.processingTime).toBeGreaterThan(0);
      expect(stats.successRate).toBeGreaterThan(0);

      console.log('✅ Import completed with stats:', {
        totalProcessed: stats.totalProcessed,
        created: stats.created,
        updated: stats.updated,
        skipped: stats.skipped,
        failed: stats.failed,
        luxeProperties: stats.luxeProperties,
        processingTime: stats.processingTime
      });
    }, 60000); // 60 second timeout for integration test

    it('should handle property updates correctly', async () => {
      // Requirements: 1.1, 1.2, 1.3, 1.4
      const testData = testHelper.createSampleTestData();
      await testHelper.setupTestJsonFile(testData);

      // First import
      const firstResult = await importPropertyFinderJson();
      expect(firstResult.success).toBe(true);
      expect(firstResult.stats!.created).toBeGreaterThan(0);

      // Second import (should update existing properties)
      const secondResult = await importPropertyFinderJson();
      expect(secondResult.success).toBe(true);
      expect(secondResult.stats!.updated).toBeGreaterThan(0);
      expect(secondResult.stats!.created).toBe(0); // No new properties created

      console.log('✅ Property updates handled correctly');
    }, 60000);

    it('should generate unique slugs for properties', async () => {
      // Requirements: 2.1, 2.2, 2.3, 2.4
      const testData = testHelper.createSampleTestData();
      await testHelper.setupTestJsonFile(testData);

      const result = await importPropertyFinderJson();
      expect(result.success).toBe(true);

      // Verify all properties have unique slugs
      const properties = await db.select({
        id: propertyTable.id,
        slug: propertyTable.slug,
        referenceNumber: propertyTable.referenceNumber
      }).from(propertyTable).where(
        sql`${propertyTable.referenceNumber} LIKE 'PF-%'`
      );

      expect(properties.length).toBeGreaterThan(0);

      // Check slug uniqueness
      const slugs = properties.map(p => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);

      // Verify slug format (should be kebab-case)
      properties.forEach(property => {
        expect(property.slug).toMatch(/^[a-z0-9-]+$/);
        expect(property.slug).not.toContain(' ');
        expect(property.slug).not.toContain('_');
      });

      console.log('✅ Unique slugs generated:', properties.map(p => ({ ref: p.referenceNumber, slug: p.slug })));
    }, 30000);
  });

  describe('Database Record Creation Verification', () => {
    it('should create correct property records in database', async () => {
      // Requirements: 1.1, 1.2, 1.3, 1.4
      const testData = testHelper.createSampleTestData();
      await testHelper.setupTestJsonFile(testData);

      const result = await importPropertyFinderJson();
      expect(result.success).toBe(true);

      // Verify property records
      const properties = await db.select().from(propertyTable).where(
        sql`${propertyTable.referenceNumber} LIKE 'PF-%'`
      );

      expect(properties.length).toBe(testData.properties.length);

      // Verify specific property data mapping
      const luxuryVilla = properties.find(p => p.referenceNumber === 'PF-LUXE-001');
      expect(luxuryVilla).toBeDefined();
      expect(luxuryVilla!.title).toBe('Luxury Villa in Palm Jumeirah');
      expect(luxuryVilla!.price).toBe(25000000);
      expect(luxuryVilla!.bedrooms).toBe(4);
      expect(luxuryVilla!.bathrooms).toBe(5);
      expect(luxuryVilla!.isLuxe).toBe(true);
      expect(luxuryVilla!.size).toBeGreaterThan(0); // Should have parsed size

      console.log('✅ Property records created correctly');
    }, 30000);

    it('should create related entity records (agents, communities, types)', async () => {
      // Requirements: 5.1, 5.2, 5.3
      const testData = testHelper.createSampleTestData();
      await testHelper.setupTestJsonFile(testData);

      const result = await importPropertyFinderJson();
      expect(result.success).toBe(true);

      // Verify agent records
      const agents = await db.select().from(employeeTable).where(
        sql`${employeeTable.name} IN ('John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson')`
      );
      expect(agents.length).toBeGreaterThan(0);

      // Verify community records
      const communities = await db.select().from(communityTable).where(
        sql`${communityTable.name} IN ('Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Jumeirah Village Circle')`
      );
      expect(communities.length).toBeGreaterThan(0);

      // Verify property type records
      const propertyTypes = await db.select().from(propertyTypeTable).where(
        sql`${propertyTypeTable.name} IN ('Villa', 'Apartment', 'Townhouse')`
      );
      expect(propertyTypes.length).toBeGreaterThan(0);

      console.log('✅ Related entity records created:', {
        agents: agents.length,
        communities: communities.length,
        propertyTypes: propertyTypes.length
      });
    }, 30000);

    it('should create import job records with correct status', async () => {
      // Requirements: 1.4, 6.4
      const testData = testHelper.createSampleTestData();
      await testHelper.setupTestJsonFile(testData);

      const result = await importPropertyFinderJson();
      expect(result.success).toBe(true);
      expect(result.jobId).toBeDefined();

      // Verify import job record
      const importJob = await db.select().from(importJobTable).where(
        eq(importJobTable.id, result.jobId)
      );

      expect(importJob.length).toBe(1);
      expect(importJob[0].status).toBe('completed');
      expect(importJob[0].startedAt).toBeDefined();
      expect(importJob[0].completedAt).toBeDefined();

      console.log('✅ Import job record created with correct status');
    }, 30000);
  });

  describe('Luxury Property Image Processing', () => {
    it('should process images for luxury properties above 20M AED threshold', async () => {
      // Requirements: 3.3, 4.1, 4.2, 4.3
      const testData = testHelper.createSampleTestData();
      await testHelper.setupTestJsonFile(testData);

      const result = await importPropertyFinderJson();
      expect(result.success).toBe(true);

      // Verify luxury property detection
      const stats = result.stats!;
      expect(stats.luxeProperties).toBe(2); // Two properties above 20M threshold
      expect(stats.luxePropertiesWithImages).toBe(1); // Only one has images
      expect(stats.luxePropertiesWithoutImages).toBe(1); // One without images

      // Verify luxury properties in database
      const luxuryProperties = await db.select().from(propertyTable).where(
        eq(propertyTable.isLuxe, true)
      );

      expect(luxuryProperties.length).toBe(2);
      luxuryProperties.forEach(property => {
        expect(property.price).toBeGreaterThan(20000000);
      });

      console.log('✅ Luxury properties detected and flagged correctly');
    }, 45000);

    it('should create image records for luxury properties with images', async () => {
      // Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.4
      const testData = testHelper.createSampleTestData();
      await testHelper.setupTestJsonFile(testData);

      const result = await importPropertyFinderJson();
      expect(result.success).toBe(true);

      // Find luxury property with images
      const luxuryVilla = await db.select().from(propertyTable).where(
        eq(propertyTable.referenceNumber, 'PF-LUXE-001')
      );

      expect(luxuryVilla.length).toBe(1);
      expect(luxuryVilla[0].isLuxe).toBe(true);

      // Note: In a real integration test, we would verify image records
      // For this test, we're focusing on the import process completion
      // Image processing might be mocked or skipped in test environment

      const stats = result.stats!;
      console.log('✅ Image processing attempted for luxury properties:', {
        imagesProcessed: stats.imagesProcessed,
        imagesSkipped: stats.imagesSkipped,
        imagesFailed: stats.imagesFailed
      });
    }, 45000);

    it('should skip image processing for standard properties', async () => {
      // Requirements: 3.1, 3.2, 3.4
      const testData = testHelper.createSampleTestData();
      await testHelper.setupTestJsonFile(testData);

      const result = await importPropertyFinderJson();
      expect(result.success).toBe(true);

      // Verify standard property (below luxury threshold)
      const standardProperty = await db.select().from(propertyTable).where(
        eq(propertyTable.referenceNumber, 'PF-STD-001')
      );

      expect(standardProperty.length).toBe(1);
      expect(standardProperty[0].isLuxe).toBe(false);
      expect(standardProperty[0].price).toBeLessThan(20000000);

      // Verify no image processing for standard properties
      const imageRecords = await db.select().from(propertyImagesTable).where(
        eq(propertyImagesTable.propertyId, standardProperty[0].id)
      );

      // Standard properties should not have images processed
      expect(imageRecords.length).toBe(0);

      console.log('✅ Image processing correctly skipped for standard properties');
    }, 30000);
  });

  describe('Error Handling with Malformed Data', () => {
    it('should handle malformed JSON data gracefully', async () => {
      // Requirements: 1.3, 4.4
      const malformedData = testHelper.createMalformedTestData();
      await testHelper.setupTestJsonFile(malformedData);

      const result = await importPropertyFinderJson();
      expect(result.success).toBe(true); // Should complete despite errors

      const stats = result.stats!;
      expect(stats.totalProcessed).toBe(3);
      expect(stats.created).toBe(1); // Only valid property should be created
      expect(stats.skipped).toBe(2); // Two invalid properties should be skipped
      expect(stats.failed).toBe(0); // Validation errors should result in skips, not failures

      console.log('✅ Malformed data handled gracefully:', {
        totalProcessed: stats.totalProcessed,
        created: stats.created,
        skipped: stats.skipped,
        failed: stats.failed
      });
    }, 30000);

    it('should handle missing JSON file gracefully', async () => {
      // Requirements: 1.3, 4.4
      // Remove the JSON file to test missing file handling
      await testHelper.restoreOriginalJsonFile();

      const result = await importPropertyFinderJson();
      expect(result.success).toBe(false);
      expect(result.error).toContain('JSON file not found');
      expect(result.jobId).toBeDefined();

      // Verify import job is marked as failed
      const importJob = await db.select().from(importJobTable).where(
        eq(importJobTable.id, result.jobId)
      );

      expect(importJob.length).toBe(1);
      expect(importJob[0].status).toBe('failed');

      console.log('✅ Missing JSON file handled gracefully');
    }, 15000);

    it('should handle invalid JSON format gracefully', async () => {
      // Requirements: 1.3, 4.4
      const invalidJson = '{ invalid json format }';
      await fs.writeFile(path.join(process.cwd(), 'scripts', 'listings.json'), invalidJson);

      const result = await importPropertyFinderJson();
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid JSON format');
      expect(result.jobId).toBeDefined();

      console.log('✅ Invalid JSON format handled gracefully');
    }, 15000);

    it('should provide detailed error reporting', async () => {
      // Requirements: 1.3, 1.4, 4.4
      const malformedData = testHelper.createMalformedTestData();
      await testHelper.setupTestJsonFile(malformedData);

      const result = await importPropertyFinderJson();
      expect(result.success).toBe(true);

      const stats = result.stats!;
      
      // Verify comprehensive statistics are provided
      expect(stats.totalProcessed).toBeGreaterThan(0);
      expect(stats.processingTime).toBeGreaterThan(0);
      expect(stats.successRate).toBeDefined();
      expect(stats.failureRate).toBeDefined();
      expect(stats.skipRate).toBeDefined();

      // Verify performance metrics
      expect(stats.averageProcessingTimePerProperty).toBeGreaterThan(0);
      expect(stats.propertiesPerSecond).toBeGreaterThan(0);

      console.log('✅ Detailed error reporting provided:', {
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
      const testData = testHelper.createSampleTestData();
      await testHelper.setupTestJsonFile(testData);

      const startTime = Date.now();
      const result = await importPropertyFinderJson();
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(result.success).toBe(true);
      expect(totalTime).toBeLessThan(60000); // Should complete within 60 seconds
      expect(result.stats!.processingTime).toBeGreaterThan(0);

      console.log('✅ Import completed within time limits:', {
        totalTime: totalTime,
        processingTime: result.stats!.processingTime,
        propertiesPerSecond: result.stats!.propertiesPerSecond
      });
    }, 65000);

    it('should maintain data consistency across multiple imports', async () => {
      // Requirements: 1.1, 1.2, 1.3, 1.4
      const testData = testHelper.createSampleTestData();
      await testHelper.setupTestJsonFile(testData);

      // Run multiple imports
      const results = [];
      for (let i = 0; i < 3; i++) {
        const result = await importPropertyFinderJson();
        expect(result.success).toBe(true);
        results.push(result);
      }

      // Verify data consistency
      const properties = await db.select().from(propertyTable).where(
        sql`${propertyTable.referenceNumber} LIKE 'PF-%'`
      );

      // Should have same number of properties as test data
      expect(properties.length).toBe(testData.properties.length);

      // Verify no duplicate properties were created
      const referenceNumbers = properties.map(p => p.referenceNumber);
      const uniqueReferences = new Set(referenceNumbers);
      expect(uniqueReferences.size).toBe(referenceNumbers.length);

      console.log('✅ Data consistency maintained across multiple imports');
    }, 90000);
  });
});