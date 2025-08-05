/**
 * Memory Cache Implementation with LRU Eviction Policy
 * 
 * Provides fast in-memory caching with automatic eviction based on:
 * - Least Recently Used (LRU) algorithm
 * - Time-to-live (TTL) expiration
 * - Maximum cache size limits
 */

export interface CacheEntry<T> {
  key: string;
  value: T;
  createdAt: Date;
  expiresAt: Date;
  lastAccessed: Date;
  hitCount: number;
  tags: string[];
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  missRate: number;
  memoryUsage: number;
  avgResponseTime: number;
  evictionCount: number;
  expiredCount: number;
}

export interface MemoryCacheConfig {
  maxSize: number;
  defaultTTL: number; // in milliseconds
  cleanupInterval: number; // in milliseconds
  enableStats: boolean;
}

export class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private accessOrder = new Map<string, number>(); // For LRU tracking
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    expired: 0,
    totalRequests: 0,
    totalResponseTime: 0,
  };
  private accessCounter = 0;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(private config: MemoryCacheConfig) {
    if (config.cleanupInterval > 0) {
      this.startCleanupTimer();
    }
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const startTime = Date.now();
    this.stats.totalRequests++;

    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (entry.expiresAt < new Date()) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      this.stats.expired++;
      this.stats.misses++;
      return null;
    }

    // Update access tracking for LRU
    entry.lastAccessed = new Date();
    entry.hitCount++;
    this.accessOrder.set(key, ++this.accessCounter);
    
    this.stats.hits++;
    this.stats.totalResponseTime += Date.now() - startTime;
    
    return entry.value as T;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number, tags: string[] = []): void {
    // Don't store anything if max size is 0
    if (this.config.maxSize === 0) {
      return;
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + (ttl || this.config.defaultTTL));

    // Check if we need to evict entries
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      createdAt: now,
      expiresAt,
      lastAccessed: now,
      hitCount: 0,
      tags,
    };

    this.cache.set(key, entry);
    this.accessOrder.set(key, ++this.accessCounter);
  }

  /**
   * Delete specific key from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.accessOrder.delete(key);
    return deleted;
  }

  /**
   * Clear cache entries by tags
   */
  invalidateByTags(tags: string[]): number {
    let invalidated = 0;
    const tagSet = new Set(tags);

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.some(tag => tagSet.has(tag))) {
        this.cache.delete(key);
        this.accessOrder.delete(key);
        invalidated++;
      }
    }

    return invalidated;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.resetStats();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;
    const missRate = totalRequests > 0 ? this.stats.misses / totalRequests : 0;
    const avgResponseTime = this.stats.totalRequests > 0 
      ? this.stats.totalResponseTime / this.stats.totalRequests 
      : 0;

    return {
      totalEntries: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      missRate: Math.round(missRate * 100) / 100,
      memoryUsage: this.estimateMemoryUsage(),
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      evictionCount: this.stats.evictions,
      expiredCount: this.stats.expired,
    };
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Check if expired
    if (entry.expiresAt < new Date()) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      this.stats.expired++;
      return false;
    }
    
    return true;
  }

  /**
   * Warm cache with critical data
   */
  async warmCache(warmupData: Array<{ key: string; fetcher: () => Promise<any>; ttl?: number; tags?: string[] }>): Promise<void> {
    const promises = warmupData.map(async ({ key, fetcher, ttl, tags }) => {
      try {
        const value = await fetcher();
        this.set(key, value, ttl, tags);
      } catch (error) {
        console.warn(`Failed to warm cache for key: ${key}`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestAccess = Infinity;

    for (const [key, accessTime] of this.accessOrder.entries()) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpired(): void {
    const now = new Date();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      this.stats.expired++;
    }
  }

  /**
   * Start cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired();
    }, this.config.cleanupInterval);
  }

  /**
   * Stop cleanup timer
   */
  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  /**
   * Estimate memory usage (rough calculation)
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0;
    
    for (const entry of this.cache.values()) {
      // Rough estimation of memory usage
      totalSize += JSON.stringify(entry).length * 2; // UTF-16 encoding
    }
    
    return totalSize;
  }

  /**
   * Reset statistics
   */
  private resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      expired: 0,
      totalRequests: 0,
      totalResponseTime: 0,
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopCleanupTimer();
    this.clear();
  }
}

// Default memory cache instance
export const defaultMemoryCache = new MemoryCache({
  maxSize: 1000,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  cleanupInterval: 60 * 1000, // 1 minute
  enableStats: true,
});