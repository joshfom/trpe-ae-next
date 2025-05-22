import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAdminLanguage = () => {
    return useQuery({
        queryKey: ["admin-languages"],
        queryFn: async () => {
            const response = await client.api.admin.languages.$get();

            if (!response.ok) {
                toast.error('An error occurred while fetching language')
                throw new Error('An error occurred while fetching languages')
            }

            const {data} = await response.json()

            return data
        },
    })
}