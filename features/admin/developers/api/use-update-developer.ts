import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.developers[":developerId"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.admin.developers[":developerId"]["$patch"]>["json"]

export const useUpdateDeveloper = (developerId? : string) => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.developers[":developerId"]["$patch"]({
                param: {developerId},
                json
            })
            return response.json()
        },

        onSuccess: () => {
            toast.success('Developer updated successfully')
            queryClient.invalidateQueries({queryKey: ["admin-developers"]})
        },

        onError: () => {
            toast.error('An error occurred while updating developer')
        }

    })
}