"use client"
import { searchPropertiesAction } from "@/actions/properties/search-properties-action";
import { toast } from "sonner";
import { extractPathSearchParams } from "@/features/search/hooks/path-search-helper";

interface SearchParams {
    page?: number;
    limit?: number;
    // Add other parameters as needed
    [key: string]: any;
}

/**
 * Client-side function to search properties using the server action
 * @param offerType - The offer type
 * @param searchParams - Search parameters
 * @param pathName - The current path name to extract area parameters
 */
export const searchClientProperties = async (
    offerType: string = '',
    searchParams: SearchParams = {},
    pathName?: string
) => {
    try {
        // Extract areas from path if provided
        const params = pathName ? extractPathSearchParams(pathName) : { areas: [] };
        
        const result = await searchPropertiesAction(offerType, searchParams, params.areas);
        return result;
    } catch (error) {
        toast.error('An error occurred while searching properties');
        console.error('Error searching properties:', error);
        return null;
    }
};
