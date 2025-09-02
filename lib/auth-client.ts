"use client";

import { createAuthClient } from "better-auth/react"

// Create a proper client-side auth client that makes API requests
// Use localhost for development, production URL for production
const baseURL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? `http://localhost:${window.location.port || 3000}`
    : process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';

export const authClient = createAuthClient({
    baseURL,
    // Add retry logic to handle temporary connection issues
    retry: {
        retries: 3, // Retry 3 times
        factor: 2, // Exponential backoff factor
        minTimeout: 1000, // Minimum retry timeout (1 second)
        maxTimeout: 10000, // Maximum retry timeout (10 seconds)
    }
})

export const { signIn, signUp, useSession, getSession } = authClient