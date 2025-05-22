import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {toast} from "sonner";


export const useGetCommunityProperties = (
    communityId:string,
) => {
    return useQuery({
        enabled: !!communityId,
        queryKey: ["community", {
            communityId
        }],
        queryFn: async () => {
            const response = await client.api.communities[':communityId'].$get({
                param: {
                    communityId
                }
            });


            if (!response.ok) {
                toast.error('An error occurred while fetching properties')
                throw new Error('An error occurred while fetching properties')
            }

            const {
                data,
            } = await response.json()

            return {
                data
            }
        },
    })
}