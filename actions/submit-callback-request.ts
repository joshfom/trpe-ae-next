"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidatePath } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.leads.callback.$post>;
type RequestType = InferRequestType<typeof client.api.leads.callback.$post>["json"];

/**
 * Server action to submit callback request data to the API
 * @param formData Form data to submit
 * @returns Response from the API or error message
 */
export async function submitCallbackRequest(formData: RequestType) {
  try {
    const response = await client.api.leads.callback.$post({ json: formData });
    const data = await response.json();
    
    // Revalidate relevant paths
    revalidatePath("/");
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error submitting callback request:", error);
    return {
      success: false,
      error: "An error occurred while sending your callback request"
    };
  }
}
