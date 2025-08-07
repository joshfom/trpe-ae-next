#!/usr/bin/env bun

/**
 * PropertyFinder JSON Import Script
 * 
 * Standalone script to import PropertyFinder JSON listings into the TRPE database.
 * This script wraps the importPropertyFinderJson server action for command-line execution.
 * 
 * IMPORTANT: All PropertyFinder listings are treated as luxury properties since PropertyFinder
 * specializes in high-end real estate. The import action should be configured to mark all
 * properties as luxury (isLuxe = true) and process all images accordingly.
 * 
 * Usage:
 *   bun run scripts/import-propertyfinder.ts
 *   npm run import:propertyfinder
 * 
 * Requirements: 6.1, 6.3
 */

import { config } from 'dotenv';
import { importPropertyFinderJson } from '../actions/import-propertyfinder-json-action';
import path from 'path';

// Configuration constants
const CONFIG = {
  JSON_FILE_PATH: './scripts/listings.json',
  SCRIPT_NAME: 'PropertyFinder JSON Import',
  VERSION: '1.0.0',
  IMPORT_TYPE: 'luxury' // All PropertyFinder listings are luxury properties
};

/**
 * Load environment variables and validate configuration
 */
function loadEnvironmentConfiguration(): boolean {
  try {
    // Load environment variables from .env.local
    config({ path: '.env.local' });
    
    console.log('🔧 Environment configuration loaded successfully');
    
    // Validate critical environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'ES_AWS_ACCESS_KEY_ID',
      'ES_AWS_SECRET_ACCESS_KEY',
      'ES_AWS_REGION',
      'ES_AWS_BUCKET_NAME'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars.join(', '));
      console.error('💡 Please ensure .env.local file contains all required variables');
      return false;
    }
    
    console.log('✅ All required environment variables are present');
    return true;
    
  } catch (error) {
    console.error('❌ Failed to load environment configuration:', error);
    return false;
  }
}

/**
 * Display script header and configuration information
 */
function displayScriptHeader(): void {
  console.log('='.repeat(80));
  console.log(`🚀 ${CONFIG.SCRIPT_NAME} v${CONFIG.VERSION}`);
  console.log('='.repeat(80));
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`📂 JSON file path: ${CONFIG.JSON_FILE_PATH}`);
  console.log(`💎 Import type: ${CONFIG.IMPORT_TYPE.toUpperCase()} (all listings treated as luxury)`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  console.log('='.repeat(80));
}

/**
 * Display final statistics and summary
 */
function displayFinalSummary(result: any, executionTime: number): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 FINAL EXECUTION SUMMARY');
  console.log('='.repeat(80));
  
  if (result.success && result.stats) {
    const stats = result.stats;
    
    console.log(`✅ Import Status: SUCCESS`);
    console.log(`🆔 Job ID: ${result.jobId}`);
    console.log(`⏱️ Total Execution Time: ${(executionTime / 1000).toFixed(2)} seconds`);
    console.log(`📋 Properties Processed: ${stats.totalProcessed}`);
    console.log(`✅ Created: ${stats.created}`);
    console.log(`🔄 Updated: ${stats.updated}`);
    console.log(`⏭️ Skipped: ${stats.skipped}`);
    console.log(`❌ Failed: ${stats.failed}`);
    console.log(`💎 Luxury Properties: ${stats.luxeProperties}`);
    console.log(`🖼️ Images Processed: ${stats.imagesProcessed}`);
    console.log(`📈 Success Rate: ${stats.successRate}%`);
    console.log(`⚡ Processing Speed: ${stats.propertiesPerSecond} properties/second`);
    
    if (stats.luxeProperties > 0) {
      console.log(`\n💎 LUXURY PROPERTY BREAKDOWN:`);
      console.log(`🖼️ With Images: ${stats.luxePropertiesWithImages}`);
      console.log(`❌ Without Images: ${stats.luxePropertiesWithoutImages}`);
      console.log(`📊 Image Processing Rate: ${((stats.luxePropertiesWithImages / stats.luxeProperties) * 100).toFixed(1)}%`);
    } else {
      console.log(`\n💎 Note: All PropertyFinder listings should be treated as luxury properties`);
      console.log(`📝 If no luxury properties were detected, the import logic may need updating`);
    }
    
  } else {
    console.log(`❌ Import Status: FAILED`);
    console.log(`🆔 Job ID: ${result.jobId || 'N/A'}`);
    console.log(`⏱️ Execution Time: ${(executionTime / 1000).toFixed(2)} seconds`);
    console.log(`💥 Error: ${result.error || 'Unknown error'}`);
    
    if (result.stats) {
      console.log(`📋 Partial Results - Processed: ${result.stats.totalProcessed}`);
      console.log(`✅ Created: ${result.stats.created}`);
      console.log(`🔄 Updated: ${result.stats.updated}`);
      console.log(`⏭️ Skipped: ${result.stats.skipped}`);
      console.log(`❌ Failed: ${result.stats.failed}`);
    }
  }
  
  console.log('='.repeat(80));
}

/**
 * Handle script cleanup and error recovery
 */
function performCleanup(error?: Error): void {
  try {
    console.log('\n🧹 Performing cleanup operations...');
    
    if (error) {
      console.error('🚨 Cleanup triggered by error:', error.message);
    }
    
    // Clear any potential memory leaks
    if (global.gc) {
      global.gc();
      console.log('♻️ Garbage collection performed');
    }
    
    // Log cleanup completion
    console.log('✅ Cleanup completed successfully');
    
  } catch (cleanupError) {
    console.error('❌ Error during cleanup:', cleanupError);
  }
}

/**
 * Handle process signals for graceful shutdown
 */
function setupSignalHandlers(): void {
  const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'] as const;
  
  signals.forEach(signal => {
    process.on(signal, () => {
      console.log(`\n🛑 Received ${signal} signal - initiating graceful shutdown...`);
      performCleanup();
      process.exit(1);
    });
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    performCleanup(error);
    process.exit(1);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    performCleanup(reason instanceof Error ? reason : new Error(String(reason)));
    process.exit(1);
  });
}

/**
 * Main script execution function
 */
async function main(): Promise<void> {
  const scriptStartTime = Date.now();
  
  try {
    // Setup signal handlers for graceful shutdown
    setupSignalHandlers();
    
    // Display script header
    displayScriptHeader();
    
    // Load and validate environment configuration
    console.log('\n🔧 Loading environment configuration...');
    if (!loadEnvironmentConfiguration()) {
      console.error('❌ Environment configuration failed - aborting script');
      process.exit(1);
    }
    
    // Validate JSON file exists
    console.log('\n📂 Validating JSON file availability...');
    try {
      const fs = await import('fs/promises');
      const fullPath = path.resolve(CONFIG.JSON_FILE_PATH);
      await fs.access(fullPath);
      console.log('✅ JSON file found and accessible');
      console.log(`📍 Full path: ${fullPath}`);
    } catch (fileError) {
      console.error(`❌ JSON file not found at: ${CONFIG.JSON_FILE_PATH}`);
      console.error(`📍 Resolved path: ${path.resolve(CONFIG.JSON_FILE_PATH)}`);
      console.error('💡 Please ensure the listings.json file exists in the scripts directory');
      process.exit(1);
    }
    
    // Execute the import process
    console.log('\n🚀 Starting PropertyFinder JSON import process...');
    console.log('💎 All properties will be imported as luxury listings with full image processing');
    console.log('⏳ This may take several minutes depending on the number of properties...');
    console.log('📝 Note: PropertyFinder specializes in luxury properties - all listings treated as luxury');
    
    // Validate that the import function is available
    if (typeof importPropertyFinderJson !== 'function') {
      throw new Error('Import function is not available - check import path');
    }
    
    const result = await importPropertyFinderJson();
    const executionTime = Date.now() - scriptStartTime;
    
    // Display final summary
    displayFinalSummary(result, executionTime);
    
    // Perform cleanup
    performCleanup();
    
    // Exit with appropriate code
    if (result.success) {
      console.log('\n🎉 PropertyFinder JSON import completed successfully!');
      process.exit(0);
    } else {
      console.log('\n💥 PropertyFinder JSON import failed!');
      process.exit(1);
    }
    
  } catch (error) {
    const executionTime = Date.now() - scriptStartTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error('\n💥 Critical script execution error:', errorMessage);
    console.error('⏱️ Script failed after:', (executionTime / 1000).toFixed(2), 'seconds');
    
    if (error instanceof Error && error.stack) {
      console.error('📍 Stack trace:', error.stack);
    }
    
    // Perform cleanup
    performCleanup(error instanceof Error ? error : new Error(errorMessage));
    
    // Exit with error code
    process.exit(1);
  }
}

// Execute the main function if this script is run directly
if (require.main === module) {
  console.log('🎬 PropertyFinder JSON Import Script starting...');
  main().catch((error) => {
    console.error('💥 Unhandled script error:', error);
    process.exit(1);
  });
}

// Export for potential programmatic usage
export { main as runPropertyFinderImport, CONFIG };