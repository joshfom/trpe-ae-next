/**
 * Example of an optimized Server Component that prevents clientModules errors
 * This component demonstrates best practices for Server Component architecture
 */

import React from 'react';
import { createSafeServerComponent, createSafeDbQuery } from '@/lib/server-component-utils';
import { ProductionErrorBoundary } from '@/components/production-error-boundary';
import { db } from '@/db/drizzle';
import { communityTable } from '@/db/schema/community-table';
import { asc, eq } from 'drizzle-orm';

interface SafeServerComponentExampleProps {
  limit?: number;
  featured?: boolean;
}

// Safe database query with error handling and caching
const getSafeCommunities = createSafeDbQuery(
  async (limit: number = 10, featured: boolean = false) => {
    const communities = await db.query.communityTable.findMany({
      where: featured ? eq(communityTable.featured, true) : undefined,
      orderBy: [asc(communityTable.name)],
      limit,
      columns: {
        id: true,
        name: true,
        slug: true,
        image: true,
        featured: true
      }
    });
    
    return communities;
  },
  {
    queryName: 'getSafeCommunities',
    fallback: [], // Return empty array on error
    cacheOptions: {
      key: 'safe-communities',
      revalidate: 3600,
      tags: ['communities']
    }
  }
);

// Core component implementation
async function SafeServerComponentImplementation({ 
  limit = 10, 
  featured = false 
}: SafeServerComponentExampleProps): Promise<React.ReactElement> {
  
  // Use the safe database query
  const communities = await getSafeCommunities(limit, featured);
  
  if (communities.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No communities found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {communities.map((community) => (
        <div 
          key={community.id} 
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          {community.image && (
            <img 
              src={community.image} 
              alt={community.name || 'Community image'}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
          )}
          <h3 className="font-medium text-lg">{community.name}</h3>
          {community.featured && (
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
              Featured
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// Create the safe server component with validation and error handling
const SafeServerComponentExample = createSafeServerComponent(
  SafeServerComponentImplementation,
  {
    name: 'SafeServerComponentExample',
    requiredProps: [], // No required props for this example
    fallbackMessage: 'Failed to load communities'
  }
);

// Wrapper component with error boundary for additional safety
export default async function SafeServerComponentWithBoundary(
  props: SafeServerComponentExampleProps
): Promise<React.ReactElement> {
  try {
    const Component = await SafeServerComponentExample(props);
    
    // Wrap with error boundary for runtime errors
    return (
      <ProductionErrorBoundary
        fallback={
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-600">Unable to load content at this time.</p>
          </div>
        }
      >
        {Component}
      </ProductionErrorBoundary>
    );
  } catch (error) {
    console.error('Safe Server Component Error:', error);
    
    // Return a fallback UI for any remaining errors
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600 text-sm">
          {process.env.NODE_ENV === 'development' 
            ? `Development Error: ${error instanceof Error ? error.message : String(error)}`
            : 'An error occurred while loading this component.'
          }
        </p>
      </div>
    );
  }
}

// Alternative pattern for simple error handling without utilities
export async function SimpleServerComponentExample({
  limit = 5
}: {
  limit?: number;
}): Promise<React.ReactElement> {
  try {
    // Simple database query with inline error handling
    const communities = await db.query.communityTable.findMany({
      limit,
      orderBy: [asc(communityTable.name)],
      columns: {
        id: true,
        name: true,
        slug: true
      }
    });

    return (
      <div className="space-y-2">
        {communities.map((community) => (
          <div key={community.id} className="p-2 border rounded">
            {community.name}
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Simple Server Component Error:', error);
    
    // Return minimal fallback
    return (
      <div className="p-2 text-gray-500 text-sm">
        Unable to load data
      </div>
    );
  }
}
