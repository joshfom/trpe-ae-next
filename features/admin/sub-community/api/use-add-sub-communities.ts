import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.communities[':communityId']['$post']>
type RequestType = InferRequestType<typeof client.api.admin.communities[':communityId']['$post']>["json"]

export const useAddSubCommunity = (communityId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.communities[':communityId'].$post({
                param: {
                    communityId
                },

                json
            })
            return response.json()
        },

        onSuccess: () => {
            toast.success('Sub community added successfully')
            queryClient.invalidateQueries({queryKey: ["admin-communities", communityId]})
        },

        onError: () => {
            toast.error('An error occurred while adding sub community')
        }

    })
}