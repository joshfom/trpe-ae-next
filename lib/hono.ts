import {hc} from "hono/client";
import {AppType} from "@/app/api/[[...route]]/route";

// Dynamic timeout based on environment and navigation type
const getTimeout = () => {
  if (process.env.NODE_ENV === 'production') {
    return 30000; // 30 seconds in production
  }
  return 10000; // 10 seconds in development (reduced from 15)
};

// Track navigation state to handle route transitions better
let isNavigating = false;
let navigationTimeout: NodeJS.Timeout | null = null;

// Create client with better error handling and navigation awareness
export const client = hc<AppType>(process.env.NEXT_PUBLIC_URL!, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    // Add timeout to requests with shorter timeout during navigation
    const controller = new AbortController();
    const timeout = isNavigating ? Math.min(getTimeout(), 5000) : getTimeout();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const enhancedInit = {
      ...init,
      signal: controller.signal,
      // Add retry headers for 503 errors
      headers: {
        ...init?.headers,
        'Cache-Control': 'no-cache',
        'X-Requested-With': 'XMLHttpRequest',
      },
    };
    
    return fetch(input, enhancedInit)
      .then(async (response) => {
        clearTimeout(timeoutId);
        
        // Handle 503 errors with automatic retry
        if (response.status === 503) {
          console.warn('Received 503 error, attempting retry in 100ms');
          
          // Short delay before retry
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Retry the request once
          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(() => retryController.abort(), timeout);
          
          try {
            const retryResponse = await fetch(input, {
              ...enhancedInit,
              signal: retryController.signal,
            });
            clearTimeout(retryTimeoutId);
            return retryResponse;
          } catch (retryError) {
            clearTimeout(retryTimeoutId);
            console.warn('Retry failed, returning original response');
            return response;
          }
        }
        
        return response;
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        
        // Enhanced error logging with context
        const errorContext = {
          url: typeof input === 'string' ? input : input.toString(),
          method: init?.method || 'GET',
          errorCode: error.cause?.code,
          errorName: error.name,
          isTimeoutError: error.name === 'AbortError',
          isConnectionError: error.cause?.code === 'ECONNREFUSED',
          isNavigating: isNavigating,
          timeout: timeout,
        };
        
        console.warn('Hono client fetch error:', error, errorContext);
        
        // For navigation errors, try to continue gracefully
        if (isNavigating && (error.name === 'AbortError' || error.cause?.code === 'ECONNREFUSED')) {
          console.warn('Navigation error detected, attempting graceful recovery');
          // Return a mock successful response to prevent UI breaking
          return new Response(JSON.stringify({ error: 'Navigation timeout', fallback: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Return a rejected response instead of throwing
        return Promise.reject(error);
      });
  }
});

// Navigation state management
if (typeof window !== 'undefined') {
  // Listen for navigation start
  window.addEventListener('beforeunload', () => {
    isNavigating = true;
    if (navigationTimeout) clearTimeout(navigationTimeout);
    navigationTimeout = setTimeout(() => {
      isNavigating = false;
    }, 2000); // Reset after 2 seconds
  });
  
  // Listen for route changes (Next.js specific)
  if ('navigation' in window && window.navigation && 'addEventListener' in (window.navigation as any)) {
    (window.navigation as any).addEventListener('navigate', () => {
      isNavigating = true;
      if (navigationTimeout) clearTimeout(navigationTimeout);
      navigationTimeout = setTimeout(() => {
        isNavigating = false;
      }, 1000); // Reset after 1 second
    });
  }
}
