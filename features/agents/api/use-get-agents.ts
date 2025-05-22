import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAgents = () => {
    return useQuery({
        queryKey: ["site-gents"],
        queryFn: async () => {
            const response = await client.api.agents.$get();

            if (!response.ok) {
                throw new Error('An error occurred while fetching agents')
            }

            const {data} = await response.json()

            return data
        },
    })
}