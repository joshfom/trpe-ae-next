import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAdminOffplans = () => {
    return useQuery({
        queryKey: ["admin-insights"],
        queryFn: async () => {
            const response = await client.api.admin.insights.$get();

            if (!response.ok) {
                toast.error('An error occurred while fetching insights')
                throw new Error('An error occurred while fetching insights')
            }

            const {data} = await response.json()

            return data
        },
    })
}