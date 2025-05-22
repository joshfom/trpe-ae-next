import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";
import {useRouter} from "next/navigation";

type ResponseType = {
    data: {
        id: string;
    };
} | { Unauthorized: string; };

type RequestType = InferRequestType<typeof client.api.admin.offplans.new.$post>["json"]

/**
 * Custom hook to add a new off-plan using a mutation.
 *
 * This hook utilizes `useMutation` from `react-query` to handle the mutation
 * for adding a new off-plan. It also handles success and error scenarios
 * with appropriate toast notifications and query invalidation.
 *
 * @returns {Mutation} The mutation object for adding a new off-plan.
 *
 * @example
 * const { mutate } = useAddPageMeta();
 * mutate(newOffplanData);
 *
 * @remarks
 * - On success, it invalidates the "admin-offplans" query and navigates to the newly added off-plan's detail page.
 * - On error, it shows an error toast notification.
 *
 * @see {@link https://react-query.tanstack.com/reference/useMutation} for more information on `useMutation`.
 */

export const useAddOffplan = () => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.offplans.new.$post({json})
            return response.json()
        },

        onSuccess: (data) => {
            if ('data' in data) {
                toast.success('Offplan added successfully')
                queryClient.invalidateQueries({queryKey: ["admin-offplans"]})
                router.push(`/admin/off-plans/${data.data.id}`)
            } else {
                toast.error('Unauthorized')
            }
        },

        onError: () => {
            toast.error('An error occurred while updating Offplan')
        }

    })
}