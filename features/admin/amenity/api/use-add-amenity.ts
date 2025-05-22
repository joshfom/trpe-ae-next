import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin.amenities.$post>
type RequestType = InferRequestType<typeof client.api.admin.amenities.$post>["json"]

export const useAddAmenity = () => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.admin.amenities.$post({json})
            return response.json()
        },

        onSuccess: () => {
            toast.success('Amenity added successfully')
            queryClient.invalidateQueries({queryKey: ["amenity"]})
        },

        onError: () => {
            toast.error('An error occurred while updating amenity')
        }

    })
}