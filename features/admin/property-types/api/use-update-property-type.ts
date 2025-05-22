import { InferResponseType, InferRequestType } from "hono";
import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

/**
 * Type definitions for API response and request
 */
type ResponseType = InferResponseType<typeof client.api.admin["property-types"][":propertyTypeId"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.admin["property-types"][":propertyTypeId"]["$patch"]>["json"];

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
    all: ["propertyType"];
    single: (id: string) => ["propertyType", string];
};

/**
 * Cache keys for React Query
 */
const CACHE_KEYS: CacheKeys = {
    all: ["propertyType"],
    single: (id: string) => ["propertyType", id],
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
export const useUpdatePropertyType = (
    propertyTypeId?: string
): UseMutationResult<ResponseType, Error, RequestType> => {
    const queryClient = useQueryClient();

    /**
     * Handles Next.js cache revalidation
     */
    const revalidateCache = async (id: string): Promise<void> => {
        const revalidateData: RevalidateRequest = {
            path: `/pro/${id}`,
            tag: `community-${id}`
        };

        try {
            const revalidateResponse = await fetch('/api/revalidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(revalidateData)
            });

            if (!revalidateResponse.ok) {
                throw new Error('Revalidation failed');
            }
        } catch (error) {
            console.warn('Cache revalidation failed, but property type was updated:', error);
        }
    };

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json: RequestType): Promise<ResponseType> => {
            if (!propertyTypeId) {
                throw new Error('Community ID is required');
            }

            // Update community through API
            const response = await client.api.admin["property-types"][":propertyTypeId"]["$patch"]({
                param: { propertyTypeId },
                json
            });

            const data = await response.json() as ResponseType;

            // Trigger Next.js cache revalidation
            await revalidateCache(propertyTypeId);

            return data;
        },

        onSuccess: (data: ResponseType) => {
            toast.success('Property type updated successfully');

            // Invalidate cached queries
            queryClient.invalidateQueries({
                queryKey: CACHE_KEYS.all
            });

            if (propertyTypeId) {
                queryClient.invalidateQueries({
                    queryKey: CACHE_KEYS.single(propertyTypeId)
                });

                // Update cache immediately for better UX
                queryClient.setQueryData(
                    CACHE_KEYS.single(propertyTypeId),
                    data
                );
            }
        },

        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while updating Property type');
            console.error('Update error:', error);
        }
    });
};