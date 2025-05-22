import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {toast} from "sonner";


export const useGetPropertyType = () => {
    return useQuery({
        queryKey: ["unitType"],
        queryFn: async () => {
            const response = await client.api.unit_types.$get();


            if (!response.ok) {
                throw new Error('An error occurred while fetching types')
            }

            const {data} = await response.json()


            return {
                data
            }
        },
    })
}