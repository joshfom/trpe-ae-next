"use server"
import {client} from "@/lib/hono";

/**
 * Server action to fetch FAQ list
 * @param targetId - The target ID
 * @param target - The target type
 */
export async function getFaqListAction(targetId: string, target: string) {
    try {
        if (!targetId) {
            return null;
        }
        
        const response = await client.api.admin.faqs[":target"]["list"][":targetId"].$get({
            param: {
                targetId,
                target,
            }
        });

        if (!response.ok) {
            console.error('An error occurred while fetching faqs');
            throw new Error('An error occurred while fetching faqs');
        }

        const {data} = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching FAQ list:', error);
        throw error;
    }
}
