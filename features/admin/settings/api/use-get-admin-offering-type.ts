import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAdminOfferingType = () => {
    return useQuery({
        queryKey: ["admin-offering-types"],
        queryFn: async () => {
            const response = await client.api.admin.types.offering_type.$get();

            if (!response.ok) {
                toast.error('An error occurred while fetching offering types')
                throw new Error('An error occurred while fetching offering types')
            }

            const {data} = await response.json()

            return data
        },
    })
}