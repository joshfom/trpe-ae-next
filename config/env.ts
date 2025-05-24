/**
 * Environment variable configuration
 * This file provides safe type-checked access to environment variables
 */

// Define types for environment variables
interface Env {
  NEXT_PUBLIC_APP_URL: string | undefined;
}

// Export environment variables with fallbacks for development
export const env: Env = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};
