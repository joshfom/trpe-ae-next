/**
 * @fileoverview Performance tests for insights CRUD operations
 * Tests operations under load and measures performance characteristics.
 * @author Auto-generated test suite
 * @date 2025-01-18
 */

// Mock external dependencies
jest.mock('@/db/drizzle');
jest.mock('@/actions/auth-session');
jest.mock('@/lib/process-html-for-storage');
jest.mock('@/lib/insights-image-utils');
jest.mock('@/lib/s3Service');
jest.mock('next/cache');

describe('Insights Performance Tests', () => {
  const mockSession = {
    session: {
      id: 'session-123',
      userId: 'user-123',
      expiresAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      token: 'token-123',
    },
    user: {
      id: 'user-123',
      email: 'admin@test.com',
      emailVerified: true,
      name: 'Admin User',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock authentication
    const { getSession } = require('@/actions/auth-session');
    getSession.mockResolvedValue(mockSession);
  });

  describe('Creation Performance', () => {
    it('should handle creation of large content efficiently', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');
      
      // Generate large content (10KB of text)
      const largeContent = '<p>' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(200) + '</p>';
      
      const startTime = performance.now();
      
      const result = await addInsight({
        title: 'Performance Test Insight',
        content: largeContent,
        coverUrl: 'https://example.com/image.jpg',
        metaDescription: 'Performance test meta description',
      });
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete within reasonable time (adjust threshold as needed)
      expect(executionTime).toBeLessThan(5000); // 5 seconds
      expect(result).toHaveProperty('success');
    });

    it('should handle concurrent creation requests', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');
      
      const createInsight = (index: number) => addInsight({
        title: `Concurrent Insight ${index}`,
        content: `<p>Content for insight ${index}</p>`,
        coverUrl: `https://example.com/image-${index}.jpg`,
      });

      const startTime = performance.now();
      
      // Create 10 insights concurrently
      const promises = Array.from({ length: 10 }, (_, i) => createInsight(i));
      const results = await Promise.all(promises);
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should handle concurrent requests efficiently
      expect(executionTime).toBeLessThan(10000); // 10 seconds for 10 concurrent requests
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result).toHaveProperty('success');
      });
    });

    it('should handle memory usage for large batches', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');
      
      // Monitor memory usage (basic check)
      const initialMemory = process.memoryUsage();
      
      const batchSize = 50;
      const promises = [];
      
      for (let i = 0; i < batchSize; i++) {
        promises.push(addInsight({
          title: `Batch Insight ${i}`,
          content: `<p>Batch content ${i}</p>`,
          coverUrl: `https://example.com/batch-${i}.jpg`,
        }));
      }
      
      await Promise.all(promises);
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be reasonable (less than 100MB for 50 operations)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    });
  });

  describe('Reading Performance', () => {
    it('should handle large result sets efficiently', async () => {
      const { getAdminInsights } = require('@/actions/admin/get-admin-insights-action');
      
      // Mock large dataset
      const mockInsights = Array.from({ length: 1000 }, (_, i) => ({
        id: `insight-${i}`,
        slug: `insight-slug-${i}`,
        title: `Insight Title ${i}`,
        content: `<p>Content for insight ${i}</p>`,
        coverUrl: `https://example.com/image-${i}.jpg`,
        metaDescription: `Meta description ${i}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      getAdminInsights.mockResolvedValue({
        success: true,
        data: {
          insights: mockInsights.slice(0, 50), // Return first page
          totalCount: 1000,
          totalPages: 20,
          currentPage: 1,
        },
      });

      const startTime = performance.now();
      
      const result = await getAdminInsights({
        page: 1,
        limit: 50,
      });
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(2000); // 2 seconds
      expect(result.success).toBe(true);
      expect(result.data.insights).toHaveLength(50);
    });

    it('should handle search operations efficiently', async () => {
      const { getAdminInsights } = require('@/actions/admin/get-admin-insights-action');
      
      const startTime = performance.now();
      
      await getAdminInsights({
        searchTerm: 'performance test',
        page: 1,
        limit: 20,
      });
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Search should be fast
      expect(executionTime).toBeLessThan(3000); // 3 seconds
    });

    it('should handle sorting operations efficiently', async () => {
      const { getAdminInsights } = require('@/actions/admin/get-admin-insights-action');
      
      const sortOptions = [
        { sortBy: 'createdAt', sortOrder: 'desc' },
        { sortBy: 'title', sortOrder: 'asc' },
        { sortBy: 'publishedAt', sortOrder: 'desc' },
      ];

      for (const sortOption of sortOptions) {
        const startTime = performance.now();
        
        await getAdminInsights({
          ...sortOption,
          page: 1,
          limit: 50,
        });
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        expect(executionTime).toBeLessThan(2000); // 2 seconds per sort
      }
    });
  });

  describe('Update Performance', () => {
    it('should handle partial updates efficiently', async () => {
      const { updateInsight } = require('@/actions/admin/update-insight-action');
      
      const updateOperations = [
        { title: 'Updated Title' },
        { content: '<p>Updated content</p>' },
        { metaDescription: 'Updated meta description' },
        { 
          title: 'New Title',
          content: '<p>New content</p>',
          metaDescription: 'New meta description'
        },
      ];

      for (const updateData of updateOperations) {
        const startTime = performance.now();
        
        await updateInsight('test-insight-slug', updateData);
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        expect(executionTime).toBeLessThan(3000); // 3 seconds per update
      }
    });

    it('should handle concurrent updates efficiently', async () => {
      const { updateInsight } = require('@/actions/admin/update-insight-action');
      
      const concurrentUpdates = Array.from({ length: 5 }, (_, i) => 
        updateInsight(`insight-slug-${i}`, {
          title: `Concurrent Update ${i}`,
          content: `<p>Updated content ${i}</p>`,
        })
      );

      const startTime = performance.now();
      
      await Promise.all(concurrentUpdates);
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(8000); // 8 seconds for 5 concurrent updates
    });
  });

  describe('Deletion Performance', () => {
    it('should handle deletion with cleanup efficiently', async () => {
      const { deleteInsight } = require('@/actions/admin/delete-insight-action');
      
      const startTime = performance.now();
      
      await deleteInsight({ slug: 'test-insight-to-delete' });
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Deletion should be fast even with S3 cleanup
      expect(executionTime).toBeLessThan(5000); // 5 seconds
    });

    it('should handle batch deletions efficiently', async () => {
      const { deleteInsight } = require('@/actions/admin/delete-insight-action');
      
      const slugsToDelete = Array.from({ length: 10 }, (_, i) => `batch-delete-${i}`);
      
      const startTime = performance.now();
      
      const deletePromises = slugsToDelete.map(slug => 
        deleteInsight({ slug })
      );
      
      await Promise.all(deletePromises);
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(15000); // 15 seconds for 10 deletions
    });
  });

  describe('Image Processing Performance', () => {
    it('should handle image optimization efficiently', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');
      
      // Mock image processing functions
      const { optimizeInsightCoverImage } = require('@/lib/insights-image-utils');
      optimizeInsightCoverImage.mockImplementation(async (url) => {
        // Simulate image processing time
        await new Promise(resolve => setTimeout(resolve, 500));
        return url.replace('.jpg', '.webp');
      });

      const startTime = performance.now();
      
      await addInsight({
        title: 'Image Performance Test',
        content: '<p>Test content with image processing</p>',
        coverUrl: 'https://example.com/large-image.jpg',
      });
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete including image processing
      expect(executionTime).toBeLessThan(8000); // 8 seconds with image processing
    });
  });

  describe('Database Query Performance', () => {
    it('should handle complex queries efficiently', async () => {
      const { getAdminInsights } = require('@/actions/admin/get-admin-insights-action');
      
      // Complex query with multiple filters
      const complexQuery = {
        searchTerm: 'real estate',
        sortBy: 'publishedAt',
        sortOrder: 'desc',
        isLuxe: true,
        authorId: 'author-123',
        page: 1,
        limit: 25,
      };

      const startTime = performance.now();
      
      await getAdminInsights(complexQuery);
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(4000); // 4 seconds for complex query
    });
  });

  describe('Cache Performance', () => {
    it('should invalidate cache efficiently', async () => {
      const { revalidateTag } = require('next/cache');
      const { addInsight } = require('@/actions/admin/add-insight-action');
      
      const startTime = performance.now();
      
      await addInsight({
        title: 'Cache Performance Test',
        content: '<p>Testing cache invalidation performance</p>',
        coverUrl: 'https://example.com/cache-test.jpg',
      });
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Cache invalidation shouldn't add significant overhead
      expect(executionTime).toBeLessThan(6000); // 6 seconds including cache ops
      expect(revalidateTag).toHaveBeenCalled();
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle validation errors quickly', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');
      
      const invalidInputs = [
        { title: '', content: 'test', coverUrl: 'test.jpg' },
        { title: 'test', content: '', coverUrl: 'test.jpg' },
        { title: 'test', content: 'test', coverUrl: '' },
      ];

      for (const invalidInput of invalidInputs) {
        const startTime = performance.now();
        
        await addInsight(invalidInput);
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        // Validation errors should be very fast
        expect(executionTime).toBeLessThan(1000); // 1 second
      }
    });
  });

  describe('Memory Leak Prevention', () => {
    it('should not leak memory during repeated operations', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');
      
      const initialMemory = process.memoryUsage();
      
      // Perform many operations
      for (let i = 0; i < 100; i++) {
        await addInsight({
          title: `Memory Test ${i}`,
          content: `<p>Memory test content ${i}</p>`,
          coverUrl: `https://example.com/memory-${i}.jpg`,
        });
        
        // Force garbage collection every 10 operations
        if (i % 10 === 0 && global.gc) {
          global.gc();
        }
      }
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory should not increase excessively
      expect(memoryIncrease).toBeLessThan(200 * 1024 * 1024); // Less than 200MB increase
    });
  });
});
