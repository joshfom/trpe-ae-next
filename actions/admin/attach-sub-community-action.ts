"use server";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { revalidateTag } from "next/cache";

type ResponseType = InferResponseType<typeof client.api.admin.communities[":communityId"]["sub_communities"]["attach"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.communities[":communityId"]["sub_communities"]["attach"]["$post"]>["json"]

/**
 * Attaches a sub-community to a parent community
 * @param communityId ID of the parent community
 * @param data Data required to attach sub-community
 * @returns Object with success status and data or error
 */
export async function attachSubCommunity(communityId: string, data: RequestType) {
  try {
    const response = await client.api.admin.communities[":communityId"].sub_communities.attach.$post({
      param: {
        communityId
      },
      json: data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to attach sub-community: ${response.statusText}`);
    }
    
    const responseData = await response.json() as ResponseType;
    
    // Revalidate relevant data
    revalidateTag('adminSubCommunities');
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error attaching sub-community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
