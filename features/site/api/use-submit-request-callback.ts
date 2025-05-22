import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.leads.callback.$post>
type RequestType = InferRequestType<typeof client.api.leads.callback.$post>["json"]

export const useCallbackRequest = () => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.leads.callback.$post({json})
            return response.json()
        },

        onSuccess: () => {
            toast.success('We have received your Callback Request, one of our Experts will contact you shortly')
        },

        onError: () => {
            toast.error('An error occurred while sending your message, please try again')
        }

    })
}