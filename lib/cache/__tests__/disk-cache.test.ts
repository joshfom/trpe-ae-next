import { DiskCache, CacheKeyGenerators, CacheTags, type DiskCacheConfig } from '../disk-cache';

// Mock Next.js cache functions
jest.mock('next/cache', () => ({
  unstable_cache: jest.fn(),
  revalidateTag: jest.fn(),
}));

import { unstable_cache, revalidateTag } from 'next/cache';

describe('DiskCache', () => {
  let diskCache: DiskCache;
  let config: DiskCacheConfig;

  beforeEach(() => {
    config = {
      defaultTTL: 300,
      enableHealthMonitoring: true,
      maxRetries: 2,
      retryDelay: 100,
      alertThreshold: 0.1,
    };
    diskCache = new DiskCache(config);
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('createCachedFunction', () => {
    it('should create a cached function with proper configuration', async () => {
      const mockFetcher = jest.fn().mockResolvedValue('test-result');
      const mockKeyGenerator = jest.fn().mockReturnValue('test-key');
      const mockCachedFn = jest.fn().mockResolvedValue('cached-result');
      
      (unstable_cache as any).mockReturnValue(mockCachedFn);

      const cachedFunction = diskCache.createCachedFunction(mockFetcher, {
        keyGenerator: mockKeyGenerator,
        tags: ['tag1', 'tag2'],
        ttl: 600,
      });

      const result = await cachedFunction('arg1', 'arg2');

      expect(unstable_cache).toHaveBeenCalledWith(
        expect.any(Function),
        undefined,
        {
          tags: ['tag1', 'tag2', 'test-key'],
          revalidate: 600,
        }
      );
      expect(result).toBe('cached-result');
    });

    it('should handle function execution errors with retry', async () => {
      const mockFetcher = jest.fn()
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockRejectedValueOnce(new Error('Second attempt failed'))
        .mockResolvedValue('success-result');
      
      const mockKeyGenerator = jest.fn().mockReturnValue('test-key');
      
      // Mock unstable_cache to call the wrapped function directly
      (unstable_cache as any).mockImplementation((fn: any) => fn);

      const cachedFunction = diskCache.createCachedFunction(mockFetcher, {
        keyGenerator: mockKeyGenerator,
      });

      const result = await cachedFunction('arg1');

      expect(mockFetcher).toHaveBeenCalledTimes(3);
      expect(result).toBe('success-result');
    });

    it('should use fallback when main function fails', async () => {
      const mockFetcher = jest.fn().mockRejectedValue(new Error('Main function failed'));
      const mockFallback = jest.fn().mockResolvedValue('fallback-result');
      const mockKeyGenerator = jest.fn().mockReturnValue('test-key');
      
      (unstable_cache as any).mockImplementation((fn: any) => fn);

      const cachedFunction = diskCache.createCachedFunction(mockFetcher, {
        keyGenerator: mockKeyGenerator,
        fallback: mockFallback,
      });

      const result = await cachedFunction('arg1');

      expect(mockFetcher).toHaveBeenCalledTimes(3); // Original + 2 retries
      expect(mockFallback).toHaveBeenCalledWith('arg1');
      expect(result).toBe('fallback-result');
    });

    it('should throw error when both main function and fallback fail', async () => {
      const mockFetcher = jest.fn().mockRejectedValue(new Error('Main function failed'));
      const mockFallback = jest.fn().mockRejectedValue(new Error('Fallback failed'));
      const mockKeyGenerator = jest.fn().mockReturnValue('test-key');
      
      (unstable_cache as any).mockImplementation((fn: any) => fn);

      const cachedFunction = diskCache.createCachedFunction(mockFetcher, {
        keyGenerator: mockKeyGenerator,
        fallback: mockFallback,
      });

      await expect(cachedFunction('arg1')).rejects.toThrow('Main function failed');
    });
  });

  describe('get method', () => {
    it('should get cached data with proper configuration', async () => {
      const mockFetcher = jest.fn().mockResolvedValue('fetched-data');
      const mockCachedFn = jest.fn().mockResolvedValue('cached-data');
      
      (unstable_cache as any).mockReturnValue(mockCachedFn);

      const result = await diskCache.get('test-key', mockFetcher, {
        tags: ['tag1'],
        ttl: 600,
      });

      expect(unstable_cache).toHaveBeenCalledWith(
        mockFetcher,
        ['test-key'],
        {
          tags: ['tag1', 'test-key'],
          revalidate: 600,
        }
      );
      expect(result).toBe('cached-data');
    });

    it('should use default options when not provided', async () => {
      const mockFetcher = jest.fn().mockResolvedValue('fetched-data');
      const mockCachedFn = jest.fn().mockResolvedValue('cached-data');
      
      (unstable_cache as any).mockReturnValue(mockCachedFn);

      await diskCache.get('test-key', mockFetcher);

      expect(unstable_cache).toHaveBeenCalledWith(
        mockFetcher,
        ['test-key'],
        {
          tags: ['test-key'],
          revalidate: 300, // default TTL
        }
      );
    });

    it('should handle errors with fallback', async () => {
      const mockFetcher = jest.fn().mockRejectedValue(new Error('Fetch failed'));
      const mockFallback = jest.fn().mockResolvedValue('fallback-data');
      
      (unstable_cache as any).mockImplementation((fn: any) => fn);

      const result = await diskCache.get('test-key', mockFetcher, {
        fallback: mockFallback,
      });

      expect(result).toBe('fallback-data');
    });
  });

  describe('Cache Invalidation', () => {
    it('should invalidate cache by tags', async () => {
      await diskCache.invalidateByTags(['tag1', 'tag2']);

      expect(revalidateTag).toHaveBeenCalledWith('tag1');
      expect(revalidateTag).toHaveBeenCalledWith('tag2');
    });

    it('should invalidate specific cache key', async () => {
      await diskCache.invalidateKey('test-key');

      expect(revalidateTag).toHaveBeenCalledWith('test-key');
    });

    it('should handle invalidation errors', async () => {
      (revalidateTag as any).mockImplementation(() => {
        throw new Error('Invalidation failed');
      });

      await expect(diskCache.invalidateByTags(['tag1'])).rejects.toThrow('Invalidation failed');
    });
  });

  describe('Cache Warming', () => {
    it('should warm cache with provided data', async () => {
      const mockFetcher1 = jest.fn().mockResolvedValue('data1');
      const mockFetcher2 = jest.fn().mockResolvedValue('data2');
      const mockCachedFn = jest.fn().mockImplementation((fn: any) => fn());
      
      (unstable_cache as any).mockReturnValue(mockCachedFn);

      const warmupData = [
        {
          key: 'key1',
          fetcher: mockFetcher1,
          tags: ['tag1'],
          ttl: 600,
        },
        {
          key: 'key2',
          fetcher: mockFetcher2,
        },
      ];

      await diskCache.warmCache(warmupData);

      expect(mockFetcher1).toHaveBeenCalled();
      expect(mockFetcher2).toHaveBeenCalled();
    });

    it('should handle warmup failures gracefully', async () => {
      const mockFetcher1 = jest.fn().mockResolvedValue('data1');
      const mockFetcher2 = jest.fn().mockRejectedValue(new Error('Fetch failed'));
      const mockCachedFn = jest.fn().mockImplementation((fn: any) => fn());
      
      (unstable_cache as any).mockReturnValue(mockCachedFn);

      const warmupData = [
        { key: 'key1', fetcher: mockFetcher1 },
        { key: 'key2', fetcher: mockFetcher2 },
      ];

      // Should not throw error
      await expect(diskCache.warmCache(warmupData)).resolves.toBeUndefined();
    });
  });

  describe('Health Monitoring', () => {
    it('should track successful operations', async () => {
      const mockFetcher = jest.fn().mockResolvedValue('data');
      const mockCachedFn = jest.fn().mockResolvedValue('cached-data');
      
      (unstable_cache as any).mockReturnValue(mockCachedFn);

      await diskCache.get('test-key', mockFetcher);

      const metrics = diskCache.getHealthMetrics();
      expect(metrics.totalRequests).toBe(1);
      expect(metrics.successfulRequests).toBe(1);
      expect(metrics.failedRequests).toBe(0);
      expect(metrics.isHealthy).toBe(true);
    });

    it('should track failed operations', async () => {
      const mockFetcher = jest.fn().mockRejectedValue(new Error('Fetch failed'));
      
      (unstable_cache as any).mockImplementation((fn: any) => fn);

      try {
        await diskCache.get('test-key', mockFetcher);
      } catch (error) {
        // Expected to fail
      }

      const metrics = diskCache.getHealthMetrics();
      expect(metrics.totalRequests).toBe(1);
      expect(metrics.successfulRequests).toBe(0);
      expect(metrics.failedRequests).toBe(1);
      expect(metrics.failureRate).toBe(1);
    });

    it('should trigger health alerts when threshold exceeded', async () => {
      const alertCallback = jest.fn();
      diskCache.onHealthAlert(alertCallback);

      const mockFetcher = jest.fn().mockRejectedValue(new Error('Fetch failed'));
      (unstable_cache as any).mockImplementation((fn: any) => fn);

      // Generate enough failures to exceed threshold
      for (let i = 0; i < 5; i++) {
        try {
          await diskCache.get(`test-key-${i}`, mockFetcher);
        } catch (error) {
          // Expected to fail
        }
      }

      expect(alertCallback).toHaveBeenCalled();
      const callArgs = alertCallback.mock.calls[0][0];
      expect(callArgs.isHealthy).toBe(false);
    });

    it('should manage health alert callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      diskCache.onHealthAlert(callback1);
      diskCache.onHealthAlert(callback2);

      diskCache.removeHealthAlert(callback1);

      // Only callback2 should remain
      expect(diskCache['alertCallbacks']).toContain(callback2);
      expect(diskCache['alertCallbacks']).not.toContain(callback1);
    });

    it('should reset health metrics', () => {
      const mockFetcher = jest.fn().mockResolvedValue('data');
      const mockCachedFn = jest.fn().mockResolvedValue('cached-data');
      
      (unstable_cache as any).mockReturnValue(mockCachedFn);

      // Generate some metrics
      diskCache.get('test-key', mockFetcher);

      diskCache.resetHealthMetrics();

      const metrics = diskCache.getHealthMetrics();
      expect(metrics.totalRequests).toBe(0);
      expect(metrics.successfulRequests).toBe(0);
      expect(metrics.failedRequests).toBe(0);
    });
  });

  describe('CacheKeyGenerators', () => {
    it('should generate property keys', () => {
      const key = CacheKeyGenerators.property('123', { filter: 'luxury' });
      expect(key).toBe('property:123:[{"filter":"luxury"}]');
    });

    it('should generate community keys', () => {
      const key = CacheKeyGenerators.community('456', { type: 'residential' });
      expect(key).toBe('community:456:[{"type":"residential"}]');
    });

    it('should generate search keys', () => {
      const key = CacheKeyGenerators.search('properties', 'dubai', { price: '1M+' });
      expect(key).toBe('search:properties:dubai:{"price":"1M+"}');
    });

    it('should generate user keys', () => {
      const key = CacheKeyGenerators.user('user123', 'preferences', { theme: 'dark' });
      expect(key).toBe('user:user123:preferences:[{"theme":"dark"}]');
    });

    it('should generate paginated keys', () => {
      const key = CacheKeyGenerators.paginated('properties', 1, 20, { sort: 'price' });
      expect(key).toBe('paginated:properties:1:20:[{"sort":"price"}]');
    });

    it('should generate timestamped keys', () => {
      const now = Date.now();
      const expectedTimestamp = Math.floor(now / (5 * 60 * 1000));
      
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      const key = CacheKeyGenerators.timestamped('analytics', 5);
      expect(key).toBe(`analytics:${expectedTimestamp}`);
      
      jest.restoreAllMocks();
    });
  });

  describe('CacheTags', () => {
    it('should provide predefined cache tags', () => {
      expect(CacheTags.PROPERTIES).toBe('properties');
      expect(CacheTags.COMMUNITIES).toBe('communities');
      expect(CacheTags.AGENTS).toBe('agents');
      expect(CacheTags.INSIGHTS).toBe('insights');
      expect(CacheTags.SEARCH).toBe('search');
      expect(CacheTags.USER_DATA).toBe('user-data');
      expect(CacheTags.METADATA).toBe('metadata');
      expect(CacheTags.IMAGES).toBe('images');
      expect(CacheTags.ANALYTICS).toBe('analytics');
    });
  });
});