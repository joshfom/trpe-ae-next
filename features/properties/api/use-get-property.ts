import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {toast} from "sonner";


export const useGetProperty = (
    slug:string,

) => {
    return useQuery({
        enabled: !!slug,
        queryKey: ["property", {
            slug,
        }],
        queryFn: async () => {
            const response = await client.api.properties[':slug'].$get({
                param: {
                    slug
                },
            });


            if (!response.ok) {
                toast.error('An error occurred while fetching properties')
                throw new Error('An error occurred while fetching properties')
            }

            const {data} = await response.json()

            return {
                data
            }
        },
    })
}