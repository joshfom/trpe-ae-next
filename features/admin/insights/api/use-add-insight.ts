import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.insights.$post>
type RequestType = InferRequestType<typeof client.api.admin.insights.$post>["json"]

export const useAddInsight = () => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.insights.$post({json})
            return response.json()
        },

        onSuccess: () => {
            toast.success('Insight added successfully')
            queryClient.invalidateQueries({queryKey: ["admin-insights"]})
        },

        onError: () => {
            toast.error('An error occurred while updating Insight')
        }

    })
}