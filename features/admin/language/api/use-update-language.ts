import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.languages[":languageId"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.languages[":languageId"]["$post"]>["json"]

export const useUpdateLanguage = (languageId? : string) => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.languages[":languageId"]["$post"]({
                param: {languageId},
                json
            })
            return response.json()
        },

        onSuccess: () => {
            toast.success('Language updated successfully')
            queryClient.invalidateQueries({queryKey: ["admin-languages"]})
        },

        onError: () => {
            toast.error('An error occurred while updating agent')
        }

    })
}