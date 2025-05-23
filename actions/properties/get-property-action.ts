"use server"
import {client} from "@/lib/hono";

/**
 * Server action to fetch property by slug
 * @param slug - The property slug
 */
export async function getPropertyAction(slug: string) {
    try {
        const response = await client.api.properties[':slug'].$get({
            param: {
                slug
            },
        });

        if (!response.ok) {
            console.error('An error occurred while fetching property');
            throw new Error('An error occurred while fetching property');
        }

        const {data} = await response.json();
        return {
            data
        };
    } catch (error) {
        console.error('Error fetching property:', error);
        throw error;
    }
}
