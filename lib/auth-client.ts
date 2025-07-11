"use client";

import { createAuthClient } from "better-auth/react"
import {env} from "@/config/env";

// Create a proper client-side auth client that makes API requests
// rather than importing server-side database code
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
console.log('🔧 Better Auth Client baseURL:', baseURL);

export const authClient = createAuthClient({
    baseURL,
    debug: true, // Enable debug logging
    onError: (error: { code?: string; message?: string }) => {
        console.error('Auth Client Error:', error);
        // Add more specific diagnostics
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused - check that your database is running and accessible');
        }
    },
    // Add retry logic to handle temporary connection issues
    retry: {
        retries: 3, // Retry 3 times
        factor: 2, // Exponential backoff factor
        minTimeout: 1000, // Minimum retry timeout (1 second)
        maxTimeout: 10000, // Maximum retry timeout (10 seconds)
    }
})

export const { signIn, signUp, useSession, getSession } = authClient