
import { MemoryCache, type MemoryCacheConfig } from '../memory-cache';

describe('MemoryCache', () => {
  let cache: MemoryCache;
  let config: MemoryCacheConfig;

  beforeEach(() => {
    config = {
      maxSize: 3,
      defaultTTL: 1000, // 1 second
      cleanupInterval: 100, // 100ms
      enableStats: true,
    };
    cache = new MemoryCache(config);
  });

  afterEach(() => {
    cache.destroy();
  });

  describe('Basic Operations', () => {
    it('should set and get values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return null for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('should delete values', () => {
      cache.set('key1', 'value1');
      expect(cache.delete('key1')).toBe(true);
      expect(cache.get('key1')).toBeNull();
      expect(cache.delete('key1')).toBe(false);
    });

    it('should check if key exists', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('nonexistent')).toBe(false);
    });

    it('should clear all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      expect(cache.size()).toBe(0);
      expect(cache.get('key1')).toBeNull();
    });

    it('should return correct size', () => {
      expect(cache.size()).toBe(0);
      cache.set('key1', 'value1');
      expect(cache.size()).toBe(1);
      cache.set('key2', 'value2');
      expect(cache.size()).toBe(2);
    });

    it('should return all keys', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      const keys = cache.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys.length).toBe(2);
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should expire entries after TTL', async () => {
      cache.set('key1', 'value1', 50); // 50ms TTL
      expect(cache.get('key1')).toBe('value1');
      
      await new Promise(resolve => setTimeout(resolve, 60));
      expect(cache.get('key1')).toBeNull();
    });

    it('should use default TTL when not specified', async () => {
      cache.set('key1', 'value1'); // Uses default TTL (1000ms)
      expect(cache.get('key1')).toBe('value1');
      
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(cache.get('key1')).toBe('value1'); // Should still exist
    });

    it('should remove expired entries from has() check', async () => {
      cache.set('key1', 'value1', 50);
      expect(cache.has('key1')).toBe(true);
      
      await new Promise(resolve => setTimeout(resolve, 60));
      expect(cache.has('key1')).toBe(false);
    });
  });

  describe('LRU Eviction', () => {
    it('should evict least recently used entry when max size reached', () => {
      // Fill cache to max size
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      // Access key1 to make it recently used
      cache.get('key1');
      
      // Add new entry, should evict key2 (least recently used)
      cache.set('key4', 'value4');
      
      expect(cache.get('key1')).toBe('value1'); // Recently accessed
      expect(cache.get('key2')).toBeNull(); // Should be evicted
      expect(cache.get('key3')).toBe('value3'); // Still exists
      expect(cache.get('key4')).toBe('value4'); // New entry
    });

    it('should not evict when updating existing key', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      // Update existing key - should not trigger eviction
      cache.set('key1', 'updated_value1');
      
      expect(cache.size()).toBe(3);
      expect(cache.get('key1')).toBe('updated_value1');
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key3')).toBe('value3');
    });
  });

  describe('Tag-based Invalidation', () => {
    it('should invalidate entries by tags', () => {
      cache.set('key1', 'value1', undefined, ['tag1', 'tag2']);
      cache.set('key2', 'value2', undefined, ['tag2', 'tag3']);
      cache.set('key3', 'value3', undefined, ['tag3']);
      
      const invalidated = cache.invalidateByTags(['tag2']);
      
      expect(invalidated).toBe(2);
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
      expect(cache.get('key3')).toBe('value3');
    });

    it('should handle empty tags array', () => {
      cache.set('key1', 'value1', undefined, ['tag1']);
      const invalidated = cache.invalidateByTags([]);
      expect(invalidated).toBe(0);
      expect(cache.get('key1')).toBe('value1');
    });

    it('should handle non-matching tags', () => {
      cache.set('key1', 'value1', undefined, ['tag1']);
      const invalidated = cache.invalidateByTags(['tag2']);
      expect(invalidated).toBe(0);
      expect(cache.get('key1')).toBe('value1');
    });
  });

  describe('Statistics', () => {
    it('should track hit and miss rates', () => {
      cache.set('key1', 'value1');
      
      // Generate hits
      cache.get('key1');
      cache.get('key1');
      
      // Generate misses
      cache.get('nonexistent1');
      cache.get('nonexistent2');
      
      const stats = cache.getStats();
      expect(stats.hitRate).toBe(0.5); // 2 hits out of 4 requests
      expect(stats.missRate).toBe(0.5); // 2 misses out of 4 requests
      expect(stats.totalEntries).toBe(1);
    });

    it('should track eviction count', () => {
      // Fill cache beyond max size to trigger evictions
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // Should trigger eviction
      
      const stats = cache.getStats();
      expect(stats.evictionCount).toBe(1);
    });

    it('should track expired count', async () => {
      cache.set('key1', 'value1', 50); // 50ms TTL
      
      await new Promise(resolve => setTimeout(resolve, 60));
      cache.get('key1'); // This should trigger expired count
      
      const stats = cache.getStats();
      expect(stats.expiredCount).toBe(1);
    });

    it('should estimate memory usage', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      const stats = cache.getStats();
      expect(stats.memoryUsage).toBeGreaterThan(0);
    });

    it('should track average response time', () => {
      cache.set('key1', 'value1');
      cache.get('key1');
      cache.get('key1');
      
      const stats = cache.getStats();
      expect(stats.avgResponseTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Cache Warming', () => {
    it('should warm cache with provided data', async () => {
      const warmupData = [
        {
          key: 'key1',
          fetcher: async () => 'value1',
          ttl: 1000,
          tags: ['tag1'],
        },
        {
          key: 'key2',
          fetcher: async () => 'value2',
        },
      ];
      
      await cache.warmCache(warmupData);
      
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBe('value2');
      expect(cache.size()).toBe(2);
    });

    it('should handle failed warmup gracefully', async () => {
      const warmupData = [
        {
          key: 'key1',
          fetcher: async () => 'value1',
        },
        {
          key: 'key2',
          fetcher: async () => {
            throw new Error('Fetch failed');
          },
        },
        {
          key: 'key3',
          fetcher: async () => 'value3',
        },
      ];
      
      await cache.warmCache(warmupData);
      
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBeNull(); // Failed to fetch
      expect(cache.get('key3')).toBe('value3');
      expect(cache.size()).toBe(2);
    });
  });

  describe('Cleanup Timer', () => {
    it('should clean up expired entries automatically', async () => {
      const shortCleanupCache = new MemoryCache({
        maxSize: 10,
        defaultTTL: 50, // 50ms
        cleanupInterval: 25, // 25ms cleanup interval
        enableStats: true,
      });
      
      shortCleanupCache.set('key1', 'value1');
      expect(shortCleanupCache.get('key1')).toBe('value1');
      
      // Wait for expiration and cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(shortCleanupCache.size()).toBe(0);
      
      shortCleanupCache.destroy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero max size', () => {
      const zeroSizeCache = new MemoryCache({
        maxSize: 0,
        defaultTTL: 1000,
        cleanupInterval: 0,
        enableStats: true,
      });
      
      zeroSizeCache.set('key1', 'value1');
      expect(zeroSizeCache.get('key1')).toBeNull();
      
      zeroSizeCache.destroy();
    });

    it('should handle negative TTL', () => {
      cache.set('key1', 'value1', -1000);
      expect(cache.get('key1')).toBeNull();
    });

    it('should handle complex objects', () => {
      const complexObject = {
        id: 1,
        name: 'Test',
        nested: {
          array: [1, 2, 3],
          date: new Date(),
        },
      };
      
      cache.set('complex', complexObject);
      const retrieved = cache.get('complex');
      
      expect(retrieved).toEqual(complexObject);
    });
  });
});