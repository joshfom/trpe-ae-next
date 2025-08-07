"use server"

import { db } from "@/db/drizzle";
import { propertyTable } from "@/db/schema/property-table";
import { createId } from "@paralleldrive/cuid2";
import { eq, sql } from "drizzle-orm";
import { importJobTable } from "@/db/schema/import-job-table";
import { subCommunityTable } from "@/db/schema/sub-community-table";
import { communityTable } from "@/db/schema/community-table";
import { cityTable } from "@/db/schema/city-table";
import { offeringTypeTable } from "@/db/schema/offering-type-table";
import { propertyTypeTable } from "@/db/schema/property-type-table";
import { employeeTable } from "@/db/schema/employee-table";
import slugify from "slugify";
import fs from "fs/promises";
import path from "path";
import { convertToWebp, uploadPropertyImageToS3 } from "@/lib/xml-import/image-utils";
import { propertyImagesTable } from "@/db/schema/property-images-table";

// PropertyFinder JSON data structure interfaces
interface PropertyFinderListing {
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
}

interface PropertyFinderData {
  metadata: {
    scrapedAt: string;
    totalProperties: number;
    successfulScrapes: number;
    failedScrapes: number;
  };
  properties: PropertyFinderListing[];
}

// Mapped property data for database insertion
interface MappedPropertyData {
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  referenceNumber: string;
  community: string;
  permitNumber: string;
  size: number; // in centi units
  agentName: string;
  isLuxe: boolean;
  images: string[];
  slug: string;
}

// Import statistics tracking
interface ImportStats {
  totalProcessed: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  luxeProperties: number;
  luxePropertiesWithImages: number;
  luxePropertiesWithoutImages: number;
  imagesProcessed: number;
  imagesSkipped: number;
  imagesFailed: number;
  processingTime: number;
  startTime: number;
  endTime?: number;
  averageProcessingTimePerProperty: number;
  propertiesPerSecond: number;
  successRate: number;
  failureRate: number;
  skipRate: number;
}

// Error tracking and logging interfaces
interface ErrorDetails {
  propertyReference: string;
  errorType: 'validation' | 'database' | 'image_processing' | 'mapping' | 'network' | 'unknown';
  errorMessage: string;
  timestamp: Date;
  recoverable: boolean;
  context?: Record<string, any>;
}

interface ProcessingProgress {
  current: number;
  total: number;
  percentage: number;
  estimatedTimeRemaining?: number;
  lastUpdateTime: Date;
}

interface SkippedPropertyDetails {
  reference: string;
  reason: string;
  category: 'missing_required_fields' | 'invalid_price' | 'invalid_data' | 'validation_failed';
  details: string[];
}

// Luxury property processing statistics
interface LuxuryProcessingStats {
  totalLuxuryFound: number;
  luxuryWithImages: number;
  luxuryWithoutImages: number;
  averageLuxuryPrice: number;
  highestPrice: number;
  lowestLuxuryPrice: number;
}

// Database processing options interface
interface PropertyOptions {
  propertyAgent: typeof employeeTable.$inferSelect;
  subCommunity: typeof subCommunityTable.$inferSelect | null;
  community: typeof communityTable.$inferSelect | null;
  city: typeof cityTable.$inferSelect | null;
  offeringType: typeof offeringTypeTable.$inferSelect | null;
  propertyType: typeof propertyTypeTable.$inferSelect | null;
  slug: string;
  lastUpdate: Date;
}

/**
 * Memory monitoring and optimization utilities
 */
interface MemoryUsage {
  rss: number; // Resident Set Size
  heapTotal: number; // Total heap size
  heapUsed: number; // Used heap size
  external: number; // External memory usage
  arrayBuffers: number; // ArrayBuffer memory usage
}

/**
 * Get current memory usage in MB
 */
function getMemoryUsage(): MemoryUsage {
  const usage = process.memoryUsage();
  return {
    rss: Math.round(usage.rss / 1024 / 1024),
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
    external: Math.round(usage.external / 1024 / 1024),
    arrayBuffers: Math.round(usage.arrayBuffers / 1024 / 1024)
  };
}

/**
 * Monitor memory usage and perform optimization if needed
 */
async function performMemoryOptimization(currentProperty: number, totalProperties: number): Promise<void> {
  const memoryUsage = getMemoryUsage();
  const progress = ((currentProperty / totalProperties) * 100).toFixed(1);
  
  console.log(`\n💾 Memory Usage Check (${progress}% complete):`);
  console.log(`📊 RSS: ${memoryUsage.rss}MB | Heap Used: ${memoryUsage.heapUsed}MB/${memoryUsage.heapTotal}MB`);
  console.log(`🔗 External: ${memoryUsage.external}MB | ArrayBuffers: ${memoryUsage.arrayBuffers}MB`);
  
  // Dynamic memory optimization thresholds based on available system memory
  const HEAP_WARNING_THRESHOLD = parseInt(process.env.PF_MEMORY_WARNING_MB || '1024'); // 1GB default
  const HEAP_CRITICAL_THRESHOLD = parseInt(process.env.PF_MEMORY_CRITICAL_MB || '2048'); // 2GB default
  const HEAP_USAGE_PERCENTAGE = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
  
  console.log(`📈 Heap Usage: ${HEAP_USAGE_PERCENTAGE.toFixed(1)}% of allocated heap`);
  
  if (memoryUsage.heapUsed > HEAP_CRITICAL_THRESHOLD) {
    console.log(`🚨 CRITICAL: Memory usage exceeds ${HEAP_CRITICAL_THRESHOLD}MB - forcing garbage collection`);
    if (global.gc) {
      const beforeGC = memoryUsage.heapUsed;
      global.gc();
      const afterGC = getMemoryUsage();
      const freedMemory = beforeGC - afterGC.heapUsed;
      console.log(`♻️ After GC: Heap Used: ${afterGC.heapUsed}MB (freed ${freedMemory}MB)`);
      
      // If memory is still critical after GC, suggest increasing heap size
      if (afterGC.heapUsed > HEAP_CRITICAL_THRESHOLD * 0.8) {
        console.log(`⚠️ Memory still high after GC - consider increasing Node.js heap size with --max-old-space-size`);
      }
    } else {
      console.log(`⚠️ Garbage collection not available - consider running with --expose-gc flag`);
      console.log(`💡 Current script should be run with: NODE_OPTIONS='--max-old-space-size=4096 --expose-gc' bun run scripts/import-propertyfinder.ts`);
    }
  } else if (memoryUsage.heapUsed > HEAP_WARNING_THRESHOLD) {
    console.log(`⚠️ WARNING: Memory usage exceeds ${HEAP_WARNING_THRESHOLD}MB - monitoring closely`);
    
    // Suggest garbage collection if heap usage is above 70%
    if (HEAP_USAGE_PERCENTAGE > 70 && global.gc) {
      console.log(`🧹 Performing preventive garbage collection (heap usage: ${HEAP_USAGE_PERCENTAGE.toFixed(1)}%)`);
      global.gc();
      const afterGC = getMemoryUsage();
      console.log(`♻️ Preventive GC completed: ${afterGC.heapUsed}MB (freed ${memoryUsage.heapUsed - afterGC.heapUsed}MB)`);
    }
  } else {
    console.log(`✅ Memory usage within normal limits (${HEAP_USAGE_PERCENTAGE.toFixed(1)}% heap usage)`);
  }
  
  // Performance optimization: Add adaptive delay based on memory pressure
  const delayMs = memoryUsage.heapUsed > HEAP_WARNING_THRESHOLD ? 200 : 50;
  await new Promise(resolve => setTimeout(resolve, delayMs));
}

/**
 * Main function to import PropertyFinder JSON listings into the database
 * Processes JSON file from /scripts/listings.json and transforms data to match our schema
 * Optimized for performance with batch processing and memory monitoring
 */
export async function importPropertyFinderJson(): Promise<{
  success: boolean;
  stats?: ImportStats;
  error?: string;
  jobId: string;
}> {
  // Initialize import statistics with comprehensive tracking
  const stats: ImportStats = {
    totalProcessed: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    luxeProperties: 0,
    luxePropertiesWithImages: 0,
    luxePropertiesWithoutImages: 0,
    imagesProcessed: 0,
    imagesSkipped: 0,
    imagesFailed: 0,
    processingTime: 0,
    startTime: Date.now(),
    averageProcessingTimePerProperty: 0,
    propertiesPerSecond: 0,
    successRate: 0,
    failureRate: 0,
    skipRate: 0,
  };

  // Initialize luxury property tracking
  const luxuryStats: LuxuryProcessingStats = {
    totalLuxuryFound: 0,
    luxuryWithImages: 0,
    luxuryWithoutImages: 0,
    averageLuxuryPrice: 0,
    highestPrice: 0,
    lowestLuxuryPrice: Number.MAX_SAFE_INTEGER,
  };

  const luxuryPrices: number[] = [];

  // Initialize comprehensive error tracking
  const errorLog: ErrorDetails[] = [];
  const skippedProperties: SkippedPropertyDetails[] = [];
  const startTime = Date.now();
  let lastProgressUpdate = Date.now();

  // Create import job record for tracking
  let [importJob] = await db.insert(importJobTable).values({
    id: createId(),
    startedAt: sql`now()`,
    status: 'running',
  }).returning();

  try {
    console.log('🚀 Starting PropertyFinder JSON import process...');
    console.log(`⏰ Import started at: ${new Date().toISOString()}`);

    // Read and parse JSON file with comprehensive error handling
    let jsonData: PropertyFinderData;
    try {
      jsonData = await readPropertyFinderJson();
      console.log(`📄 Found ${jsonData.properties.length} properties in JSON file`);
      console.log(`📊 JSON metadata: scraped at ${jsonData.metadata.scrapedAt}, successful: ${jsonData.metadata.successfulScrapes}, failed: ${jsonData.metadata.failedScrapes}`);
    } catch (jsonError) {
      const errorMessage = jsonError instanceof Error ? jsonError.message : 'Unknown JSON parsing error';
      console.error('❌ Critical error reading JSON file:', errorMessage);
      
      // Log detailed error for debugging
      logError(errorLog, 'JSON_FILE', 'network', errorMessage, false, {
        filePath: 'scripts/listings.json',
        errorType: 'file_read_error'
      });

      // Update import job with error status
      await updateImportJobStatus(importJob.id, 'failed', stats, errorMessage);
      
      return {
        success: false,
        error: `Failed to read JSON file: ${errorMessage}`,
        jobId: importJob.id,
      };
    }

    // Initialize processing statistics
    const processingStats = {
      validationErrors: [] as string[],
      priceParsingErrors: [] as string[],
      sizeParsingWarnings: [] as string[],
      luxuryPropertiesFound: [] as string[],
      processedReferences: [] as string[]
    };

    console.log(`\n🚀 Starting to process ${jsonData.properties.length} properties...`);

    // Configuration for batch processing and performance optimization
    const BATCH_SIZE = parseInt(process.env.PF_BATCH_SIZE || '15'); // Process properties in batches to manage memory
    const MAX_CONCURRENT_IMAGES = parseInt(process.env.PF_MAX_CONCURRENT_IMAGES || '5'); // Limit concurrent image downloads
    const MEMORY_CHECK_INTERVAL = parseInt(process.env.PF_MEMORY_CHECK_INTERVAL || '20'); // Check memory usage every N properties
    const ENABLE_PARALLEL_PROCESSING = process.env.PF_ENABLE_PARALLEL === 'true'; // Enable parallel processing within batches
    
    // Initialize batch processing variables
    const totalBatches = Math.ceil(jsonData.properties.length / BATCH_SIZE);
    let currentBatch = 0;
    
    console.log(`📦 Processing in batches of ${BATCH_SIZE} properties (${totalBatches} total batches)`);
    console.log(`🖼️ Maximum concurrent image downloads: ${MAX_CONCURRENT_IMAGES}`);
    console.log(`💾 Memory monitoring enabled (check every ${MEMORY_CHECK_INTERVAL} properties)`);

    // Process properties in batches for better memory management
    for (let batchStart = 0; batchStart < jsonData.properties.length; batchStart += BATCH_SIZE) {
      currentBatch++;
      const batchEnd = Math.min(batchStart + BATCH_SIZE, jsonData.properties.length);
      const batch = jsonData.properties.slice(batchStart, batchEnd);
      
      console.log(`\n📦 Processing batch ${currentBatch}/${totalBatches} (properties ${batchStart + 1}-${batchEnd})`);
      console.log(`⚡ Parallel processing: ${ENABLE_PARALLEL_PROCESSING ? 'ENABLED' : 'DISABLED'}`);
      
      if (ENABLE_PARALLEL_PROCESSING) {
        // Process batch properties in parallel with controlled concurrency
        const batchPromises = batch.map(async (listing, index) => {
          const globalIndex = batchStart + index;
          return await processPropertyWithErrorHandling(listing, globalIndex + 1, jsonData.properties.length, stats, luxuryStats, luxuryPrices, errorLog, skippedProperties, processingStats, startTime, lastProgressUpdate, MAX_CONCURRENT_IMAGES, MEMORY_CHECK_INTERVAL);
        });
        
        // Wait for all properties in the batch to complete
        const batchResults = await Promise.allSettled(batchPromises);
        
        // Process results and update statistics
        batchResults.forEach((result, index) => {
          if (result.status === 'rejected') {
            const reference = batch[index]?.propertyDetails?.reference || `BATCH-${currentBatch}-${index}`;
            console.error(`❌ Batch processing failed for ${reference}:`, result.reason);
            stats.failed++;
            logError(errorLog, reference, 'unknown', String(result.reason), false, {
              step: 'batch_parallel_processing',
              batchIndex: currentBatch,
              propertyIndex: index
            });
          }
        });
      } else {
        // Process each property in the current batch sequentially
        for (let i = 0; i < batch.length; i++) {
          const listing = batch[i];
          const globalIndex = batchStart + i;
          await processPropertyWithErrorHandling(listing, globalIndex + 1, jsonData.properties.length, stats, luxuryStats, luxuryPrices, errorLog, skippedProperties, processingStats, startTime, lastProgressUpdate, MAX_CONCURRENT_IMAGES, MEMORY_CHECK_INTERVAL);
        }
      }
      
      // End of batch processing - perform cleanup
      console.log(`✅ Batch ${currentBatch}/${totalBatches} completed`);
      
      // Force garbage collection between batches if available
      if (global.gc && currentBatch < totalBatches) {
        global.gc();
        console.log(`♻️ Garbage collection performed after batch ${currentBatch}`);
      }
      
      // Add small delay between batches to prevent overwhelming the system
      if (currentBatch < totalBatches) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Log detailed processing statistics
    console.log(`\n📈 DETAILED PROCESSING STATISTICS:`);
    console.log(`🔍 Total validation errors: ${processingStats.validationErrors.length}`);
    if (processingStats.validationErrors.length > 0) {
      console.log(`❌ Properties with validation errors:`, processingStats.validationErrors.slice(0, 10));
      if (processingStats.validationErrors.length > 10) {
        console.log(`... and ${processingStats.validationErrors.length - 10} more`);
      }
    }
    
    // Calculate luxury property statistics
    if (luxuryPrices.length > 0) {
      luxuryStats.averageLuxuryPrice = luxuryPrices.reduce((sum, price) => sum + price, 0) / luxuryPrices.length;
    }

    console.log(`💎 LUXURY PROPERTY ANALYSIS:`);
    console.log(`💎 Total luxury properties found: ${luxuryStats.totalLuxuryFound}`);
    console.log(`🖼️ Luxury properties with images: ${luxuryStats.luxuryWithImages}`);
    console.log(`❌ Luxury properties without images: ${luxuryStats.luxuryWithoutImages}`);
    
    if (luxuryStats.totalLuxuryFound > 0) {
      console.log(`💰 Highest luxury price: ${luxuryStats.highestPrice.toLocaleString()} AED`);
      console.log(`💰 Lowest luxury price: ${luxuryStats.lowestLuxuryPrice.toLocaleString()} AED`);
      console.log(`💰 Average luxury price: ${Math.round(luxuryStats.averageLuxuryPrice).toLocaleString()} AED`);
      console.log(`📊 Image processing rate: ${((luxuryStats.luxuryWithImages / luxuryStats.totalLuxuryFound) * 100).toFixed(1)}%`);
      
      console.log(`💎 Luxury property references:`, processingStats.luxuryPropertiesFound);
    }

    console.log(`✅ Successfully processed references: ${processingStats.processedReferences.length}`);
    if (processingStats.processedReferences.length > 0) {
      console.log(`📋 Sample processed references:`, processingStats.processedReferences.slice(0, 5));
    }

    // Calculate comprehensive processing statistics
    stats.endTime = Date.now();
    stats.processingTime = stats.endTime - stats.startTime;
    
    // Calculate performance metrics
    if (stats.totalProcessed > 0) {
      stats.averageProcessingTimePerProperty = Math.round(stats.processingTime / stats.totalProcessed);
      stats.propertiesPerSecond = parseFloat((stats.totalProcessed / (stats.processingTime / 1000)).toFixed(2));
      stats.successRate = parseFloat(((stats.created + stats.updated) / stats.totalProcessed * 100).toFixed(1));
      stats.failureRate = parseFloat((stats.failed / stats.totalProcessed * 100).toFixed(1));
      stats.skipRate = parseFloat((stats.skipped / stats.totalProcessed * 100).toFixed(1));
    }

    // Update import job with success status
    await updateImportJobStatus(importJob.id, 'completed', stats);

    // Generate and log comprehensive final statistics report
    const finalReport = generateFinalStatisticsReport(stats, luxuryStats, errorLog, skippedProperties);
    console.log(finalReport);

    return {
      success: true,
      stats,
      jobId: importJob.id,
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Critical error in PropertyFinder JSON import process:', errorMessage);
    
    // Log critical error details
    logError(errorLog, 'SYSTEM', 'unknown', errorMessage, false, {
      step: 'main_process',
      stats: stats,
      processingTime: Date.now() - startTime
    });

    // Calculate final statistics even on failure
    stats.endTime = Date.now();
    stats.processingTime = stats.endTime - stats.startTime;
    
    // Calculate performance metrics for partial processing
    if (stats.totalProcessed > 0) {
      stats.averageProcessingTimePerProperty = Math.round(stats.processingTime / stats.totalProcessed);
      stats.propertiesPerSecond = parseFloat((stats.totalProcessed / (stats.processingTime / 1000)).toFixed(2));
      stats.successRate = parseFloat(((stats.created + stats.updated) / stats.totalProcessed * 100).toFixed(1));
      stats.failureRate = parseFloat((stats.failed / stats.totalProcessed * 100).toFixed(1));
      stats.skipRate = parseFloat((stats.skipped / stats.totalProcessed * 100).toFixed(1));
    }

    // Update import job with error status
    await updateImportJobStatus(importJob.id, 'failed', stats, errorMessage);

    // Generate and log error summary report
    const errorReport = generateFinalStatisticsReport(stats, luxuryStats, errorLog, skippedProperties);
    console.log('\n🚨 CRITICAL FAILURE - PARTIAL STATISTICS REPORT:');
    console.log(errorReport);

    return {
      success: false,
      error: errorMessage,
      stats, // Include partial statistics even on failure
      jobId: importJob.id,
    };
  }
}

/**
 * Process a single property with comprehensive error handling
 * Extracted for both sequential and parallel processing support
 */
async function processPropertyWithErrorHandling(
  listing: PropertyFinderListing,
  currentIndex: number,
  totalProperties: number,
  stats: ImportStats,
  luxuryStats: LuxuryProcessingStats,
  luxuryPrices: number[],
  errorLog: ErrorDetails[],
  skippedProperties: SkippedPropertyDetails[],
  processingStats: any,
  startTime: number,
  lastProgressUpdate: number,
  maxConcurrentImages: number,
  memoryCheckInterval: number
): Promise<void> {
  stats.totalProcessed++;
  const reference = listing.propertyDetails?.reference || `UNKNOWN-${stats.totalProcessed}`;
  
  // Update progress indicators
  updateProgressIndicators(stats.totalProcessed, totalProperties, startTime, lastProgressUpdate);
  
  console.log(`\n=== Processing property ${stats.totalProcessed}/${totalProperties}: ${reference} ===`);
  console.log(`📋 Title: ${listing.title?.substring(0, 50)}${listing.title?.length > 50 ? '...' : ''}`);
  console.log(`💰 Price: ${listing.price}`);
  console.log(`🏠 Type: ${listing.propertyDetails?.propertyType} in ${listing.propertyDetails?.zoneName}`);
  console.log(`👤 Agent: ${listing.agentName}`);

  try {
    // Validate and map property data with detailed error tracking
    const mappedProperty = await validateAndMapPropertyWithErrorHandling(listing, errorLog, skippedProperties);
        if (!mappedProperty) {
          console.log(`❌ SKIPPED: Validation failed - ${reference}`);
          stats.skipped++;
          processingStats.validationErrors.push(reference);
          return;
        }

        // Track processed reference
        processingStats.processedReferences.push(mappedProperty.referenceNumber);

        // Track luxury properties with enhanced logging and statistics
        if (mappedProperty.isLuxe) {
          stats.luxeProperties++;
          processingStats.luxuryPropertiesFound.push(mappedProperty.referenceNumber);
          
          // Update luxury statistics
          luxuryStats.totalLuxuryFound++;
          luxuryPrices.push(mappedProperty.price);
          
          if (mappedProperty.price > luxuryStats.highestPrice) {
            luxuryStats.highestPrice = mappedProperty.price;
          }
          
          if (mappedProperty.price < luxuryStats.lowestLuxuryPrice) {
            luxuryStats.lowestLuxuryPrice = mappedProperty.price;
          }
          
          // Track image availability for luxury properties
          if (mappedProperty.images.length > 0) {
            stats.luxePropertiesWithImages++;
            luxuryStats.luxuryWithImages++;
            console.log(`💎 LUXURY WITH IMAGES: ${mappedProperty.referenceNumber} (${mappedProperty.images.length} images)`);
            console.log(`💰 Price: ${mappedProperty.price.toLocaleString()} AED`);
            console.log(`✅ Images will be processed for luxury property`);
          } else {
            stats.luxePropertiesWithoutImages++;
            luxuryStats.luxuryWithoutImages++;
            console.log(`💎 LUXURY WITHOUT IMAGES: ${mappedProperty.referenceNumber}`);
            console.log(`💰 Price: ${mappedProperty.price.toLocaleString()} AED`);
            console.log(`⚠️ No images to process for luxury property`);
          }
        } else {
          console.log(`🏠 Standard property: ${mappedProperty.referenceNumber} (${mappedProperty.price.toLocaleString()} AED - below 20M threshold)`);
        }

        // Log property details
        console.log(`📐 Size: ${mappedProperty.size} centi units (${(mappedProperty.size / 100).toFixed(2)} sqm)`);
        console.log(`🛏️ Bedrooms: ${mappedProperty.bedrooms}, Bathrooms: ${mappedProperty.bathrooms}`);
        console.log(`🏘️ Community: ${mappedProperty.community}`);

        // Process database entities using existing XML import logic with error recovery
        console.log(`🔄 Processing database entities...`);
        
        let propertyAgent, community, propertyType, offeringType, city;
        
        try {
          // Process agent - Requirements: 5.1
          propertyAgent = await processAgentWithErrorHandling(mappedProperty.agentName, reference, errorLog);
          
          // Process community - Requirements: 5.2
          community = await processCommunityWithErrorHandling(mappedProperty.community, reference, errorLog);
          
          // Process property type - Requirements: 5.3
          propertyType = await processPropertyTypeWithErrorHandling(mappedProperty.propertyType, reference, errorLog);
          
          // Process offering type (default to 'sale') - Requirements: 5.3
          offeringType = await processOfferingTypeWithErrorHandling(reference, errorLog);
          
          // Process city (default to Dubai) - Requirements: 5.2
          city = await processCityWithErrorHandling(reference, errorLog);
          
        } catch (entityError) {
          const errorMessage = entityError instanceof Error ? entityError.message : 'Unknown entity processing error';
          console.error(`❌ Failed to process database entities for ${reference}:`, errorMessage);
          
          logError(errorLog, reference, 'database', errorMessage, false, {
            step: 'entity_processing',
            agentName: mappedProperty.agentName,
            community: mappedProperty.community,
            propertyType: mappedProperty.propertyType
          });
          
          stats.failed++;
          return;
        }
        
        // Sub-community is not available in PropertyFinder data
        const subCommunity = null;
        
        // Set last update to current time for PropertyFinder imports
        const lastUpdate = new Date();

        // Prepare property options for database operations
        const propertyOptions: PropertyOptions = {
          propertyAgent,
          subCommunity,
          community,
          city,
          offeringType,
          propertyType,
          slug: mappedProperty.slug,
          lastUpdate,
        };

        // Check if property already exists by reference number with error handling
        let existingProperty;
        try {
          existingProperty = await db.query.propertyTable.findFirst({
            where: eq(propertyTable.referenceNumber, mappedProperty.referenceNumber),
          });
        } catch (dbError) {
          const errorMessage = dbError instanceof Error ? dbError.message : 'Database query error';
          console.error(`❌ Database error checking existing property ${reference}:`, errorMessage);
          
          logError(errorLog, reference, 'database', errorMessage, true, {
            step: 'property_lookup',
            referenceNumber: mappedProperty.referenceNumber
          });
          
          // Try to recover by assuming property doesn't exist
          existingProperty = null;
        }

        let property;
        try {
          if (existingProperty) {
            // Update existing property - Requirements: 7.4
            property = await updatePropertyWithErrorHandling(existingProperty.id, mappedProperty, propertyOptions, reference, errorLog);
            stats.updated++;
            console.log(`🔄 Property updated: ${mappedProperty.referenceNumber}`);
          } else {
            // Create new property - Requirements: 7.4
            property = await createPropertyWithErrorHandling(mappedProperty, propertyOptions, reference, errorLog);
            stats.created++;
            console.log(`✅ Property created: ${mappedProperty.referenceNumber}`);
          }
        } catch (propertyError) {
          const errorMessage = propertyError instanceof Error ? propertyError.message : 'Property operation error';
          console.error(`❌ Failed to save property ${reference}:`, errorMessage);
          
          logError(errorLog, reference, 'database', errorMessage, false, {
            step: existingProperty ? 'property_update' : 'property_create',
            propertyData: {
              title: mappedProperty.title,
              price: mappedProperty.price,
              referenceNumber: mappedProperty.referenceNumber
            }
          });
          
          stats.failed++;
          return;
        }

        // Process images for luxury properties with comprehensive error handling - Requirements: 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 5.4
        if (mappedProperty.isLuxe && mappedProperty.images.length > 0) {
          console.log(`🖼️ Processing ${mappedProperty.images.length} images for luxury property: ${mappedProperty.referenceNumber}`);
          try {
            const imageResults = await processPropertyFinderImagesWithErrorHandling(
              property.id, 
              mappedProperty.images, 
              reference, 
              errorLog,
              maxConcurrentImages
            );
            
            // Update image processing statistics
            stats.imagesProcessed += imageResults.processed;
            stats.imagesSkipped += imageResults.skipped;
            stats.imagesFailed += imageResults.failed;
            
            console.log(`✅ Image processing completed: ${imageResults.processed} processed, ${imageResults.skipped} skipped, ${imageResults.failed} failed`);
          } catch (imageError) {
            const imageErrorMessage = imageError instanceof Error ? imageError.message : String(imageError);
            console.error(`❌ Image processing failed for luxury property ${mappedProperty.referenceNumber}:`, imageErrorMessage);
            
            // Track failed images
            stats.imagesFailed += mappedProperty.images.length;
            
            logError(errorLog, reference, 'image_processing', imageErrorMessage, true, {
              step: 'image_processing',
              imageCount: mappedProperty.images.length,
              propertyId: property.id
            });
            
            // Continue processing even if image processing fails (non-critical failure)
          }
        } else if (mappedProperty.isLuxe && mappedProperty.images.length === 0) {
          // Track skipped images for luxury properties without images
          console.log(`💎 Luxury property without images: ${mappedProperty.referenceNumber} - no images to process`);
        }

        console.log(`🔗 Generated slug: ${mappedProperty.slug}`);
        console.log(`✅ SUCCESS: Property processed successfully - ${mappedProperty.referenceNumber}`);

        // Memory monitoring and garbage collection
        if (stats.totalProcessed % memoryCheckInterval === 0) {
          await performMemoryOptimization(stats.totalProcessed, totalProperties);
        }

        // Log progress every 5 properties
        if (stats.totalProcessed % 5 === 0) {
          const progress = ((stats.totalProcessed / totalProperties) * 100).toFixed(1);
          console.log(`\n📊 Progress: ${stats.totalProcessed}/${totalProperties} (${progress}%)`);
          console.log(`✅ Processed: ${stats.created}, ⏭️ Skipped: ${stats.skipped}, ❌ Failed: ${stats.failed}, 💎 Luxury: ${stats.luxeProperties}`);
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ FAILED: Error processing property ${reference}:`, errorMessage);
        
        // Log detailed error information
        logError(errorLog, reference, 'unknown', errorMessage, false, {
          step: 'property_processing',
          listingData: {
            title: listing.title,
            price: listing.price,
            agentName: listing.agentName,
            propertyType: listing.propertyDetails?.propertyType
          }
        });
        
        stats.failed++;
        processingStats.validationErrors.push(`${reference}: ${errorMessage}`);
        
        // Attempt error recovery for next property
        console.log(`🔄 Attempting to recover and continue with next property...`);
      }
  }

/**
 * Read and parse PropertyFinder JSON file with comprehensive validation
 */
async function readPropertyFinderJson(): Promise<PropertyFinderData> {
  const jsonPath = path.join(process.cwd(), 'scripts', 'listings.json');
  
  try {
    console.log(`📂 Reading JSON file from: ${jsonPath}`);
    
    // Check if file exists
    try {
      await fs.access(jsonPath);
    } catch (accessError) {
      throw new Error(`JSON file not found at path: ${jsonPath}`);
    }

    // Read file content
    const fileContent = await fs.readFile(jsonPath, 'utf-8');
    console.log(`📄 File read successfully, size: ${fileContent.length} characters`);

    // Parse JSON with error handling
    let jsonData: PropertyFinderData;
    try {
      jsonData = JSON.parse(fileContent);
    } catch (parseError) {
      throw new Error(`Invalid JSON format: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
    }

    // Validate JSON structure
    const validationErrors = validateJsonStructure(jsonData);
    if (validationErrors.length > 0) {
      throw new Error(`JSON structure validation failed: ${validationErrors.join(', ')}`);
    }

    console.log(`✅ JSON validation successful`);
    console.log(`📊 Metadata: scraped at ${jsonData.metadata.scrapedAt}, total properties: ${jsonData.metadata.totalProperties}`);
    console.log(`📋 Properties array length: ${jsonData.properties.length}`);

    return jsonData;
  } catch (error) {
    console.error(`❌ Error reading PropertyFinder JSON file:`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to read PropertyFinder JSON file: ${error.message}`);
    }
    throw new Error('Failed to read PropertyFinder JSON file: Unknown error');
  }
}

/**
 * Validate the structure of the PropertyFinder JSON data
 */
function validateJsonStructure(data: any): string[] {
  const errors: string[] = [];

  // Check if data is an object
  if (!data || typeof data !== 'object') {
    errors.push('Root data must be an object');
    return errors;
  }

  // Validate metadata
  if (!data.metadata) {
    errors.push('Missing metadata object');
  } else {
    if (typeof data.metadata !== 'object') {
      errors.push('Metadata must be an object');
    } else {
      if (!data.metadata.scrapedAt) errors.push('Missing metadata.scrapedAt');
      if (typeof data.metadata.totalProperties !== 'number') errors.push('metadata.totalProperties must be a number');
      if (typeof data.metadata.successfulScrapes !== 'number') errors.push('metadata.successfulScrapes must be a number');
      if (typeof data.metadata.failedScrapes !== 'number') errors.push('metadata.failedScrapes must be a number');
    }
  }

  // Validate properties array
  if (!data.properties) {
    errors.push('Missing properties array');
  } else if (!Array.isArray(data.properties)) {
    errors.push('Properties must be an array');
  } else {
    console.log(`🔍 Validating ${data.properties.length} properties structure...`);
    
    // Sample validation on first few properties to check structure
    const sampleSize = Math.min(3, data.properties.length);
    for (let i = 0; i < sampleSize; i++) {
      const property = data.properties[i];
      const propertyErrors = validatePropertyStructure(property, i);
      errors.push(...propertyErrors);
    }
  }

  return errors;
}

/**
 * Validate individual property structure
 */
function validatePropertyStructure(property: any, index: number): string[] {
  const errors: string[] = [];
  const prefix = `Property[${index}]`;

  if (!property || typeof property !== 'object') {
    errors.push(`${prefix}: must be an object`);
    return errors;
  }

  // Check required top-level fields
  const requiredFields = ['url', 'title', 'price', 'description', 'propertyDetails', 'agentName', 'images', 'scrapedAt'];
  for (const field of requiredFields) {
    if (!(field in property)) {
      errors.push(`${prefix}: missing required field '${field}'`);
    }
  }

  // Validate propertyDetails structure
  if (property.propertyDetails && typeof property.propertyDetails === 'object') {
    const requiredDetailFields = ['propertyType', 'propertySize', 'bedrooms', 'bathrooms', 'reference', 'zoneName', 'dldPermitNumber'];
    for (const field of requiredDetailFields) {
      if (!(field in property.propertyDetails)) {
        errors.push(`${prefix}.propertyDetails: missing required field '${field}'`);
      }
    }
  } else if (property.propertyDetails !== undefined) {
    errors.push(`${prefix}.propertyDetails: must be an object`);
  }

  // Validate images array
  if (property.images && !Array.isArray(property.images)) {
    errors.push(`${prefix}.images: must be an array`);
  }

  return errors;
}

/**
 * Validate and map PropertyFinder listing to our database schema with comprehensive validation
 */
async function validateAndMapProperty(listing: PropertyFinderListing): Promise<MappedPropertyData | null> {
  const validationErrors: string[] = [];
  const reference = listing.propertyDetails?.reference || 'UNKNOWN';

  try {
    console.log(`🔍 Validating property: ${reference}`);

    // Validate required fields with detailed logging
    const requiredFieldValidation = validateRequiredFields(listing);
    if (requiredFieldValidation.length > 0) {
      console.log(`❌ Required field validation failed for ${reference}:`, requiredFieldValidation);
      validationErrors.push(...requiredFieldValidation);
      return null;
    }

    // Parse and validate price
    const price = parsePrice(listing.price);
    if (price === null || price < 1) {
      const error = `Invalid price format or value: "${listing.price}"`;
      console.log(`❌ Price validation failed for ${reference}: ${error}`);
      validationErrors.push(error);
      return null;
    }

    // Parse and validate bedrooms and bathrooms
    const bedroomValidation = validateAndParseNumber(listing.propertyDetails.bedrooms, 'bedrooms', 0, 20);
    const bathroomValidation = validateAndParseNumber(listing.propertyDetails.bathrooms, 'bathrooms', 0, 20);
    
    if (!bedroomValidation.isValid || !bathroomValidation.isValid) {
      const errors = [
        !bedroomValidation.isValid ? `Invalid bedrooms: ${bedroomValidation.error}` : null,
        !bathroomValidation.isValid ? `Invalid bathrooms: ${bathroomValidation.error}` : null
      ].filter((error): error is string => error !== null);
      console.log(`❌ Bedroom/bathroom validation failed for ${reference}:`, errors);
      validationErrors.push(...errors);
      return null;
    }

    // Parse property size and convert to centi units
    const size = parsePropertySize(listing.propertyDetails.propertySize);
    if (size === 0) {
      console.log(`⚠️ Warning: Could not parse property size for ${reference}: "${listing.propertyDetails.propertySize}"`);
    }

    // Validate property type
    if (!listing.propertyDetails.propertyType || listing.propertyDetails.propertyType.trim() === '') {
      const error = 'Property type is required and cannot be empty';
      console.log(`❌ Property type validation failed for ${reference}: ${error}`);
      validationErrors.push(error);
      return null;
    }

    // Validate zone name (community) - Allow empty zone names for now
    // if (!listing.propertyDetails.zoneName || listing.propertyDetails.zoneName.trim() === '') {
    //   const error = 'Zone name (community) is required and cannot be empty';
    //   console.log(`❌ Zone name validation failed for ${reference}: ${error}`);
    //   validationErrors.push(error);
    //   return null;
    // }

    // Validate agent name
    if (!listing.agentName || listing.agentName.trim() === '') {
      const error = 'Agent name is required and cannot be empty';
      console.log(`❌ Agent name validation failed for ${reference}: ${error}`);
      validationErrors.push(error);
      return null;
    }

    // Extract and format reference number with PF- prefix
    const referenceNumber = extractReferenceNumber(listing.propertyDetails.reference);

    // Validate images array
    const images = Array.isArray(listing.images) ? listing.images.filter(img => 
      typeof img === 'string' && img.trim() !== ''
    ) : [];

    // Determine luxury status and image processing requirements
    const luxuryStatus = setLuxuryStatus(price, referenceNumber, images);
    const isLuxe = luxuryStatus.isLuxe;

    // Generate unique slug for the property
    const slug = await generatePropertySlug(listing.title.trim(), referenceNumber);

    // Map the property data
    const mappedProperty: MappedPropertyData = {
      title: listing.title.trim(),
      description: listing.description.trim(),
      price,
      bedrooms: bedroomValidation.value!,
      bathrooms: bathroomValidation.value!,
      propertyType: listing.propertyDetails.propertyType.trim(),
      referenceNumber,
      community: listing.propertyDetails.zoneName?.trim() || 'Unknown Community',
      permitNumber: listing.propertyDetails.dldPermitNumber?.trim() || '',
      size,
      agentName: listing.agentName.trim(),
      isLuxe,
      images,
      slug,
    };

    console.log(`✅ Property validation successful for ${reference} (Price: ${price.toLocaleString()} AED, Luxury: ${isLuxe})`);
    return mappedProperty;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error mapping property data for ${reference}:`, errorMessage);
    validationErrors.push(`Mapping error: ${errorMessage}`);
    return null;
  }
}

/**
 * Validate required fields for PropertyFinder listing
 */
function validateRequiredFields(listing: PropertyFinderListing): string[] {
  const errors: string[] = [];

  // Check top-level required fields
  if (!listing.title || listing.title.trim() === '') {
    errors.push('Title is required and cannot be empty');
  }

  if (!listing.price || listing.price.trim() === '') {
    errors.push('Price is required and cannot be empty');
  }

  if (!listing.description || listing.description.trim() === '') {
    errors.push('Description is required and cannot be empty');
  }

  if (!listing.agentName || listing.agentName.trim() === '') {
    errors.push('Agent name is required and cannot be empty');
  }

  // Check propertyDetails object
  if (!listing.propertyDetails || typeof listing.propertyDetails !== 'object') {
    errors.push('PropertyDetails object is required');
    return errors; // Can't validate further without propertyDetails
  }

  // Check propertyDetails required fields
  const requiredDetailFields = [
    { field: 'reference', name: 'Reference number' },
    { field: 'propertyType', name: 'Property type' },
    // { field: 'zoneName', name: 'Zone name' }, // Allow empty zone names for now
    { field: 'bedrooms', name: 'Bedrooms' },
    { field: 'bathrooms', name: 'Bathrooms' }
  ];

  for (const { field, name } of requiredDetailFields) {
    const value = listing.propertyDetails[field as keyof typeof listing.propertyDetails];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${name} is required and cannot be empty`);
    }
  }

  return errors;
}

/**
 * Validate and parse numeric values with range checking
 * Requirements: 7.3 - Extract bedrooms, bathrooms from "propertyDetails"
 */
function validateAndParseNumber(
  value: string, 
  fieldName: string, 
  min: number = 0, 
  max: number = Number.MAX_SAFE_INTEGER
): { isValid: boolean; value?: number; error?: string } {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  // Handle special cases like "4 + Maid" for bedrooms, "Studio" for bedrooms
  let cleanValue = value.replace(/\s*\+.*$/i, '').trim();
  
  // Handle "Studio" case for bedrooms (convert to 0)
  if (cleanValue.toLowerCase() === 'studio' && fieldName.toLowerCase().includes('bedroom')) {
    return { isValid: true, value: 0 };
  }

  const parsed = parseInt(cleanValue, 10);

  if (isNaN(parsed)) {
    return { isValid: false, error: `${fieldName} must be a valid number, got: "${value}"` };
  }

  if (parsed < min || parsed > max) {
    return { isValid: false, error: `${fieldName} must be between ${min} and ${max}, got: ${parsed}` };
  }

  return { isValid: true, value: parsed };
}

/**
 * Parse price string and convert to number with comprehensive validation
 * Handles comma-separated values, currency symbols, and various formats
 * Requirements: 7.2 - Extract price from the "price" field and parse it as a number
 */
function parsePrice(priceStr: string): number | null {
  if (!priceStr || priceStr.trim() === '') {
    console.log(`⚠️ Price parsing: Empty or null price string`);
    return null;
  }

  const originalPrice = priceStr;
  console.log(`🔍 Parsing price: "${originalPrice}"`);

  try {
    // Remove common currency symbols and text
    let cleanedPrice = priceStr
      .replace(/AED|USD|EUR|GBP|\$|€|£/gi, '') // Remove currency symbols
      .replace(/\s+/g, '') // Remove all whitespace
      .replace(/,/g, '') // Remove commas
      .trim();

    console.log(`🧹 Cleaned price string: "${cleanedPrice}"`);

    // Handle empty string after cleaning
    if (cleanedPrice === '') {
      console.log(`❌ Price parsing failed: Empty string after cleaning`);
      return null;
    }

    // Parse as float first to handle decimal values, then convert to integer
    const parsedFloat = parseFloat(cleanedPrice);
    
    if (isNaN(parsedFloat)) {
      console.log(`❌ Price parsing failed: Not a valid number after parsing`);
      return null;
    }

    // Convert to integer (prices are typically whole numbers in AED)
    const price = Math.round(parsedFloat);

    // Validate price range (minimum 1 AED, maximum 1 billion AED)
    if (price < 1) {
      console.log(`❌ Price validation failed: Price too low (${price})`);
      return null;
    }

    if (price > 1_000_000_000) {
      console.log(`❌ Price validation failed: Price too high (${price})`);
      return null;
    }

    console.log(`✅ Price parsed successfully: ${price.toLocaleString()} AED`);
    return price;

  } catch (error) {
    console.log(`❌ Price parsing error:`, error);
    return null;
  }
}

/**
 * Parse property size string and convert to centi units with comprehensive validation
 * Handles formats like "6,381 sqft / 593 sqm", "1,200 sqft", "150 sqm"
 * Requirements: 7.8 - Extract property size and convert to appropriate units
 */
function parsePropertySize(sizeStr: string): number {
  if (!sizeStr || sizeStr.trim() === '') {
    console.log(`⚠️ Property size parsing: Empty size string`);
    return 0;
  }

  const originalSize = sizeStr;
  console.log(`🔍 Parsing property size: "${originalSize}"`);

  try {
    // Extract square feet value (first number before "sqft")
    const sqftMatch = sizeStr.match(/([0-9,]+)\s*sqft/i);
    if (sqftMatch) {
      const sqftStr = sqftMatch[1].replace(/,/g, '');
      const sqft = parseInt(sqftStr, 10);
      
      if (!isNaN(sqft) && sqft > 0) {
        // Convert sqft to sqm and then to centi units (sqm * 100)
        const sqm = sqft * 0.092903; // 1 sqft = 0.092903 sqm
        const centiUnits = Math.round(sqm * 100);
        console.log(`✅ Size parsed from sqft: ${sqft} sqft = ${sqm.toFixed(2)} sqm = ${centiUnits} centi units`);
        return centiUnits;
      }
    }

    // Extract square meter value (number before "sqm")
    const sqmMatch = sizeStr.match(/([0-9,]+)\s*sqm/i);
    if (sqmMatch) {
      const sqmStr = sqmMatch[1].replace(/,/g, '');
      const sqm = parseInt(sqmStr, 10);
      
      if (!isNaN(sqm) && sqm > 0) {
        const centiUnits = sqm * 100; // Convert to centi units
        console.log(`✅ Size parsed from sqm: ${sqm} sqm = ${centiUnits} centi units`);
        return centiUnits;
      }
    }

    // Try to extract any number as a fallback (assume sqm)
    const numberMatch = sizeStr.match(/([0-9,]+)/);
    if (numberMatch) {
      const numberStr = numberMatch[1].replace(/,/g, '');
      const number = parseInt(numberStr, 10);
      
      if (!isNaN(number) && number > 0) {
        // Assume it's in sqm if no unit specified
        const centiUnits = number * 100;
        console.log(`⚠️ Size parsed as fallback (assuming sqm): ${number} = ${centiUnits} centi units`);
        return centiUnits;
      }
    }

    console.log(`❌ Property size parsing failed: Could not extract valid size from "${originalSize}"`);
    return 0;

  } catch (error) {
    console.log(`❌ Property size parsing error:`, error);
    return 0;
  }
}

/**
 * Extract and format reference number with PF- prefix
 * Requirements: 7.4 - Extract reference number from "propertyDetails.reference"
 */
function extractReferenceNumber(reference: string): string {
  if (!reference || reference.trim() === '') {
    throw new Error('Reference number is required and cannot be empty');
  }

  const cleanReference = reference.trim();
  
  // Add PF- prefix if not already present
  if (cleanReference.startsWith('PF-')) {
    console.log(`✅ Reference already has PF- prefix: ${cleanReference}`);
    return cleanReference;
  }

  const prefixedReference = `PF-${cleanReference}`;
  console.log(`✅ Reference number formatted: ${reference} → ${prefixedReference}`);
  return prefixedReference;
}

/**
 * Check if a property qualifies as luxury based on price threshold
 * Requirements: 3.1 - Price threshold checking function (20M AED)
 */
function isLuxuryProperty(price: number): boolean {
  const LUXURY_PRICE_THRESHOLD = 20_000_000; // 20 million AED
  return price > LUXURY_PRICE_THRESHOLD;
}

/**
 * Set isLuxe flag and log luxury property identification
 * Requirements: 3.2, 3.4 - Implement isLuxe flag setting and logging
 */
function setLuxuryStatus(price: number, referenceNumber: string, images: string[]): {
  isLuxe: boolean;
  shouldProcessImages: boolean;
} {
  const isLuxe = isLuxuryProperty(price);
  
  if (isLuxe) {
    console.log(`💎 LUXURY PROPERTY DETECTED: ${referenceNumber}`);
    console.log(`💰 Price: ${price.toLocaleString()} AED (above 20M threshold)`);
    console.log(`🖼️ Images available for processing: ${images.length}`);
    
    if (images.length > 0) {
      console.log(`✅ Will process ${images.length} images for luxury property`);
    } else {
      console.log(`⚠️ No images available for luxury property - image processing skipped`);
    }
  } else {
    console.log(`🏠 Standard property: ${referenceNumber} (${price.toLocaleString()} AED - below luxury threshold)`);
    console.log(`⏭️ Image processing skipped for non-luxury property`);
  }
  
  // Requirements: 3.3 - Conditional logic for image processing based on luxury status
  const shouldProcessImages = isLuxe && images.length > 0;
  
  return {
    isLuxe,
    shouldProcessImages
  };
}

/**
 * Generate property slug using title and reference number with uniqueness checking
 * Requirements: 2.1, 2.2, 2.3, 2.4 - Generate unique slugs from title and reference
 */
async function generatePropertySlug(title: string, reference: string): Promise<string> {
  // Create base slug from title and reference number
  const baseSlug = `${title}-${reference}`;
  
  console.log(`🔗 Generating slug for: "${title}" with reference: "${reference}"`);
  
  // Generate initial slug using slugify with kebab-case configuration
  const initialSlug = slugify(baseSlug, {
    lower: true,
    strict: true,
    replacement: '-',
    remove: /[*+~.()'"!:@]/g
  });
  
  console.log(`🔗 Initial slug generated: "${initialSlug}"`);
  
  // Check for uniqueness and generate unique slug if needed
  const uniqueSlug = await ensureSlugUniqueness(initialSlug);
  
  console.log(`✅ Final unique slug: "${uniqueSlug}"`);
  return uniqueSlug;
}

/**
 * Ensure slug uniqueness by checking database and appending unique identifier if needed
 * Requirements: 2.3, 2.4 - Check uniqueness and append identifier for duplicates
 */
async function ensureSlugUniqueness(baseSlug: string): Promise<string> {
  try {
    // Check if the base slug already exists
    const existingProperty = await db
      .select({ id: propertyTable.id, slug: propertyTable.slug })
      .from(propertyTable)
      .where(eq(propertyTable.slug, baseSlug))
      .limit(1);

    // If slug is unique, return it as-is
    if (existingProperty.length === 0) {
      console.log(`✅ Slug "${baseSlug}" is unique`);
      return baseSlug;
    }

    console.log(`⚠️ Slug "${baseSlug}" already exists, generating unique variant...`);

    // Generate unique slug by appending counter
    let counter = 1;
    let uniqueSlug = `${baseSlug}-${counter}`;
    
    while (true) {
      const checkUnique = await db
        .select({ id: propertyTable.id })
        .from(propertyTable)
        .where(eq(propertyTable.slug, uniqueSlug))
        .limit(1);
      
      if (checkUnique.length === 0) {
        console.log(`✅ Generated unique slug: "${uniqueSlug}" (attempt ${counter})`);
        break;
      }
      
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
      
      // Safety check to prevent infinite loops
      if (counter > 1000) {
        console.error(`❌ Failed to generate unique slug after 1000 attempts for base: "${baseSlug}"`);
        // Fallback to timestamp-based unique identifier
        const timestamp = Date.now();
        uniqueSlug = `${baseSlug}-${timestamp}`;
        break;
      }
    }
    
    return uniqueSlug;
    
  } catch (error) {
    console.error(`❌ Error checking slug uniqueness for "${baseSlug}":`, error);
    // Fallback to timestamp-based unique identifier
    const timestamp = Date.now();
    const fallbackSlug = `${baseSlug}-${timestamp}`;
    console.log(`🔄 Using fallback slug: "${fallbackSlug}"`);
    return fallbackSlug;
  }
}

/**
 * Process and store agent information adapted from XML import
 * Requirements: 5.1 - Reuse agent processing logic from XML import
 */
async function processAgent(agentName: string): Promise<typeof employeeTable.$inferSelect> {
  console.log(`👤 Processing agent: ${agentName}`);
  
  // Generate agent email based on name (simplified approach for PropertyFinder data)
  const agentEmail = generateAgentEmail(agentName);
  
  // Find an existing agent by email or create a new one
  let [propertyAgent] = await db.select().from(employeeTable).where(
    eq(employeeTable.email, agentEmail)
  ).limit(1);

  if (!propertyAgent) {
    // Parse first and last name from full name
    const nameParts = agentName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Generate agent slug
    const agentSlug = agentName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    console.log(`✅ Creating new agent: ${firstName} ${lastName} (${agentEmail})`);
    
    [propertyAgent] = await db.insert(employeeTable).values({
      id: createId(),
      firstName: firstName,
      lastName: lastName,
      email: agentEmail,
      phone: '', // PropertyFinder data doesn't include phone numbers
      slug: agentSlug,
    }).returning();
  } else {
    console.log(`✅ Found existing agent: ${propertyAgent.firstName} ${propertyAgent.lastName}`);
  }

  return propertyAgent;
}

/**
 * Generate agent email from name for PropertyFinder agents
 */
function generateAgentEmail(agentName: string): string {
  // Create email based on name: firstname.lastname@propertyfinder.ae
  const cleanName = agentName.toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '');
  
  return `${cleanName}@propertyfinder.ae`;
}

/**
 * Process and store community information adapted from XML import
 * Requirements: 5.2 - Reuse community processing functions for zone name mapping
 */
async function processCommunity(zoneName: string): Promise<typeof communityTable.$inferSelect | null> {
  if (!zoneName || zoneName.trim() === '') {
    return null;
  }

  const communityName = zoneName.trim();
  console.log(`🏘️ Processing community: ${communityName}`);

  // Check if the community already exists (case-insensitive)
  let [community] = await db.select().from(communityTable).where(
    eq(sql`lower(${communityTable.name})`, communityName.toLowerCase())
  ).limit(1);

  // Generate a slug for the community
  const communitySlug = slugify(communityName, {
    lower: true,
    strict: true,
    replacement: '-'
  });

  // Create if it doesn't exist
  if (!community) {
    console.log(`✅ Creating new community: ${communityName}`);
    
    [community] = await db.insert(communityTable).values({
      id: createId(),
      slug: communitySlug,
      name: communityName,
      label: communityName,
    }).returning();
  } else {
    console.log(`✅ Found existing community: ${community.name}`);
  }

  return community;
}

/**
 * Process and store property type information adapted from XML import
 * Requirements: 5.3 - Integrate property type processing from existing XML import
 */
async function processPropertyType(propertyTypeName: string): Promise<typeof propertyTypeTable.$inferSelect | null> {
  if (!propertyTypeName || propertyTypeName.trim() === '') {
    return null;
  }

  const typeName = propertyTypeName.trim();
  console.log(`🏠 Processing property type: ${typeName}`);

  // Check if the property type already exists
  let [propertyType] = await db.select().from(propertyTypeTable).where(
    eq(propertyTypeTable.short_name, typeName)
  ).limit(1);

  // Generate a slug for the property type
  const typeSlug = slugify(typeName, {
    lower: true,
    strict: true,
    replacement: '-'
  });

  // Create if it doesn't exist
  if (!propertyType) {
    console.log(`✅ Creating new property type: ${typeName}`);
    
    [propertyType] = await db.insert(propertyTypeTable).values({
      id: createId(),
      slug: typeSlug,
      short_name: typeName,
    }).returning();
  } else {
    console.log(`✅ Found existing property type: ${propertyType.short_name}`);
  }

  return propertyType;
}

/**
 * Process and store offering type information (default to 'sale' for PropertyFinder)
 * Requirements: 5.3 - Integrate offering type processing from existing XML import
 */
async function processOfferingType(): Promise<typeof offeringTypeTable.$inferSelect | null> {
  const offeringTypeName = 'sale'; // PropertyFinder listings are typically for sale
  console.log(`💼 Processing offering type: ${offeringTypeName}`);

  // Check if the offering type already exists
  let [offeringType] = await db.select().from(offeringTypeTable).where(
    eq(offeringTypeTable.short_name, offeringTypeName)
  ).limit(1);

  // Generate a slug for the offering type
  const offeringTypeSlug = slugify(offeringTypeName, {
    lower: true,
    strict: true,
    replacement: '-'
  });

  // Create if it doesn't exist
  if (!offeringType) {
    console.log(`✅ Creating new offering type: ${offeringTypeName}`);
    
    [offeringType] = await db.insert(offeringTypeTable).values({
      id: createId(),
      slug: offeringTypeSlug,
      short_name: offeringTypeName,
    }).returning();
  } else {
    console.log(`✅ Found existing offering type: ${offeringType.short_name}`);
  }

  return offeringType;
}

/**
 * Process city information (default to Dubai for PropertyFinder)
 * Requirements: 5.2 - Reuse community processing functions
 */
async function processCity(): Promise<typeof cityTable.$inferSelect | null> {
  const cityName = 'Dubai'; // PropertyFinder listings are typically in Dubai
  console.log(`🏙️ Processing city: ${cityName}`);

  // Check if the city already exists
  let [city] = await db.select().from(cityTable).where(
    eq(cityTable.name, cityName)
  ).limit(1);

  // Generate a slug for the city
  const citySlug = slugify(cityName, {
    lower: true,
    strict: true,
    replacement: '-'
  });

  // Create if it doesn't exist
  if (!city) {
    console.log(`✅ Creating new city: ${cityName}`);
    
    [city] = await db.insert(cityTable).values({
      id: createId(),
      slug: citySlug,
      name: cityName,
    }).returning();
  } else {
    console.log(`✅ Found existing city: ${city.name}`);
  }

  return city;
}

/**
 * Create a new property in the database
 * Requirements: 7.4, 7.5, 7.6, 7.7 - Property creation with database connection
 */
async function createProperty(
  mappedProperty: MappedPropertyData,
  options: PropertyOptions
): Promise<typeof propertyTable.$inferSelect> {
  const {
    propertyAgent,
    subCommunity,
    community,
    city,
    offeringType,
    propertyType,
    slug,
    lastUpdate,
  } = options;

  console.log(`✅ Creating new property: ${mappedProperty.referenceNumber}`);

  // Convert size from centi units to database format (already in centi units)
  const size = mappedProperty.size > 0 ? mappedProperty.size : null;

  const [property] = await db.insert(propertyTable).values({
    id: createId(),
    title: mappedProperty.title,
    description: mappedProperty.description,
    price: mappedProperty.price,
    bedrooms: mappedProperty.bedrooms,
    bathrooms: mappedProperty.bathrooms,
    agentId: propertyAgent.id,
    subCommunityId: subCommunity?.id || null,
    communityId: community?.id || null,
    cityId: city?.id || null,
    offeringTypeId: offeringType?.id || null,
    typeId: propertyType?.id || null,
    unitTypeId: propertyType?.id || null,
    size: size,
    referenceNumber: mappedProperty.referenceNumber,
    permitNumber: mappedProperty.permitNumber || null,
    slug: slug,
    isLuxe: mappedProperty.isLuxe,
    status: 'published',
    imported: true,
    lastUpdated: lastUpdate.toISOString(),
  }).returning();

  console.log(`✅ Property created successfully: ${property.id}`);
  return property;
}

/**
 * Update an existing property in the database
 * Requirements: 7.4, 7.5, 7.6, 7.7 - Property update with database connection
 */
async function updateProperty(
  propertyId: string,
  mappedProperty: MappedPropertyData,
  options: PropertyOptions
): Promise<typeof propertyTable.$inferSelect> {
  const {
    propertyAgent,
    subCommunity,
    community,
    city,
    offeringType,
    propertyType,
    slug,
    lastUpdate,
  } = options;

  console.log(`🔄 Updating existing property: ${mappedProperty.referenceNumber}`);

  // Convert size from centi units to database format (already in centi units)
  const size = mappedProperty.size > 0 ? mappedProperty.size : null;

  const [property] = await db.update(propertyTable).set({
    title: mappedProperty.title,
    description: mappedProperty.description,
    price: mappedProperty.price,
    bedrooms: mappedProperty.bedrooms,
    bathrooms: mappedProperty.bathrooms,
    agentId: propertyAgent.id,
    subCommunityId: subCommunity?.id || null,
    communityId: community?.id || null,
    cityId: city?.id || null,
    offeringTypeId: offeringType?.id || null,
    typeId: propertyType?.id || null,
    unitTypeId: propertyType?.id || null,
    size: size,
    referenceNumber: mappedProperty.referenceNumber,
    permitNumber: mappedProperty.permitNumber || null,
    slug: slug,
    isLuxe: mappedProperty.isLuxe,
    imported: true,
    lastUpdated: lastUpdate.toISOString(),
    updatedAt: sql`now()`,
  }).where(
    eq(propertyTable.id, propertyId)
  ).returning();

  console.log(`✅ Property updated successfully: ${property.id}`);
  return property;
}

/**
 * Process and upload images for PropertyFinder luxury properties
 * Downloads images from URLs, converts to WebP, uploads to S3, and creates database records
 * Requirements: 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 5.4
 */
async function processPropertyFinderImages(propertyId: string, imageUrls: string[]): Promise<number> {
  let processedCount = 0;
  
  console.log(`🖼️ Starting image processing for property ${propertyId} with ${imageUrls.length} images`);

  for (let index = 0; index < imageUrls.length; index++) {
    const imageUrl = imageUrls[index];
    
    try {
      console.log(`📥 Processing image ${index + 1}/${imageUrls.length}: ${imageUrl}`);

      // Validate image URL
      if (!imageUrl || imageUrl.trim() === '') {
        console.log(`⚠️ Skipping empty image URL at index ${index}`);
        continue;
      }

      // Requirements: 4.1 - Download images from provided URLs
      console.log(`🌐 Downloading image from URL: ${imageUrl}`);
      
      // Requirements: 4.2, 5.4 - Convert to WebP format using existing utilities
      const webpBuffer = await convertToWebp(imageUrl, 80);
      console.log(`✅ Image converted to WebP format (${webpBuffer.length} bytes)`);

      // Requirements: 4.3, 5.4 - Upload to S3 using existing function
      const s3Url = await uploadPropertyImageToS3(webpBuffer, propertyId, index);
      console.log(`☁️ Image uploaded to S3: ${s3Url}`);

      // Requirements: 4.5 - Create database record linking image to property
      await db.insert(propertyImagesTable).values({
        id: createId(),
        propertyId: propertyId,
        crmUrl: imageUrl, // Original PropertyFinder URL
        s3Url: s3Url,     // WebP image URL in S3
        order: index,     // Maintain image order
      });

      processedCount++;
      console.log(`✅ Image ${index + 1} processed successfully and saved to database`);

    } catch (error) {
      // Requirements: 4.4 - Log error but continue processing other images
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to process image ${index + 1} (${imageUrl}):`, errorMessage);
      
      // Log specific error types for debugging
      if (errorMessage.includes('fetch')) {
        console.error(`  → Download failed: Unable to fetch image from URL`);
      } else if (errorMessage.includes('WebP') || errorMessage.includes('sharp')) {
        console.error(`  → Conversion failed: Unable to convert image to WebP format`);
      } else if (errorMessage.includes('S3') || errorMessage.includes('upload')) {
        console.error(`  → Upload failed: Unable to upload image to S3`);
      } else if (errorMessage.includes('database') || errorMessage.includes('insert')) {
        console.error(`  → Database failed: Unable to save image record to database`);
      }
      
      // Continue processing remaining images
      continue;
    }
  }

  console.log(`🏁 Image processing completed: ${processedCount}/${imageUrls.length} images processed successfully`);
  return processedCount;
}

// ===== COMPREHENSIVE ERROR HANDLING AND LOGGING FUNCTIONS =====

/**
 * Log error details with comprehensive context information
 * Requirements: 1.3, 4.4 - Detailed logging for skipped properties with reasons
 */
function logError(
  errorLog: ErrorDetails[], 
  propertyReference: string, 
  errorType: ErrorDetails['errorType'], 
  errorMessage: string, 
  recoverable: boolean, 
  context?: Record<string, any>
): void {
  const errorDetail: ErrorDetails = {
    propertyReference,
    errorType,
    errorMessage,
    timestamp: new Date(),
    recoverable,
    context
  };
  
  errorLog.push(errorDetail);
  
  // Log to console with appropriate emoji and formatting
  const emoji = recoverable ? '⚠️' : '❌';
  const recoverableText = recoverable ? '(Recoverable)' : '(Critical)';
  
  console.log(`${emoji} ERROR [${errorType.toUpperCase()}] ${recoverableText}: ${propertyReference}`);
  console.log(`   Message: ${errorMessage}`);
  
  if (context) {
    console.log(`   Context:`, JSON.stringify(context, null, 2));
  }
  
  console.log(`   Timestamp: ${errorDetail.timestamp.toISOString()}`);
}

/**
 * Update progress indicators with time estimation
 * Requirements: 1.3, 4.4 - Add progress indicators for console output during processing
 */
function updateProgressIndicators(
  current: number, 
  total: number, 
  startTime: number, 
  lastUpdateTime: number
): void {
  const now = Date.now();
  
  // Update progress every 10 properties or every 30 seconds
  if (current % 10 === 0 || (now - lastUpdateTime) > 30000) {
    const percentage = ((current / total) * 100).toFixed(1);
    const elapsedTime = now - startTime;
    const avgTimePerProperty = elapsedTime / current;
    const remainingProperties = total - current;
    const estimatedTimeRemaining = Math.round((avgTimePerProperty * remainingProperties) / 1000);
    
    console.log(`\n📊 PROGRESS UPDATE:`);
    console.log(`   Current: ${current}/${total} (${percentage}%)`);
    console.log(`   Elapsed: ${Math.round(elapsedTime / 1000)}s`);
    console.log(`   Estimated remaining: ${estimatedTimeRemaining}s`);
    console.log(`   Average time per property: ${Math.round(avgTimePerProperty)}ms`);
    
    // Progress bar visualization
    const progressBarLength = 20;
    const filledLength = Math.round((current / total) * progressBarLength);
    const progressBar = '█'.repeat(filledLength) + '░'.repeat(progressBarLength - filledLength);
    console.log(`   Progress: [${progressBar}] ${percentage}%`);
  }
}

/**
 * Enhanced property validation with detailed error tracking
 * Requirements: 1.3 - Create error recovery mechanisms for non-critical failures
 */
async function validateAndMapPropertyWithErrorHandling(
  listing: PropertyFinderListing, 
  errorLog: ErrorDetails[], 
  skippedProperties: SkippedPropertyDetails[]
): Promise<MappedPropertyData | null> {
  const reference = listing.propertyDetails?.reference || 'UNKNOWN';
  
  try {
    const result = await validateAndMapProperty(listing);
    
    if (!result) {
      // Log detailed skip reason
      const skipDetails: SkippedPropertyDetails = {
        reference,
        reason: 'Validation failed',
        category: 'validation_failed',
        details: ['Property failed validation checks']
      };
      
      skippedProperties.push(skipDetails);
      
      logError(errorLog, reference, 'validation', 'Property validation failed', true, {
        step: 'property_validation',
        listingData: {
          title: listing.title,
          price: listing.price,
          hasPropertyDetails: !!listing.propertyDetails
        }
      });
    }
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
    
    logError(errorLog, reference, 'validation', errorMessage, false, {
      step: 'property_mapping',
      error: error
    });
    
    return null;
  }
}

/**
 * Enhanced agent processing with error handling
 * Requirements: 1.3 - Create error recovery mechanisms for non-critical failures
 */
async function processAgentWithErrorHandling(
  agentName: string, 
  propertyReference: string, 
  errorLog: ErrorDetails[]
): Promise<typeof employeeTable.$inferSelect> {
  try {
    return await processAgent(agentName);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown agent processing error';
    
    logError(errorLog, propertyReference, 'database', errorMessage, true, {
      step: 'agent_processing',
      agentName: agentName
    });
    
    // Attempt recovery with default agent
    console.log(`🔄 Attempting agent recovery for ${propertyReference}...`);
    
    try {
      return await processAgent('Unknown Agent');
    } catch (recoveryError) {
      logError(errorLog, propertyReference, 'database', 'Agent recovery failed', false, {
        step: 'agent_recovery',
        originalError: errorMessage,
        recoveryError: recoveryError instanceof Error ? recoveryError.message : 'Unknown recovery error'
      });
      
      throw new Error(`Agent processing failed and recovery unsuccessful: ${errorMessage}`);
    }
  }
}

/**
 * Enhanced community processing with error handling
 * Requirements: 1.3 - Create error recovery mechanisms for non-critical failures
 */
async function processCommunityWithErrorHandling(
  communityName: string, 
  propertyReference: string, 
  errorLog: ErrorDetails[]
): Promise<typeof communityTable.$inferSelect | null> {
  try {
    return await processCommunity(communityName);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown community processing error';
    
    logError(errorLog, propertyReference, 'database', errorMessage, true, {
      step: 'community_processing',
      communityName: communityName
    });
    
    // Attempt recovery with default community
    console.log(`🔄 Attempting community recovery for ${propertyReference}...`);
    
    try {
      return await processCommunity('Unknown Community');
    } catch (recoveryError) {
      logError(errorLog, propertyReference, 'database', 'Community recovery failed', true, {
        step: 'community_recovery',
        originalError: errorMessage
      });
      
      // Return null for community (non-critical)
      return null;
    }
  }
}

/**
 * Enhanced property type processing with error handling
 * Requirements: 1.3 - Create error recovery mechanisms for non-critical failures
 */
async function processPropertyTypeWithErrorHandling(
  propertyTypeName: string, 
  propertyReference: string, 
  errorLog: ErrorDetails[]
): Promise<typeof propertyTypeTable.$inferSelect | null> {
  try {
    return await processPropertyType(propertyTypeName);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown property type processing error';
    
    logError(errorLog, propertyReference, 'database', errorMessage, true, {
      step: 'property_type_processing',
      propertyTypeName: propertyTypeName
    });
    
    // Attempt recovery with default property type
    console.log(`🔄 Attempting property type recovery for ${propertyReference}...`);
    
    try {
      return await processPropertyType('Apartment');
    } catch (recoveryError) {
      logError(errorLog, propertyReference, 'database', 'Property type recovery failed', true, {
        step: 'property_type_recovery',
        originalError: errorMessage
      });
      
      // Return null for property type (non-critical)
      return null;
    }
  }
}

/**
 * Enhanced offering type processing with error handling
 * Requirements: 1.3 - Create error recovery mechanisms for non-critical failures
 */
async function processOfferingTypeWithErrorHandling(
  propertyReference: string, 
  errorLog: ErrorDetails[]
): Promise<typeof offeringTypeTable.$inferSelect | null> {
  try {
    return await processOfferingType();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown offering type processing error';
    
    logError(errorLog, propertyReference, 'database', errorMessage, true, {
      step: 'offering_type_processing'
    });
    
    // Return null for offering type (non-critical)
    return null;
  }
}

/**
 * Enhanced city processing with error handling
 * Requirements: 1.3 - Create error recovery mechanisms for non-critical failures
 */
async function processCityWithErrorHandling(
  propertyReference: string, 
  errorLog: ErrorDetails[]
): Promise<typeof cityTable.$inferSelect | null> {
  try {
    return await processCity();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown city processing error';
    
    logError(errorLog, propertyReference, 'database', errorMessage, true, {
      step: 'city_processing'
    });
    
    // Return null for city (non-critical)
    return null;
  }
}

/**
 * Enhanced property creation with error handling
 * Requirements: 1.3 - Create error recovery mechanisms for non-critical failures
 */
async function createPropertyWithErrorHandling(
  mappedProperty: MappedPropertyData,
  options: PropertyOptions,
  propertyReference: string,
  errorLog: ErrorDetails[]
): Promise<typeof propertyTable.$inferSelect> {
  try {
    return await createProperty(mappedProperty, options);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown property creation error';
    
    logError(errorLog, propertyReference, 'database', errorMessage, false, {
      step: 'property_creation',
      propertyData: {
        title: mappedProperty.title,
        price: mappedProperty.price,
        referenceNumber: mappedProperty.referenceNumber
      }
    });
    
    throw error; // Re-throw as this is critical
  }
}

/**
 * Enhanced property update with error handling
 * Requirements: 1.3 - Create error recovery mechanisms for non-critical failures
 */
async function updatePropertyWithErrorHandling(
  propertyId: string,
  mappedProperty: MappedPropertyData,
  options: PropertyOptions,
  propertyReference: string,
  errorLog: ErrorDetails[]
): Promise<typeof propertyTable.$inferSelect> {
  try {
    return await updateProperty(propertyId, mappedProperty, options);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown property update error';
    
    logError(errorLog, propertyReference, 'database', errorMessage, false, {
      step: 'property_update',
      propertyId: propertyId,
      propertyData: {
        title: mappedProperty.title,
        price: mappedProperty.price,
        referenceNumber: mappedProperty.referenceNumber
      }
    });
    
    throw error; // Re-throw as this is critical
  }
}

/**
 * Enhanced image processing with comprehensive error handling and statistics tracking
 * Requirements: 4.4 - Log error but continue processing other images
 */
async function processPropertyFinderImagesWithErrorHandling(
  propertyId: string, 
  imageUrls: string[], 
  propertyReference: string, 
  errorLog: ErrorDetails[],
  maxConcurrent: number = 3
): Promise<{ processed: number; skipped: number; failed: number }> {
  let processedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  const imageErrors: string[] = [];
  
  console.log(`🖼️ Starting optimized image processing for property ${propertyReference} with ${imageUrls.length} images`);
  console.log(`⚡ Using concurrent processing with max ${maxConcurrent} simultaneous downloads`);

  // Process images in batches with concurrency control
  const processingPromises: Promise<void>[] = [];
  const semaphore = new Array(maxConcurrent).fill(null);
  
  const processImage = async (imageUrl: string, index: number): Promise<void> => {
    // Wait for available slot
    await new Promise<void>((resolve) => {
      const checkSlot = () => {
        const availableSlot = semaphore.findIndex(slot => slot === null);
        if (availableSlot !== -1) {
          semaphore[availableSlot] = true;
          resolve();
        } else {
          setTimeout(checkSlot, 100);
        }
      };
      checkSlot();
    });

    try {
      console.log(`📥 Processing image ${index + 1}/${imageUrls.length}: ${imageUrl.substring(0, 50)}...`);

      // Validate image URL
      if (!imageUrl || imageUrl.trim() === '') {
        const error = `Empty image URL at index ${index}`;
        imageErrors.push(error);
        skippedCount++;
        
        logError(errorLog, propertyReference, 'validation', error, true, {
          step: 'image_validation',
          imageIndex: index,
          imageUrl: imageUrl
        });
        
        console.log(`⚠️ Skipping empty image URL at index ${index}`);
        return;
      }

      // Download and process image with timeout
      const webpBuffer = await Promise.race([
        convertToWebp(imageUrl, 80),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Image processing timeout')), 30000)
        )
      ]);
      
      console.log(`✅ Image converted to WebP format (${webpBuffer.length} bytes)`);

      // Upload to S3 with retry logic
      let s3Url;
      let uploadAttempts = 0;
      const maxUploadAttempts = 3;
      
      while (uploadAttempts < maxUploadAttempts) {
        try {
          s3Url = await uploadPropertyImageToS3(webpBuffer, propertyId, index);
          break;
        } catch (uploadError) {
          uploadAttempts++;
          const uploadErrorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown upload error';
          
          if (uploadAttempts >= maxUploadAttempts) {
            throw new Error(`Upload failed after ${maxUploadAttempts} attempts: ${uploadErrorMessage}`);
          }
          
          console.log(`⚠️ Upload attempt ${uploadAttempts} failed, retrying... (${uploadErrorMessage})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempts)); // Exponential backoff
        }
      }
      
      console.log(`☁️ Image uploaded to S3: ${s3Url}`);

      // Create database record with error handling
      try {
        await db.insert(propertyImagesTable).values({
          id: createId(),
          propertyId: propertyId,
          crmUrl: imageUrl,
          s3Url: s3Url!,
          order: index,
        });
      } catch (dbError) {
        const dbErrorMessage = dbError instanceof Error ? dbError.message : 'Database insert error';
        
        logError(errorLog, propertyReference, 'database', dbErrorMessage, true, {
          step: 'image_database_insert',
          imageIndex: index,
          imageUrl: imageUrl,
          s3Url: s3Url
        });
        
        // Continue even if database insert fails
        console.log(`⚠️ Database insert failed for image ${index + 1}, but continuing...`);
      }

      processedCount++;
      console.log(`✅ Image ${index + 1} processed successfully`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown image processing error';
      imageErrors.push(`Image ${index + 1}: ${errorMessage}`);
      failedCount++;
      
      // Determine error type based on error message
      let errorType: ErrorDetails['errorType'] = 'image_processing';
      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        errorType = 'network';
      } else if (errorMessage.includes('timeout')) {
        errorType = 'network';
      } else if (errorMessage.includes('database')) {
        errorType = 'database';
      }
      
      logError(errorLog, propertyReference, errorType, errorMessage, true, {
        step: 'image_processing',
        imageIndex: index,
        imageUrl: imageUrl,
        errorCategory: getImageErrorCategory(errorMessage)
      });
      
      console.error(`❌ Failed to process image ${index + 1} (${imageUrl.substring(0, 50)}...):`, errorMessage);
    } finally {
      // Release semaphore slot
      const slotIndex = semaphore.findIndex(slot => slot === true);
      if (slotIndex !== -1) {
        semaphore[slotIndex] = null;
      }
    }
  };

  // Start processing all images with concurrency control
  for (let index = 0; index < imageUrls.length; index++) {
    const imageUrl = imageUrls[index];
    processingPromises.push(processImage(imageUrl, index));
  }

  // Wait for all image processing to complete
  await Promise.all(processingPromises);

  // Log comprehensive image processing summary
  console.log(`🏁 Optimized image processing completed for ${propertyReference}:`);
  console.log(`   ✅ Processed: ${processedCount}/${imageUrls.length}`);
  console.log(`   ⏭️ Skipped: ${skippedCount}`);
  console.log(`   ❌ Failed: ${failedCount}`);
  
  if (imageErrors.length > 0) {
    console.log(`⚠️ Image processing errors (${imageErrors.length}):`);
    imageErrors.slice(0, 3).forEach(error => console.log(`   - ${error}`));
    if (imageErrors.length > 3) {
      console.log(`   ... and ${imageErrors.length - 3} more errors`);
    }
  }
  
  return {
    processed: processedCount,
    skipped: skippedCount,
    failed: failedCount
  };
}

/**
 * Categorize image processing errors for better debugging
 */
function getImageErrorCategory(errorMessage: string): string {
  if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    return 'network_error';
  } else if (errorMessage.includes('timeout')) {
    return 'timeout_error';
  } else if (errorMessage.includes('WebP') || errorMessage.includes('sharp')) {
    return 'conversion_error';
  } else if (errorMessage.includes('S3') || errorMessage.includes('upload')) {
    return 'upload_error';
  } else if (errorMessage.includes('database')) {
    return 'database_error';
  } else {
    return 'unknown_error';
  }
}

/**
 * Update import job status with comprehensive error handling
 * Requirements: 1.3 - Add try-catch blocks for all major processing steps
 */
async function updateImportJobStatus(
  jobId: string, 
  status: 'running' | 'completed' | 'failed', 
  stats: ImportStats, 
  errorMessage?: string
): Promise<void> {
  try {
    await db.update(importJobTable).set({
      status: status,
      failedCount: stats.failed,
      importedCount: stats.created + stats.updated,
      updatedCount: stats.updated,
      finishedAt: sql`now()`,
    }).where(eq(importJobTable.id, jobId));
    
    console.log(`✅ Import job status updated to: ${status}`);
  } catch (error) {
    const dbErrorMessage = error instanceof Error ? error.message : 'Unknown database error';
    console.error(`❌ Failed to update import job status:`, dbErrorMessage);
    
    // This is a non-critical error, so we don't throw
    console.log(`⚠️ Continuing despite job status update failure...`);
  }
}

/**
 * Generate comprehensive final statistics report
 * Requirements: 1.4, 6.4 - Create final summary report with all statistics
 */
function generateFinalStatisticsReport(
  stats: ImportStats,
  luxuryStats: LuxuryProcessingStats,
  errorLog: ErrorDetails[],
  skippedProperties: SkippedPropertyDetails[]
): string {
  const report: string[] = [];
  
  // Header
  report.push('\n' + '='.repeat(80));
  report.push('🏁 PROPERTYFINDER JSON IMPORT - FINAL STATISTICS REPORT');
  report.push('='.repeat(80));
  
  // Processing time and performance
  report.push('\n📊 PROCESSING OVERVIEW:');
  report.push(`   ⏰ Start time: ${new Date(stats.startTime).toISOString()}`);
  report.push(`   ⏰ End time: ${stats.endTime ? new Date(stats.endTime).toISOString() : 'N/A'}`);
  report.push(`   ⏱️ Total processing time: ${Math.round(stats.processingTime / 1000)}s (${stats.processingTime}ms)`);
  report.push(`   📈 Average time per property: ${stats.averageProcessingTimePerProperty}ms`);
  report.push(`   🚀 Processing speed: ${stats.propertiesPerSecond} properties/second`);
  
  // Property statistics
  report.push('\n📋 PROPERTY STATISTICS:');
  report.push(`   📊 Total processed: ${stats.totalProcessed}`);
  report.push(`   ✅ Successfully created: ${stats.created}`);
  report.push(`   🔄 Successfully updated: ${stats.updated}`);
  report.push(`   ⏭️ Skipped: ${stats.skipped}`);
  report.push(`   ❌ Failed: ${stats.failed}`);
  
  // Success rates
  report.push('\n📈 SUCCESS METRICS:');
  report.push(`   ✅ Success rate: ${stats.successRate}% (${stats.created + stats.updated}/${stats.totalProcessed})`);
  report.push(`   ❌ Failure rate: ${stats.failureRate}% (${stats.failed}/${stats.totalProcessed})`);
  report.push(`   ⏭️ Skip rate: ${stats.skipRate}% (${stats.skipped}/${stats.totalProcessed})`);
  
  // Luxury property analysis
  report.push('\n💎 LUXURY PROPERTY ANALYSIS:');
  report.push(`   💎 Total luxury properties: ${stats.luxeProperties}`);
  report.push(`   🖼️ Luxury with images: ${stats.luxePropertiesWithImages}`);
  report.push(`   ❌ Luxury without images: ${stats.luxePropertiesWithoutImages}`);
  
  if (stats.luxeProperties > 0) {
    const luxuryImageRate = ((stats.luxePropertiesWithImages / stats.luxeProperties) * 100).toFixed(1);
    report.push(`   📊 Luxury image availability rate: ${luxuryImageRate}%`);
    
    if (luxuryStats.totalLuxuryFound > 0) {
      report.push(`   💰 Highest luxury price: ${luxuryStats.highestPrice.toLocaleString()} AED`);
      report.push(`   💰 Lowest luxury price: ${luxuryStats.lowestLuxuryPrice.toLocaleString()} AED`);
      report.push(`   💰 Average luxury price: ${Math.round(luxuryStats.averageLuxuryPrice).toLocaleString()} AED`);
    }
  }
  
  // Image processing statistics
  report.push('\n🖼️ IMAGE PROCESSING STATISTICS:');
  report.push(`   ✅ Images processed successfully: ${stats.imagesProcessed}`);
  report.push(`   ⏭️ Images skipped: ${stats.imagesSkipped}`);
  report.push(`   ❌ Images failed: ${stats.imagesFailed}`);
  
  const totalImages = stats.imagesProcessed + stats.imagesSkipped + stats.imagesFailed;
  if (totalImages > 0) {
    const imageSuccessRate = ((stats.imagesProcessed / totalImages) * 100).toFixed(1);
    report.push(`   📊 Image processing success rate: ${imageSuccessRate}%`);
  }
  
  // Error analysis
  report.push('\n🔍 ERROR ANALYSIS:');
  report.push(`   📊 Total errors logged: ${errorLog.length}`);
  report.push(`   ⚠️ Recoverable errors: ${errorLog.filter(e => e.recoverable).length}`);
  report.push(`   ❌ Critical errors: ${errorLog.filter(e => !e.recoverable).length}`);
  
  // Error breakdown by type
  const errorsByType = errorLog.reduce((acc, error) => {
    acc[error.errorType] = (acc[error.errorType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  if (Object.keys(errorsByType).length > 0) {
    report.push('   📋 Error breakdown by type:');
    Object.entries(errorsByType).forEach(([type, count]) => {
      report.push(`      - ${type}: ${count}`);
    });
  }
  
  // Skip analysis
  if (skippedProperties.length > 0) {
    report.push('\n⏭️ SKIP ANALYSIS:');
    report.push(`   📊 Total skipped properties: ${skippedProperties.length}`);
    
    const skipsByCategory = skippedProperties.reduce((acc, skip) => {
      acc[skip.category] = (acc[skip.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    report.push('   📋 Skip breakdown by category:');
    Object.entries(skipsByCategory).forEach(([category, count]) => {
      report.push(`      - ${category}: ${count}`);
    });
    
    // Sample skipped properties
    report.push('   📝 Sample skipped properties:');
    skippedProperties.slice(0, 5).forEach((skip, index) => {
      report.push(`      ${index + 1}. ${skip.reference}: ${skip.reason}`);
    });
    
    if (skippedProperties.length > 5) {
      report.push(`      ... and ${skippedProperties.length - 5} more`);
    }
  }
  
  // Recent errors for debugging
  if (errorLog.length > 0) {
    report.push('\n🚨 RECENT ERRORS (for debugging):');
    errorLog.slice(-5).forEach((error, index) => {
      const emoji = error.recoverable ? '⚠️' : '❌';
      report.push(`   ${index + 1}. ${emoji} [${error.errorType}] ${error.propertyReference}: ${error.errorMessage}`);
    });
    
    if (errorLog.length > 5) {
      report.push(`   ... and ${errorLog.length - 5} more errors in full log`);
    }
  }
  
  // Summary and recommendations
  report.push('\n🎯 SUMMARY & RECOMMENDATIONS:');
  
  if (stats.successRate >= 90) {
    report.push('   ✅ Excellent import success rate! The process completed successfully.');
  } else if (stats.successRate >= 70) {
    report.push('   ⚠️ Good import success rate, but consider reviewing failed properties.');
  } else {
    report.push('   ❌ Low import success rate. Review errors and data quality.');
  }
  
  if (stats.luxeProperties > 0 && stats.imagesProcessed === 0) {
    report.push('   ⚠️ Luxury properties found but no images processed. Check image URLs.');
  }
  
  if (errorLog.filter(e => !e.recoverable).length > 0) {
    report.push('   ❌ Critical errors detected. Review error log for data integrity issues.');
  }
  
  report.push('\n' + '='.repeat(80));
  report.push(`🏁 Import completed at: ${new Date().toISOString()}`);
  report.push('='.repeat(80));
  
  return report.join('\n');
}

/**
 * Log comprehensive final statistics with error analysis (legacy function)
 * Requirements: 1.3, 4.4 - Detailed logging and progress reporting
 */
function logFinalStatistics(
  stats: ImportStats, 
  luxuryStats: LuxuryProcessingStats, 
  errorLog: ErrorDetails[], 
  skippedProperties: SkippedPropertyDetails[], 
  startTime: number
): void {
  const processingTime = Date.now() - startTime;
  
  console.log(`\n=== COMPREHENSIVE IMPORT SUMMARY ===`);
  console.log(`⏰ Total processing time: ${Math.round(processingTime / 1000)}s (${processingTime}ms)`);
  console.log(`📊 Total processed: ${stats.totalProcessed}`);
  console.log(`✅ Created: ${stats.created}`);
  console.log(`🔄 Updated: ${stats.updated}`);
  console.log(`⏭️ Skipped: ${stats.skipped}`);
  console.log(`❌ Failed: ${stats.failed}`);
  console.log(`💎 Luxury properties: ${stats.luxeProperties}`);
  console.log(`🖼️ Luxury with images: ${stats.luxePropertiesWithImages}`);
  console.log(`❌ Luxury without images: ${stats.luxePropertiesWithoutImages}`);
  console.log(`🖼️ Images processed: ${stats.imagesProcessed}`);
  
  // Success rate calculations
  const successRate = stats.totalProcessed > 0 ? ((stats.created + stats.updated) / stats.totalProcessed * 100).toFixed(1) : '0';
  const failureRate = stats.totalProcessed > 0 ? (stats.failed / stats.totalProcessed * 100).toFixed(1) : '0';
  const skipRate = stats.totalProcessed > 0 ? (stats.skipped / stats.totalProcessed * 100).toFixed(1) : '0';
  
  console.log(`\n📈 SUCCESS METRICS:`);
  console.log(`   Success rate: ${successRate}% (${stats.created + stats.updated}/${stats.totalProcessed})`);
  console.log(`   Failure rate: ${failureRate}% (${stats.failed}/${stats.totalProcessed})`);
  console.log(`   Skip rate: ${skipRate}% (${stats.skipped}/${stats.totalProcessed})`);
  
  if (stats.luxeProperties > 0) {
    const imageProcessingRate = ((stats.luxePropertiesWithImages / stats.luxeProperties) * 100).toFixed(1);
    console.log(`   Luxury image processing rate: ${imageProcessingRate}%`);
  }
  
  // Performance metrics
  const avgTimePerProperty = stats.totalProcessed > 0 ? Math.round(processingTime / stats.totalProcessed) : 0;
  console.log(`\n⚡ PERFORMANCE METRICS:`);
  console.log(`   Average time per property: ${avgTimePerProperty}ms`);
  console.log(`   Properties per second: ${(stats.totalProcessed / (processingTime / 1000)).toFixed(2)}`);
  
  // Error analysis
  console.log(`\n🔍 ERROR ANALYSIS:`);
  console.log(`   Total errors logged: ${errorLog.length}`);
  console.log(`   Recoverable errors: ${errorLog.filter(e => e.recoverable).length}`);
  console.log(`   Critical errors: ${errorLog.filter(e => !e.recoverable).length}`);
  
  // Error breakdown by type
  const errorsByType = errorLog.reduce((acc, error) => {
    acc[error.errorType] = (acc[error.errorType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  if (Object.keys(errorsByType).length > 0) {
    console.log(`   Error breakdown by type:`);
    Object.entries(errorsByType).forEach(([type, count]) => {
      console.log(`     - ${type}: ${count}`);
    });
  }
  
  // Skip analysis
  if (skippedProperties.length > 0) {
    console.log(`\n⏭️ SKIP ANALYSIS:`);
    console.log(`   Total skipped properties: ${skippedProperties.length}`);
    
    const skipsByCategory = skippedProperties.reduce((acc, skip) => {
      acc[skip.category] = (acc[skip.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log(`   Skip breakdown by category:`);
    Object.entries(skipsByCategory).forEach(([category, count]) => {
      console.log(`     - ${category}: ${count}`);
    });
    
    // Show sample skipped properties
    console.log(`   Sample skipped properties:`);
    skippedProperties.slice(0, 5).forEach((skip, index) => {
      console.log(`     ${index + 1}. ${skip.reference}: ${skip.reason}`);
    });
    
    if (skippedProperties.length > 5) {
      console.log(`     ... and ${skippedProperties.length - 5} more`);
    }
  }
  
  // Recent errors for debugging
  if (errorLog.length > 0) {
    console.log(`\n🚨 RECENT ERRORS (for debugging):`);
    errorLog.slice(-5).forEach((error, index) => {
      const emoji = error.recoverable ? '⚠️' : '❌';
      console.log(`   ${index + 1}. ${emoji} [${error.errorType}] ${error.propertyReference}: ${error.errorMessage}`);
    });
    
    if (errorLog.length > 5) {
      console.log(`   ... and ${errorLog.length - 5} more errors in full log`);
    }
  }
  
  console.log(`\n🏁 Import process completed at: ${new Date().toISOString()}`);
}