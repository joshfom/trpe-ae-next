import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

/**
 * Custom hook to fetch admin community data based on the provided community ID.
 *
 * @param {string} [communityId] - The ID of the community to fetch.
 * @returns {UseQueryResult} - The result of the query, including the community data.
 *
 * @example
 * const { data, error, isLoading } = useGetAdminCommunity("community-id");
 *
 * @remarks
 * This hook uses the `useQuery` hook from React Query to fetch the community data.
 * The query is enabled only if the `communityId` is provided.
 * If the fetch operation fails, an error toast is displayed and an error is thrown.
 */

export const useGetAdminCommunity = (communityId?: string) => {
    return useQuery({
        enabled: !!communityId,
        queryKey: ["adminCommunities", communityId],
        queryFn: async () => {
            const response = await client.api.admin.communities[":communityId"].$get({
                param: {
                    communityId
                }
            });

            if (!response.ok) {
                toast.error('An error occurred while fetching community')
                throw new Error('An error occurred while fetching community')
            }

            const {data} = await response.json()

            return data
        },
    })
}