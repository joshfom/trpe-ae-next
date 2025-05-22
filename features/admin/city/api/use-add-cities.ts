import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.cities.$post>
type RequestType = InferRequestType<typeof client.api.admin.cities.$post>["json"]

export const useAddCity = () => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.cities.$post({json})
            return response.json()
        },

        onSuccess: () => {
            toast.success('City added successfully')
            queryClient.invalidateQueries({queryKey: ["admin-cities"]})
        },

        onError: () => {
            toast.error('An error occurred while updating city')
        }

    })
}