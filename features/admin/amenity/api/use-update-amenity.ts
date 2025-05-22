import {InferResponseType, InferRequestType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import { client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.agents[":agentId"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.agents[":agentId"]["$post"]>["json"]

export const useUpdateAmenity = (agentId? : string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.agents[":agentId"]["$post"]({
                param: {agentId},
                json
            })
            return response.json()
        },

        onSuccess: () => {
            toast.success('Agent updated successfully')
            queryClient.invalidateQueries({queryKey: ["agents"]})
        },

        onError: () => {
            toast.error('An error occurred while updating agent')
        }

    })

    return mutation
}