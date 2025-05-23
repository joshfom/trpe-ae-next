"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Gets the current session for the authenticated user
 * @returns The session object or null if not authenticated
 */
export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers() // Pass the headers to get cookies
    });
    
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Gets the current authenticated user
 * @returns The user object or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Checks if the current request is from an authenticated user
 * @returns True if authenticated, false otherwise
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * BACKWARDS COMPATIBILITY FUNCTION
 * This function provides the same interface as the old validateRequest function
 * but uses the new Better Auth approach internally
 * @returns An object with user and session properties
 */
export async function validateRequest() {
  const session = await getSession();
  
  return {
    user: session?.user ?? null,
    session
  };
}
