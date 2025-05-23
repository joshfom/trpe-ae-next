"use server"
import {client} from "@/lib/hono";
import {InferRequestType} from "hono";

type RequestType = InferRequestType<typeof client.api.admin["page-meta"]["new"]["$post"]>["json"];

/**
 * Server action to add page meta
 * @param data - The page meta data to add
 */
export async function addPageMetaAction(data: RequestType) {
    try {
        const response = await client.api.admin["page-meta"]["new"].$post({
            json: data
        });

        console.log('Response status:', response);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error response:', errorData);
            throw new Error(JSON.stringify(errorData));
        }

        return await response.json();
    } catch (error) {
        console.log('API request failed:', error);
        throw error;
    }
}
