import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

/**
 * Custom hook to fetch admin offering type data based on the provided offering type ID.
 *
 * @param {string} [propertyTypeId] - The ID of the offering type to fetch.
 * @returns {UseQueryResult} - The result of the query, including the offering type data.
 *
 * @example
 * const { data, error, isLoading } = useGetAdminCommunity("offering type-id");
 *
 * @remarks
 * This hook uses the `useQuery` hook from React Query to fetch the offering type data.
 * The query is enabled only if the `propertyTypeId` is provided.
 * If the fetch operation fails, an error toast is displayed and an error is thrown.
 */

export const useGetAdminPropertyType = (propertyTypeId?: string) => {
    return useQuery({
        enabled: !!propertyTypeId,
        queryKey: ["adminOfferingType", propertyTypeId],
        queryFn: async () => {
            const response = await client.api.admin["property-types"][":propertyTypeId"].$get({
                param: {
                    propertyTypeId
                }
            });

            if (!response.ok) {
                toast.error('An error occurred while fetching offering type')
                throw new Error('An error occurred while fetching offering type')
            }

            const {data} = await response.json()

            return data
        },
    })
}