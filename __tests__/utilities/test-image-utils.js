#!/usr/bin/env node

// Simple test runner for image management utilities
const { execSync } = require('child_process');

try {
  console.log('Running image management utility tests...');
  
  // Run only the utility tests
  execSync('npm test -- lib/__tests__/image-management-utils.test.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Image management utility tests completed successfully!');
} catch (error) {
  console.error('❌ Tests failed:', error.message);
  process.exit(1);
}