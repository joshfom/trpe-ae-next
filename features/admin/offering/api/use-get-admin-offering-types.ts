import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAdminOfferingTypes = () => {
    return useQuery({
        queryKey: ["adminOfferingTypes"],
        queryFn: async () => {
            const response = await client.api.admin["offering-types"].$get();

            if (!response.ok) {
                toast.error('An error occurred while fetching Offering Type')
                throw new Error('An error occurred while fetching Offering Type')
            }

            const {data} = await response.json()

            return data
        },
    })
}