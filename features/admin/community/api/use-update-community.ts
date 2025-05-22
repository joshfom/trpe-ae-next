import { InferResponseType, InferRequestType } from "hono";
import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

/**
 * Type definitions for API response and request
 */
type ResponseType = InferResponseType<typeof client.api.admin.communities[":communityId"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.admin.communities[":communityId"]["$patch"]>["json"];

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
    all: ["adminCommunities"];
    single: (id: string) => ["adminCommunity", string];
};

/**
 * Cache keys for React Query
 */
const CACHE_KEYS: CacheKeys = {
    all: ["adminCommunities"],
    single: (id: string) => ["adminCommunity", id],
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
export const useUpdateCommunity = (
    communityId?: string
): UseMutationResult<ResponseType, Error, RequestType> => {
    const queryClient = useQueryClient();

    /**
     * Handles Next.js cache revalidation
     */
    const revalidateCache = async (id: string): Promise<void> => {
        const revalidateData: RevalidateRequest = {
            path: `/communities/${id}`,
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
            console.warn('Cache revalidation failed, but community was updated:', error);
        }
    };

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json: RequestType): Promise<ResponseType> => {
            if (!communityId) {
                throw new Error('Community ID is required');
            }

            // Update community through API
            const response = await client.api.admin.communities[":communityId"]["$patch"]({
                param: { communityId },
                json
            });

            const data = await response.json() as ResponseType;

            // Trigger Next.js cache revalidation
            await revalidateCache(communityId);

            return data;
        },

        onSuccess: (data: ResponseType) => {
            toast.success('Community updated successfully');

            // Invalidate cached queries
            queryClient.invalidateQueries({
                queryKey: CACHE_KEYS.all
            });

            if (communityId) {
                queryClient.invalidateQueries({
                    queryKey: CACHE_KEYS.single(communityId)
                });

                // Update cache immediately for better UX
                queryClient.setQueryData(
                    CACHE_KEYS.single(communityId),
                    data
                );
            }
        },

        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while updating community');
            console.error('Update error:', error);
        }
    });
};