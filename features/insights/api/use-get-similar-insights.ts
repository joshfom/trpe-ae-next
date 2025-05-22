import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetSimilarInsights = (insightId?: string) => {
    return useQuery({
        queryKey: ["insights-similar"],
        enabled: !!insightId,
        queryFn: async () => {
            const response = await client.api.insights.similar[":insightId"].$get({
                param: {
                    insightId
                }
            });

            if (!response.ok) {
                throw new Error('An error occurred while fetching insights')
            }

            const {data} = await response.json()

            return data
        },
    })
}