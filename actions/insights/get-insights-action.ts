'use server';

import { client } from "@/lib/hono";

export async function getInsight(insightSlug: string) {
  try {
    const response = await client.api.insights[':insightSlug'].$get({
      param: { insightSlug }
    });

    if (!response.ok) {
      return { success: false, error: 'An error occurred while fetching insights' };
    }

    const { data } = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching insight:", error);
    return { success: false, error: (error as Error).message || 'An error occurred' };
  }
}

export async function getInsights(page: number = 1) {
  try {
    const response = await client.api.insights.$get({
      query: {
        page: page.toString()
      }
    });

    if (!response.ok) {
      return { success: false, error: 'An error occurred while fetching insights' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching insights:", error);
    return { success: false, error: (error as Error).message || 'An error occurred' };
  }
}
