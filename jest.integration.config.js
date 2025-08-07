/**
 * Jest Configuration for Integration Tests
 * Specifically configured for PropertyFinder JSON Import Integration Testing
 */

const baseConfig = require('./jest.config.js');

module.exports = {
  ...baseConfig,
  
  // Test environment setup
  testEnvironment: 'node',
  
  // Only run integration tests
  testMatch: [
    '**/__tests__/**/*integration*.test.ts',
    '**/*integration*.test.ts'
  ],
  
  // Longer timeout for integration tests
  testTimeout: 120000, // 2 minutes
  
  // Setup files for integration tests
  setupFilesAfterEnv: [
    '<rootDir>/jest.integration.setup.js'
  ],
  
  // Coverage settings for integration tests
  collectCoverageFrom: [
    'actions/import-propertyfinder-json-action.ts',
    '!**/__tests__/**',
    '!**/node_modules/**'
  ],
  
  // Verbose output for integration tests
  verbose: true,
  
  // Run tests serially to avoid database conflicts
  maxWorkers: 1,
  
  // Clear mocks between tests
  clearMocks: true
};