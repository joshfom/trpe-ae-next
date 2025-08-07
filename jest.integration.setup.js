/**
 * Integration Test Setup
 * Sets up the test environment for PropertyFinder JSON Import integration tests
 */

// Mock network requests for image downloads
global.fetch = jest.fn().mockImplementation((url) => {
  // Mock successful image download
  if (url.includes('placeholder') || url.includes('via.placeholder')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      headers: {
        get: (header) => {
          if (header === 'content-type') return 'image/jpeg';
          if (header === 'content-length') return '1024000';
          return null;
        }
      },
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024000))
    });
  }
  
  // Mock failed image download
  return Promise.resolve({
    ok: false,
    status: 404,
    statusText: 'Not Found'
  });
});

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';

// Increase timeout for database operations
jest.setTimeout(120000);

console.log('🧪 Integration test environment setup completed');