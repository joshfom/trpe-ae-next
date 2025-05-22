import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAdminUnitTypes = () => {
    return useQuery({
        queryKey: ["admin-unit-types"],
        queryFn: async () => {
            const response = await client.api.admin.types.unit_type.$get();

            if (!response.ok) {
                toast.error('An error occurred while fetching Unit types')
                throw new Error('An error occurred while fetching unit types')
            }

            const {data} = await response.json()

            return data
        },
    })
}