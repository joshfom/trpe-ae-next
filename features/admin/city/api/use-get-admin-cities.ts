import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAdminCities = () => {
    return useQuery({
        queryKey: ["admin-cities"],
        queryFn: async () => {
            const response = await client.api.admin.cities.$get();

            if (!response.ok) {
                toast.error('An error occurred while fetching cities')
                throw new Error('An error occurred while fetching cities')
            }

            const {data} = await response.json()

            return data
        },
    })
}