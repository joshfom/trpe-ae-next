import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {client} from "@/lib/hono"
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.admin["page-meta"]["new"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin["page-meta"]["new"]["$post"]>["json"]

export const useAddPageMeta = () => {
    const queryClient = useQueryClient()

    return useMutation<
        ResponseType,
        Error,
        RequestType
    >({
       mutationFn: async (json) => {
                        try {

                            const response = await client.api.admin["page-meta"]["new"].$post({json})

                            console.log('Response status:', response);
                            if (!response.ok) {
                                const errorData = await response.json();
                                console.error('API error response:', errorData);
                                throw new Error(JSON.stringify(errorData));
                            }

                            return await response.json();
                        } catch (error) {
                            console.log('API request failed:', error);
                            // Re-throw the error to properly handle it in onError
                            throw error;
                        }
                    },

        onSuccess: (data) => {
            console.log('Page meta added successfully:', data);
            toast.success('Page meta added successfully')
            queryClient.invalidateQueries({queryKey: ["admin-page-meta"]})
        },

        onError: (error) => {
            console.error('Error in mutation:', error);
            if (error instanceof Error) {
                try {
                    const errorData = JSON.parse(error.message);
                    if (errorData.error) {
                        toast.error(errorData.error);
                        return;
                    }
                } catch (e) {
                    // Not a JSON error
                }
            }
            toast.error('An error occurred while updating page Meta')
        }

    })
}