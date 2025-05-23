"use server"
import {client} from "@/lib/hono";

/**
 * Server action to fetch properties by offering type with pagination
 * @param offeringTypeId - The offering type ID
 * @param pageParam - The page number
 * @param queryParams - Additional query parameters for filtering
 */
export async function getPropertiesByOfferingTypeAction(
    offeringTypeId: string, 
    pageParam: number = 1,
    queryParams?: {
        lo?: string;
        maxPrice?: string;
        bed?: string;
        bathrooms?: string;
        minArea?: string;
        maxArea?: string;
        sortBy?: string;
        typeSlug?: string;
    }
) {
    try {
        // Convert queryParams values to strings (same pattern as searchPropertiesAction)
        const stringifiedQueryParams: Record<string, string> = {};
        
        if (queryParams) {
            for (const [key, value] of Object.entries(queryParams)) {
                if (value !== undefined && value !== null) {
                    stringifiedQueryParams[key] = value.toString();
                }
            }
        }
        
        // Add page parameter
        stringifiedQueryParams.page = pageParam.toString();
        
        const response = await client.api.properties.offer[':offeringTypeId'].$get({
            param: {
                offeringTypeId,
            },
            query: stringifiedQueryParams
        });

        if (!response.ok) {
            console.error('An error occurred while fetching properties by offering type');
            throw new Error('An error occurred while fetching properties by offering type');
        }

        const {data} = await response.json();
        
        return {
            data,
            nextPage: pageParam + 1,
            hasMore: data.length > 0 // Assuming if we got data, there might be more
        };
    } catch (error) {
        console.error('Error fetching properties by offering type:', error);
        throw error;
    }
}
