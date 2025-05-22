import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.offplans[":offplanId"]["faqs"]["new"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.offplans[":offplanId"]["faqs"]["new"]["$post"]>["json"]

export const useAddOffplanFaq = (offplanId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.offplans[":offplanId"]["faqs"]["new"].$post({
                json,
                param: {offplanId}
            })
            return response.json()
        },

        onSuccess: () => {
            toast.success('Faq added successfully')
            queryClient.invalidateQueries({queryKey: ["offplan-faqs", offplanId]})
        },

        onError: (e) => {
            toast.error('An error occurred while adding FAQ')
        }

    })
}