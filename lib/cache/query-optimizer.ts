/**
 * Database Query Optimization System
 * 
 * Provides intelligent query batching, connection pooling, and performance monitoring
 * for optimal database performance in the TRPE real estate platform.
 */

import { db } from '@/db/drizzle';
import { sql } from 'drizzle-orm';

export interface QueryPerformanceMetrics {
  queryId: string;
  executionTime: number;
  rowsAffected: number;
  cacheHit: boolean;
  timestamp: Date;
  queryType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  tableName?: string;
}

export interface SlowQueryAlert {
  queryId: string;
  executionTime: number;
  threshold: number;
  query: string;
  timestamp: Date;
}

export interface QueryOptimizerConfig {
  slowQueryThreshold: number; // in milliseconds
  batchSize: number;
  batchTimeout: number; // in milliseconds
  enableQueryCache: boolean;
  cacheTimeout: number; // in milliseconds
  enablePerformanceMonitoring: boolean;
  connectionPoolSize: number;
}

export interface BatchedQuery<T = any> {
  id: string;
  query: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  timestamp: Date;
  priority: number;
}

export interface QueryCacheEntry<T> {
  data: T;
  timestamp: Date;
  expiresAt: Date;
  hitCount: number;
}

export class QueryOptimizer {
  private queryCache = new Map<string, QueryCacheEntry<any>>();
  private batchQueue: BatchedQuery[] = [];
  private batchTimer?: NodeJS.Timeout;
  private performanceMetrics: QueryPerformanceMetrics[] = [];
  private slowQueryCallbacks: Array<(alert: SlowQueryAlert) => void> = [];
  private queryIdCounter = 0;

  constructor(private config: QueryOptimizerConfig) {
    if (config.enablePerformanceMonitoring) {
      this.startPerformanceMonitoring();
    }
  }

  /**
   * Execute optimized property queries with intelligent batching
   */
  async optimizePropertyQueries(filters: {
    communityId?: string;
    propertyType?: string;
    priceRange?: { min: number; max: number };
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    const queryId = this.generateQueryId('property-search');
    const cacheKey = `properties:${JSON.stringify(filters)}`;

    // Check cache first
    if (this.config.enableQueryCache) {
      const cached = this.getFromCache<any[]>(cacheKey);
      if (cached) {
        this.recordMetrics(queryId, 0, cached.length, true, 'SELECT', 'properties');
        return cached;
      }
    }

    const startTime = Date.now();

    try {
      // Build optimized query with raw SQL to avoid type issues
      let sqlQuery = sql`
        SELECT p.*, c.name as community_name, 
               ARRAY_AGG(DISTINCT a.name) as amenities
        FROM properties p
        LEFT JOIN communities c ON p.community_id = c.id
        LEFT JOIN property_amenities pa ON p.id = pa.property_id
        LEFT JOIN amenities a ON pa.amenity_id = a.id
      `;

      // Apply filters with optimized WHERE clauses
      const conditions: string[] = [];

      if (filters.communityId) {
        conditions.push(`p.community_id = ${filters.communityId}`);
      }

      if (filters.propertyType) {
        conditions.push(`p.property_type = '${filters.propertyType}'`);
      }

      if (filters.priceRange) {
        conditions.push(
          `p.price >= ${filters.priceRange.min} AND p.price <= ${filters.priceRange.max}`
        );
      }

      if (filters.bedrooms) {
        conditions.push(`p.bedrooms = ${filters.bedrooms}`);
      }

      if (filters.bathrooms) {
        conditions.push(`p.bathrooms = ${filters.bathrooms}`);
      }

      if (filters.amenities && filters.amenities.length > 0) {
        const amenityList = filters.amenities.map(a => `'${a}'`).join(', ');
        conditions.push(`a.name IN (${amenityList})`);
      }

      if (conditions.length > 0) {
        sqlQuery = sql`${sqlQuery} WHERE ${sql.raw(conditions.join(' AND '))}`;
      }

      // Add GROUP BY for aggregation
      sqlQuery = sql`${sqlQuery} GROUP BY p.id, c.name`;

      // Add pagination
      if (filters.limit) {
        sqlQuery = sql`${sqlQuery} LIMIT ${filters.limit}`;
      }

      if (filters.offset) {
        sqlQuery = sql`${sqlQuery} OFFSET ${filters.offset}`;
      }

      // Execute with performance monitoring
      const result = await this.executeWithMonitoring<any[]>(queryId, db.execute(sqlQuery), 'SELECT', 'properties');

      // Cache the result
      if (this.config.enableQueryCache) {
        this.setCache(cacheKey, result);
      }

      return result;
    } catch (error) {
      this.recordMetrics(queryId, Date.now() - startTime, 0, false, 'SELECT', 'properties');
      throw error;
    }
  }

  /**
   * Optimize community queries with related data
   */
  async optimizeCommunityQueries(params: {
    cityId?: string;
    luxeOnly?: boolean;
    withProperties?: boolean;
    withSubCommunities?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    const queryId = this.generateQueryId('community-search');
    const cacheKey = `communities:${JSON.stringify(params)}`;

    if (this.config.enableQueryCache) {
      const cached = this.getFromCache<any[]>(cacheKey);
      if (cached) {
        this.recordMetrics(queryId, 0, cached.length, true, 'SELECT', 'communities');
        return cached;
      }
    }

    const startTime = Date.now();

    try {
      // Build base query
      let sqlQuery = sql`
        SELECT c.*, ci.name as city_name
        FROM communities c
        LEFT JOIN cities ci ON c.city_id = ci.id
      `;

      // Add related data joins based on parameters
      if (params.withProperties) {
        sqlQuery = sql`${sqlQuery} LEFT JOIN properties p ON c.id = p.community_id`;
      }

      if (params.withSubCommunities) {
        sqlQuery = sql`${sqlQuery} LEFT JOIN sub_communities sc ON c.id = sc.community_id`;
      }

      // Apply filters
      const conditions: string[] = [];

      if (params.cityId) {
        conditions.push(`c.city_id = ${params.cityId}`);
      }

      if (params.luxeOnly) {
        sqlQuery = sql`${sqlQuery} LEFT JOIN luxe_communities lc ON c.id = lc.community_id`;
        conditions.push('lc.id IS NOT NULL');
      }

      if (conditions.length > 0) {
        sqlQuery = sql`${sqlQuery} WHERE ${sql.raw(conditions.join(' AND '))}`;
      }

      // Add pagination
      if (params.limit) {
        sqlQuery = sql`${sqlQuery} LIMIT ${params.limit}`;
      }

      if (params.offset) {
        sqlQuery = sql`${sqlQuery} OFFSET ${params.offset}`;
      }

      const result = await this.executeWithMonitoring<any[]>(queryId, db.execute(sqlQuery), 'SELECT', 'communities');

      if (this.config.enableQueryCache) {
        this.setCache(cacheKey, result);
      }

      return result;
    } catch (error) {
      this.recordMetrics(queryId, Date.now() - startTime, 0, false, 'SELECT', 'communities');
      throw error;
    }
  }

  /**
   * Optimize insight queries with author and content data
   */
  async optimizeInsightQueries(pagination: {
    page: number;
    limit: number;
    category?: string;
    authorId?: string;
    luxeOnly?: boolean;
    published?: boolean;
  }): Promise<{ data: any[]; total: number }> {
    const queryId = this.generateQueryId('insight-search');
    const cacheKey = `insights:${JSON.stringify(pagination)}`;

    if (this.config.enableQueryCache) {
      const cached = this.getFromCache<{ data: any[]; total: number }>(cacheKey);
      if (cached) {
        this.recordMetrics(queryId, 0, cached.data.length, true, 'SELECT', 'insights');
        return cached;
      }
    }

    const startTime = Date.now();

    try {
      // Build optimized query with raw SQL
      let dataQuery = sql`
        SELECT i.*, a.name as author_name, m.url as featured_image_url
        FROM insights i
        LEFT JOIN authors a ON i.author_id = a.id
        LEFT JOIN media m ON i.featured_image_id = m.id
      `;

      let countQuery = sql`
        SELECT COUNT(*) as count
        FROM insights i
      `;

      // Apply filters
      const conditions: string[] = [];

      if (pagination.category) {
        conditions.push(`i.category = '${pagination.category}'`);
      }

      if (pagination.authorId) {
        conditions.push(`i.author_id = ${pagination.authorId}`);
      }

      if (pagination.luxeOnly) {
        conditions.push('i.is_luxe = true');
      }

      if (pagination.published !== undefined) {
        conditions.push(`i.published = ${pagination.published}`);
      }

      if (conditions.length > 0) {
        const whereClause = conditions.join(' AND ');
        dataQuery = sql`${dataQuery} WHERE ${sql.raw(whereClause)}`;
        countQuery = sql`${countQuery} WHERE ${sql.raw(whereClause)}`;
      }

      // Add pagination to data query
      const offset = (pagination.page - 1) * pagination.limit;
      dataQuery = sql`${dataQuery} ORDER BY i.created_at DESC LIMIT ${pagination.limit} OFFSET ${offset}`;

      // Execute both queries in parallel
      const [data, countResult] = await Promise.all([
        this.executeWithMonitoring<any[]>(queryId + '-data', db.execute(dataQuery), 'SELECT', 'insights'),
        this.executeWithMonitoring<any[]>(queryId + '-count', db.execute(countQuery), 'SELECT', 'insights'),
      ]);

      const result = {
        data,
        total: countResult[0]?.count || 0,
      };

      if (this.config.enableQueryCache) {
        this.setCache(cacheKey, result);
      }

      return result;
    } catch (error) {
      this.recordMetrics(queryId, Date.now() - startTime, 0, false, 'SELECT', 'insights');
      throw error;
    }
  }

  /**
   * Batch multiple queries for efficient execution
   */
  async batchQueries<T>(queries: Array<{
    id: string;
    query: () => Promise<T>;
    priority?: number;
  }>): Promise<Map<string, T>> {
    const results = new Map<string, T>();
    const batchPromises: Array<Promise<void>> = [];

    // Sort queries by priority (higher priority first)
    const sortedQueries = queries.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Process queries in batches
    for (let i = 0; i < sortedQueries.length; i += this.config.batchSize) {
      const batch = sortedQueries.slice(i, i + this.config.batchSize);
      
      const batchPromise = Promise.all(
        batch.map(async ({ id, query }) => {
          try {
            const result = await query();
            results.set(id, result);
          } catch (error) {
            console.error(`Batched query ${id} failed:`, error);
            throw error;
          }
        })
      );

      batchPromises.push(batchPromise.then(() => {}));
    }

    await Promise.all(batchPromises);
    return results;
  }

  /**
   * Add query to batch queue for deferred execution
   */
  addToBatch<T>(query: () => Promise<T>, priority: number = 0): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const batchedQuery: BatchedQuery<T> = {
        id: this.generateQueryId('batched'),
        query,
        resolve,
        reject,
        timestamp: new Date(),
        priority,
      };

      this.batchQueue.push(batchedQuery);

      // Start batch timer if not already running
      if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => {
          this.processBatchQueue();
        }, this.config.batchTimeout);
      }

      // Process immediately if batch is full
      if (this.batchQueue.length >= this.config.batchSize) {
        this.processBatchQueue();
      }
    });
  }

  /**
   * Get query performance metrics
   */
  getPerformanceMetrics(): QueryPerformanceMetrics[] {
    return [...this.performanceMetrics];
  }

  /**
   * Get slow query alerts
   */
  onSlowQuery(callback: (alert: SlowQueryAlert) => void): void {
    this.slowQueryCallbacks.push(callback);
  }

  /**
   * Clear performance metrics
   */
  clearMetrics(): void {
    this.performanceMetrics = [];
  }

  /**
   * Invalidate query cache by pattern
   */
  invalidateCache(pattern: string): number {
    let invalidated = 0;
    const regex = new RegExp(pattern);

    for (const [key] of this.queryCache.entries()) {
      if (regex.test(key)) {
        this.queryCache.delete(key);
        invalidated++;
      }
    }

    return invalidated;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    totalHits: number;
    memoryUsage: number;
  } {
    let totalHits = 0;
    let memoryUsage = 0;

    for (const entry of this.queryCache.values()) {
      totalHits += entry.hitCount;
      memoryUsage += JSON.stringify(entry.data).length * 2; // Rough estimation
    }

    const totalRequests = this.performanceMetrics.length;
    const cacheHits = this.performanceMetrics.filter(m => m.cacheHit).length;
    const hitRate = totalRequests > 0 ? cacheHits / totalRequests : 0;

    return {
      size: this.queryCache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      totalHits,
      memoryUsage,
    };
  }

  /**
   * Execute query with performance monitoring
   */
  private async executeWithMonitoring<T>(
    queryId: string,
    query: any,
    queryType: QueryPerformanceMetrics['queryType'],
    tableName?: string
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await query;
      const executionTime = Date.now() - startTime;
      const rowsAffected = Array.isArray(result) ? result.length : 1;

      this.recordMetrics(queryId, executionTime, rowsAffected, false, queryType, tableName);

      // Check for slow queries
      if (executionTime > this.config.slowQueryThreshold) {
        this.alertSlowQuery(queryId, executionTime, query.toString());
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.recordMetrics(queryId, executionTime, 0, false, queryType, tableName);
      throw error;
    }
  }

  /**
   * Process batch queue
   */
  private async processBatchQueue(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = undefined;
    }

    if (this.batchQueue.length === 0) {
      return;
    }

    const batch = this.batchQueue.splice(0, this.config.batchSize);
    
    // Sort by priority
    batch.sort((a, b) => b.priority - a.priority);

    // Execute all queries in parallel
    const promises = batch.map(async (batchedQuery) => {
      try {
        const result = await batchedQuery.query();
        batchedQuery.resolve(result);
      } catch (error) {
        batchedQuery.reject(error as Error);
      }
    });

    await Promise.allSettled(promises);

    // Continue processing if there are more queries
    if (this.batchQueue.length > 0) {
      this.batchTimer = setTimeout(() => {
        this.processBatchQueue();
      }, this.config.batchTimeout);
    }
  }

  /**
   * Record performance metrics
   */
  private recordMetrics(
    queryId: string,
    executionTime: number,
    rowsAffected: number,
    cacheHit: boolean,
    queryType: QueryPerformanceMetrics['queryType'],
    tableName?: string
  ): void {
    const metric: QueryPerformanceMetrics = {
      queryId,
      executionTime,
      rowsAffected,
      cacheHit,
      timestamp: new Date(),
      queryType,
      tableName,
    };

    this.performanceMetrics.push(metric);

    // Keep only recent metrics (last 1000)
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }
  }

  /**
   * Alert for slow queries
   */
  private alertSlowQuery(queryId: string, executionTime: number, query: string): void {
    const alert: SlowQueryAlert = {
      queryId,
      executionTime,
      threshold: this.config.slowQueryThreshold,
      query,
      timestamp: new Date(),
    };

    this.slowQueryCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Slow query callback failed:', error);
      }
    });
  }

  /**
   * Get data from cache
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.queryCache.get(key);
    
    if (!entry) {
      return null;
    }

    if (entry.expiresAt < new Date()) {
      this.queryCache.delete(key);
      return null;
    }

    entry.hitCount++;
    return entry.data as T;
  }

  /**
   * Set data in cache
   */
  private setCache<T>(key: string, data: T): void {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.cacheTimeout);

    this.queryCache.set(key, {
      data,
      timestamp: now,
      expiresAt,
      hitCount: 0,
    });
  }

  /**
   * Generate unique query ID
   */
  private generateQueryId(prefix: string): string {
    return `${prefix}-${++this.queryIdCounter}-${Date.now()}`;
  }

  /**
   * Start performance monitoring
   */
  private startPerformanceMonitoring(): void {
    // Set up periodic cleanup of old metrics
    setInterval(() => {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      this.performanceMetrics = this.performanceMetrics.filter(
        metric => metric.timestamp > cutoff
      );
    }, 60 * 60 * 1000); // Run every hour
  }
}

// Default query optimizer instance
export const defaultQueryOptimizer = new QueryOptimizer({
  slowQueryThreshold: 1000, // 1 second
  batchSize: 10,
  batchTimeout: 100, // 100ms
  enableQueryCache: true,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  enablePerformanceMonitoring: true,
  connectionPoolSize: 10,
});

// Setup default slow query monitoring
if (typeof window === 'undefined') { // Server-side only
  defaultQueryOptimizer.onSlowQuery((alert) => {
    console.warn('Slow query detected:', {
      queryId: alert.queryId,
      executionTime: `${alert.executionTime}ms`,
      threshold: `${alert.threshold}ms`,
      timestamp: alert.timestamp.toISOString(),
    });
  });
}