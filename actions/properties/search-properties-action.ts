"use server"
import {client} from "@/lib/hono";

interface SearchParams {
    page?: number;
    limit?: number;
    // Add other parameters as needed
    [key: string]: any;
}

/**
 * Server action to search properties
 * @param offerType - The offer type
 * @param searchParams - Search parameters
 * @param areas - Area parameters extracted from path
 */
export async function searchPropertiesAction(
    offerType: string = '',
    searchParams: SearchParams = {},
    areas: string[] = []
) {
    try {
        // Prepare query parameters by converting values to strings
        const queryParams: Record<string, string> = {};
        
        for (const [key, value] of Object.entries(searchParams)) {
            if (value !== undefined && value !== null) {
                queryParams[key] = value.toString();
            }
        }
        
        // Add areas to query if provided
        if (areas.length > 0) {
            queryParams.areas = areas.join(',');
        }
        
        const response = await client.api.properties[":offerType"].listings.search.$get({
            param: {
                offerType,
            },
            query: queryParams
        });

        if (!response.ok) {
            console.error('An error occurred while searching properties');
            throw new Error('An error occurred while searching properties');
        }

        const { data } = await response.json();
        return { data };
    } catch (error) {
        console.error('Error searching properties:', error);
        throw error;
    }
}
