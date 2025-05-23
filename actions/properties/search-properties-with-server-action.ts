"use server"
import { getPropertiesServer } from "@/features/properties/api/get-properties-server";

/**
 * Server action to search properties with server-side functions
 * @param params - Search parameters
 */
export async function searchPropertiesWithServerAction(params: {
    offeringType?: string;
    propertyType?: string;
    searchParams: URLSearchParams;
    pathname: string;
}) {
    try {
        return await getPropertiesServer(params);
    } catch (error) {
        console.error('Error searching properties with server:', error);
        throw error;
    }
}
