/**
 * Multi-Tier Cache Manager
 * 
 * Combines memory cache, disk cache, and database query optimization
 * into a unified caching system for optimal performance.
 */

import { MemoryCache, type MemoryCacheConfig } from './memory-cache';
import { DiskCache, type DiskCacheConfig } from './disk-cache';
import { QueryOptimizer, type QueryOptimizerConfig } from './query-optimizer';

export interface MultiTierCacheConfig {
  memory: MemoryCacheConfig;
  disk: DiskCacheConfig;
  query: QueryOptimizerConfig;
  enableFallback: boolean;
  enableMetrics: boolean;
}

export interface CacheStats {
  memory: {
    totalEntries: number;
    hitRate: number;
    missRate: number;
    memoryUsage: number;
    avgResponseTime: number;
    evictionCount: number;
    expiredCount: number;
  };
  disk: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    failureRate: number;
    avgResponseTime: number;
    isHealthy: boolean;
  };
  query: {
    size: number;
    hitRate: number;
    totalHits: number;
    memoryUsage: number;
  };
  overall: {
    totalRequests: number;
    cacheHitRate: number;
    avgResponseTime: number;
    errorRate: number;
  };
}

export interface CacheOptions {
  memoryTTL?: number;
  diskTTL?: number;
  tags?: string[];
  priority?: number;
  fallback?: () => Promise<any>;
}

export class MultiTierCache {
  private memoryCache: MemoryCache;
  private diskCache: DiskCache;
  private queryOptimizer: QueryOptimizer;
  private overallStats = {
    totalRequests: 0,
    cacheHits: 0,
    totalResponseTime: 0,
    errors: 0,
  };

  constructor(private config: MultiTierCacheConfig) {
    this.memoryCache = new MemoryCache(config.memory);
    this.diskCache = new DiskCache(config.disk);
    this.queryOptimizer = new QueryOptimizer(config.query);
  }

  /**
   * Get data with multi-tier caching strategy
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const startTime = Date.now();
    this.overallStats.totalRequests++;

    try {
      // 1. Try memory cache first (fastest)
      const memoryResult = this.memoryCache.get<T>(key);
      if (memoryResult !== null) {
        this.recordCacheHit(Date.now() - startTime);
        return memoryResult;
      }

      // 2. Try disk cache (medium speed)
      try {
        const diskResult = await this.diskCache.get(key, fetcher, {
          tags: options.tags,
          ttl: options.diskTTL,
          fallback: options.fallback,
        });

        // Store in memory cache for next time
        this.memoryCache.set(key, diskResult, options.memoryTTL, options.tags);
        
        this.recordCacheHit(Date.now() - startTime);
        return diskResult;
      } catch (diskError) {
        if (!this.config.enableFallback) {
          throw diskError;
        }

        // 3. Fallback to direct fetcher execution
        console.warn('Disk cache failed, falling back to direct fetch:', diskError);
        
        const result = await fetcher();
        
        // Try to store in memory cache at least
        try {
          this.memoryCache.set(key, result, options.memoryTTL, options.tags);
        } catch (memoryError) {
          console.warn('Failed to store in memory cache:', memoryError);
        }

        this.recordCacheMiss(Date.now() - startTime);
        return result;
      }
    } catch (error) {
      this.overallStats.errors++;
      throw error;
    }
  }

  /**
   * Set data in all cache tiers
   */
  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    const promises: Promise<void>[] = [];

    // Set in memory cache
    try {
      this.memoryCache.set(key, value, options.memoryTTL, options.tags);
    } catch (error) {
      console.warn('Failed to set in memory cache:', error);
    }

    // Set in disk cache (via a dummy fetcher that returns the value)
    promises.push(
      this.diskCache.get(key, async () => value, {
        tags: options.tags,
        ttl: options.diskTTL,
      }).then(() => {}).catch(error => {
        console.warn('Failed to set in disk cache:', error);
      })
    );

    if (promises.length > 0) {
      await Promise.allSettled(promises);
    }
  }

  /**
   * Delete from all cache tiers
   */
  async delete(key: string): Promise<void> {
    const promises: Promise<void>[] = [];

    // Delete from memory cache
    this.memoryCache.delete(key);

    // Delete from disk cache
    promises.push(
      this.diskCache.invalidateKey(key).catch(error => {
        console.warn('Failed to delete from disk cache:', error);
      })
    );

    await Promise.allSettled(promises);
  }

  /**
   * Invalidate cache by tags across all tiers
   */
  async invalidateByTags(tags: string[]): Promise<void> {
    const promises: Promise<void>[] = [];

    // Invalidate memory cache
    this.memoryCache.invalidateByTags(tags);

    // Invalidate disk cache
    promises.push(
      this.diskCache.invalidateByTags(tags).catch(error => {
        console.warn('Failed to invalidate disk cache by tags:', error);
      })
    );

    // Invalidate query cache
    for (const tag of tags) {
      this.queryOptimizer.invalidateCache(tag);
    }

    await Promise.allSettled(promises);
  }

  /**
   * Clear all cache tiers
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    this.queryOptimizer.clearMetrics();
    // Note: Disk cache doesn't have a clear method as it uses Next.js cache
  }

  /**
   * Warm all cache tiers with critical data
   */
  async warmCache(warmupData: Array<{
    key: string;
    fetcher: () => Promise<any>;
    options?: CacheOptions;
  }>): Promise<void> {
    const promises = warmupData.map(async ({ key, fetcher, options = {} }) => {
      try {
        await this.get(key, fetcher, options);
      } catch (error) {
        console.warn(`Failed to warm cache for key: ${key}`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Get comprehensive cache statistics
   */
  getStats(): CacheStats {
    const memoryStats = this.memoryCache.getStats();
    const diskStats = this.diskCache.getHealthMetrics();
    const queryStats = this.queryOptimizer.getCacheStats();

    const totalRequests = this.overallStats.totalRequests;
    const cacheHitRate = totalRequests > 0 
      ? this.overallStats.cacheHits / totalRequests 
      : 0;
    const avgResponseTime = totalRequests > 0 
      ? this.overallStats.totalResponseTime / totalRequests 
      : 0;
    const errorRate = totalRequests > 0 
      ? this.overallStats.errors / totalRequests 
      : 0;

    return {
      memory: memoryStats,
      disk: diskStats,
      query: queryStats,
      overall: {
        totalRequests,
        cacheHitRate: Math.round(cacheHitRate * 100) / 100,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        errorRate: Math.round(errorRate * 100) / 100,
      },
    };
  }

  /**
   * Get optimized property data with multi-tier caching
   */
  async getProperties(filters: any, options: CacheOptions = {}): Promise<any[]> {
    const key = `properties:${JSON.stringify(filters)}`;
    
    return this.get(key, async () => {
      return this.queryOptimizer.optimizePropertyQueries(filters);
    }, options);
  }

  /**
   * Get optimized community data with multi-tier caching
   */
  async getCommunities(params: any, options: CacheOptions = {}): Promise<any[]> {
    const key = `communities:${JSON.stringify(params)}`;
    
    return this.get(key, async () => {
      return this.queryOptimizer.optimizeCommunityQueries(params);
    }, options);
  }

  /**
   * Get optimized insight data with multi-tier caching
   */
  async getInsights(pagination: any, options: CacheOptions = {}): Promise<{ data: any[]; total: number }> {
    const key = `insights:${JSON.stringify(pagination)}`;
    
    return this.get(key, async () => {
      return this.queryOptimizer.optimizeInsightQueries(pagination);
    }, options);
  }

  /**
   * Batch multiple cache operations
   */
  async batchGet<T>(
    operations: Array<{
      key: string;
      fetcher: () => Promise<T>;
      options?: CacheOptions;
    }>
  ): Promise<Map<string, T>> {
    const results = new Map<string, T>();
    const promises = operations.map(async ({ key, fetcher, options }) => {
      try {
        const result = await this.get(key, fetcher, options);
        results.set(key, result);
      } catch (error) {
        console.error(`Batch get failed for key: ${key}`, error);
        throw error;
      }
    });

    await Promise.all(promises);
    return results;
  }

  /**
   * Setup health monitoring and alerts
   */
  setupHealthMonitoring(): void {
    // Setup disk cache health alerts
    this.diskCache.onHealthAlert((metrics) => {
      console.warn('Multi-tier cache disk health alert:', {
        failureRate: `${(metrics.failureRate * 100).toFixed(2)}%`,
        avgResponseTime: `${metrics.avgResponseTime}ms`,
        isHealthy: metrics.isHealthy,
      });
    });

    // Setup query optimizer slow query alerts
    this.queryOptimizer.onSlowQuery((alert) => {
      console.warn('Multi-tier cache slow query alert:', {
        queryId: alert.queryId,
        executionTime: `${alert.executionTime}ms`,
        threshold: `${alert.threshold}ms`,
      });
    });

    // Periodic stats logging
    if (this.config.enableMetrics) {
      setInterval(() => {
        const stats = this.getStats();
        console.info('Multi-tier cache stats:', {
          overall: stats.overall,
          memory: {
            entries: stats.memory.totalEntries,
            hitRate: `${(stats.memory.hitRate * 100).toFixed(2)}%`,
            memoryUsage: `${(stats.memory.memoryUsage / 1024).toFixed(2)}KB`,
          },
          disk: {
            isHealthy: stats.disk.isHealthy,
            failureRate: `${(stats.disk.failureRate * 100).toFixed(2)}%`,
          },
          query: {
            cacheSize: stats.query.size,
            hitRate: `${(stats.query.hitRate * 100).toFixed(2)}%`,
          },
        });
      }, 60000); // Every minute
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.memoryCache.destroy();
    // Disk cache and query optimizer don't need explicit cleanup
  }

  /**
   * Record cache hit for overall stats
   */
  private recordCacheHit(responseTime: number): void {
    this.overallStats.cacheHits++;
    this.overallStats.totalResponseTime += responseTime;
  }

  /**
   * Record cache miss for overall stats
   */
  private recordCacheMiss(responseTime: number): void {
    this.overallStats.totalResponseTime += responseTime;
  }
}

// Default multi-tier cache configuration
const defaultConfig: MultiTierCacheConfig = {
  memory: {
    maxSize: 1000,
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    cleanupInterval: 60 * 1000, // 1 minute
    enableStats: true,
  },
  disk: {
    defaultTTL: 300, // 5 minutes
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
    cacheTimeout: 5 * 60 * 1000,
    enablePerformanceMonitoring: true,
    connectionPoolSize: 10,
  },
  enableFallback: true,
  enableMetrics: true,
};

// Default multi-tier cache instance
export const defaultMultiTierCache = new MultiTierCache(defaultConfig);

// Setup health monitoring for the default instance
if (typeof window === 'undefined') { // Server-side only
  defaultMultiTierCache.setupHealthMonitoring();
}

// Cache utility functions for common patterns
export const CacheUtils = {
  /**
   * Generate cache key for property data
   */
  propertyKey: (id: string, ...params: any[]): string => {
    return `property:${id}:${JSON.stringify(params)}`;
  },

  /**
   * Generate cache key for community data
   */
  communityKey: (id: string, ...params: any[]): string => {
    return `community:${id}:${JSON.stringify(params)}`;
  },

  /**
   * Generate cache key for search results
   */
  searchKey: (type: string, query: string, filters: any): string => {
    return `search:${type}:${query}:${JSON.stringify(filters)}`;
  },

  /**
   * Generate cache key for user-specific data
   */
  userKey: (userId: string, dataType: string, ...params: any[]): string => {
    return `user:${userId}:${dataType}:${JSON.stringify(params)}`;
  },

  /**
   * Generate cache key for paginated data
   */
  paginatedKey: (type: string, page: number, limit: number, ...params: any[]): string => {
    return `paginated:${type}:${page}:${limit}:${JSON.stringify(params)}`;
  },
};