'use server';

import { client } from "@/lib/hono";

export async function getAdminOffplans() {
  try {
    const response = await client.api.admin.insights.$get();

    if (!response.ok) {
      throw new Error('An error occurred while fetching insights');
    }

    const { data } = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching admin offplans:", error);
    return { success: false, error: (error as Error).message || 'An error occurred' };
  }
}
