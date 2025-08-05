# Multi-Tier Caching System

A comprehensive caching solution for the TRPE real estate platform that combines memory caching, disk caching, and database query optimization for optimal performance.

## Overview

The multi-tier caching system provides three levels of caching:

1. **Memory Cache** - Ultra-fast in-memory caching with LRU eviction
2. **Disk Cache** - Persistent caching using Next.js unstable_cache
3. **Query Optimizer** - Database query optimization with intelligent batching

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Memory Cache  │    │   Disk Cache    │    │ Query Optimizer │
│   (Fastest)     │    │   (Persistent)  │    │ (Database)      │
│                 │    │                 │    │                 │
│ • LRU eviction  │    │ • Next.js cache │    │ • Query batching│
│ • TTL support   │    │ • Tag-based     │    │ • Performance   │
│ • Statistics    │    │   invalidation  │    │   monitoring    │
│ • Cache warming │    │ • Health alerts │    │ • Slow query    │
│                 │    │ • Retry logic   │    │   detection     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Multi-Tier Cache│
                    │    Manager      │
                    │                 │
                    │ • Unified API   │
                    │ • Fallback      │
                    │ • Statistics    │
                    │ • Health        │
                    │   monitoring    │
                    └─────────────────┘
```

## Components

### Memory Cache (`memory-cache.ts`)

Fast in-memory caching with LRU (Least Recently Used) eviction policy.

**Features:**
- LRU eviction when cache reaches maximum size
- TTL (Time To Live) expiration
- Tag-based invalidation
- Cache statistics and monitoring
- Automatic cleanup of expired entries
- Cache warming support

**Usage:**
```typescript
import { MemoryCache } from '@/lib/cache/memory-cache';

const cache = new MemoryCache({
  maxSize: 1000,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  cleanupInterval: 60 * 1000, // 1 minute
  enableStats: true,
});

// Set data
cache.set('key', data, 60000, ['tag1', 'tag2']);

// Get data
const result = cache.get('key');

// Invalidate by tags
cache.invalidateByTags(['tag1']);

// Get statistics
const stats = cache.getStats();
```

### Disk Cache (`disk-cache.ts`)

Persistent caching using Next.js `unstable_cache` with health monitoring.

**Features:**
- Integration with Next.js caching system
- Tag-based cache invalidation
- Health monitoring and alerting
- Retry logic with exponential backoff
- Fallback mechanisms
- Cache warming support

**Usage:**
```typescript
import { DiskCache, CacheKeyGenerators, CacheTags } from '@/lib/cache/disk-cache';

const diskCache = new DiskCache({
  defaultTTL: 300, // 5 minutes
  enableHealthMonitoring: true,
  maxRetries: 3,
  retryDelay: 1000,
  alertThreshold: 0.1,
});

// Get cached data
const data = await diskCache.get('key', async () => {
  return await fetchData();
}, {
  tags: [CacheTags.PROPERTIES],
  ttl: 600,
});

// Invalidate by tags
await diskCache.invalidateByTags([CacheTags.PROPERTIES]);

// Create cached function
const cachedFunction = diskCache.createCachedFunction(
  fetchProperties,
  {
    keyGenerator: CacheKeyGenerators.property,
    tags: [CacheTags.PROPERTIES],
    ttl: 300,
  }
);
```

### Query Optimizer (`query-optimizer.ts`)

Database query optimization with intelligent batching and performance monitoring.

**Features:**
- Optimized property, community, and insight queries
- Query batching for improved performance
- Query performance monitoring
- Slow query detection and alerting
- Query result caching
- Database connection optimization

**Usage:**
```typescript
import { QueryOptimizer } from '@/lib/cache/query-optimizer';

const optimizer = new QueryOptimizer({
  slowQueryThreshold: 1000,
  batchSize: 10,
  batchTimeout: 100,
  enableQueryCache: true,
  cacheTimeout: 5 * 60 * 1000,
  enablePerformanceMonitoring: true,
  connectionPoolSize: 10,
});

// Optimize property queries
const properties = await optimizer.optimizePropertyQueries({
  communityId: 'community-123',
  propertyType: 'apartment',
  priceRange: { min: 100000, max: 500000 },
});

// Batch multiple queries
const results = await optimizer.batchQueries([
  { id: 'query1', query: () => fetchData1() },
  { id: 'query2', query: () => fetchData2() },
]);

// Monitor performance
optimizer.onSlowQuery((alert) => {
  console.warn('Slow query detected:', alert);
});
```

### Multi-Tier Cache Manager (`multi-tier-cache.ts`)

Unified interface that combines all three caching layers.

**Features:**
- Automatic fallback between cache tiers
- Unified API for all caching operations
- Comprehensive statistics
- Health monitoring across all tiers
- Batch operations
- Cache warming

**Usage:**
```typescript
import { defaultMultiTierCache, CacheUtils } from '@/lib/cache/multi-tier-cache';

// Get data with multi-tier caching
const data = await defaultMultiTierCache.get(
  'cache-key',
  async () => await fetchData(),
  {
    memoryTTL: 60000,
    diskTTL: 300,
    tags: ['properties'],
  }
);

// Get optimized property data
const properties = await defaultMultiTierCache.getProperties({
  communityId: 'community-123',
});

// Batch operations
const results = await defaultMultiTierCache.batchGet([
  { key: 'key1', fetcher: () => fetchData1() },
  { key: 'key2', fetcher: () => fetchData2() },
]);

// Invalidate by tags
await defaultMultiTierCache.invalidateByTags(['properties']);

// Get comprehensive statistics
const stats = defaultMultiTierCache.getStats();
```

## Cache Tags

Predefined cache tags for organized invalidation:

```typescript
import { CacheTags } from '@/lib/cache/disk-cache';

// Available tags
CacheTags.PROPERTIES    // Property-related data
CacheTags.COMMUNITIES   // Community-related data
CacheTags.AGENTS        // Agent-related data
CacheTags.INSIGHTS      // Insight/content data
CacheTags.SEARCH        // Search results
CacheTags.USER_DATA     // User-specific data
CacheTags.METADATA      // SEO and metadata
CacheTags.IMAGES        // Image-related data
CacheTags.ANALYTICS     // Analytics data
```

## Cache Key Generators

Utility functions for generating consistent cache keys:

```typescript
import { CacheKeyGenerators } from '@/lib/cache/disk-cache';
import { CacheUtils } from '@/lib/cache/multi-tier-cache';

// Property keys
const key = CacheKeyGenerators.property('property-123', { filters });
const key2 = CacheUtils.propertyKey('property-123', { filters });

// Community keys
const key3 = CacheKeyGenerators.community('community-456', { params });

// Search keys
const key4 = CacheKeyGenerators.search('properties', 'dubai', { filters });

// Paginated keys
const key5 = CacheKeyGenerators.paginated('properties', 1, 20, { sort: 'price' });

// Timestamped keys (for time-sensitive data)
const key6 = CacheKeyGenerators.timestamped('analytics', 5); // 5-minute intervals
```

## Performance Monitoring

The caching system provides comprehensive performance monitoring:

### Memory Cache Statistics
```typescript
const memoryStats = memoryCache.getStats();
// {
//   totalEntries: 150,
//   hitRate: 0.85,
//   missRate: 0.15,
//   memoryUsage: 2048576, // bytes
//   avgResponseTime: 2.5,  // milliseconds
//   evictionCount: 10,
//   expiredCount: 5
// }
```

### Disk Cache Health Metrics
```typescript
const diskHealth = diskCache.getHealthMetrics();
// {
//   totalRequests: 1000,
//   successfulRequests: 950,
//   failedRequests: 50,
//   failureRate: 0.05,
//   avgResponseTime: 45.2,
//   lastHealthCheck: Date,
//   isHealthy: true
// }
```

### Query Performance Metrics
```typescript
const queryStats = queryOptimizer.getCacheStats();
// {
//   size: 75,
//   hitRate: 0.72,
//   totalHits: 540,
//   memoryUsage: 1024000
// }

const performanceMetrics = queryOptimizer.getPerformanceMetrics();
// Array of QueryPerformanceMetrics with execution times, row counts, etc.
```

### Multi-Tier Statistics
```typescript
const overallStats = multiTierCache.getStats();
// {
//   memory: { /* memory cache stats */ },
//   disk: { /* disk cache health */ },
//   query: { /* query cache stats */ },
//   overall: {
//     totalRequests: 5000,
//     cacheHitRate: 0.78,
//     avgResponseTime: 25.3,
//     errorRate: 0.02
//   }
// }
```

## Health Monitoring and Alerts

### Disk Cache Health Alerts
```typescript
diskCache.onHealthAlert((metrics) => {
  if (!metrics.isHealthy) {
    console.warn('Disk cache unhealthy:', {
      failureRate: metrics.failureRate,
      avgResponseTime: metrics.avgResponseTime,
    });
    // Send alert to monitoring system
  }
});
```

### Slow Query Detection
```typescript
queryOptimizer.onSlowQuery((alert) => {
  console.warn('Slow query detected:', {
    queryId: alert.queryId,
    executionTime: alert.executionTime,
    threshold: alert.threshold,
    query: alert.query,
  });
  // Log to monitoring system
});
```

## Cache Warming

Pre-populate caches with critical data for optimal performance:

```typescript
// Memory cache warming
await memoryCache.warmCache([
  {
    key: 'critical-data-1',
    fetcher: async () => await fetchCriticalData1(),
    ttl: 300000,
    tags: ['critical'],
  },
]);

// Disk cache warming
await diskCache.warmCache([
  {
    key: 'important-data',
    fetcher: async () => await fetchImportantData(),
    tags: [CacheTags.PROPERTIES],
    ttl: 600,
  },
]);

// Multi-tier cache warming
await multiTierCache.warmCache([
  {
    key: 'homepage-data',
    fetcher: async () => await fetchHomepageData(),
    options: {
      memoryTTL: 60000,
      diskTTL: 300,
      tags: ['homepage'],
    },
  },
]);
```

## Best Practices

### 1. Cache Key Design
- Use consistent naming conventions
- Include relevant parameters in keys
- Use cache key generators for consistency
- Avoid overly long keys

### 2. TTL Configuration
- Set appropriate TTLs based on data freshness requirements
- Use shorter TTLs for frequently changing data
- Use longer TTLs for static or rarely changing data
- Consider different TTLs for different cache tiers

### 3. Tag-based Invalidation
- Use descriptive and consistent tags
- Group related data with common tags
- Invalidate at the appropriate granularity
- Avoid over-invalidation

### 4. Error Handling
- Always provide fallback mechanisms
- Handle cache failures gracefully
- Log cache errors for monitoring
- Don't let cache failures break application functionality

### 5. Performance Monitoring
- Monitor cache hit rates regularly
- Set up alerts for performance degradation
- Track slow queries and optimize them
- Monitor memory usage and adjust cache sizes

### 6. Cache Warming
- Warm critical data during application startup
- Use background processes for cache warming
- Prioritize frequently accessed data
- Monitor warming effectiveness

## Configuration

### Default Configuration
```typescript
const defaultConfig = {
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
    alertThreshold: 0.1, // 10% failure rate
  },
  query: {
    slowQueryThreshold: 1000, // 1 second
    batchSize: 10,
    batchTimeout: 100, // 100ms
    enableQueryCache: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    enablePerformanceMonitoring: true,
    connectionPoolSize: 10,
  },
  enableFallback: true,
  enableMetrics: true,
};
```

### Environment-specific Configuration
```typescript
// Production configuration
const productionConfig = {
  memory: {
    maxSize: 5000,
    defaultTTL: 10 * 60 * 1000, // 10 minutes
  },
  disk: {
    defaultTTL: 600, // 10 minutes
    maxRetries: 5,
  },
  query: {
    slowQueryThreshold: 500, // 500ms
    batchSize: 20,
    connectionPoolSize: 20,
  },
};

// Development configuration
const developmentConfig = {
  memory: {
    maxSize: 100,
    defaultTTL: 60 * 1000, // 1 minute
  },
  disk: {
    defaultTTL: 60, // 1 minute
  },
  query: {
    slowQueryThreshold: 2000, // 2 seconds
    enablePerformanceMonitoring: false,
  },
};
```

## Testing

The caching system includes comprehensive unit tests:

```bash
# Run all cache tests
npm test lib/cache

# Run specific test files
npm test lib/cache/__tests__/memory-cache.test.ts
npm test lib/cache/__tests__/disk-cache.test.ts
npm test lib/cache/__tests__/query-optimizer.test.ts
npm test lib/cache/__tests__/multi-tier-cache.test.ts
```

## Integration Examples

### Next.js App Router Integration
```typescript
// app/layout.tsx
import { defaultMultiTierCache } from '@/lib/cache/multi-tier-cache';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Warm cache with critical data
  await defaultMultiTierCache.warmCache([
    {
      key: 'navigation-data',
      fetcher: async () => await getNavigationData(),
      options: { tags: ['navigation'] },
    },
  ]);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Server Actions Integration
```typescript
// actions/properties/get-properties-action.ts
import { defaultMultiTierCache, CacheUtils } from '@/lib/cache/multi-tier-cache';

export async function getPropertiesAction(filters: PropertyFilters) {
  const cacheKey = CacheUtils.searchKey('properties', JSON.stringify(filters), {});
  
  return await defaultMultiTierCache.get(
    cacheKey,
    async () => {
      // Actual database query
      return await db.select().from(properties).where(/* filters */);
    },
    {
      memoryTTL: 2 * 60 * 1000, // 2 minutes
      diskTTL: 300, // 5 minutes
      tags: ['properties', 'search'],
    }
  );
}
```

### API Route Integration
```typescript
// app/api/properties/route.ts
import { defaultMultiTierCache } from '@/lib/cache/multi-tier-cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = Object.fromEntries(searchParams);
  
  try {
    const properties = await defaultMultiTierCache.getProperties(filters, {
      memoryTTL: 60 * 1000, // 1 minute
      diskTTL: 300, // 5 minutes
      tags: ['properties', 'api'],
    });
    
    return Response.json(properties);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
```

This multi-tier caching system provides a robust, scalable solution for optimizing performance across the TRPE real estate platform while maintaining data consistency and providing comprehensive monitoring capabilities.