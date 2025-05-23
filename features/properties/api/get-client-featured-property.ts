"use client"
import { useState, useEffect } from "react";
import { getFeaturedPropertyAction } from "@/actions/properties/get-featured-property-action";
import { toast } from "sonner";

/**
 * Client-side function to fetch featured property using the server action
 * @param offeringTypeId - The offering type ID
 * @param limit - Number of properties to fetch (default: 1)
 */
export const getClientFeaturedProperty = async (offeringTypeId: string, limit: string = '1') => {
  try {
    if (!offeringTypeId) {
      return null;
    }
    
    const data = await getFeaturedPropertyAction(offeringTypeId, limit);
    return data;
  } catch (error) {
    toast.error('An error occurred while fetching featured property');
    console.error('Error fetching featured property:', error);
    return null;
  }
};
