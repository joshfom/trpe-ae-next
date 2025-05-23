"use client"
import { searchPropertiesWithServerAction } from "@/actions/properties/search-properties-with-server-action";
import { toast } from "sonner";

/**
 * Client-side function to search properties using the server action
 * @param offeringType - The offering type
 * @param propertyType - The property type
 * @param searchParams - Search parameters
 * @param pathname - The current path name
 */
export const searchClientPropertiesWithServer = async (
    offeringType?: string,
    propertyType?: string,
    searchParams?: URLSearchParams,
    pathname?: string
) => {
    try {
        if (!pathname) {
            throw new Error('Pathname is required');
        }
        
        // Create a new URLSearchParams object if not provided
        const params = searchParams || new URLSearchParams();
        
        const result = await searchPropertiesWithServerAction({
            offeringType,
            propertyType,
            searchParams: params,
            pathname
        });
        
        return result;
    } catch (error) {
        toast.error('An error occurred while searching properties');
        console.error('Error searching properties with server:', error);
        return null;
    }
};
