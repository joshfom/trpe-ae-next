"use client"
import { useState, useEffect } from "react";
import { getCommunitiesAction } from "@/actions/get-communities-action";
import { toast } from "sonner";

/**
 * This is a client-side function to fetch communities using the server action
 * It replaces the React Query hook useGetCommunities
 */
export const getClientCommunities = async () => {
  try {
    const communities = await getCommunitiesAction();
    
    // Ensure we always return an array
    if (!Array.isArray(communities)) {
      console.warn('Communities data is not an array, returning empty array');
      return [];
    }
    
    return communities;
  } catch (error) {
    console.error('Error fetching communities:', error);
    
    // Only show toast in development to avoid spamming users
    if (process.env.NODE_ENV === 'development') {
      toast.error('An error occurred while fetching communities');
    }
    
    // Always return empty array to prevent breaking the UI
    return [];
  }
};
