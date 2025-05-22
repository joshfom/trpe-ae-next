import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin["page-meta"][":id"]["update"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.admin["page-meta"][":id"]["update"]["$patch"]>["json"]

export const useUpdatePageMeta = (id? : string) => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin["page-meta"][":id"]["update"]["$patch"]({
                param: {id},
                json
            })
            return response.json()
        },

        onSuccess: () => {
            toast.success('Agent updated successfully')
            queryClient.invalidateQueries({queryKey: ["admin-page-meta"]})
        },

        onError: () => {
            toast.error('An error occurred while updating Insight')
        }

    })
}