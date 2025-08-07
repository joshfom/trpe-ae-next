#!/usr/bin/env bun

/**
 * Simple syntax test to verify the import action can be loaded
 */

async function testSyntax() {
  try {
    console.log('🧪 Testing import action syntax...');
    
    // Try to import the action
    const importModule = await import('../actions/import-propertyfinder-json-action');
    
    console.log('✅ Import action syntax is valid');
    console.log('📋 Available exports:', Object.keys(importModule));
    
  } catch (error) {
    console.error('❌ Syntax error in import action:', error);
    process.exit(1);
  }
}

testSyntax();