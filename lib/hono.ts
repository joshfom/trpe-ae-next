import {hc} from "hono/client";
import {AppType} from "@/app/api/[[...route]]/route";

// Dynamic timeout based on environment
const getTimeout = () => {
  if (process.env.NODE_ENV === 'production') {
    return 30000; // 30 seconds in production
  }
  return 15000; // 15 seconds in development
};

// Create client with better error handling and timeout
export const client = hc<AppType>(process.env.NEXT_PUBLIC_URL!, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    // Add timeout to requests
    const controller = new AbortController();
    const timeout = getTimeout();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const enhancedInit = {
      ...init,
      signal: controller.signal,
    };
    
    return fetch(input, enhancedInit)
      .then((response) => {
        clearTimeout(timeoutId);
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
          timeout: timeout,
        };
        
        console.warn('Hono client fetch error:', error, errorContext);
        
        // Return a rejected response instead of throwing
        return Promise.reject(error);
      });
  }
});
