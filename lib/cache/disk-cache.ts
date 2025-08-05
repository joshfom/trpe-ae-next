/**
 * Disk Cache Integration for Next.js
 * 
 * Provides persistent caching using Next.js unstable_cache with:
 * - Cache tagging and invalidation
 * - Health monitoring and alerting
 * - Automatic fallback mechanisms
 */

import { unstable_cache, revalidateTag } from 'next/cache';

export interface DiskCacheConfig {
  defaultTTL: number; // in seconds
  enableHealthMonitoring: boolean;
  maxRetries: number;
  retryDelay: number; // in milliseconds
  alertThreshold: number; // failure rate threshold for alerts
}

export interface CacheHealthMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  failureRate: number;
  avgResponseTime: number;
  lastHealthCheck: Date;
  isHealthy: boolean;
}

export interface DiskCacheEntry<T> {
  data: T;
  cachedAt: Date;
  expiresAt: Date;
  tags: string[];
  hitCount: number;
}

export type CacheKeyGenerator = (...args: any[]) => string;
export type CacheFetcher<T> = (...args: any[]) => Promise<T>;

export class DiskCache {
  private healthMetrics: CacheHealthMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    failureRate: 0,
    avgResponseTime: 0,
    lastHealthCheck: new Date(),
    isHealthy: true,
  };

  private responseTimeSum = 0;
  private alertCallbacks: Array<(metrics: CacheHealthMetrics) => void> = [];

  constructor(private config: DiskCacheConfig) {}

  /**
   * Create a cached function with disk persistence
   */
  createCachedFunction<T extends any[], R>(
    fetcher: (...args: T) => Promise<R>,
    options: {
      keyGenerator: (...args: T) => string;
      tags?: string[];
      ttl?: number;
      fallback?: (...args: T) => Promise<R>;
    }
  ): (...args: T) => Promise<R> {
    const { keyGenerator, tags = [], ttl = this.config.defaultTTL, fallback } = options;

    return unstable_cache(
      async (...args: T): Promise<R> => {
        const startTime = Date.now();
        this.healthMetrics.totalRequests++;

        try {
          const result = await this.executeWithRetry(fetcher, args);
          
          this.recordSuccess(Date.now() - startTime);
          return result;
        } catch (error) {
          this.recordFailure();
          
          // Try fallback if available
          if (fallback) {
            try {
              const fallbackResult = await fallback(...args);
              this.recordSuccess(Date.now() - startTime);
              return fallbackResult;
            } catch (fallbackError) {
              console.error('Disk cache fallback failed:', fallbackError);
            }
          }
          
          throw error;
        }
      },
      undefined, // Let Next.js generate the key based on function and args
      {
        tags: [...tags, keyGenerator(...([] as any))], // Include generated key as tag
        revalidate: ttl,
      }
    );
  }

  /**
   * Get cached data with manual key management
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: {
      tags?: string[];
      ttl?: number;
      fallback?: () => Promise<T>;
    } = {}
  ): Promise<T> {
    const { tags = [], ttl = this.config.defaultTTL, fallback } = options;
    const startTime = Date.now();
    
    this.healthMetrics.totalRequests++;

    try {
      const cachedFunction = unstable_cache(
        fetcher,
        [key],
        {
          tags: [...tags, key],
          revalidate: ttl,
        }
      );

      const result = await this.executeWithRetry(cachedFunction, []);
      this.recordSuccess(Date.now() - startTime);
      return result;
    } catch (error) {
      this.recordFailure();
      
      if (fallback) {
        try {
          const fallbackResult = await fallback();
          this.recordSuccess(Date.now() - startTime);
          return fallbackResult;
        } catch (fallbackError) {
          console.error('Disk cache fallback failed:', fallbackError);
        }
      }
      
      throw error;
    }
  }

  /**
   * Invalidate cache by tags
   */
  async invalidateByTags(tags: string[]): Promise<void> {
    try {
      for (const tag of tags) {
        revalidateTag(tag);
      }
    } catch (error) {
      console.error('Failed to invalidate cache tags:', error);
      throw error;
    }
  }

  /**
   * Invalidate specific cache key
   */
  async invalidateKey(key: string): Promise<void> {
    await this.invalidateByTags([key]);
  }

  /**
   * Warm cache with critical data
   */
  async warmCache<T>(
    warmupData: Array<{
      key: string;
      fetcher: () => Promise<T>;
      tags?: string[];
      ttl?: number;
    }>
  ): Promise<void> {
    const promises = warmupData.map(async ({ key, fetcher, tags, ttl }) => {
      try {
        await this.get(key, fetcher, { tags, ttl });
      } catch (error) {
        console.warn(`Failed to warm disk cache for key: ${key}`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Get cache health metrics
   */
  getHealthMetrics(): CacheHealthMetrics {
    const totalRequests = this.healthMetrics.totalRequests;
    const failureRate = totalRequests > 0 
      ? this.healthMetrics.failedRequests / totalRequests 
      : 0;
    
    const avgResponseTime = totalRequests > 0 
      ? this.responseTimeSum / totalRequests 
      : 0;

    const isHealthy = failureRate < this.config.alertThreshold;

    return {
      ...this.healthMetrics,
      failureRate: Math.round(failureRate * 100) / 100,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      lastHealthCheck: new Date(),
      isHealthy,
    };
  }

  /**
   * Add health alert callback
   */
  onHealthAlert(callback: (metrics: CacheHealthMetrics) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Remove health alert callback
   */
  removeHealthAlert(callback: (metrics: CacheHealthMetrics) => void): void {
    const index = this.alertCallbacks.indexOf(callback);
    if (index > -1) {
      this.alertCallbacks.splice(index, 1);
    }
  }

  /**
   * Reset health metrics
   */
  resetHealthMetrics(): void {
    this.healthMetrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      failureRate: 0,
      avgResponseTime: 0,
      lastHealthCheck: new Date(),
      isHealthy: true,
    };
    this.responseTimeSum = 0;
  }

  /**
   * Execute function with retry logic
   */
  private async executeWithRetry<T>(
    fn: (...args: any[]) => Promise<T>,
    args: any[]
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.config.maxRetries) {
          await this.delay(this.config.retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }
    
    throw lastError!;
  }

  /**
   * Record successful operation
   */
  private recordSuccess(responseTime: number): void {
    this.healthMetrics.successfulRequests++;
    this.responseTimeSum += responseTime;
    
    if (this.config.enableHealthMonitoring) {
      this.checkHealth();
    }
  }

  /**
   * Record failed operation
   */
  private recordFailure(): void {
    this.healthMetrics.failedRequests++;
    
    if (this.config.enableHealthMonitoring) {
      this.checkHealth();
    }
  }

  /**
   * Check cache health and trigger alerts if needed
   */
  private checkHealth(): void {
    const metrics = this.getHealthMetrics();
    
    if (!metrics.isHealthy && this.alertCallbacks.length > 0) {
      this.alertCallbacks.forEach(callback => {
        try {
          callback(metrics);
        } catch (error) {
          console.error('Health alert callback failed:', error);
        }
      });
    }
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Cache key generators for common patterns
 */
export const CacheKeyGenerators = {
  /**
   * Generate key for property queries
   */
  property: (id: string, ...params: any[]): string => {
    return `property:${id}:${JSON.stringify(params)}`;
  },

  /**
   * Generate key for community queries
   */
  community: (id: string, ...params: any[]): string => {
    return `community:${id}:${JSON.stringify(params)}`;
  },

  /**
   * Generate key for search queries
   */
  search: (type: string, query: string, filters: any): string => {
    return `search:${type}:${query}:${JSON.stringify(filters)}`;
  },

  /**
   * Generate key for user-specific data
   */
  user: (userId: string, dataType: string, ...params: any[]): string => {
    return `user:${userId}:${dataType}:${JSON.stringify(params)}`;
  },

  /**
   * Generate key for paginated data
   */
  paginated: (type: string, page: number, limit: number, ...params: any[]): string => {
    return `paginated:${type}:${page}:${limit}:${JSON.stringify(params)}`;
  },

  /**
   * Generate key with timestamp for time-sensitive data
   */
  timestamped: (key: string, intervalMinutes: number): string => {
    const timestamp = Math.floor(Date.now() / (intervalMinutes * 60 * 1000));
    return `${key}:${timestamp}`;
  },
};

/**
 * Cache tags for organized invalidation
 */
export const CacheTags = {
  PROPERTIES: 'properties',
  COMMUNITIES: 'communities',
  AGENTS: 'agents',
  INSIGHTS: 'insights',
  SEARCH: 'search',
  USER_DATA: 'user-data',
  METADATA: 'metadata',
  IMAGES: 'images',
  ANALYTICS: 'analytics',
} as const;

// Default disk cache instance
export const defaultDiskCache = new DiskCache({
  defaultTTL: 300, // 5 minutes
  enableHealthMonitoring: true,
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  alertThreshold: 0.1, // 10% failure rate
});

// Setup default health monitoring
if (typeof window === 'undefined') { // Server-side only
  defaultDiskCache.onHealthAlert((metrics) => {
    console.warn('Disk cache health alert:', {
      failureRate: `${(metrics.failureRate * 100).toFixed(2)}%`,
      totalRequests: metrics.totalRequests,
      failedRequests: metrics.failedRequests,
      avgResponseTime: `${metrics.avgResponseTime}ms`,
    });
  });
}