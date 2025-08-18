/**
 * @fileoverview Integration tests for insights CRUD functionality
 * Simplified tests focusing on main workflows without complex mocking.
 * @author Auto-generated test suite
 * @date 2025-01-18
 */

// Mock external dependencies before imports
jest.mock('@/db/drizzle');
jest.mock('@/actions/auth-session');
jest.mock('@/lib/process-html-for-storage');
jest.mock('@/lib/insights-image-utils');
jest.mock('@/lib/s3Service');
jest.mock('next/cache');

describe('Insights CRUD Integration Tests', () => {
  const mockUser = {
    id: 'user-123',
    email: 'admin@test.com',
    emailVerified: true,
    name: 'Admin User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSession = {
    session: {
      id: 'session-123',
      userId: 'user-123',
      expiresAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      token: 'token-123',
    },
    user: mockUser,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Integration', () => {
    it('should block unauthenticated requests', async () => {
      // Mock auth-session to return null
      const { getSession } = require('@/actions/auth-session');
      getSession.mockResolvedValue(null);

      const { addInsight } = require('@/actions/admin/add-insight-action');
      
      const result = await addInsight({
        title: 'Test Title',
        content: 'Test Content',
        coverUrl: 'https://example.com/image.jpg',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('log in');
    });

    it('should allow authenticated requests to proceed', async () => {
      const { getSession } = require('@/actions/auth-session');
      getSession.mockResolvedValue(mockSession);

      const { addInsight } = require('@/actions/admin/add-insight-action');
      
      const result = await addInsight({
        title: 'Test Title',
        content: 'Test Content',
        coverUrl: 'https://example.com/image.jpg',
      });

      // Should pass authentication but may fail on other validation
      expect(result.error).not.toContain('log in');
    });
  });

  describe('CRUD Operation Flow', () => {
    beforeEach(() => {
      const { getSession } = require('@/actions/auth-session');
      getSession.mockResolvedValue(mockSession);
    });

    it('should validate required fields for creation', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');
      
      // Test missing title
      const result1 = await addInsight({
        title: '',
        content: 'Test Content',
        coverUrl: 'https://example.com/image.jpg',
      });
      expect(result1.success).toBe(false);

      // Test missing content
      const result2 = await addInsight({
        title: 'Test Title',
        content: '',
        coverUrl: 'https://example.com/image.jpg',
      });
      expect(result2.success).toBe(false);

      // Test missing cover image
      const result3 = await addInsight({
        title: 'Test Title',
        content: 'Test Content',
      });
      expect(result3.success).toBe(false);
    });

    it('should validate slugs for updates and deletes', async () => {
      const { updateInsight } = require('@/actions/admin/update-insight-action');
      const { deleteInsight } = require('@/actions/admin/delete-insight-action');

      // Test empty slug for update
      const updateResult = await updateInsight('', { title: 'New Title' });
      expect(updateResult.success).toBe(false);
      expect(updateResult.error).toContain('slug');

      // Test empty slug for delete
      const deleteResult = await deleteInsight({ slug: '' });
      expect(deleteResult.success).toBe(false);
      expect(deleteResult.error).toContain('slug');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      const { getSession } = require('@/actions/auth-session');
      getSession.mockResolvedValue(mockSession);
    });

    it('should return consistent error structures', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');
      const { updateInsight } = require('@/actions/admin/update-insight-action');
      const { deleteInsight } = require('@/actions/admin/delete-insight-action');

      const operations = [
        () => addInsight({ title: '', content: '', coverUrl: '' }),
        () => updateInsight('', {}),
        () => deleteInsight({ slug: '' }),
      ];

      for (const operation of operations) {
        const result = await operation();
        
        expect(result).toHaveProperty('success');
        if (!result.success) {
          expect(result).toHaveProperty('error');
          expect(typeof result.error).toBe('string');
        }
      }
    });

    it('should handle concurrent operations', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');

      const promises = Array.from({ length: 3 }, (_, i) =>
        addInsight({
          title: `Test Title ${i}`,
          content: `Test Content ${i}`,
          coverUrl: `https://example.com/image-${i}.jpg`,
        })
      );

      const results = await Promise.allSettled(promises);
      
      // All promises should resolve (not reject)
      results.forEach(result => {
        expect(result.status).toBe('fulfilled');
      });
    });
  });

  describe('Data Processing', () => {
    beforeEach(() => {
      const { getSession } = require('@/actions/auth-session');
      getSession.mockResolvedValue(mockSession);
    });

    it('should handle special characters in input', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');

      const result = await addInsight({
        title: 'Title with émojis 🚀 & special chars',
        content: '<p>Content with <strong>HTML</strong> & émojis 🎉</p>',
        coverUrl: 'https://example.com/special-image.jpg',
        metaDescription: 'Meta with "quotes" & ampersands',
      });

      // Should handle special characters without throwing
      expect(result).toHaveProperty('success');
    });

    it('should handle very long content', async () => {
      const { addInsight } = require('@/actions/admin/add-insight-action');

      const longContent = '<p>' + 'A'.repeat(10000) + '</p>';

      const result = await addInsight({
        title: 'Long Content Test',
        content: longContent,
        coverUrl: 'https://example.com/image.jpg',
      });

      // Should handle long content without throwing
      expect(result).toHaveProperty('success');
    });
  });

  describe('Cache Management', () => {
    beforeEach(() => {
      const { getSession } = require('@/actions/auth-session');
      getSession.mockResolvedValue(mockSession);
    });

    it('should attempt cache invalidation on operations', async () => {
      const { revalidateTag } = require('next/cache');
      const { addInsight } = require('@/actions/admin/add-insight-action');

      await addInsight({
        title: 'Cache Test',
        content: 'Test Content',
        coverUrl: 'https://example.com/image.jpg',
      });

      // Should have attempted to invalidate cache
      expect(revalidateTag).toHaveBeenCalled();
    });
  });
});

  describe('Complete CRUD Workflow', () => {
    test('should perform full CRUD lifecycle successfully', async () => {
      // Setup mocks for CREATE
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdInsight]),
        }),
      });
      mockDb.insert.mockReturnValue(mockInsert as any);

      // 1. CREATE - Add new insight
      const createResult = await addInsight(testInsightData);
      
      expect(createResult.success).toBe(true);
      expect(createResult.data).toMatchObject({
        id: 'generated-id',
        slug: 'integration-test-insight',
        title: testInsightData.title,
      });

      // Setup mocks for READ
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([createdInsight]),
      };
      const mockCountChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([{ count: 1 }]),
      };
      mockDb.select.mockImplementation((fields) => {
        if (fields && typeof fields === 'object' && 'count' in fields) {
          return mockCountChain as any;
        }
        return mockSelectChain as any;
      });

      // 2. READ - Retrieve insights
      const readResult = await getAdminInsights({ page: 1, limit: 10 });
      
      expect(readResult.success).toBe(true);
      expect(readResult.data).toEqual([createdInsight]);
      expect(readResult.totalCount).toBe(1);

      // Setup mocks for UPDATE
      mockDb.query.insightTable.findFirst.mockResolvedValue(createdInsight);
      const mockUpdate = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([{
              ...createdInsight,
              title: 'Updated Integration Test Insight',
              updatedAt: '2025-08-18T11:00:00.000Z',
            }]),
          }),
        }),
      });
      mockDb.update.mockReturnValue(mockUpdate as any);

      // 3. UPDATE - Modify insight
      const updateResult = await updateInsight('integration-test-insight', {
        title: 'Updated Integration Test Insight',
      });
      
      expect(updateResult.success).toBe(true);
      expect(updateResult.data?.title).toBe('Updated Integration Test Insight');

      // Setup mocks for DELETE
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdInsight]),
        }),
      });
      mockDb.delete.mockReturnValue(mockDelete as any);

      // 4. DELETE - Remove insight
      const deleteResult = await deleteInsight({ 
        slug: 'integration-test-insight',
        coverUrl: createdInsight.coverUrl,
      });
      
      expect(deleteResult.success).toBe(true);
      expect(deleteResult.data).toEqual(createdInsight);
    });

    test('should handle workflow interruption gracefully', async () => {
      // Setup successful CREATE
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdInsight]),
        }),
      });
      mockDb.insert.mockReturnValue(mockInsert as any);

      const createResult = await addInsight(testInsightData);
      expect(createResult.success).toBe(true);

      // Simulate authentication failure during UPDATE
      mockGetSession.mockResolvedValue(null);

      const updateResult = await updateInsight('integration-test-insight', {
        title: 'This should fail',
      });
      
      expect(updateResult.success).toBe(false);
      expect(updateResult.error).toBe('Please log in or your session to access resource.');

      // Restore authentication for cleanup
      mockGetSession.mockResolvedValue(mockSession);
      mockDb.query.insightTable.findFirst.mockResolvedValue(createdInsight);
      
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdInsight]),
        }),
      });
      mockDb.delete.mockReturnValue(mockDelete as any);

      // DELETE should still work with proper authentication
      const deleteResult = await deleteInsight({ slug: 'integration-test-insight' });
      expect(deleteResult.success).toBe(true);
    });
  });

  describe('Data Consistency Across Operations', () => {
    test('should maintain data integrity throughout CRUD operations', async () => {
      let currentInsight = { ...createdInsight };

      // CREATE
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([currentInsight]),
        }),
      });
      mockDb.insert.mockReturnValue(mockInsert as any);

      const createResult = await addInsight(testInsightData);
      expect(createResult.success).toBe(true);

      // UPDATE 1 - Partial update
      currentInsight = {
        ...currentInsight,
        title: 'First Update',
        updatedAt: '2025-08-18T11:00:00.000Z',
      };
      
      mockDb.query.insightTable.findFirst.mockResolvedValue(currentInsight);
      const mockUpdate1 = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([currentInsight]),
          }),
        }),
      });
      mockDb.update.mockReturnValue(mockUpdate1 as any);

      const updateResult1 = await updateInsight('integration-test-insight', {
        title: 'First Update',
      });
      
      expect(updateResult1.success).toBe(true);
      expect(updateResult1.data?.title).toBe('First Update');
      expect(updateResult1.data?.metaTitle).toBe(testInsightData.metaTitle); // Should preserve

      // UPDATE 2 - Another partial update
      currentInsight = {
        ...currentInsight,
        metaDescription: 'Updated meta description',
        updatedAt: '2025-08-18T12:00:00.000Z',
      };
      
      mockDb.query.insightTable.findFirst.mockResolvedValue(currentInsight);
      const mockUpdate2 = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([currentInsight]),
          }),
        }),
      });
      mockDb.update.mockReturnValue(mockUpdate2 as any);

      const updateResult2 = await updateInsight('integration-test-insight', {
        metaDescription: 'Updated meta description',
      });
      
      expect(updateResult2.success).toBe(true);
      expect(updateResult2.data?.title).toBe('First Update'); // Should preserve from previous update
      expect(updateResult2.data?.metaDescription).toBe('Updated meta description');
    });

    test('should handle concurrent operations safely', async () => {
      // Setup initial insight
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdInsight]),
        }),
      });
      mockDb.insert.mockReturnValue(mockInsert as any);

      await addInsight(testInsightData);

      // Setup for concurrent updates
      mockDb.query.insightTable.findFirst.mockResolvedValue(createdInsight);
      
      const mockUpdate = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([{
              ...createdInsight,
              title: 'Concurrent Update',
              updatedAt: '2025-08-18T11:00:00.000Z',
            }]),
          }),
        }),
      });
      mockDb.update.mockReturnValue(mockUpdate as any);

      // Simulate concurrent updates
      const updatePromises = [
        updateInsight('integration-test-insight', { title: 'Update 1' }),
        updateInsight('integration-test-insight', { title: 'Update 2' }),
        updateInsight('integration-test-insight', { metaDescription: 'Concurrent meta' }),
      ];

      const results = await Promise.all(updatePromises);
      
      // All updates should succeed (in this mocked scenario)
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Error Recovery and Rollback Scenarios', () => {
    test('should handle partial failures gracefully', async () => {
      // Successful CREATE
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdInsight]),
        }),
      });
      mockDb.insert.mockReturnValue(mockInsert as any);

      const createResult = await addInsight(testInsightData);
      expect(createResult.success).toBe(true);

      // Failed UPDATE due to database error
      mockDb.query.insightTable.findFirst.mockResolvedValue(createdInsight);
      const mockUpdate = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockRejectedValue(new Error('Database connection lost')),
          }),
        }),
      });
      mockDb.update.mockReturnValue(mockUpdate as any);

      const updateResult = await updateInsight('integration-test-insight', {
        title: 'This update will fail',
      });
      
      expect(updateResult.success).toBe(false);
      expect(updateResult.error).toBe('Database connection lost');

      // READ should still work (insight exists)
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([createdInsight]),
      };
      const mockCountChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([{ count: 1 }]),
      };
      mockDb.select.mockImplementation((fields) => {
        if (fields && typeof fields === 'object' && 'count' in fields) {
          return mockCountChain as any;
        }
        return mockSelectChain as any;
      });

      const readResult = await getAdminInsights({});
      expect(readResult.success).toBe(true);
      expect(readResult.data).toEqual([createdInsight]);

      // DELETE should work (cleanup)
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdInsight]),
        }),
      });
      mockDb.delete.mockReturnValue(mockDelete as any);

      const deleteResult = await deleteInsight({ slug: 'integration-test-insight' });
      expect(deleteResult.success).toBe(true);
    });

    test('should validate data consistency after errors', async () => {
      // CREATE with image processing failure
      const { ImageProcessingError } = await import('@/lib/insights-image-utils');
      const mockProcessInsightImage = (await import('@/lib/insights-image-utils')).processInsightImage as jest.MockedFunction<any>;
      
      mockProcessInsightImage.mockRejectedValue(new ImageProcessingError('Image processing failed'));

      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{
            ...createdInsight,
            coverUrl: testInsightData.coverUrl, // Original URL (not processed)
          }]),
        }),
      });
      mockDb.insert.mockReturnValue(mockInsert as any);

      const createResult = await addInsight(testInsightData);
      
      expect(createResult.success).toBe(true);
      expect(createResult.data?.coverUrl).toBe(testInsightData.coverUrl); // Should use original URL

      // Verify READ returns the same data
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([{
          ...createdInsight,
          coverUrl: testInsightData.coverUrl,
        }]),
      };
      const mockCountChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([{ count: 1 }]),
      };
      mockDb.select.mockImplementation((fields) => {
        if (fields && typeof fields === 'object' && 'count' in fields) {
          return mockCountChain as any;
        }
        return mockSelectChain as any;
      });

      const readResult = await getAdminInsights({});
      expect(readResult.success).toBe(true);
      expect(readResult.data?.[0]?.coverUrl).toBe(testInsightData.coverUrl);
    });
  });

  describe('Authentication Flow Integration', () => {
    test('should enforce authentication across all operations', async () => {
      // Test CREATE without authentication
      mockGetSession.mockResolvedValue(null);

      const createResult = await addInsight(testInsightData);
      expect(createResult.success).toBe(false);
      expect(createResult.error).toBe('Please log in or your session to access resource.');

      // Test READ without authentication
      const readResult = await getAdminInsights({});
      expect(readResult.success).toBe(false);
      expect(readResult.error).toBe('Please log in or your session to access resource.');

      // Test UPDATE without authentication
      const updateResult = await updateInsight('some-slug', { title: 'Test' });
      expect(updateResult.success).toBe(false);
      expect(updateResult.error).toBe('Please log in or your session to access resource.');

      // Test DELETE without authentication
      const deleteResult = await deleteInsight({ slug: 'some-slug' });
      expect(deleteResult.success).toBe(false);
      expect(deleteResult.error).toBe('Please log in or your session to access resource.');
    });

    test('should handle session expiration during workflow', async () => {
      // Start with valid session
      mockGetSession.mockResolvedValue(mockSession);

      // Successful CREATE
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdInsight]),
        }),
      });
      mockDb.insert.mockReturnValue(mockInsert as any);

      const createResult = await addInsight(testInsightData);
      expect(createResult.success).toBe(true);

      // Session expires
      mockGetSession.mockResolvedValue(null);

      // Subsequent operations should fail
      const updateResult = await updateInsight('integration-test-insight', { title: 'Should fail' });
      expect(updateResult.success).toBe(false);

      const deleteResult = await deleteInsight({ slug: 'integration-test-insight' });
      expect(deleteResult.success).toBe(false);

      // Session is restored
      mockGetSession.mockResolvedValue(mockSession);
      mockDb.query.insightTable.findFirst.mockResolvedValue(createdInsight);

      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdInsight]),
        }),
      });
      mockDb.delete.mockReturnValue(mockDelete as any);

      // Operations should work again
      const finalDeleteResult = await deleteInsight({ slug: 'integration-test-insight' });
      expect(finalDeleteResult.success).toBe(true);
    });
  });

  describe('Real-world Usage Patterns', () => {
    test('should handle bulk operations efficiently', async () => {
      const insights = Array.from({ length: 5 }, (_, i) => ({
        ...testInsightData,
        title: `Bulk Insight ${i + 1}`,
      }));

      const createdInsights = insights.map((insight, i) => ({
        ...createdInsight,
        id: `generated-id-${i}`,
        title: insight.title,
        slug: insight.title.toLowerCase().replace(/\s+/g, '-'),
      }));

      // CREATE multiple insights
      for (let i = 0; i < insights.length; i++) {
        const mockInsert = jest.fn().mockReturnValue({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([createdInsights[i]]),
          }),
        });
        mockDb.insert.mockReturnValue(mockInsert as any);

        const result = await addInsight(insights[i]);
        expect(result.success).toBe(true);
      }

      // READ all insights
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue(createdInsights),
      };
      const mockCountChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([{ count: 5 }]),
      };
      mockDb.select.mockImplementation((fields) => {
        if (fields && typeof fields === 'object' && 'count' in fields) {
          return mockCountChain as any;
        }
        return mockSelectChain as any;
      });

      const readResult = await getAdminInsights({ limit: 10 });
      expect(readResult.success).toBe(true);
      expect(readResult.data).toHaveLength(5);
      expect(readResult.totalCount).toBe(5);

      // UPDATE multiple insights
      for (let i = 0; i < createdInsights.length; i++) {
        mockDb.query.insightTable.findFirst.mockResolvedValue(createdInsights[i]);
        
        const updatedInsight = {
          ...createdInsights[i],
          title: `Updated ${createdInsights[i].title}`,
        };

        const mockUpdate = jest.fn().mockReturnValue({
          set: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              returning: jest.fn().mockResolvedValue([updatedInsight]),
            }),
          }),
        });
        mockDb.update.mockReturnValue(mockUpdate as any);

        const result = await updateInsight(createdInsights[i].slug, {
          title: `Updated ${createdInsights[i].title}`,
        });
        expect(result.success).toBe(true);
      }
    });

    test('should handle complex search and filter scenarios', async () => {
      const mockInsights = [
        { ...createdInsight, title: 'Luxury Real Estate Trends', slug: 'luxury-real-estate-trends' },
        { ...createdInsight, title: 'Market Analysis 2024', slug: 'market-analysis-2024' },
        { ...createdInsight, title: 'Investment Opportunities', slug: 'investment-opportunities' },
      ];

      // Search for "luxury"
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([mockInsights[0]]),
      };
      const mockCountChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([{ count: 1 }]),
      };
      mockDb.select.mockImplementation((fields) => {
        if (fields && typeof fields === 'object' && 'count' in fields) {
          return mockCountChain as any;
        }
        return mockSelectChain as any;
      });

      const searchResult = await getAdminInsights({ search: 'luxury' });
      expect(searchResult.success).toBe(true);
      expect(searchResult.data).toHaveLength(1);
      expect(searchResult.data?.[0]?.title).toBe('Luxury Real Estate Trends');

      // Search with pagination
      mockSelectChain.offset.mockResolvedValue([mockInsights[1]]);
      mockCountChain.where.mockResolvedValue([{ count: 3 }]);

      const paginatedResult = await getAdminInsights({ 
        search: 'market', 
        page: 2, 
        limit: 1 
      });
      expect(paginatedResult.success).toBe(true);
      expect(paginatedResult.page).toBe(2);
      expect(paginatedResult.totalPages).toBe(3);
    });
  });
});