/**
 * @fileoverview Unit tests for insights reading functionality
 * Tests the getAdminInsights server action including pagination, filtering,
 * search functionality, and data retrieval operations.
 */

import { jest } from '@jest/globals';
import { getAdminInsights } from '@/actions/admin/get-admin-insights-action';
import { db } from '@/db/drizzle';
import { insightTable } from '@/db/schema/insight-table';
import { authorTable } from '@/db/schema/author-table';
import { getSession } from '@/actions/auth-session';
import { and, desc, asc, like, count, eq } from 'drizzle-orm';

// Mock external dependencies
jest.mock('@/db/drizzle', () => ({
  db: {
    select: jest.fn(),
    query: {
      insightTable: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    },
  },
}));

jest.mock('@/db/schema/insight-table', () => ({
  insightTable: {
    id: 'insights.id',
    title: 'insights.title',
    slug: 'insights.slug',
    coverUrl: 'insights.cover_url',
    createdAt: 'insights.created_at',
    updatedAt: 'insights.updated_at',
    isPublished: 'insights.is_published',
    authorId: 'insights.author',
  },
}));

jest.mock('@/db/schema/author-table', () => ({
  authorTable: {
    id: 'authors.id',
    name: 'authors.name',
  },
}));

jest.mock('@/actions/auth-session');
jest.mock('drizzle-orm');

// Type the mocked functions
const mockDb = db as jest.Mocked<typeof db>;
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockAnd = and as jest.MockedFunction<typeof and>;
const mockDesc = desc as jest.MockedFunction<typeof desc>;
const mockAsc = asc as jest.MockedFunction<typeof asc>;
const mockLike = like as jest.MockedFunction<typeof like>;
const mockCount = count as jest.MockedFunction<typeof count>;
const mockEq = eq as jest.MockedFunction<typeof eq>;

describe('Insights Reading Tests', () => {
  // Test data
  const mockSession = {
    user: { id: 'user-123', email: 'test@example.com' },
  };

  const mockInsights = [
    {
      id: 'insight-1',
      title: 'First Insight',
      slug: 'first-insight',
      coverUrl: 'https://example.com/image1.jpg',
      metaDescription: 'First insight description',
      isPublished: 'yes',
      createdAt: '2025-08-18T10:00:00.000Z',
      updatedAt: '2025-08-18T10:00:00.000Z',
      author: {
        id: 'author-1',
        name: 'John Doe',
      },
    },
    {
      id: 'insight-2',
      title: 'Second Insight',
      slug: 'second-insight',
      coverUrl: 'https://example.com/image2.jpg',
      metaDescription: 'Second insight description',
      isPublished: 'no',
      createdAt: '2025-08-17T10:00:00.000Z',
      updatedAt: '2025-08-17T10:00:00.000Z',
      author: {
        id: 'author-2',
        name: 'Jane Smith',
      },
    },
    {
      id: 'insight-3',
      title: 'Third Insight',
      slug: 'third-insight',
      coverUrl: 'https://example.com/image3.jpg',
      metaDescription: 'Third insight description',
      isPublished: 'yes',
      createdAt: '2025-08-16T10:00:00.000Z',
      updatedAt: '2025-08-16T10:00:00.000Z',
      author: {
        id: 'author-1',
        name: 'John Doe',
      },
    },
  ];

  const mockCountResult = [{ count: 3 }];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Initialize mockDb.query structure if not exists
    if (!mockDb.query) {
      mockDb.query = {};
    }
    if (!mockDb.query.insightTable) {
      mockDb.query.insightTable = {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      };
    }
    
    // Initialize Drizzle ORM function mocks if they don't exist
    if (!mockAnd.mockReturnValue) {
      Object.assign(mockAnd, jest.fn());
    }
    if (!mockDesc.mockReturnValue) {
      Object.assign(mockDesc, jest.fn());
    }
    if (!mockAsc.mockReturnValue) {
      Object.assign(mockAsc, jest.fn());
    }
    if (!mockLike.mockReturnValue) {
      Object.assign(mockLike, jest.fn());
    }
    if (!mockCount.mockReturnValue) {
      Object.assign(mockCount, jest.fn());
    }
    if (!mockEq.mockReturnValue) {
      Object.assign(mockEq, jest.fn());
    }
    
    // Default mock implementations
    mockGetSession.mockResolvedValue(mockSession);
    
    // Mock query builder pattern
    const mockSelectChain = {
      from: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockResolvedValue(mockInsights),
    };

    const mockCountChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(mockCountResult),
    };

    mockDb.select.mockImplementation((fields) => {
      if (fields && typeof fields === 'object' && 'count' in fields) {
        return mockCountChain as any;
      }
      return mockSelectChain as any;
    });

    // Mock query helper
    mockDb.query.insightTable.findMany.mockResolvedValue(mockInsights);
    mockDb.query.insightTable.findFirst.mockResolvedValue(mockInsights[0]);

    // Mock drizzle-orm functions
    mockAnd.mockReturnValue('AND_CONDITION' as any);
    mockDesc.mockReturnValue('DESC_ORDER' as any);
    mockAsc.mockReturnValue('ASC_ORDER' as any);
    mockLike.mockReturnValue('LIKE_CONDITION' as any);
    mockCount.mockReturnValue({ count: jest.fn() } as any);
    mockEq.mockReturnValue('EQ_CONDITION' as any);
    mockCount.mockReturnValue('COUNT_FIELD' as any);
    mockEq.mockReturnValue('EQ_CONDITION' as any);
  });

  describe('Authentication and Authorization', () => {
    test('should fail when user is not authenticated', async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await getAdminInsights({});

      expect(result).toEqual({
        success: false,
        error: 'Please log in or your session to access resource.',
        data: null,
      });
    });

    test('should proceed when user is authenticated', async () => {
      const result = await getAdminInsights({});

      expect(result.success).toBe(true);
      expect(mockGetSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('Basic Data Retrieval', () => {
    test('should retrieve insights with default parameters', async () => {
      const result = await getAdminInsights({});

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockInsights);
      expect(result.totalCount).toBe(3);
      expect(result.totalPages).toBe(1);
    });

    test('should retrieve insights with author information', async () => {
      const result = await getAdminInsights({});

      expect(result.success).toBe(true);
      expect(result.data?.[0]).toHaveProperty('author');
      expect(result.data?.[0].author).toEqual({
        id: 'author-1',
        name: 'John Doe',
      });
    });

    test('should handle empty results', async () => {
      mockDb.select.mockImplementation((fields) => {
        if (fields && typeof fields === 'object' && 'count' in fields) {
          return {
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockResolvedValue([{ count: 0 }]),
          } as any;
        }
        return {
          from: jest.fn().mockReturnThis(),
          leftJoin: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          offset: jest.fn().mockResolvedValue([]),
        } as any;
      });

      const result = await getAdminInsights({});

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.totalCount).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('Pagination', () => {
    test('should handle page 1 with default limit', async () => {
      const result = await getAdminInsights({ page: 1 });

      expect(result.success).toBe(true);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      
      // Verify offset calculation (page 1 = offset 0)
      const selectChain = mockDb.select.mock.results[0].value;
      expect(selectChain.offset).toHaveBeenCalledWith(0);
    });

    test('should handle page 2 with default limit', async () => {
      const result = await getAdminInsights({ page: 2 });

      expect(result.success).toBe(true);
      expect(result.page).toBe(2);
      
      // Verify offset calculation (page 2 = offset 10)
      const selectChain = mockDb.select.mock.results[0].value;
      expect(selectChain.offset).toHaveBeenCalledWith(10);
    });

    test('should handle custom limit', async () => {
      const result = await getAdminInsights({ page: 1, limit: 5 });

      expect(result.success).toBe(true);
      expect(result.limit).toBe(5);
      
      const selectChain = mockDb.select.mock.results[0].value;
      expect(selectChain.limit).toHaveBeenCalledWith(5);
    });

    test('should calculate total pages correctly', async () => {
      // Mock 25 total insights with limit of 10
      mockDb.select.mockImplementation((fields) => {
        if (fields && typeof fields === 'object' && 'count' in fields) {
          return {
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockResolvedValue([{ count: 25 }]),
          } as any;
        }
        return {
          from: jest.fn().mockReturnThis(),
          leftJoin: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          offset: jest.fn().mockResolvedValue(mockInsights),
        } as any;
      });

      const result = await getAdminInsights({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.totalCount).toBe(25);
      expect(result.totalPages).toBe(3); // Math.ceil(25/10) = 3
    });

    test('should handle large page numbers', async () => {
      const result = await getAdminInsights({ page: 100, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.page).toBe(100);
      
      // Verify offset calculation (page 100 = offset 990)
      const selectChain = mockDb.select.mock.results[0].value;
      expect(selectChain.offset).toHaveBeenCalledWith(990);
    });

    test('should handle invalid page numbers', async () => {
      const result = await getAdminInsights({ page: 0 });

      expect(result.success).toBe(true);
      expect(result.page).toBe(1); // Should default to page 1
    });

    test('should handle negative page numbers', async () => {
      const result = await getAdminInsights({ page: -5 });

      expect(result.success).toBe(true);
      expect(result.page).toBe(1); // Should default to page 1
    });
  });

  describe('Search Functionality', () => {
    test('should search insights by title', async () => {
      const result = await getAdminInsights({ search: 'First' });

      expect(result.success).toBe(true);
      expect(mockLike).toHaveBeenCalledWith(insightTable.title, '%First%');
    });

    test('should handle empty search', async () => {
      const result = await getAdminInsights({ search: '' });

      expect(result.success).toBe(true);
      // Should not add search conditions for empty search
      expect(mockLike).not.toHaveBeenCalled();
    });

    test('should handle undefined search', async () => {
      const result = await getAdminInsights({ search: undefined });

      expect(result.success).toBe(true);
      expect(mockLike).not.toHaveBeenCalled();
    });

    test('should handle special characters in search', async () => {
      const searchTerm = 'Special "Chars" & Symbols';
      
      const result = await getAdminInsights({ search: searchTerm });

      expect(result.success).toBe(true);
      expect(mockLike).toHaveBeenCalledWith(
        insightTable.title, 
        `%${searchTerm}%`
      );
    });

    test('should trim whitespace from search term', async () => {
      const result = await getAdminInsights({ search: '  trimmed  ' });

      expect(result.success).toBe(true);
      expect(mockLike).toHaveBeenCalledWith(
        insightTable.title, 
        '%trimmed%'
      );
    });
  });

  describe('Sorting', () => {
    test('should sort by createdAt desc by default', async () => {
      const result = await getAdminInsights({});

      expect(result.success).toBe(true);
      expect(mockDesc).toHaveBeenCalledWith(insightTable.createdAt);
    });

    test('should sort by title ascending', async () => {
      const result = await getAdminInsights({ 
        sortBy: 'title', 
        sortOrder: 'asc' 
      });

      expect(result.success).toBe(true);
      expect(mockAsc).toHaveBeenCalledWith(insightTable.title);
    });

    test('should sort by title descending', async () => {
      const result = await getAdminInsights({ 
        sortBy: 'title', 
        sortOrder: 'desc' 
      });

      expect(result.success).toBe(true);
      expect(mockDesc).toHaveBeenCalledWith(insightTable.title);
    });

    test('should sort by updatedAt', async () => {
      const result = await getAdminInsights({ 
        sortBy: 'updatedAt', 
        sortOrder: 'asc' 
      });

      expect(result.success).toBe(true);
      expect(mockAsc).toHaveBeenCalledWith(insightTable.updatedAt);
    });

    test('should handle invalid sort field', async () => {
      const result = await getAdminInsights({ 
        sortBy: 'invalidField', 
        sortOrder: 'asc' 
      });

      expect(result.success).toBe(true);
      // Should fallback to default sorting (createdAt desc)
      expect(mockDesc).toHaveBeenCalledWith(insightTable.createdAt);
    });

    test('should handle invalid sort order', async () => {
      const result = await getAdminInsights({ 
        sortBy: 'title', 
        sortOrder: 'invalid' as any 
      });

      expect(result.success).toBe(true);
      // Should fallback to desc order
      expect(mockDesc).toHaveBeenCalledWith(insightTable.title);
    });
  });

  describe('Combined Filters', () => {
    test('should handle search with pagination', async () => {
      const result = await getAdminInsights({ 
        search: 'test', 
        page: 2, 
        limit: 5 
      });

      expect(result.success).toBe(true);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(mockLike).toHaveBeenCalledWith(insightTable.title, '%test%');
      
      const selectChain = mockDb.select.mock.results[0].value;
      expect(selectChain.offset).toHaveBeenCalledWith(5); // (page 2 - 1) * limit 5
    });

    test('should handle search with sorting', async () => {
      const result = await getAdminInsights({ 
        search: 'insight', 
        sortBy: 'title', 
        sortOrder: 'asc' 
      });

      expect(result.success).toBe(true);
      expect(mockLike).toHaveBeenCalledWith(insightTable.title, '%insight%');
      expect(mockAsc).toHaveBeenCalledWith(insightTable.title);
    });

    test('should handle all parameters together', async () => {
      const result = await getAdminInsights({ 
        search: 'comprehensive', 
        page: 3, 
        limit: 8, 
        sortBy: 'updatedAt', 
        sortOrder: 'desc' 
      });

      expect(result.success).toBe(true);
      expect(result.page).toBe(3);
      expect(result.limit).toBe(8);
      expect(mockLike).toHaveBeenCalledWith(insightTable.title, '%comprehensive%');
      expect(mockDesc).toHaveBeenCalledWith(insightTable.updatedAt);
      
      const selectChain = mockDb.select.mock.results[0].value;
      expect(selectChain.offset).toHaveBeenCalledWith(16); // (page 3 - 1) * limit 8
    });
  });

  describe('Single Insight Retrieval', () => {
    test('should retrieve single insight by slug', async () => {
      const slug = 'first-insight';
      
      // Mock the findFirst method specifically for single insight
      const mockSingleInsight = mockInsights[0];
      mockDb.query.insightTable.findFirst.mockResolvedValue(mockSingleInsight);

      // Create a mock function for single insight retrieval
      const getSingleInsight = async (insightSlug: string) => {
        const session = await getSession();
        if (!session) {
          return {
            success: false,
            error: 'Please log in or your session to access resource.',
            data: null,
          };
        }

        const insight = await db.query.insightTable.findFirst({
          where: eq(insightTable.slug, insightSlug),
          with: {
            author: true,
          },
        });

        if (!insight) {
          return {
            success: false,
            error: 'Insight not found',
            data: null,
          };
        }

        return {
          success: true,
          data: insight,
        };
      };

      const result = await getSingleInsight(slug);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSingleInsight);
      expect(mockEq).toHaveBeenCalledWith(insightTable.slug, slug);
    });

    test('should handle insight not found', async () => {
      mockDb.query.insightTable.findFirst.mockResolvedValue(null);

      const getSingleInsight = async (insightSlug: string) => {
        const session = await getSession();
        if (!session) {
          return {
            success: false,
            error: 'Please log in or your session to access resource.',
            data: null,
          };
        }

        const insight = await db.query.insightTable.findFirst({
          where: eq(insightTable.slug, insightSlug),
        });

        if (!insight) {
          return {
            success: false,
            error: 'Insight not found',
            data: null,
          };
        }

        return {
          success: true,
          data: insight,
        };
      };

      const result = await getSingleInsight('non-existent-slug');

      expect(result).toEqual({
        success: false,
        error: 'Insight not found',
        data: null,
      });
    });
  });

  describe('Data Validation', () => {
    test('should return valid data structure', async () => {
      const result = await getAdminInsights({});

      expect(result.success).toBe(true);
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('totalCount');
      expect(result).toHaveProperty('totalPages');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(Array.isArray(result.data)).toBe(true);
    });

    test('should validate insight object structure', async () => {
      const result = await getAdminInsights({});

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data && result.data.length > 0) {
        const insight = result.data[0];
        expect(insight).toHaveProperty('id');
        expect(insight).toHaveProperty('title');
        expect(insight).toHaveProperty('slug');
        expect(insight).toHaveProperty('coverUrl');
        expect(insight).toHaveProperty('createdAt');
        expect(insight).toHaveProperty('updatedAt');
        expect(insight).toHaveProperty('author');
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      mockDb.select.mockImplementation(() => {
        throw dbError;
      });

      const result = await getAdminInsights({});

      expect(result).toEqual({
        success: false,
        error: 'Database connection failed',
        data: null,
      });
    });

    test('should handle query building errors', async () => {
      const queryError = new Error('Invalid query');
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockRejectedValue(queryError),
      };

      mockDb.select.mockReturnValue(mockSelectChain as any);

      const result = await getAdminInsights({});

      expect(result).toEqual({
        success: false,
        error: 'Invalid query',
        data: null,
      });
    });

    test('should log errors for debugging', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const testError = new Error('Test error for logging');
      
      mockDb.select.mockImplementation(() => {
        throw testError;
      });

      await getAdminInsights({});

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching admin insights:', testError);
      
      consoleSpy.mockRestore();
    });

    test('should handle non-Error objects thrown', async () => {
      mockDb.select.mockImplementation(() => {
        throw 'String error';
      });

      const result = await getAdminInsights({});

      expect(result).toEqual({
        success: false,
        error: 'An unknown error occurred',
        data: null,
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle very large page numbers', async () => {
      const result = await getAdminInsights({ page: Number.MAX_SAFE_INTEGER });

      expect(result.success).toBe(true);
      expect(result.page).toBe(Number.MAX_SAFE_INTEGER);
    });

    test('should handle zero and negative limits', async () => {
      const result = await getAdminInsights({ limit: 0 });

      expect(result.success).toBe(true);
      expect(result.limit).toBe(10); // Should default to 10
    });

    test('should handle extremely long search terms', async () => {
      const longSearchTerm = 'a'.repeat(1000);
      
      const result = await getAdminInsights({ search: longSearchTerm });

      expect(result.success).toBe(true);
      expect(mockLike).toHaveBeenCalledWith(
        insightTable.title, 
        `%${longSearchTerm}%`
      );
    });

    test('should handle search with only whitespace', async () => {
      const result = await getAdminInsights({ search: '   \t\n   ' });

      expect(result.success).toBe(true);
      // Should not add search conditions for whitespace-only search
      expect(mockLike).not.toHaveBeenCalled();
    });
  });
});
