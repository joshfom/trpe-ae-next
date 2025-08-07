import { QueryOptimizer, type QueryOptimizerConfig } from '../query-optimizer';

// Mock the database connection
jest.mock('@/db/drizzle', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  },
}));

jest.mock('drizzle-orm', () => ({
  sql: jest.fn((strings, ...values) => ({
    toString: () => strings.join('?'),
    strings,
    values,
  })),
}));

describe('QueryOptimizer', () => {
  let queryOptimizer: QueryOptimizer;
  let config: QueryOptimizerConfig;

  beforeEach(() => {
    config = {
      slowQueryThreshold: 100,
      batchSize: 3,
      batchTimeout: 50,
      enableQueryCache: true,
      cacheTimeout: 1000,
      enablePerformanceMonitoring: true,
      connectionPoolSize: 5,
    };
    queryOptimizer = new QueryOptimizer(config);
  });

  afterEach(() => {
    queryOptimizer.clearMetrics();
  });

  describe('Property Query Optimization', () => {
    it('should optimize property queries with filters', async () => {
      const mockQuery = {
        execute: jest.fn().mockResolvedValue([
          { id: '1', name: 'Property 1' },
          { id: '2', name: 'Property 2' },
        ]),
      };

      // Mock the query builder chain
      const { db } = await import('@/db/drizzle');
      (db.select as any).mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                  limit: jest.fn().mockReturnValue({
                    offset: jest.fn().mockReturnValue(mockQuery),
                  }),
                }),
              }),
            }),
          }),
        }),
      });

      const filters = {
        communityId: 'community-123',
        propertyType: 'apartment',
        priceRange: { min: 100000, max: 500000 },
        bedrooms: 2,
        limit: 10,
        offset: 0,
      };

      const result = await queryOptimizer.optimizePropertyQueries(filters);

      expect(result).toHaveLength(2);
      expect(mockQuery.execute).toHaveBeenCalled();
    });

    it('should cache property query results', async () => {
      const mockQuery = {
        execute: jest.fn().mockResolvedValue([{ id: '1', name: 'Property 1' }]),
      };

      const { db } = await import('@/db/drizzle');
      (db.select as any).mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnValue(mockQuery),
            }),
          }),
        }),
      });

      const filters = { communityId: 'community-123' };

      // First call should execute query
      const result1 = await queryOptimizer.optimizePropertyQueries(filters);
      expect(mockQuery.execute).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const result2 = await queryOptimizer.optimizePropertyQueries(filters);
      expect(mockQuery.execute).toHaveBeenCalledTimes(1); // Still 1, not 2
      expect(result1).toEqual(result2);
    });

    it('should handle property query errors', async () => {
      const mockQuery = {
        execute: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      const { db } = await import('@/db/drizzle');
      (db.select as any).mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnValue(mockQuery),
            }),
          }),
        }),
      });

      const filters = { communityId: 'community-123' };

      await expect(queryOptimizer.optimizePropertyQueries(filters)).rejects.toThrow('Database error');

      const metrics = queryOptimizer.getPerformanceMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].rowsAffected).toBe(0);
    });
  });

  describe('Community Query Optimization', () => {
    it('should optimize community queries with parameters', async () => {
      const mockQuery = {
        execute: jest.fn().mockResolvedValue([
          { id: '1', name: 'Community 1' },
          { id: '2', name: 'Community 2' },
        ]),
      };

      const { db } = await import('@/db/drizzle');
      (db.select as any).mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                  limit: jest.fn().mockReturnValue({
                    offset: jest.fn().mockReturnValue(mockQuery),
                  }),
                }),
              }),
            }),
          }),
        }),
      });

      const params = {
        cityId: 'city-123',
        luxeOnly: true,
        withProperties: true,
        withSubCommunities: true,
        limit: 5,
      };

      const result = await queryOptimizer.optimizeCommunityQueries(params);

      expect(result).toHaveLength(2);
      expect(mockQuery.execute).toHaveBeenCalled();
    });

    it('should cache community query results', async () => {
      const mockQuery = {
        execute: jest.fn().mockResolvedValue([{ id: '1', name: 'Community 1' }]),
      };

      const { db } = await import('@/db/drizzle');
      (db.select as any).mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue(mockQuery),
          }),
        }),
      });

      const params = { cityId: 'city-123' };

      // First call
      await queryOptimizer.optimizeCommunityQueries(params);
      expect(mockQuery.execute).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await queryOptimizer.optimizeCommunityQueries(params);
      expect(mockQuery.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('Insight Query Optimization', () => {
    it('should optimize insight queries with pagination', async () => {
      const mockDataQuery = {
        execute: jest.fn().mockResolvedValue([
          { id: '1', title: 'Insight 1' },
          { id: '2', title: 'Insight 2' },
        ]),
      };

      const mockCountQuery = {
        execute: jest.fn().mockResolvedValue([{ count: 10 }]),
      };

      const { db } = await import('@/db/drizzle');
      (db.select as any)
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                  orderBy: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                      offset: jest.fn().mockReturnValue(mockDataQuery),
                    }),
                  }),
                }),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue(mockCountQuery),
          }),
        });

      const pagination = {
        page: 1,
        limit: 10,
        category: 'market-analysis',
        published: true,
      };

      const result = await queryOptimizer.optimizeInsightQueries(pagination);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(10);
      expect(mockDataQuery.execute).toHaveBeenCalled();
      expect(mockCountQuery.execute).toHaveBeenCalled();
    });

    it('should cache insight query results', async () => {
      const mockDataQuery = {
        execute: jest.fn().mockResolvedValue([{ id: '1', title: 'Insight 1' }]),
      };

      const mockCountQuery = {
        execute: jest.fn().mockResolvedValue([{ count: 5 }]),
      };

      const { db } = await import('@/db/drizzle');
      (db.select as any)
        .mockReturnValue({
          from: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockReturnValue({
                  limit: jest.fn().mockReturnValue({
                    offset: jest.fn().mockReturnValue(mockDataQuery),
                  }),
                }),
              }),
            }),
          }),
        })
        .mockReturnValue({
          from: jest.fn().mockReturnValue(mockCountQuery),
        });

      const pagination = { page: 1, limit: 10 };

      // First call
      await queryOptimizer.optimizeInsightQueries(pagination);
      expect(mockDataQuery.execute).toHaveBeenCalledTimes(1);
      expect(mockCountQuery.execute).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await queryOptimizer.optimizeInsightQueries(pagination);
      expect(mockDataQuery.execute).toHaveBeenCalledTimes(1);
      expect(mockCountQuery.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('Query Batching', () => {
    it('should batch multiple queries efficiently', async () => {
      const queries = [
        {
          id: 'query1',
          query: jest.fn().mockResolvedValue('result1'),
          priority: 1,
        },
        {
          id: 'query2',
          query: jest.fn().mockResolvedValue('result2'),
          priority: 2,
        },
        {
          id: 'query3',
          query: jest.fn().mockResolvedValue('result3'),
          priority: 1,
        },
      ];

      const results = await queryOptimizer.batchQueries(queries);

      expect(results.size).toBe(3);
      expect(results.get('query1')).toBe('result1');
      expect(results.get('query2')).toBe('result2');
      expect(results.get('query3')).toBe('result3');

      // All queries should have been executed
      queries.forEach(({ query }) => {
        expect(query).toHaveBeenCalled();
      });
    });

    it('should handle batch query errors', async () => {
      const queries = [
        {
          id: 'query1',
          query: jest.fn().mockResolvedValue('result1'),
        },
        {
          id: 'query2',
          query: jest.fn().mockRejectedValue(new Error('Query failed')),
        },
      ];

      await expect(queryOptimizer.batchQueries(queries)).rejects.toThrow('Query failed');
    });

    it('should add queries to batch queue', async () => {
      const mockQuery = jest.fn().mockResolvedValue('batched-result');

      const promise = queryOptimizer.addToBatch(mockQuery, 1);

      // Wait for batch timeout
      await new Promise(resolve => setTimeout(resolve, 60));

      const result = await promise;
      expect(result).toBe('batched-result');
      expect(mockQuery).toHaveBeenCalled();
    });

    it('should process batch immediately when full', async () => {
      const queries = Array.from({ length: 3 }, (_, i) => 
        jest.fn().mockResolvedValue(`result${i}`)
      );

      const promises = queries.map((query, i) => 
        queryOptimizer.addToBatch(query, i)
      );

      const results = await Promise.all(promises);

      expect(results).toEqual(['result0', 'result1', 'result2']);
      queries.forEach(query => {
        expect(query).toHaveBeenCalled();
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should record performance metrics', async () => {
      const mockQuery = {
        execute: jest.fn().mockResolvedValue([{ id: '1' }, { id: '2' }]),
      };

      const { db } = await import('@/db/drizzle');
      (db.select as any).mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnValue(mockQuery),
            }),
          }),
        }),
      });

      await queryOptimizer.optimizePropertyQueries({ communityId: 'test' });

      const metrics = queryOptimizer.getPerformanceMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].queryType).toBe('SELECT');
      expect(metrics[0].tableName).toBe('properties');
      expect(metrics[0].rowsAffected).toBe(2);
      expect(metrics[0].cacheHit).toBe(false);
    });

    it('should detect slow queries', async () => {
      const slowQueryCallback = jest.fn();
      queryOptimizer.onSlowQuery(slowQueryCallback);

      const mockQuery = {
        execute: jest.fn().mockImplementation(() => 
          new Promise(resolve => setTimeout(() => resolve([]), 150))
        ),
      };

      const { db } = await import('@/db/drizzle');
      (db.select as any).mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnValue(mockQuery),
            }),
          }),
        }),
      });

      await queryOptimizer.optimizePropertyQueries({ communityId: 'test' });

      expect(slowQueryCallback).toHaveBeenCalled();
      const alert = slowQueryCallback.mock.calls[0][0];
      expect(alert.executionTime).toBeGreaterThan(100);
      expect(alert.threshold).toBe(100);
    });

    it('should clear performance metrics', () => {
      // Add some metrics first
      queryOptimizer['recordMetrics']('test', 50, 1, false, 'SELECT', 'test_table');
      expect(queryOptimizer.getPerformanceMetrics()).toHaveLength(1);

      queryOptimizer.clearMetrics();
      expect(queryOptimizer.getPerformanceMetrics()).toHaveLength(0);
    });
  });

  describe('Cache Management', () => {
    it('should invalidate cache by pattern', () => {
      // Set up some cache entries
      queryOptimizer['setCache']('properties:123', { id: '123' });
      queryOptimizer['setCache']('communities:456', { id: '456' });
      queryOptimizer['setCache']('insights:789', { id: '789' });

      const invalidated = queryOptimizer.invalidateCache('properties:.*');

      expect(invalidated).toBe(1);
      expect(queryOptimizer['getFromCache']('properties:123')).toBeNull();
      expect(queryOptimizer['getFromCache']('communities:456')).not.toBeNull();
    });

    it('should provide cache statistics', () => {
      // Set up cache entries
      queryOptimizer['setCache']('key1', { data: 'value1' });
      queryOptimizer['setCache']('key2', { data: 'value2' });

      // Simulate cache hits
      queryOptimizer['getFromCache']('key1');
      queryOptimizer['getFromCache']('key1');
      queryOptimizer['getFromCache']('key2');

      const stats = queryOptimizer.getCacheStats();

      expect(stats.size).toBe(2);
      expect(stats.totalHits).toBe(3);
      expect(stats.memoryUsage).toBeGreaterThan(0);
    });

    it('should handle cache expiration', async () => {
      const shortTimeoutOptimizer = new QueryOptimizer({
        ...config,
        cacheTimeout: 50, // 50ms
      });

      shortTimeoutOptimizer['setCache']('test-key', { data: 'test-value' });

      // Should be available immediately
      expect(shortTimeoutOptimizer['getFromCache']('test-key')).not.toBeNull();

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 60));

      // Should be expired
      expect(shortTimeoutOptimizer['getFromCache']('test-key')).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty query results', async () => {
      const mockQuery = {
        execute: jest.fn().mockResolvedValue([]),
      };

      const { db } = await import('@/db/drizzle');
      (db.select as any).mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnValue(mockQuery),
            }),
          }),
        }),
      });

      const result = await queryOptimizer.optimizePropertyQueries({});

      expect(result).toEqual([]);
      expect(mockQuery.execute).toHaveBeenCalled();
    });

    it('should handle queries with no filters', async () => {
      const mockQuery = {
        execute: jest.fn().mockResolvedValue([{ id: '1' }]),
      };

      const { db } = await import('@/db/drizzle');
      (db.select as any).mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnValue(mockQuery),
            }),
          }),
        }),
      });

      const result = await queryOptimizer.optimizePropertyQueries({});

      expect(result).toHaveLength(1);
      expect(mockQuery.execute).toHaveBeenCalled();
    });

    it('should handle batch queue with different priorities', async () => {
      const highPriorityQuery = jest.fn().mockResolvedValue('high');
      const lowPriorityQuery = jest.fn().mockResolvedValue('low');

      const promises = [
        queryOptimizer.addToBatch(lowPriorityQuery, 1),
        queryOptimizer.addToBatch(highPriorityQuery, 10),
      ];

      const results = await Promise.all(promises);

      expect(results).toEqual(['low', 'high']);
      expect(highPriorityQuery).toHaveBeenCalled();
      expect(lowPriorityQuery).toHaveBeenCalled();
    });
  });
});