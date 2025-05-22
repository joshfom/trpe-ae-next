import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.insights[":insightSlug"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.admin.insights[":insightSlug"]["$patch"]>["json"]

export const useUpdateInsight = (insightSlug? : string) => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.insights[":insightSlug"]["$patch"]({
                param: {insightSlug},
                json
            })
            return response.json()
        },

        onSuccess: () => {
            toast.success('Agent updated successfully')
            queryClient.invalidateQueries({queryKey: ["admin-insights"]})
        },

        onError: (e) => {
            console.log('error updating', e)
            toast.error('An error occurred while updating Insight')
        }

    })
}