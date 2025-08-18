const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // Handle specific imports from __tests__ directory
    '^../import-propertyfinder-json-action$': '<rootDir>/actions/admin/import-propertyfinder-json-action',
    '^../luxe-property-actions$': '<rootDir>/actions/admin/luxe/properties/luxe-property-actions',
    '^../image-management-utils$': '<rootDir>/lib/image-management-utils',
    '^../multi-image-dropzone$': '<rootDir>/components/ui/multi-image-dropzone',
    '^../sortable-image-grid$': '<rootDir>/components/ui/sortable-image-grid',
    '^../LuxePropertyForm$': '<rootDir>/features/admin/luxe/properties/components/LuxePropertyForm',
    '^../MobileNavigation$': '<rootDir>/components/MobileNavigation',
    '^../MobileFormOptimization$': '<rootDir>/components/MobileFormOptimization',
    '^../SEOHead$': '<rootDir>/components/SEOHead',
    '^../responsive-design-manager$': '<rootDir>/lib/responsive-design-manager',
    '^../image-optimizer$': '<rootDir>/lib/image-optimizer',
    '^../image-seo-optimizer$': '<rootDir>/lib/image-seo-optimizer',
    '^../responsive-image-system$': '<rootDir>/lib/responsive-image-system',
    '^../mobile-performance-optimizer$': '<rootDir>/lib/mobile-performance-optimizer',
    '^../memory-cache$': '<rootDir>/lib/cache/memory-cache',
    '^../disk-cache$': '<rootDir>/lib/cache/disk-cache',
    '^../query-optimizer$': '<rootDir>/lib/cache/query-optimizer',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'actions/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(node-fetch|fetch-blob|data-uri-to-buffer|formdata-polyfill)/)'
  ],
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
      },
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)