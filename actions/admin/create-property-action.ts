'use server';

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.admin.properties.$post>
type RequestType = InferRequestType<typeof client.api.admin.properties.$post>["json"]

interface CreatePropertySuccess {
  success: true;
  data: ResponseType;
}

interface CreatePropertyError {
  success: false;
  error: string;
}

type CreatePropertyResult = CreatePropertySuccess | CreatePropertyError;

export async function createProperty(data: RequestType): Promise<CreatePropertyResult> {
  try {
    const response = await client.api.admin.properties.$post({ json: data });
    const responseData = await response.json();
    
    // Revalidate cache for properties
    revalidateTag("admin-properties");
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while creating property'
    };
  }
}
