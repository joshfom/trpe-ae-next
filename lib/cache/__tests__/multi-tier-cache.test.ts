import { MultiTierCache, CacheUtils, type MultiTierCacheConfig } from '../multi-tier-cache';

// Mock the individual cache components
jest.mock('../memory-cache', () => ({
  MemoryCache: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    invalidateByTags: jest.fn(),
    clear: jest.fn(),
    getStats: jest.fn().mockReturnValue({
      totalEntries: 10,
      hitRate: 0.8,
      missRate: 0.2,
      memoryUsage: 1024,
      avgResponseTime: 5,
      evictionCount: 2,
      expiredCount: 1,
    }),
    destroy: jest.fn(),
  })),
}));

jest.mock('../disk-cache', () => ({
  DiskCache: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    invalidateKey: jest.fn(),
    invalidateByTags: jest.fn(),
    getHealthMetrics: jest.fn().mockReturnValue({
      totalRequests: 100,
      successfulRequests: 95,
      failedRequests: 5,
      failureRate: 0.05,
      avgResponseTime: 50,
      isHealthy: true,
    }),
    onHealthAlert: jest.fn(),
  })),
}));

jest.mock('../query-optimizer', () => ({
  QueryOptimizer: jest.fn().mockImplementation(() => ({
    optimizePropertyQueries: jest.fn(),
    optimizeCommunityQueries: jest.fn(),
    optimizeInsightQueries: jest.fn(),
    invalidateCache: jest.fn(),
    clearMetrics: jest.fn(),
    getCacheStats: jest.fn().mockReturnValue({
      size: 50,
      hitRate: 0.7,
      totalHits: 350,
      memoryUsage: 2048,
    }),
    onSlowQuery: jest.fn(),
  })),
}));

describe('MultiTierCache', () => {
  let multiTierCache: MultiTierCache;
  let config: MultiTierCacheConfig;
  let mockMemoryCache: any;
  let mockDiskCache: any;
  let mockQueryOptimizer: any;

  beforeEach(() => {
    config = {
      memory: {
        maxSize: 100,
        defaultTTL: 60000,
        cleanupInterval: 30000,
        enableStats: true,
      },
      disk: {
        defaultTTL: 300,
        enableHealthMonitoring: true,
        maxRetries: 3,
        retryDelay: 1000,
        alertThreshold: 0.1,
      },
      query: {
        slowQueryThreshold: 1000,
        batchSize: 10,
        batchTimeout: 100,
        enableQueryCache: true,
        cacheTimeout: 300000,
        enablePerformanceMonitoring: true,
        connectionPoolSize: 10,
      },
      enableFallback: true,
      enableMetrics: true,
    };

    multiTierCache = new MultiTierCache(config);
    
    // Get references to the mocked instances
    mockMemoryCache = multiTierCache['memoryCache'];
    mockDiskCache = multiTierCache['diskCache'];
    mockQueryOptimizer = multiTierCache['queryOptimizer'];
  });

  afterEach(() => {
    multiTierCache.destroy();
    jest.clearAllMocks();
  });

  describe('Multi-tier Get Operation', () => {
    it('should return data from memory cache when available', async () => {
      const testData = { id: '1', name: 'Test Data' };
      mockMemoryCache.get.mockReturnValue(testData);

      const fetcher = jest.fn().mockResolvedValue('should not be called');
      const result = await multiTierCache.get('test-key', fetcher);

      expect(result).toEqual(testData);
      expect(mockMemoryCache.get).toHaveBeenCalledWith('test-key');
      expect(fetcher).not.toHaveBeenCalled();
      expect(mockDiskCache.get).not.toHaveBeenCalled();
    });

    it('should fallback to disk cache when memory cache misses', async () => {
      const testData = { id: '1', name: 'Test Data' };
      mockMemoryCache.get.mockReturnValue(null);
      mockDiskCache.get.mockResolvedValue(testData);

      const fetcher = jest.fn().mockResolvedValue(testData);
      const result = await multiTierCache.get('test-key', fetcher, {
        tags: ['tag1'],
        diskTTL: 600,
      });

      expect(result).toEqual(testData);
      expect(mockMemoryCache.get).toHaveBeenCalledWith('test-key');
      expect(mockDiskCache.get).toHaveBeenCalledWith('test-key', fetcher, {
        tags: ['tag1'],
        ttl: 600,
        fallback: undefined,
      });
      expect(mockMemoryCache.set).toHaveBeenCalledWith('test-key', testData, undefined, ['tag1']);
    });

    it('should fallback to direct fetcher when disk cache fails', async () => {
      const testData = { id: '1', name: 'Test Data' };
      mockMemoryCache.get.mockReturnValue(null);
      mockDiskCache.get.mockRejectedValue(new Error('Disk cache failed'));

      const fetcher = jest.fn().mockResolvedValue(testData);
      const result = await multiTierCache.get('test-key', fetcher);

      expect(result).toEqual(testData);
      expect(fetcher).toHaveBeenCalled();
      expect(mockMemoryCache.set).toHaveBeenCalledWith('test-key', testData, undefined, undefined);
    });

    it('should throw error when fallback is disabled and disk cache fails', async () => {
      const fallbackDisabledCache = new MultiTierCache({
        ...config,
        enableFallback: false,
      });

      const mockMemoryCacheFallback = fallbackDisabledCache['memoryCache'];
      const mockDiskCacheFallback = fallbackDisabledCache['diskCache'];

      mockMemoryCacheFallback.get.mockReturnValue(null);
      mockDiskCacheFallback.get.mockRejectedValue(new Error('Disk cache failed'));

      const fetcher = jest.fn().mockResolvedValue('should not be called');

      await expect(fallbackDisabledCache.get('test-key', fetcher)).rejects.toThrow('Disk cache failed');
      expect(fetcher).not.toHaveBeenCalled();

      fallbackDisabledCache.destroy();
    });
  });

  describe('Set Operation', () => {
    it('should set data in both memory and disk cache', async () => {
      const testData = { id: '1', name: 'Test Data' };
      mockDiskCache.get.mockResolvedValue(testData);

      await multiTierCache.set('test-key', testData, {
        memoryTTL: 60000,
        diskTTL: 300,
        tags: ['tag1'],
      });

      expect(mockMemoryCache.set).toHaveBeenCalledWith('test-key', testData, 60000, ['tag1']);
      expect(mockDiskCache.get).toHaveBeenCalledWith('test-key', expect.any(Function), {
        tags: ['tag1'],
        ttl: 300,
      });
    });

    it('should handle memory cache set failures gracefully', async () => {
      const testData = { id: '1', name: 'Test Data' };
      mockMemoryCache.set.mockImplementation(() => {
        throw new Error('Memory cache set failed');
      });
      mockDiskCache.get.mockResolvedValue(testData);

      // Should not throw error
      await expect(multiTierCache.set('test-key', testData)).resolves.toBeUndefined();
    });
  });

  describe('Delete Operation', () => {
    it('should delete from both memory and disk cache', async () => {
      mockDiskCache.invalidateKey.mockResolvedValue(undefined);

      await multiTierCache.delete('test-key');

      expect(mockMemoryCache.delete).toHaveBeenCalledWith('test-key');
      expect(mockDiskCache.invalidateKey).toHaveBeenCalledWith('test-key');
    });

    it('should handle disk cache delete failures gracefully', async () => {
      mockDiskCache.invalidateKey.mockRejectedValue(new Error('Disk delete failed'));

      // Should not throw error
      await expect(multiTierCache.delete('test-key')).resolves.toBeUndefined();
      expect(mockMemoryCache.delete).toHaveBeenCalledWith('test-key');
    });
  });

  describe('Tag-based Invalidation', () => {
    it('should invalidate by tags across all cache tiers', async () => {
      const tags = ['tag1', 'tag2'];
      mockDiskCache.invalidateByTags.mockResolvedValue(undefined);

      await multiTierCache.invalidateByTags(tags);

      expect(mockMemoryCache.invalidateByTags).toHaveBeenCalledWith(tags);
      expect(mockDiskCache.invalidateByTags).toHaveBeenCalledWith(tags);
      expect(mockQueryOptimizer.invalidateCache).toHaveBeenCalledWith('tag1');
      expect(mockQueryOptimizer.invalidateCache).toHaveBeenCalledWith('tag2');
    });

    it('should handle disk cache invalidation failures gracefully', async () => {
      mockDiskCache.invalidateByTags.mockRejectedValue(new Error('Disk invalidation failed'));

      // Should not throw error
      await expect(multiTierCache.invalidateByTags(['tag1'])).resolves.toBeUndefined();
    });
  });

  describe('Cache Warming', () => {
    it('should warm cache with provided data', async () => {
      const testData1 = { id: '1', name: 'Data 1' };
      const testData2 = { id: '2', name: 'Data 2' };

      mockMemoryCache.get.mockReturnValue(null);
      mockDiskCache.get
        .mockResolvedValueOnce(testData1)
        .mockResolvedValueOnce(testData2);

      const warmupData = [
        {
          key: 'key1',
          fetcher: jest.fn().mockResolvedValue(testData1),
          options: { tags: ['tag1'] },
        },
        {
          key: 'key2',
          fetcher: jest.fn().mockResolvedValue(testData2),
        },
      ];

      await multiTierCache.warmCache(warmupData);

      expect(mockDiskCache.get).toHaveBeenCalledTimes(2);
    });

    it('should handle warmup failures gracefully', async () => {
      mockMemoryCache.get.mockReturnValue(null);
      mockDiskCache.get.mockRejectedValue(new Error('Warmup failed'));

      const warmupData = [
        {
          key: 'key1',
          fetcher: jest.fn().mockRejectedValue(new Error('Fetch failed')),
        },
      ];

      // Should not throw error
      await expect(multiTierCache.warmCache(warmupData)).resolves.toBeUndefined();
    });
  });

  describe('Optimized Data Retrieval', () => {
    it('should get properties with multi-tier caching', async () => {
      const properties = [{ id: '1', name: 'Property 1' }];
      const filters = { communityId: 'community-123' };

      mockMemoryCache.get.mockReturnValue(null);
      mockDiskCache.get.mockImplementation(async (key, fetcher) => {
        return await fetcher();
      });
      mockQueryOptimizer.optimizePropertyQueries.mockResolvedValue(properties);

      const result = await multiTierCache.getProperties(filters);

      expect(result).toEqual(properties);
      expect(mockQueryOptimizer.optimizePropertyQueries).toHaveBeenCalledWith(filters);
    });

    it('should get communities with multi-tier caching', async () => {
      const communities = [{ id: '1', name: 'Community 1' }];
      const params = { cityId: 'city-123' };

      mockMemoryCache.get.mockReturnValue(null);
      mockDiskCache.get.mockImplementation(async (key, fetcher) => {
        return await fetcher();
      });
      mockQueryOptimizer.optimizeCommunityQueries.mockResolvedValue(communities);

      const result = await multiTierCache.getCommunities(params);

      expect(result).toEqual(communities);
      expect(mockQueryOptimizer.optimizeCommunityQueries).toHaveBeenCalledWith(params);
    });

    it('should get insights with multi-tier caching', async () => {
      const insights = { data: [{ id: '1', title: 'Insight 1' }], total: 1 };
      const pagination = { page: 1, limit: 10 };

      mockMemoryCache.get.mockReturnValue(null);
      mockDiskCache.get.mockImplementation(async (key, fetcher) => {
        return await fetcher();
      });
      mockQueryOptimizer.optimizeInsightQueries.mockResolvedValue(insights);

      const result = await multiTierCache.getInsights(pagination);

      expect(result).toEqual(insights);
      expect(mockQueryOptimizer.optimizeInsightQueries).toHaveBeenCalledWith(pagination);
    });
  });

  describe('Batch Operations', () => {
    it('should perform batch get operations', async () => {
      const operations = [
        {
          key: 'key1',
          fetcher: jest.fn().mockResolvedValue('data1'),
        },
        {
          key: 'key2',
          fetcher: jest.fn().mockResolvedValue('data2'),
        },
      ];

      mockMemoryCache.get.mockReturnValue(null);
      mockDiskCache.get.mockImplementation(async (key, fetcher) => {
        return await fetcher();
      });

      const results = await multiTierCache.batchGet(operations);

      expect(results.size).toBe(2);
      expect(results.get('key1')).toBe('data1');
      expect(results.get('key2')).toBe('data2');
    });

    it('should handle batch operation failures', async () => {
      const operations = [
        {
          key: 'key1',
          fetcher: jest.fn().mockResolvedValue('data1'),
        },
        {
          key: 'key2',
          fetcher: jest.fn().mockRejectedValue(new Error('Fetch failed')),
        },
      ];

      mockMemoryCache.get.mockReturnValue(null);
      mockDiskCache.get.mockImplementation(async (key, fetcher) => {
        return await fetcher();
      });

      await expect(multiTierCache.batchGet(operations)).rejects.toThrow('Fetch failed');
    });
  });

  describe('Statistics', () => {
    it('should provide comprehensive cache statistics', () => {
      // Simulate some cache operations
      multiTierCache['overallStats'] = {
        totalRequests: 100,
        cacheHits: 80,
        totalResponseTime: 5000,
        errors: 2,
      };

      const stats = multiTierCache.getStats();

      expect(stats.memory.totalEntries).toBe(10);
      expect(stats.memory.hitRate).toBe(0.8);
      expect(stats.disk.isHealthy).toBe(true);
      expect(stats.query.size).toBe(50);
      expect(stats.overall.totalRequests).toBe(100);
      expect(stats.overall.cacheHitRate).toBe(0.8);
      expect(stats.overall.avgResponseTime).toBe(50);
      expect(stats.overall.errorRate).toBe(0.02);
    });
  });

  describe('Health Monitoring', () => {
    it('should setup health monitoring', () => {
      multiTierCache.setupHealthMonitoring();

      expect(mockDiskCache.onHealthAlert).toHaveBeenCalled();
      expect(mockQueryOptimizer.onSlowQuery).toHaveBeenCalled();
    });
  });

  describe('Clear Operation', () => {
    it('should clear all cache tiers', async () => {
      await multiTierCache.clear();

      expect(mockMemoryCache.clear).toHaveBeenCalled();
      expect(mockQueryOptimizer.clearMetrics).toHaveBeenCalled();
    });
  });

  describe('Destroy Operation', () => {
    it('should cleanup resources', () => {
      multiTierCache.destroy();

      expect(mockMemoryCache.destroy).toHaveBeenCalled();
    });
  });
});

describe('CacheUtils', () => {
  describe('Key Generation', () => {
    it('should generate property keys', () => {
      const key = CacheUtils.propertyKey('123', { filter: 'luxury' });
      expect(key).toBe('property:123:[{"filter":"luxury"}]');
    });

    it('should generate community keys', () => {
      const key = CacheUtils.communityKey('456', { type: 'residential' });
      expect(key).toBe('community:456:[{"type":"residential"}]');
    });

    it('should generate search keys', () => {
      const key = CacheUtils.searchKey('properties', 'dubai', { price: '1M+' });
      expect(key).toBe('search:properties:dubai:{"price":"1M+"}');
    });

    it('should generate user keys', () => {
      const key = CacheUtils.userKey('user123', 'preferences', { theme: 'dark' });
      expect(key).toBe('user:user123:preferences:[{"theme":"dark"}]');
    });

    it('should generate paginated keys', () => {
      const key = CacheUtils.paginatedKey('properties', 1, 20, { sort: 'price' });
      expect(key).toBe('paginated:properties:1:20:[{"sort":"price"}]');
    });
  });
});