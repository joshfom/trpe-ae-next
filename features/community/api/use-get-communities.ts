import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetCommunities = () => {
    return useQuery({
        queryKey: ["communities"],
        queryFn: async () => {
            const response = await client.api.communities.list.$get()

            if (!response.ok) {
                toast.error('An error occurred while fetching communities')
                throw new Error('An error occurred while fetching communities')
            }

            const {communities} = await response.json()

            return communities
        },
    })
}