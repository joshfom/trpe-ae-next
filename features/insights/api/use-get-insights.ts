import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";

export const useGetInsight = (insightSlug?: string) => {
    return useQuery({
        enabled: !!insightSlug,
        queryKey: ["insights", {insightSlug}],
        queryFn: async () => {
            const response = await client.api.insights[':insightSlug'].$get({
                param: {insightSlug}
            });

            if (!response.ok) {
                throw new Error('An error occurred while fetching insights')
            }

            const {data} = await response.json()

            return data
        },
    })
}

export function useGetInsights(page: number = 1) {
    return useQuery({
        queryKey: ["insights", { page }],
        queryFn: async () => {
            const response = await client.api.insights.$get({
                query: {
                    page: page.toString()
                }
            });

            if (!response.ok) {
                throw new Error('An error occurred while fetching insights')
            }

            return response.json();
        }
    });
}