import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAgentData = (teamId?: string) => {
    return useQuery({
        queryKey: ["agents-data"],
        enabled: !!teamId,
        queryFn: async () => {
            const response = await client.api.admin.agents.$get();

            if (!response.ok) {
                toast.error('An error occurred while fetching agents')
                throw new Error('An error occurred while fetching agents')
            }

            const {data} = await response.json()

            return data
        },
    })
}