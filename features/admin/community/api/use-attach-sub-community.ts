import {InferResponseType, InferRequestType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import { client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.communities[":communityId"]["sub_communities"]["attach"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.communities[":communityId"]["sub_communities"]["attach"]["$post"]>["json"]

export const useAttachSubCommunity = (communityId: string) => {

    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.communities[":communityId"].sub_communities.attach.$post({
                param: {
                    communityId
                },
                json
            })
            return response.json()
        },

        onSuccess: () => {
            toast.success('Sub community attached successfully')
            queryClient.invalidateQueries({queryKey: ["adminSubCommunities"]})
        },

        onError: () => {
            toast.error('An error occurred while updating community')
        }

    })

    return mutation
}