import { InferResponseType, InferRequestType } from "hono";
import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

/**
 * Type definitions for API response and request
 */
type ResponseType = InferResponseType<typeof client.api.admin["offering-types"][":offeringTypeId"]["update"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.admin["offering-types"][":offeringTypeId"]["update"]["$patch"]>["json"];

/**
 * Type for revalidation request
 */
interface RevalidateRequest {
    path: string;
    tag: string;
}

/**
 * Type for cache keys to ensure consistency
 */
type CacheKeys = {
    all: ["offeringTypes"];
    single: (id: string) => ["adminOfferingType", string];
};

/**
 * Cache keys for React Query
 */
const CACHE_KEYS: CacheKeys = {
    all: ["offeringTypes"],
    single: (id: string) => ["adminOfferingType", id],
};

/**
 * Custom hook for updating a community and managing related cache
 *
 * This hook handles:
 * 1. Community data update through the API
 * 2. Next.js cache revalidation
 * 3. React Query cache invalidation
 * 4. Success/error notifications
 *
 * @param communityId - The ID of the community to update
 * @returns Mutation object for handling community updates
 *
 * @example
 * ```tsx
 * const UpdateCommunity = () => {
 *   const updateCommunity = useUpdateCommunity('123')
 *
 *   const handleSubmit = (formData: RequestType) => {
 *     updateCommunity.mutate(formData)
 *   }
 *
 *   return <form onSubmit={handleSubmit}>...</form>
 * }
 * ```
 */
export const useUpdateOfferingType = (
    offeringTypeId?: string
): UseMutationResult<ResponseType, Error, RequestType> => {
    const queryClient = useQueryClient();

    /**
     * Handles Next.js cache revalidation
     */


    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json: RequestType): Promise<ResponseType> => {
            if (!offeringTypeId) {
                throw new Error('Community ID is required');
            }

            // Update community through API
            const response = await client.api.admin["offering-types"][":offeringTypeId"]["update"]["$patch"]({
                param: { offeringTypeId },
                json
            });

            const data = await response.json() as ResponseType;


            return data;
        },

        onSuccess: (data: ResponseType) => {
            toast.success('Offering type updated successfully');


        },

        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while updating community');
            console.error('Update error:', error);
        }
    });
};