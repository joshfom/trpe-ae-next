"use client"

/**
 * Navigation Error Handler
 * Handles 503 errors and other navigation issues during client-side routing
 */

let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 500; // 500ms

/**
 * Enhanced fetch wrapper that handles 503 errors during navigation
 */
export async function navigationSafeFetch(
  url: string | URL | Request,
  options?: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'X-Navigation-Request': 'true',
        'Cache-Control': 'no-cache',
      },
    });

    // Handle 503 errors with retry logic
    if (response.status === 503 && retryCount < MAX_RETRIES) {
      retryCount++;
      console.warn(`Navigation 503 error, retrying (${retryCount}/${MAX_RETRIES})`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
      
      return navigationSafeFetch(url, options);
    }

    // Reset retry count on success
    if (response.ok) {
      retryCount = 0;
    }

    return response;
  } catch (error) {
    console.error('Navigation fetch error:', error);
    
    // For navigation errors, return a mock response to prevent UI breaking
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return navigationSafeFetch(url, options);
    }
    
    // Reset retry count
    retryCount = 0;
    throw error;
  }
}

/**
 * Navigation error recovery utility
 */
export function handleNavigationError(error: Error, fallbackUrl?: string) {
  console.warn('Navigation error detected:', error);
  
  // Track navigation errors for analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', 'navigation_error', {
      error_message: error.message,
      fallback_url: fallbackUrl,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Attempt recovery by reloading the page if in a bad state
  if (typeof window !== 'undefined') {
    const isInBadState = 
      error.message.includes('503') || 
      error.message.includes('Service Unavailable') ||
      error.message.includes('fetch failed');
      
    if (isInBadState && fallbackUrl) {
      console.warn('Attempting navigation recovery');
      window.location.href = fallbackUrl;
    }
  }
}

/**
 * Page transition helper that handles errors gracefully
 */
export async function safePageTransition(
  transitionFn: () => Promise<void> | void,
  fallbackUrl?: string
): Promise<void> {
  try {
    await transitionFn();
  } catch (error) {
    console.error('Page transition error:', error);
    handleNavigationError(error as Error, fallbackUrl);
  }
}

/**
 * Reset navigation state on successful navigation
 */
export function resetNavigationState() {
  retryCount = 0;
}

// Auto-reset navigation state on successful page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', resetNavigationState);
  
  // Listen for successful navigation events
  document.addEventListener('DOMContentLoaded', resetNavigationState);
}
