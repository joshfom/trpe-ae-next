"use client";

/**
 * Utility for handling Server Action errors in production
 */

export interface ServerActionError {
  code?: string;
  message: string;
  digest?: string;
  timestamp: string;
}

export interface ServerActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: ServerActionError;
}

/**
 * Safely execute a Server Action with error handling
 * @param action - The Server Action function to execute
 * @param args - Arguments to pass to the Server Action
 * @returns Promise with standardized result format
 */
export async function safeServerAction<T = any>(
  action: (...args: any[]) => Promise<any>,
  ...args: any[]
): Promise<ServerActionResult<T>> {
  try {
    const result = await action(...args);
    
    // Handle different result formats
    if (result && typeof result === 'object') {
      if ('success' in result) {
        return result as ServerActionResult<T>;
      }
      
      if ('error' in result) {
        return {
          success: false,
          error: {
            message: result.error,
            timestamp: new Date().toISOString()
          }
        };
      }
    }
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Server Action Error:', error);
    
    // Check for specific Server Action errors
    const isServerActionNotFound = error instanceof Error && 
      error.message?.includes('Failed to find Server Action');
    
    const isDigestError = error instanceof Error && 
      'digest' in error;
    
    return {
      success: false,
      error: {
        code: isServerActionNotFound ? 'SERVER_ACTION_NOT_FOUND' : 
              isDigestError ? 'DIGEST_ERROR' : 'UNKNOWN_ERROR',
        message: isServerActionNotFound 
          ? 'The server action could not be found. This might be due to a recent deployment. Please refresh the page.'
          : error instanceof Error 
            ? error.message 
            : 'An unknown error occurred',
        digest: isDigestError ? (error as any).digest : undefined,
        timestamp: new Date().toISOString()
      }
    };
  }
}

/**
 * React hook for handling Server Action errors with state management
 */
import { useState, useCallback } from 'react';

export function useServerAction<T = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ServerActionError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (
    action: (...args: any[]) => Promise<any>,
    ...args: any[]
  ) => {
    setIsLoading(true);
    setError(null);
    
    const result = await safeServerAction<T>(action, ...args);
    
    if (result.success) {
      setData(result.data || null);
    } else {
      setError(result.error || null);
    }
    
    setIsLoading(false);
    return result;
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setIsLoading(false);
  }, []);

  return {
    execute,
    reset,
    isLoading,
    error,
    data
  };
}

/**
 * Retry mechanism for failed Server Actions
 */
export async function retryServerAction<T = any>(
  action: (...args: any[]) => Promise<any>,
  args: any[],
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ServerActionResult<T>> {
  let lastError: ServerActionError | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await safeServerAction<T>(action, ...args);
    
    if (result.success) {
      return result;
    }
    
    lastError = result.error || null;
    
    // Don't retry certain types of errors
    if (result.error?.code === 'SERVER_ACTION_NOT_FOUND') {
      break;
    }
    
    // Wait before retrying (exponential backoff)
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  return {
    success: false,
    error: lastError || {
      message: 'Maximum retries exceeded',
      timestamp: new Date().toISOString()
    }
  };
}
