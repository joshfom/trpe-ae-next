import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAdminPropertyTypes = () => {
    return useQuery({
        queryKey: ["adminPropertyTypes"],
        queryFn: async () => {
            const response = await client.api.admin["property-types"].$get();

            if (!response.ok) {
                toast.error('An error occurred while fetching Property Type')
                throw new Error('An error occurred while fetching Property Type')
            }

            const {data} = await response.json()

            return data
        },
    })
}