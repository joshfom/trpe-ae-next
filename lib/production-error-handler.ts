"use client"

import { useEffect } from 'react';

/**
 * Production Runtime Error Handler
 * Handles clientModules errors and other runtime issues in production
 */

// Global error handling for clientModules errors
export function handleClientModulesError() {
  if (typeof window === 'undefined') return;

  // Override console.error to catch and handle clientModules errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const errorMessage = args.join(' ');
    
    if (errorMessage.includes('clientModules') || 
        errorMessage.includes('Cannot read properties of undefined')) {
      
      // Log for debugging but don't spam the console
      if (process.env.NODE_ENV === 'development') {
        originalConsoleError('[ClientModules Error Handled]:', ...args);
      }
      
      // Track the error for analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'client_modules_error', {
          error_message: errorMessage,
          timestamp: new Date().toISOString(),
        });
      }
      
      return; // Suppress the error
    }
    
    // Call original console.error for other errors
    originalConsoleError(...args);
  };
}

// Global error handler for unhandled promise rejections
export function handleUnhandledRejections() {
  if (typeof window === 'undefined') return;

  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // Handle server action errors gracefully
    if (error?.message?.includes('An unexpected response was received from the server') ||
        error?.message?.includes('500')) {
      
      console.warn('Server action error handled gracefully:', error.message);
      
      // Track server errors
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'server_action_error', {
          error_message: error.message,
          timestamp: new Date().toISOString(),
        });
      }
      
      // Prevent the error from breaking the UI
      event.preventDefault();
      return;
    }
    
    // For other errors, log them normally
    console.error('Unhandled promise rejection:', error);
  });
}

// React component to set up error handling
export function ProductionErrorHandler() {
  useEffect(() => {
    handleClientModulesError();
    handleUnhandledRejections();
    
    // Additional error boundary for runtime errors
    window.addEventListener('error', (event) => {
      if (event.error?.message?.includes('clientModules')) {
        event.preventDefault();
        console.warn('ClientModules error prevented from breaking UI');
      }
    });
    
    // Handle CSP errors
    document.addEventListener('securitypolicyviolation', (event) => {
      // Only log CSP violations in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('CSP Violation:', {
          directive: event.violatedDirective,
          blockedURI: event.blockedURI,
          lineNumber: event.lineNumber,
        });
      }
    });
    
  }, []);

  return null; // This component doesn't render anything
}

// Utility to safely execute code that might trigger clientModules errors
export function safeExecute<T>(fn: () => T, fallback?: T): T | undefined {
  try {
    return fn();
  } catch (error) {
    if (error instanceof Error && error.message.includes('clientModules')) {
      console.warn('ClientModules error caught in safeExecute');
      return fallback;
    }
    throw error; // Re-throw if it's not a clientModules error
  }
}

// Safe wrapper for dynamic imports
export function safeDynamicImport<T>(importFn: () => Promise<T>): Promise<T | null> {
  return importFn().catch((error) => {
    if (error.message?.includes('clientModules')) {
      console.warn('ClientModules error in dynamic import, returning null');
      return null;
    }
    throw error;
  });
}
