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
    return communities;
  } catch (error) {
    toast.error('An error occurred while fetching communities');
    console.error('Error fetching communities:', error);
    return [];
  }
};
