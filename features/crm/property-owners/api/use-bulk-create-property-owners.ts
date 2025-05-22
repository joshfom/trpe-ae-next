import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.crm.property_owners["bulk_create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.crm.property_owners["bulk_create"]["$post"]>["json"];

export const useBulkCreatePropertyOwner = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.crm.property_owners["bulk_create"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transactions created");
            queryClient.invalidateQueries({ queryKey: ["property-owners"] });
        },
        onError: () => {
            toast.error("Failed to create transactions");
        },
    });

    return mutation;
};
