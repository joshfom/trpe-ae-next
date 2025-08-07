#!/usr/bin/env bun

/**
 * Basic test script to verify PropertyFinder JSON import functionality
 */

import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testBasicImport() {
  try {
    console.log('🧪 Testing basic PropertyFinder JSON import functionality...');
    
    // Import the action
    const { importPropertyFinderJson } = await import('../actions/import-propertyfinder-json-action');
    
    console.log('✅ Import action loaded successfully');
    console.log('🚀 Starting import test...');
    
    // Run the import
    const result = await importPropertyFinderJson();
    
    if (result.success) {
      console.log('✅ Import completed successfully!');
      console.log('📊 Statistics:', result.stats);
    } else {
      console.log('❌ Import failed:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testBasicImport();