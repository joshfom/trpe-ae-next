import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAdminSubCommunities = () => {
    return useQuery({
        queryKey: ["adminSubCommunities"],
        queryFn: async () => {
            const response = await client.api.admin.communities.sub_communities.$get();

            if (!response.ok) {
                toast.error('An error occurred while fetching community')
                throw new Error('An error occurred while fetching community')
            }

            const {data} = await response.json()

            return data
        },
    })
}