import { createAdvancedCache } from '@/lib/advanced-cache';

interface CacheMetrics {
  namespace: string;
  hitRate: number;
  missRate: number;
  totalRequests: number;
  avgResponseTime: number;
  memoryUsage: number;
  diskUsage: number;
  errorRate: number;
  lastCleared: Date | null;
  popularKeys: Array<{ key: string; hits: number }>;
}

interface CacheHealth {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  issues: string[];
  recommendations: string[];
}

class CacheHealthMonitor {
  private static instance: CacheHealthMonitor;
  private metrics = new Map<string, CacheMetrics>();
  private healthChecks: Array<(metrics: CacheMetrics) => CacheHealth> = [];
  
  static getInstance(): CacheHealthMonitor {
    if (!this.instance) {
      this.instance = new CacheHealthMonitor();
      this.instance.setupHealthChecks();
    }
    return this.instance;
  }
  
  private setupHealthChecks() {
    // Hit rate health check
    this.healthChecks.push((metrics) => {
      const issues: string[] = [];
      const recommendations: string[] = [];
      let score = 100;
      
      if (metrics.hitRate < 0.5) {
        issues.push(`Low hit rate: ${(metrics.hitRate * 100).toFixed(1)}%`);
        recommendations.push('Consider increasing cache TTL or warming cache');
        score -= 30;
      } else if (metrics.hitRate < 0.7) {
        issues.push(`Moderate hit rate: ${(metrics.hitRate * 100).toFixed(1)}%`);
        recommendations.push('Optimize cache keys and TTL settings');
        score -= 15;
      }
      
      // Error rate check
      if (metrics.errorRate > 0.1) {
        issues.push(`High error rate: ${(metrics.errorRate * 100).toFixed(1)}%`);
        recommendations.push('Investigate cache errors and fallback mechanisms');
        score -= 25;
      } else if (metrics.errorRate > 0.05) {
        issues.push(`Moderate error rate: ${(metrics.errorRate * 100).toFixed(1)}%`);
        recommendations.push('Monitor cache errors closely');
        score -= 10;
      }
      
      // Memory usage check
      if (metrics.memoryUsage > 0.9) {
        issues.push(`High memory usage: ${(metrics.memoryUsage * 100).toFixed(1)}%`);
        recommendations.push('Consider reducing memory TTL or increasing memory limits');
        score -= 20;
      }
      
      // Response time check
      if (metrics.avgResponseTime > 1000) {
        issues.push(`Slow response time: ${metrics.avgResponseTime.toFixed(0)}ms`);
        recommendations.push('Optimize cache storage or reduce data size');
        score -= 15;
      }
      
      let status: CacheHealth['status'] = 'healthy';
      if (score < 50) status = 'critical';
      else if (score < 80) status = 'warning';
      
      return { status, score, issues, recommendations };
    });
  }
  
  updateMetrics(namespace: string, metrics: Partial<CacheMetrics>) {
    const existing = this.metrics.get(namespace) || {
      namespace,
      hitRate: 0,
      missRate: 0,
      totalRequests: 0,
      avgResponseTime: 0,
      memoryUsage: 0,
      diskUsage: 0,
      errorRate: 0,
      lastCleared: null,
      popularKeys: []
    };
    
    this.metrics.set(namespace, { ...existing, ...metrics });
  }
  
  getMetrics(namespace?: string) {
    if (namespace) {
      return this.metrics.get(namespace);
    }
    return Array.from(this.metrics.values());
  }
  
  getHealth(): Record<string, CacheHealth>;
  getHealth(namespace: string): CacheHealth;
  getHealth(namespace?: string): CacheHealth | Record<string, CacheHealth> {
    if (namespace) {
      const metrics = this.metrics.get(namespace);
      if (!metrics) {
        return {
          status: 'warning',
          score: 0,
          issues: ['No metrics available'],
          recommendations: ['Initialize cache monitoring']
        };
      }
      
      const healthResults = this.healthChecks.map(check => check(metrics));
      
      // Aggregate health scores
      const avgScore = healthResults.reduce((sum, result) => sum + result.score, 0) / healthResults.length;
      const allIssues = healthResults.flatMap(result => result.issues);
      const allRecommendations = healthResults.flatMap(result => result.recommendations);
      
      let status: CacheHealth['status'] = 'healthy';
      if (avgScore < 50) status = 'critical';
      else if (avgScore < 80) status = 'warning';
      
      return {
        status,
        score: Math.round(avgScore),
        issues: [...new Set(allIssues)], // Remove duplicates
        recommendations: [...new Set(allRecommendations)]
      };
    } else {
      // Return health for all namespaces
      const result: Record<string, CacheHealth> = {};
      for (const [ns, metrics] of this.metrics.entries()) {
        const healthResults = this.healthChecks.map(check => check(metrics));
        
        const avgScore = healthResults.reduce((sum, result) => sum + result.score, 0) / healthResults.length;
        const allIssues = healthResults.flatMap(result => result.issues);
        const allRecommendations = healthResults.flatMap(result => result.recommendations);
        
        let status: CacheHealth['status'] = 'healthy';
        if (avgScore < 50) status = 'critical';
        else if (avgScore < 80) status = 'warning';
        
        result[ns] = {
          status,
          score: Math.round(avgScore),
          issues: [...new Set(allIssues)],
          recommendations: [...new Set(allRecommendations)]
        };
      }
      return result;
    }
  }
  
  clearMetrics(namespace?: string) {
    if (namespace) {
      this.metrics.delete(namespace);
    } else {
      this.metrics.clear();
    }
  }
}

// Enhanced cache with monitoring integration
export function createMonitoredCache(options: {
  keyPrefix: string;
  memoryTTL: number;
  diskTTL: number;
  namespace: string;
}) {
  const cache = createAdvancedCache(options);
  const monitor = CacheHealthMonitor.getInstance();
  
  // Wrap cache methods with monitoring
  const originalGet = cache.get.bind(cache);
  const originalSet = cache.set.bind(cache);
  const originalClear = cache.clear.bind(cache);
  
  let requestCount = 0;
  let hitCount = 0;
  let errorCount = 0;
  let totalResponseTime = 0;
  
  cache.get = async (key: string, fetcher?: () => Promise<any>) => {
    const startTime = Date.now();
    requestCount++;
    
    try {
      const result = await originalGet(key, fetcher);
      const responseTime = Date.now() - startTime;
      totalResponseTime += responseTime;
      
      if (result !== null) {
        hitCount++;
      }
      
      // Update metrics periodically
      if (requestCount % 10 === 0) {
        monitor.updateMetrics(options.namespace, {
          hitRate: hitCount / requestCount,
          missRate: (requestCount - hitCount) / requestCount,
          totalRequests: requestCount,
          avgResponseTime: totalResponseTime / requestCount,
          errorRate: errorCount / requestCount
        });
      }
      
      return result;
    } catch (error) {
      errorCount++;
      const responseTime = Date.now() - startTime;
      totalResponseTime += responseTime;
      
      monitor.updateMetrics(options.namespace, {
        hitRate: hitCount / requestCount,
        missRate: (requestCount - hitCount) / requestCount,
        totalRequests: requestCount,
        avgResponseTime: totalResponseTime / requestCount,
        errorRate: errorCount / requestCount
      });
      
      throw error;
    }
  };
  
  cache.clear = async () => {
    await originalClear();
    monitor.updateMetrics(options.namespace, {
      lastCleared: new Date()
    });
  };
  
  return cache;
}

export { CacheHealthMonitor };
