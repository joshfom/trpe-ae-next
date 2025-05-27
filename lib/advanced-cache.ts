import { unstable_cache } from 'next/cache';
import { cache } from 'react';

export interface AdvancedCacheOptions {
  revalidate: number;
  tags: readonly string[];
  memoryTtl?: number; // Memory cache TTL in ms
  fallback?: boolean; // Whether to fallback to direct fetch on error
}

export interface CacheStats {
  hits: number;
  misses: number;
  errors: number;
  hitRate: number;
  totalRequests: number;
}

/**
 * Cache Analytics for monitoring performance
 */
export class CacheAnalytics {
  private static hits = 0;
  private static misses = 0;
  private static errors = 0;

  static recordHit() {
    this.hits++;
  }

  static recordMiss() {
    this.misses++;
  }

  static recordError() {
    this.errors++;
  }

  static getHitRate() {
    const total = this.hits + this.misses;
    return total > 0 ? (this.hits / total) * 100 : 0;
  }

  static getStats(): CacheStats {
    return {
      hits: this.hits,
      misses: this.misses,
      errors: this.errors,
      hitRate: this.getHitRate(),
      totalRequests: this.hits + this.misses + this.errors
    };
  }

  static reset() {
    this.hits = 0;
    this.misses = 0;
    this.errors = 0;
  }
}

/**
 * Creates a multi-layer cache with memory and disk caching
 * Provides better performance for frequently accessed data
 */
export function createAdvancedCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: AdvancedCacheOptions
): () => Promise<T>;

/**
 * Factory function for creating cache instances with object-style API
 * This overload supports the pattern: createAdvancedCache({ keyPrefix, memoryTTL, diskTTL, namespace })
 */
export function createAdvancedCache<T = any>(options: CacheFactoryOptions): CacheInstance<T>;

export function createAdvancedCache<T>(
  keyOrOptions: string | CacheFactoryOptions,
  fetcher?: () => Promise<T>,
  options?: AdvancedCacheOptions
): (() => Promise<T>) | CacheInstance<T> {
  // Handle object-style API
  if (typeof keyOrOptions === 'object') {
    const factoryOptions = keyOrOptions;
    return {
      async get<U = T>(key: string, fetcher: () => Promise<U>): Promise<U> {
        const fullKey = `${factoryOptions.keyPrefix}-${key}`;
        const cacheOptions: AdvancedCacheOptions = {
          revalidate: Math.floor(factoryOptions.diskTTL / 1000), // Convert ms to seconds
          tags: [factoryOptions.namespace, factoryOptions.keyPrefix],
          memoryTtl: factoryOptions.memoryTTL,
          fallback: true
        };
        
        const cacheFunction = createAdvancedCache(fullKey, fetcher, cacheOptions);
        return await (cacheFunction as () => Promise<U>)();
      }
    };
  }
  
  // Handle traditional API
  const key = keyOrOptions;
  if (!fetcher || !options) {
    throw new Error('fetcher and options are required when using string key');
  }
  // Layer 1: React cache (memory) - for ultra-fast repeated calls
  const memoryCache = cache(async () => {
    try {
      CacheAnalytics.recordHit();
      return await fetcher();
    } catch (error) {
      CacheAnalytics.recordError();
      throw error;
    }
  });
  
  // Layer 2: unstable_cache (disk/CDN) - for persistent caching
  const diskCache = unstable_cache(
    async () => {
      try {
        CacheAnalytics.recordMiss();
        return await fetcher();
      } catch (error) {
        CacheAnalytics.recordError();
        throw error;
      }
    },
    [key],
    {
      revalidate: options.revalidate,
      tags: [...options.tags]
    }
  );
  
  return async (): Promise<T> => {
    try {
      // Use memory cache for frequently accessed data within the same request
      if (options.memoryTtl) {
        return await memoryCache();
      }
      
      // Use disk cache for persistence across requests
      return await diskCache();
    } catch (error) {
      console.error(`Cache error for ${key}:`, error);
      
      // Fallback to direct fetch if enabled
      if (options.fallback !== false) {
        CacheAnalytics.recordMiss();
        return await fetcher();
      }
      
      throw error;
    }
  };
}

/**
 * Property-specific cache configurations
 */
export const CACHE_CONFIGS = {
  PROPERTY_LISTINGS: {
    revalidate: 1800, // 30 minutes
    tags: ['properties', 'listings'],
    memoryTtl: 300000, // 5 minutes
    fallback: true
  },
  PROPERTY_DETAIL: {
    revalidate: 3600, // 1 hour
    tags: ['properties', 'property-details'],
    memoryTtl: 600000, // 10 minutes
    fallback: true
  },
  PROPERTY_TYPES: {
    revalidate: 14400, // 4 hours
    tags: ['property-types', 'metadata'],
    memoryTtl: 1800000, // 30 minutes
    fallback: true
  },
  OFFERING_TYPES: {
    revalidate: 14400, // 4 hours
    tags: ['offering-types', 'metadata'],
    memoryTtl: 1800000, // 30 minutes
    fallback: true
  },
  COMMUNITIES: {
    revalidate: 7200, // 2 hours
    tags: ['communities', 'metadata'],
    memoryTtl: 1200000, // 20 minutes
    fallback: true
  },
  PAGE_META: {
    revalidate: 7200, // 2 hours
    tags: ['page-meta', 'seo'],
    memoryTtl: 1800000, // 30 minutes
    fallback: true
  }
} as const;

/**
 * Enhanced cache with geographic optimization for properties
 */
export function createGeoOptimizedCache<T>(
  baseKey: string,
  fetcher: (params: any) => Promise<T>,
  config: AdvancedCacheOptions
) {
  return (params: any) => {
    // Create cache key with geographic and search parameters
    const geoKey = [
      baseKey,
      params.city || 'all',
      params.community || 'all',
      params.propertyType || 'all',
      params.offeringType || 'all',
      params.page || '1',
      // Hash search params for consistent caching
      params.searchParams ? btoa(params.searchParams.toString()).slice(0, 10) : 'default'
    ].join('-');

    return createAdvancedCache(
      geoKey,
      () => fetcher(params),
      config
    );
  };
}

/**
 * Cache warmer for preloading critical data
 */
export async function warmCache() {
  const criticalQueries = [
    // Warm offering types cache
    createAdvancedCache(
      'offering-types-warm',
      async () => {
        // Import db query here to avoid circular dependencies
        const { db } = await import('@/db/drizzle');
        const { offeringTypeTable } = await import('@/db/schema/offering-type-table');
        return await db.select().from(offeringTypeTable);
      },
      CACHE_CONFIGS.OFFERING_TYPES
    ),
    
    // Warm property types cache
    createAdvancedCache(
      'property-types-warm',
      async () => {
        const { db } = await import('@/db/drizzle');
        const { propertyTypeTable } = await import('@/db/schema/property-type-table');
        return await db.select().from(propertyTypeTable);
      },
      CACHE_CONFIGS.PROPERTY_TYPES
    )
  ];

  try {
    await Promise.all(criticalQueries.map(query => query()));
    console.log('✅ Cache warming completed successfully');
  } catch (error) {
    console.error('❌ Cache warming failed:', error);
  }
}

/**
 * Cache health check utility
 */
export function getCacheHealth(): { status: 'healthy' | 'degraded' | 'unhealthy'; stats: CacheStats } {
  const stats = CacheAnalytics.getStats();
  
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  
  if (stats.hitRate < 50) {
    status = 'unhealthy';
  } else if (stats.hitRate < 75) {
    status = 'degraded';
  }
  
  if (stats.errors > stats.hits) {
    status = 'unhealthy';
  }

  return { status, stats };
}

/**
 * Cache factory pattern interfaces and implementation
 */
export interface CacheFactoryOptions {
  keyPrefix: string;
  memoryTTL: number;
  diskTTL: number;
  namespace: string;
}

export interface CacheInstance<T = any> {
  get<U = T>(key: string, fetcher: () => Promise<U>): Promise<U>;
  set?(key: string, value: any): Promise<void>;
  clear?(): Promise<void>;
}

/**
 * Creates a cache instance with factory pattern
 */
export function createCacheFactory<T>(options: CacheFactoryOptions): CacheInstance<T> {
  const { keyPrefix, memoryTTL, diskTTL, namespace } = options;

  return {
    async get<U = T>(key: string, fetcher: () => Promise<U>): Promise<U> {
      const cacheKey = `${keyPrefix}:${key}`;
      return await createAdvancedCache<U>(cacheKey, fetcher, {
        revalidate: diskTTL / 1000,
        tags: [namespace],
        memoryTtl: memoryTTL,
        fallback: true
      })();
    },
    async set(key: string, value: any): Promise<void> {
      // Implement set logic if needed
    },
    async clear(): Promise<void> {
      // Implement clear logic if needed
    }
  };
}
