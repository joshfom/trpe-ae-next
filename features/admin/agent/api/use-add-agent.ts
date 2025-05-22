import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.agents.$post>
type RequestType = InferRequestType<typeof client.api.admin.agents.$post>["json"]

export const useAddAgent = () => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.agents.$post({json})
            return response.json()
        },

        onSuccess: () => {
            toast.success('Agent added successfully')
            queryClient.invalidateQueries({queryKey: ["agents"]})
        },

        onError: () => {
            toast.error('An error occurred while updating agent')
        }

    })
}