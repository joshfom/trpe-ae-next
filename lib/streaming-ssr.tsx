import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';

interface StreamingConfig {
  batchSize: number;
  loadingComponent: React.ComponentType;
  errorBoundary?: React.ComponentType<{ error: Error; reset: () => void }>;
  priority?: 'high' | 'low';
}

interface PropertyBatch {
  properties: any[];
  hasMore: boolean;
  nextCursor?: string;
}

/**
 * Progressive property loading for large datasets
 * Streams properties in batches to improve perceived performance
 */
export class PropertyStreamer {
  private cache = new Map<string, PropertyBatch>();
  
  constructor(private config: StreamingConfig) {}
  
  /**
   * Create a streaming property grid component
   */
  createStreamingGrid(
    fetcher: (cursor?: string, limit?: number) => Promise<PropertyBatch>,
    renderItem: (property: any, index: number) => React.ReactNode,
    options: {
      initialBatch?: PropertyBatch;
      cacheKey: string;
      revalidate?: number;
    }
  ) {
    const { batchSize, loadingComponent: LoadingComponent } = this.config;
    
    // Cached batch fetcher
    const getCachedBatch = unstable_cache(
      async (cursor?: string) => {
        return fetcher(cursor, batchSize);
      },
      [`property-batch-${options.cacheKey}`],
      {
        revalidate: options.revalidate || 300, // 5 minutes default
        tags: ['properties', 'property-batches']
      }
    );
    
    const PropertyBatch = async ({ cursor }: { cursor?: string }) => {
      try {
        const batch = cursor ? await getCachedBatch(cursor) : options.initialBatch;
        
        if (!batch || batch.properties.length === 0) {
          return (
            <div className="col-span-full text-center py-8 text-gray-500">
              No properties found
            </div>
          );
        }
        
        return (
          <>
            {batch.properties.map(renderItem)}
            {batch.hasMore && (
              <Suspense 
                fallback={
                  <div className="col-span-full">
                    <LoadingComponent />
                  </div>
                }
              >
                <PropertyBatch cursor={batch.nextCursor} />
              </Suspense>
            )}
          </>
        );
      } catch (error) {
        console.error('Error loading property batch:', error);
        return (
          <div className="col-span-full text-center py-8 text-red-500">
            Failed to load properties
          </div>
        );
      }
    };
    
    return PropertyBatch;
  }
  
  /**
   * Create an infinite scroll component for properties
   */
  createInfiniteScroll(
    fetcher: (cursor?: string, limit?: number) => Promise<PropertyBatch>,
    renderItem: (property: any, index: number) => React.ReactNode,
    options: {
      cacheKey: string;
      threshold?: number;
      revalidate?: number;
    }
  ) {
    const InfinitePropertyGrid = ({ initialData }: { initialData?: PropertyBatch }) => {
      return (
        <div className="property-infinite-grid">
          <Suspense fallback={<this.config.loadingComponent />}>
            {/* Client-side infinite scroll implementation would go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialData?.properties.map(renderItem)}
            </div>
          </Suspense>
        </div>
      );
    };
    
    return InfinitePropertyGrid;
  }
}

/**
 * Default loading skeletons for property grids
 */
export const PropertyGridSkeleton = ({ count = 9 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
        <div className="aspect-video bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

export const PropertyListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
        <div className="flex space-x-4">
          <div className="w-24 h-24 bg-gray-200 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Progressive enhancement for property search
 */
export class PropertySearchEnhancer {
  static enhanceWithStreaming(
    searchComponent: React.ComponentType<any>,
    resultsComponent: React.ComponentType<any>
  ) {
    return function EnhancedPropertySearch(props: any) {
      const SearchComponent = searchComponent;
      const ResultsComponent = resultsComponent;
      
      return (
        <div className="property-search-enhanced">
          <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse rounded" />}>
            {/* Search filters load first */}
            <SearchComponent {...props} />
          </Suspense>
          
          <Suspense fallback={<PropertyGridSkeleton />}>
            {/* Results stream in after filters */}
            <ResultsComponent {...props} />
          </Suspense>
        </div>
      );
    };
  }
  
  static createSearchWithPagination(
    fetcher: (params: any) => Promise<{ properties: any[]; total: number; hasMore: boolean }>,
    options: {
      pageSize: number;
      cacheKey: string;
      revalidate?: number;
    }
  ) {
    const SearchResults = async ({ searchParams }: { searchParams: any }) => {
      const page = parseInt(searchParams.page || '1');
      const offset = (page - 1) * options.pageSize;
      
      const getCachedResults = unstable_cache(
        async (params: any) => {
          return fetcher({ ...params, offset, limit: options.pageSize });
        },
        [`search-results-${options.cacheKey}`],
        {
          revalidate: options.revalidate || 300,
          tags: ['properties', 'search-results']
        }
      );
      
      try {
        const results = await getCachedResults(searchParams);
        
        return (
          <div className="search-results">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.properties.map((property, index) => (
                <div key={property.id} className="property-card">
                  {/* Property card content */}
                </div>
              ))}
            </div>
            
            {results.hasMore && (
              <div className="text-center mt-8">
                <button className="btn-load-more">
                  Load More Properties
                </button>
              </div>
            )}
          </div>
        );
      } catch (error) {
        return (
          <div className="text-center py-8 text-red-500">
            Failed to load search results
          </div>
        );
      }
    };
    
    return SearchResults;
  }
}

/**
 * Edge runtime optimized property fetcher
 */
export const createEdgeOptimizedPropertyFetcher = (
  baseQuery: string,
  options: {
    runtime: 'edge' | 'nodejs';
    region?: string;
  }
) => {
  if (options.runtime === 'edge') {
    // Simplified query for edge runtime using path-based routing
    return async (searchPath: string) => {
      // Use path-based URLs for edge runtime
      // Avoid heavy database joins
      // Return essential data only
      
      const basicProperties = await fetch(`${searchPath}?format=json`);
      return basicProperties.json();
    };
  }
  
  // Full-featured query for Node.js runtime
  return async (filters: any) => {
    // Complex database operations
    // Multiple joins and aggregations
    // Rich data with relationships
    
    return { properties: [], total: 0, hasMore: false };
  };
};

/**
 * Cache warming utility for popular property searches
 */
export class PropertyCacheWarmer {
  private static popularSearchPaths = [
    '/dubai/properties/residential/for-sale/property-type-apartment',
    '/dubai/properties/residential/for-rent/property-type-villa',
    '/dubai/properties/residential/for-sale/area-dubai-marina',
    '/dubai/properties/residential/for-rent/area-downtown-dubai',
  ];
  
  static async warmCache() {
    console.log('🔥 Warming property cache...');
    
    for (const searchPath of this.popularSearchPaths) {
      try {
        // Pre-load popular searches using path-based URLs
        await fetch(`${searchPath}`);
        console.log(`✅ Warmed cache for:`, searchPath);
      } catch (error) {
        console.error(`❌ Failed to warm cache for:`, searchPath, error);
      }
    }
    
    console.log('🎯 Cache warming completed');
  }
  
  static scheduleWarming() {
    // Warm cache every 6 hours
    setInterval(() => {
      this.warmCache();
    }, 6 * 60 * 60 * 1000);
    
    // Initial warming
    this.warmCache();
  }
}
