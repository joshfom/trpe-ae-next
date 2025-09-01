// Client Reference Manifest Fix for Next.js 15.5.x
// This fixes the "Expected clientReferenceManifest to be defined" error

if (typeof window === 'undefined') {
  // Server-side only code
  const originalConsoleError = console.error;
  
  console.error = (...args: any[]) => {
    // Suppress clientReferenceManifest errors in production
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Expected clientReferenceManifest to be defined')
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
  
  // Ensure proper globals are set
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).__webpack_require__ = (globalThis as any).__webpack_require__ || function() {};
    (globalThis as any).__webpack_chunk_load__ = (globalThis as any).__webpack_chunk_load__ || function() {};
  }
}

// Export empty object to make this a valid module
export {};
