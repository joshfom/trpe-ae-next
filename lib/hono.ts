import {hc} from "hono/client";
import {AppType} from "@/app/api/[[...route]]/route";

// Create client with better error handling and timeout
export const client = hc<AppType>(process.env.NEXT_PUBLIC_URL!, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    // Add timeout to requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
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
        };
        
        console.warn('Hono client fetch error:', error, errorContext);
        
        // Return a rejected response instead of throwing
        return Promise.reject(error);
      });
  }
});
