import {InferResponseType, InferRequestType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import { client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.communities.$post>
type RequestType = InferRequestType<typeof client.api.admin.communities.$post>["json"]

export const useAddCommunity = (agentId? : string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.communities.$post({
                json
            })
            return response.json()
        },

        onSuccess: () => {
            toast.success('Community updated successfully')
            queryClient.invalidateQueries({queryKey: ["admin-communities"]})
        },

        onError: () => {
            toast.error('An error occurred while updating community')
        }

    })

    return mutation
}