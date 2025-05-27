import {drizzle} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema-index';

// This ensures this code only runs on the server
if (typeof window !== 'undefined') {
    throw new Error('This module is server-only');
}

// Configure connection pool for build-time optimization
const connectionConfig = {
    // Drastically reduce max connections during build to prevent "too many clients" errors
    max: process.env.NEXT_PHASE === 'phase-production-build' ? 2 : 5,
    // Connection pooling settings optimized for build
    idle_timeout: 10, // Shorter idle timeout during build
    max_lifetime: 60 * 10, // Shorter max lifetime during build
    // Retry configuration
    connect_timeout: 5,
    // Prepare statements for better performance
    prepare: false, // Disable during build to reduce connection overhead
    // Transform functions to reduce overhead
    transform: undefined,
    // Debug during build issues
    debug: process.env.NEXT_PHASE === 'phase-production-build' ? false : false
};

const queryClient = postgres(process.env.DATABASE_URL!, connectionConfig);
export const db = drizzle(queryClient, {schema});

// Add connection cleanup for build process
if (process.env.NEXT_PHASE === 'phase-production-build') {
  // Cleanup connections after a short delay to prevent accumulation
  const cleanup = () => {
    try {
      queryClient.end();
    } catch (error) {
      // Ignore cleanup errors during build
    }
  };
  
  // Cleanup after cache operations
  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}