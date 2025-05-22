import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {toast} from "sonner";
import {useSearchParams} from "next/navigation";


export const useGetFeaturedProperty = (
    offeringTypeId:string
) => {

    const params = useSearchParams();
    const limit = params.get('limit') || '1';

    return useQuery({
        enabled: !!offeringTypeId,
        queryKey: ["featured_property", {
            offeringTypeId
        }],

        queryFn: async () => {
            const response = await client.api.featured.properties[":offeringTypeId"].$get({
                param: {
                    offeringTypeId,
                },
                query: {
                    limit
                }
            });



            if (!response.ok) {
                toast.error('An error occurred while fetching properties')
                throw new Error('An error occurred while fetching properties')
            }

            const {data} = await response.json()

            return data
        },
    })
}