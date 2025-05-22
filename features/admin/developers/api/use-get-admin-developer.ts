import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAdminDeveloper = () => {
    return useQuery({
        queryKey: ["admin-developers"],
        queryFn: async () => {
            const response = await client.api.admin.developers.$get();

            if (!response.ok) {
                toast.error('An error occurred while fetching developers')
                throw new Error('An error occurred while fetching developers')
            }

            const {data} = await response.json()

            return data
        },
    })
}