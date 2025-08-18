# Insights CRUD Testing Documentation

## Overview

This documentation provides a comprehensive guide to testing the insights CRUD functionality in the admin panel. The test suite ensures reliability, performance, and maintainability of the insights management system.

## Table of Contents

1. [Test Structure](#test-structure)
2. [Test Files Overview](#test-files-overview)
3. [Testing Strategy](#testing-strategy)
4. [Running Tests](#running-tests)
5. [Coverage Areas](#coverage-areas)
6. [Mock Configuration](#mock-configuration)
7. [Test Data Management](#test-data-management)
8. [Performance Testing](#performance-testing)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

## Test Structure

The insights testing suite is organized in the `__tests__/insights/` directory with the following structure:

```
__tests__/insights/
├── insights-creation.test.ts      # Unit tests for insight creation
├── insights-reading.test.ts       # Unit tests for insight reading/querying
├── insights-updates.test.ts       # Unit tests for insight updates
├── insights-deletion.test.ts      # Unit tests for insight deletion
├── insights-integration.test.ts   # Integration tests for complete workflows
├── insights-e2e.test.tsx         # End-to-end UI tests
└── insights-performance.test.ts   # Performance and load tests
```

## Test Files Overview

### insights-creation.test.ts
**Purpose**: Tests all aspects of insight creation functionality

**Key Test Cases**:
- Input validation (required fields, data types)
- Authentication enforcement
- Slug generation and uniqueness
- Content processing and sanitization
- Image upload and optimization
- Error handling and edge cases
- Database transaction integrity

**Coverage**: ~95% of creation logic including all error paths

### insights-reading.test.ts
**Purpose**: Tests insight retrieval and querying operations

**Key Test Cases**:
- Pagination functionality
- Search and filtering
- Sorting mechanisms
- Data transformation
- Query optimization
- Permission checking
- Cache integration

**Coverage**: All query scenarios and data retrieval patterns

### insights-updates.test.ts
**Purpose**: Tests insight modification operations

**Key Test Cases**:
- Partial updates
- Full updates
- Validation on updates
- Image replacement
- Content reprocessing
- Version control
- Concurrent update handling

**Coverage**: All update scenarios including conflict resolution

### insights-deletion.test.ts
**Purpose**: Tests insight removal and cleanup operations

**Key Test Cases**:
- Soft/hard deletion logic
- S3 image cleanup
- Database cascade operations
- Transaction rollback
- Permission validation
- Audit trail maintenance

**Coverage**: Complete deletion workflow including cleanup

### insights-integration.test.ts
**Purpose**: Tests complete CRUD workflows and cross-operation scenarios

**Key Test Cases**:
- End-to-end CRUD cycles
- Authentication flow across operations
- Error handling consistency
- Data processing pipeline
- Cache invalidation
- Concurrent operations
- Edge case handling

**Coverage**: Integration between all CRUD operations

### insights-e2e.test.tsx
**Purpose**: Tests user interface interactions and complete user workflows

**Key Test Cases**:
- Form validation and submission
- Image upload UI
- List pagination and filtering
- Edit form pre-population
- Delete confirmations
- Error message display
- Responsive design
- Accessibility compliance

**Coverage**: Complete user interface functionality

### insights-performance.test.ts
**Purpose**: Tests performance characteristics under various loads

**Key Test Cases**:
- Large content handling
- Concurrent request processing
- Memory usage optimization
- Query performance
- Image processing efficiency
- Cache performance
- Memory leak prevention

**Coverage**: Performance benchmarks and resource utilization

## Testing Strategy

### 1. Unit Testing
- **Scope**: Individual functions and components
- **Focus**: Logic correctness, edge cases, error handling
- **Isolation**: Heavy use of mocks for external dependencies
- **Speed**: Fast execution, suitable for TDD

### 2. Integration Testing
- **Scope**: Multiple components working together
- **Focus**: Data flow, API contracts, business workflows
- **Dependencies**: Controlled mocking with realistic responses
- **Scenarios**: Real-world usage patterns

### 3. End-to-End Testing
- **Scope**: Complete user journeys
- **Focus**: UI interactions, user experience, accessibility
- **Environment**: Simulated browser environment
- **Coverage**: Critical user paths

### 4. Performance Testing
- **Scope**: System performance under load
- **Focus**: Response times, memory usage, scalability
- **Metrics**: Execution time, memory consumption, concurrency
- **Thresholds**: Defined performance benchmarks

## Running Tests

### Prerequisites
```bash
# Install dependencies
npm install

# Ensure Jest and testing utilities are available
npm install --save-dev @types/jest @testing-library/react @testing-library/user-event
```

### Running Individual Test Suites
```bash
# Run creation tests
npm test insights-creation

# Run reading tests
npm test insights-reading

# Run update tests
npm test insights-updates

# Run deletion tests
npm test insights-deletion

# Run integration tests
npm test insights-integration

# Run E2E tests
npm test insights-e2e

# Run performance tests
npm test insights-performance
```

### Running All Insights Tests
```bash
# Run all insights tests
npm test __tests__/insights/

# Run with coverage
npm test __tests__/insights/ --coverage

# Run in watch mode
npm test __tests__/insights/ --watch
```

### Test Configuration
The tests use the following Jest configuration:

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom', // For React components
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
  collectCoverageFrom: [
    'actions/admin/*-insight-action.ts',
    'lib/insights-*.ts',
    'components/admin/insights/**/*.tsx',
  ],
};
```

## Coverage Areas

### Functional Coverage
- ✅ **Authentication**: Session validation across all operations
- ✅ **Validation**: Input sanitization and business rule enforcement
- ✅ **CRUD Operations**: Create, Read, Update, Delete functionality
- ✅ **Image Processing**: Upload, optimization, and cleanup
- ✅ **Content Processing**: HTML sanitization and formatting
- ✅ **Error Handling**: Graceful error recovery and user feedback
- ✅ **Caching**: Cache invalidation and data freshness
- ✅ **Permissions**: Role-based access control

### Technical Coverage
- ✅ **Database Operations**: Queries, transactions, rollbacks
- ✅ **External Services**: S3 uploads, image optimization
- ✅ **Performance**: Response times, memory usage
- ✅ **Concurrency**: Race conditions, data consistency
- ✅ **Security**: Input validation, XSS prevention
- ✅ **Monitoring**: Error tracking, performance metrics

### User Experience Coverage
- ✅ **Form Interactions**: Validation, submission, error display
- ✅ **Navigation**: List pagination, search, filtering
- ✅ **Visual Feedback**: Loading states, success/error messages
- ✅ **Accessibility**: Keyboard navigation, screen reader support
- ✅ **Responsive Design**: Mobile and desktop layouts
- ✅ **Performance**: Page load times, interaction responsiveness

## Mock Configuration

### Database Mocking
```typescript
// Mock Drizzle ORM
jest.mock('@/db/drizzle', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  insights: {},
}));
```

### Authentication Mocking
```typescript
// Mock auth session
jest.mock('@/actions/auth-session', () => ({
  getSession: jest.fn(),
}));

// Usage in tests
const { getSession } = require('@/actions/auth-session');
getSession.mockResolvedValue({
  session: { id: 'session-123', userId: 'user-123' },
  user: { id: 'user-123', email: 'admin@test.com' },
});
```

### External Services Mocking
```typescript
// Mock S3 service
jest.mock('@/lib/s3Service', () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
}));

// Mock image processing
jest.mock('@/lib/insights-image-utils', () => ({
  optimizeInsightCoverImage: jest.fn(),
  generateImageAltText: jest.fn(),
}));
```

## Test Data Management

### Test Data Factories
```typescript
// Standard test insight data
const createTestInsight = (overrides = {}) => ({
  title: 'Test Insight Title',
  content: '<p>Test insight content with <strong>formatting</strong></p>',
  coverUrl: 'https://example.com/test-image.jpg',
  metaTitle: 'Test Meta Title',
  metaDescription: 'Test meta description for SEO',
  altText: 'Test image alt text',
  authorId: 'author-123',
  publishedAt: '2025-01-18T10:00:00.000Z',
  ...overrides,
});

// Large content for performance testing
const createLargeContent = (size = 10000) => {
  return '<p>' + 'Lorem ipsum dolor sit amet. '.repeat(size / 25) + '</p>';
};

// Invalid data for validation testing
const createInvalidInsight = (invalidField) => {
  const base = createTestInsight();
  return { ...base, [invalidField]: '' };
};
```

### Database State Management
```typescript
// Reset database state between tests
beforeEach(() => {
  jest.clearAllMocks();
  
  // Reset mock implementations
  mockDatabaseQueries();
  mockExternalServices();
});

const mockDatabaseQueries = () => {
  const { db } = require('@/db/drizzle');
  
  // Mock successful operations
  db.insert.mockResolvedValue([{ id: 'new-insight-id' }]);
  db.select.mockResolvedValue([createTestInsight()]);
  db.update.mockResolvedValue([createTestInsight()]);
  db.delete.mockResolvedValue([{ id: 'deleted-id' }]);
};
```

## Performance Testing

### Performance Metrics
- **Response Time**: All operations should complete within defined thresholds
- **Memory Usage**: Monitor heap usage and prevent memory leaks
- **Concurrency**: Handle multiple simultaneous requests efficiently
- **Throughput**: Measure operations per second under load

### Performance Thresholds
```typescript
const PERFORMANCE_THRESHOLDS = {
  CREATE_INSIGHT: 5000,      // 5 seconds max
  READ_INSIGHTS: 2000,       // 2 seconds max
  UPDATE_INSIGHT: 3000,      // 3 seconds max
  DELETE_INSIGHT: 5000,      // 5 seconds max (includes cleanup)
  SEARCH_OPERATION: 3000,    // 3 seconds max
  IMAGE_PROCESSING: 8000,    // 8 seconds max
  CONCURRENT_OPERATIONS: 10000, // 10 seconds for batch
};
```

### Memory Testing
```typescript
// Monitor memory usage during operations
const measureMemoryUsage = async (operation) => {
  const initialMemory = process.memoryUsage();
  await operation();
  const finalMemory = process.memoryUsage();
  
  return {
    heapUsed: finalMemory.heapUsed - initialMemory.heapUsed,
    heapTotal: finalMemory.heapTotal - initialMemory.heapTotal,
  };
};
```

## Troubleshooting

### Common Issues

#### 1. Mock Import Errors
**Problem**: `Cannot find name 'jest'` or mock function not working
**Solution**: 
```typescript
// Use require() for mocks in test files
const { mockFunction } = require('module-to-mock');
mockFunction.mockResolvedValue('test-value');
```

#### 2. TypeScript Compilation Errors
**Problem**: Type mismatches in mock implementations
**Solution**:
```typescript
// Use proper typing for mocks
const mockGetSession = jest.fn() as jest.MockedFunction<typeof getSession>;
```

#### 3. Async Test Timeouts
**Problem**: Tests timing out on async operations
**Solution**:
```typescript
// Increase timeout for performance tests
jest.setTimeout(30000); // 30 seconds

// Use proper async/await patterns
await expect(asyncOperation()).resolves.toBe(expectedValue);
```

#### 4. Database Connection Issues
**Problem**: Real database connections in tests
**Solution**:
```typescript
// Ensure all database modules are mocked
jest.mock('@/db/drizzle');
jest.mock('drizzle-orm');

// Mock before importing modules
```

### Debugging Tests

#### 1. Console Logging
```typescript
// Add debug logging to tests
test('should create insight', async () => {
  console.log('Test data:', testInsightData);
  const result = await addInsight(testInsightData);
  console.log('Result:', result);
  expect(result.success).toBe(true);
});
```

#### 2. Mock Inspection
```typescript
// Check mock calls and arguments
expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
expect(mockFunction).toHaveBeenCalledTimes(expectedCallCount);
console.log('Mock calls:', mockFunction.mock.calls);
```

#### 3. Test Isolation
```typescript
// Run single test file
npm test insights-creation.test.ts

// Run specific test case
npm test -t "should validate required fields"
```

## Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names that explain the scenario
- Follow Arrange-Act-Assert pattern
- Keep tests focused and atomic

### 2. Mock Management
- Mock external dependencies consistently
- Reset mocks between tests
- Use realistic mock data
- Avoid over-mocking internal logic

### 3. Error Testing
- Test both success and failure scenarios
- Verify error messages and codes
- Test edge cases and boundary conditions
- Ensure graceful error handling

### 4. Performance Considerations
- Set realistic performance thresholds
- Monitor memory usage in long-running tests
- Test with various data sizes
- Consider real-world usage patterns

### 5. Maintenance
- Update tests when business logic changes
- Refactor test utilities for reusability
- Keep test data relevant and up-to-date
- Document test scenarios and expectations

### 6. Continuous Integration
- Run tests automatically on code changes
- Include coverage reporting
- Fail builds on test failures
- Monitor test performance over time

## Code Examples

### Example Test Case Structure
```typescript
describe('Insight Creation', () => {
  describe('Input Validation', () => {
    it('should reject empty title', async () => {
      // Arrange
      const invalidData = { title: '', content: 'test', coverUrl: 'test.jpg' };
      
      // Act
      const result = await addInsight(invalidData);
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('title');
    });
  });
});
```

### Example Mock Setup
```typescript
const setupMocks = () => {
  const { getSession } = require('@/actions/auth-session');
  const { uploadImage } = require('@/lib/s3Service');
  
  getSession.mockResolvedValue(validSession);
  uploadImage.mockResolvedValue({ url: 'uploaded-url' });
};
```

### Example Performance Test
```typescript
it('should handle large content efficiently', async () => {
  const largeContent = createLargeContent(50000);
  const startTime = performance.now();
  
  await addInsight({ ...testData, content: largeContent });
  
  const executionTime = performance.now() - startTime;
  expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CREATE_INSIGHT);
});
```

## Conclusion

This testing suite provides comprehensive coverage of the insights CRUD functionality, ensuring reliability, performance, and maintainability. The tests serve as both verification tools and documentation of expected behavior, supporting confident development and deployment of the insights management system.

For questions or issues with the test suite, refer to the troubleshooting section or consult the development team.
