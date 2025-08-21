/**
 * Server Component Best Practices and Optimization Guide
 * 
 * This file contains utilities and patterns to prevent clientModules errors
 * and optimize Server Components for production.
 */

import React from 'react';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

/**
 * Type-safe wrapper for Server Component data fetching
 * Prevents clientModules errors by ensuring proper error boundaries
 */
export function createServerComponentWrapper<T extends any[], R>(
  asyncFunction: (...args: T) => Promise<R>,
  options: {
    cacheKey?: string;
    revalidate?: number;
    tags?: string[];
    fallback?: R;
    errorMessage?: string;
  } = {}
) {
  return cache(async (...args: T): Promise<R> => {
    const {
      cacheKey = '',
      revalidate = 3600,
      tags = [],
      fallback,
      errorMessage = 'Failed to fetch data'
    } = options;

    try {
      // Use Next.js cache when cache key is provided
      if (cacheKey) {
        return await unstable_cache(
          async () => await asyncFunction(...args),
          [cacheKey, ...args.map(String)],
          {
            revalidate,
            tags
          }
        )();
      }

      // Direct execution for non-cached operations
      return await asyncFunction(...args);
    } catch (error) {
      console.error(`Server Component Error [${cacheKey || 'uncached'}]:`, error);
      
      // Log for monitoring
      if (process.env.NODE_ENV === 'production') {
        console.error('Production Server Component Error:', {
          function: asyncFunction.name,
          cacheKey,
          args: args.map(String),
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        });
      }

      // Return fallback if provided
      if (fallback !== undefined) {
        return fallback;
      }

      // Re-throw with enhanced error message
      throw new Error(`${errorMessage}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

/**
 * Utility to safely render Server Components with error boundaries
 */
export async function safeServerRender<T>(
  renderFunction: () => Promise<T>,
  fallback: T,
  errorContext: string = 'Server Component'
): Promise<T> {
  try {
    return await renderFunction();
  } catch (error) {
    console.error(`${errorContext} rendering error:`, error);
    
    // Log for production monitoring
    if (process.env.NODE_ENV === 'production') {
      console.error('Production Server Render Error:', {
        context: errorContext,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }

    return fallback;
  }
}

/**
 * Server Component props validation utility
 * Prevents runtime errors from invalid props
 */
export function validateServerProps<T extends Record<string, any>>(
  props: T,
  requiredFields: (keyof T)[],
  componentName: string = 'ServerComponent'
): T {
  for (const field of requiredFields) {
    if (props[field] === undefined || props[field] === null) {
      const error = new Error(`Missing required prop '${String(field)}' in ${componentName}`);
      console.error('Server Component Prop Validation Error:', error);
      throw error;
    }
  }
  return props;
}

/**
 * Database query wrapper with enhanced error handling
 */
export function createSafeDbQuery<T extends any[], R>(
  queryFunction: (...args: T) => Promise<R>,
  options: {
    queryName: string;
    fallback?: R;
    cacheOptions?: {
      key: string;
      revalidate?: number;
      tags?: string[];
    };
  }
) {
  return createServerComponentWrapper(
    queryFunction,
    {
      cacheKey: options.cacheOptions?.key,
      revalidate: options.cacheOptions?.revalidate,
      tags: options.cacheOptions?.tags,
      fallback: options.fallback,
      errorMessage: `Database query failed: ${options.queryName}`
    }
  );
}

/**
 * Type-safe Server Action wrapper
 * Prevents clientModules errors in Server Actions
 */
export function createSafeServerAction<T extends any[], R>(
  actionFunction: (...args: T) => Promise<R>,
  actionName: string
) {
  return async (...args: T): Promise<R> => {
    try {
      const result = await actionFunction(...args);
      return result;
    } catch (error) {
      console.error(`Server Action Error [${actionName}]:`, error);
      
      // Enhanced error logging for production
      if (process.env.NODE_ENV === 'production') {
        console.error('Production Server Action Error:', {
          action: actionName,
          args: args.map(arg => typeof arg === 'object' ? '[Object]' : String(arg)),
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        });
      }

      // Re-throw with action context
      throw new Error(`Server Action ${actionName} failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
}

/**
 * Component factory for creating safe Server Components
 */
export function createSafeServerComponent<P extends Record<string, any>>(
  component: (props: P) => Promise<React.ReactElement>,
  options: {
    name: string;
    requiredProps?: (keyof P)[];
    fallbackMessage?: string;
  }
) {
  return async function SafeServerComponent(props: P): Promise<React.ReactElement | null> {
    try {
      // Validate props if required
      if (options.requiredProps) {
        validateServerProps(props, options.requiredProps, options.name);
      }

      // Render component
      return await component(props);
    } catch (error) {
      console.error(`Server Component ${options.name} error:`, error);

      // In production, return null to prevent errors
      if (process.env.NODE_ENV === 'production') {
        return null;
      }

      // In development, you would handle this with an error boundary
      throw error;
    }
  };
}

/**
 * Utility to prevent hydration mismatches
 */
export function createHydrationSafeWrapper<P extends Record<string, any>>(
  options: {
    name: string;
    useClientWhen?: (props: P) => boolean;
  }
) {
  return {
    shouldUseClient: (props: P): boolean => {
      return options.useClientWhen ? options.useClientWhen(props) : false;
    },
    wrapperName: options.name
  };
}

// Export commonly used patterns
export const ServerComponentPatterns = {
  safeRender: safeServerRender,
  validateProps: validateServerProps,
  createWrapper: createServerComponentWrapper,
  createSafeQuery: createSafeDbQuery,
  createSafeAction: createSafeServerAction,
  createSafeComponent: createSafeServerComponent,
  createHydrationSafe: createHydrationSafeWrapper
} as const;
