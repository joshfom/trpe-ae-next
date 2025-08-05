/**
 * Multi-Tier Caching System
 * 
 * A comprehensive caching solution that combines memory caching, disk caching,
 * and database query optimization for optimal performance.
 */

// Memory Cache
export {
  MemoryCache,
  defaultMemoryCache,
  type CacheEntry,
  type CacheStats as MemoryCacheStats,
  type MemoryCacheConfig,
} from './memory-cache';

// Disk Cache
export {
  DiskCache,
  defaultDiskCache,
  CacheKeyGenerators,
  CacheTags,
  type DiskCacheConfig,
  type CacheHealthMetrics,
  type DiskCacheEntry,
  type CacheKeyGenerator,
  type CacheFetcher,
} from './disk-cache';

// Query Optimizer
export {
  QueryOptimizer,
  defaultQueryOptimizer,
  type QueryOptimizerConfig,
  type QueryPerformanceMetrics,
  type SlowQueryAlert,
  type BatchedQuery,
  type QueryCacheEntry,
} from './query-optimizer';

// Multi-Tier Cache Manager
export {
  MultiTierCache,
  defaultMultiTierCache,
  CacheUtils,
  type MultiTierCacheConfig,
  type CacheStats,
  type CacheOptions,
} from './multi-tier-cache';

// Re-export commonly used types
export type {
  CacheEntry as MemoryCacheEntry,
  CacheStats as MemoryCacheStatsType,
} from './memory-cache';

export type {
  CacheHealthMetrics as DiskCacheHealthMetrics,
  DiskCacheEntry as DiskCacheEntryType,
} from './disk-cache';

export type {
  QueryPerformanceMetrics as QueryMetrics,
  SlowQueryAlert as SlowQueryAlertType,
} from './query-optimizer';

export type {
  CacheStats as MultiTierCacheStats,
  CacheOptions as MultiTierCacheOptions,
} from './multi-tier-cache';