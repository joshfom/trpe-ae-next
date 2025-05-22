import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {toast} from "sonner";


export const useGetUnitType = (
    slug?:string,

) => {
    return useQuery({
        enabled: !!slug,
        queryKey: ["property-type", {
            slug,
        }],
        queryFn: async () => {
            const response = await client.api.unit_types[':slug'].$get({
                param: {
                    slug
                },
            });


            if (!response.ok) {
                toast.error('An error occurred while fetching properties')
                throw new Error('An error occurred while fetching properties')
            }

            const {unitType} = await response.json()

            return {
                unitType
            }
        },
    })
}