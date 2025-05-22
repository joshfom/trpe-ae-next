import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.faqs[":target"]["faqs"][":targetId"]["new"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.faqs[":target"]["faqs"][":targetId"]["new"]["$post"]>["json"]

export const useAddFaq = (targetId: string, target: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.faqs[":target"]["faqs"][":targetId"]["new"].$post({
                json,
                param: {targetId, target}
            })
            return response.json()
        },

        onSuccess: () => {
            toast.success('Faq added successfully')
            queryClient.invalidateQueries({queryKey: ["admin-faqs", targetId]})
        },

        onError: (e) => {
            toast.error('An error occurred while adding FAQ')
        }

    })
}