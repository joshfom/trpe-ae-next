import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAdminCommunities = () => {
    return useQuery({
        queryKey: ["adminCommunities"],
        queryFn: async () => {
            const response = await client.api.admin.communities.$get();

            if (!response.ok) {
                toast.error('An error occurred while fetching communities')
                throw new Error('An error occurred while fetching communities')
            }

            const {data} = await response.json()

            return data
        },
    })
}