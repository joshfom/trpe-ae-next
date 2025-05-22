import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.languages.$post>
type RequestType = InferRequestType<typeof client.api.admin.languages.$post>["json"]

export const useAddLanguage = () => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.languages.$post({json})
            return response.json()
        },

        onSuccess: () => {
            toast.success('Language added successfully')
            queryClient.invalidateQueries({queryKey: ["admin-languages"]})
        },

        onError: () => {
            toast.error('An error occurred while adding language')
        }

    })
}