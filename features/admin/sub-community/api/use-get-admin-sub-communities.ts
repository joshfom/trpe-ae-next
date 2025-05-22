import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAdminSubCommunities = (communityId: string) => {
    return useQuery({
        queryKey: ["admin-community", communityId ],
        queryFn: async () => {
            const response = await client.api.admin.communities[":communityId"].sub_communities.$get({
                param: {communityId}
            });

            if (!response.ok) {
                toast.error('An error occurred while fetching sub communities')
                throw new Error('An error occurred while fetching communities')
            }

            const {data} = await response.json()

            return data
        },
    })
}