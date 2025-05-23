"use server"
import {client} from "@/lib/hono";
import { InferRequestType } from "hono";

type RequestType = InferRequestType<typeof client.api.admin.faqs[":target"]["faqs"][":targetId"]["new"]["$post"]>["json"];

/**
 * Server action to add a new FAQ
 * @param targetId - The target ID
 * @param target - The target type
 * @param data - The FAQ data to add
 */
export async function addFaqAction(targetId: string, target: string, data: RequestType) {
    try {
        const response = await client.api.admin.faqs[":target"]["faqs"][":targetId"]["new"].$post({
            json: data,
            param: {
                targetId, 
                target
            }
        });

        if (!response.ok) {
            console.error('An error occurred while adding FAQ');
            throw new Error('An error occurred while adding FAQ');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding FAQ:', error);
        throw error;
    }
}
