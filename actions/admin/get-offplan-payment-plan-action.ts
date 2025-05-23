"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Server action to fetch an offplan's payment plan
 * @param offplanId ID of the offplan to fetch payment plan for
 * @returns Object with success status and data or error message
 */
export async function getOffplanPaymentPlan(offplanId: string) {
  if (!offplanId) {
    return {
      success: false,
      error: "Offplan ID is required"
    };
  }

  try {
    const response = await client.api.admin.offplans[":offplanId"]["payment_plan"].$get({
      param: { offplanId }
    });

    if (!response.ok) {
      throw new Error('An error occurred while fetching payment plan');
    }

    const { data } = await response.json();
    
    // Revalidate the payment plan tag for this offplan
    revalidateTag(`offplan-payment-plan-${offplanId}`);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching offplan payment plan:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
