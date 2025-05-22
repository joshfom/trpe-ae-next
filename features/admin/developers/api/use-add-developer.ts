import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.developers.$post>
type RequestType = InferRequestType<typeof client.api.admin.developers.$post>["json"]

/**
 * Custom hook to add a developer using a mutation.
 *
 * This hook uses `useMutation` from `react-query` to handle the mutation for adding a developer.
 * It also uses `useQueryClient` to invalidate the queries related to developers upon successful mutation.
 *
 * @returns {UseMutationResult<ResponseType, Error, RequestType>} The mutation result object.
 *
 * @example
 * const { mutate } = useAddDeveloper();
 * mutate(newDeveloperData);
 *
 * @remarks
 * - On successful addition of a developer, a success toast message is shown and the "admin-developers" query is invalidated.
 * - On error, an error toast message is shown.
 */


export const useAddDeveloper = () => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.developers.$post({json})
            return response.json()
        },

        onSuccess: () => {
            toast.success('Developer added successfully')
            queryClient.invalidateQueries({queryKey: ["admin-developers"]})
        },

        onError: (e) => {
            toast.error('An error occurred while adding Developer')
        }

    })
}