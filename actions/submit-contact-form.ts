"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidatePath } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.leads.contact.$post>;
type RequestType = InferRequestType<typeof client.api.leads.contact.$post>["json"];

/**
 * Server action to submit form data to the API
 * @param formData Form data to submit
 * @returns Response from the API or error message
 */
export async function submitContactForm(formData: RequestType) {
  try {
    const response = await client.api.leads.contact.$post({ json: formData });
    const data = await response.json();
    
    // Revalidate the path to update any cached data
    revalidatePath("/contact-us");
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      error: "An error occurred while sending your message"
    };
  }
}
