"use client"
// This file now re-exports the client-side function to maintain backward compatibility
// while transitioning away from React Query

import { getClientCommunities } from './get-client-communities';

// For backward compatibility, we provide a dummy hook that logs a deprecation warning
// This helps identify any places still using the old hook pattern
export const useGetCommunities = () => {
    console.warn('useGetCommunities is deprecated. Please use getClientCommunities instead.');
    
    return {
        data: [],
        isLoading: true,
        error: null,
        isError: false,
        refetch: async () => {
            console.warn('useGetCommunities.refetch is deprecated. Please use getClientCommunities instead.');
            return await getClientCommunities();
        }
    };
};

// Export the client-side function for direct usage
export { getClientCommunities };