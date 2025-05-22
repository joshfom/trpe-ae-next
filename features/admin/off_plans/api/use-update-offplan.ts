import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.offplans[":offplanId"]["update"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.admin.offplans[":offplanId"]["update"]["$patch"]>["json"]

export const useUpdateOffplan = (offplanId? : string) => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.offplans[":offplanId"]["update"]["$patch"]({
                param: {offplanId},
                json
            })
            return response.json()
        },

        onSuccess: () => {
            toast.success('Agent updated successfully')
            queryClient.invalidateQueries({queryKey: ["admin-offplans"]})
        },

        onError: () => {
            toast.error('An error occurred while updating Insight')
        }

    })
}