"use server"
import {client} from "@/lib/hono";
import {InferRequestType} from "hono";

type RequestType = InferRequestType<typeof client.api.admin["page-meta"][":id"]["update"]["$patch"]>["json"];

/**
 * Server action to update page meta
 * @param id - The ID of the page meta to update
 * @param data - The updated page meta data
 */
export async function updatePageMetaAction(id: string, data: RequestType) {
    try {
        const response = await client.api.admin["page-meta"][":id"]["update"]["$patch"]({
            param: {id},
            json: data
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error response:', errorData);
            throw new Error(JSON.stringify(errorData));
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating page meta:', error);
        throw error;
    }
}
