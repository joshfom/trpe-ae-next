"use client";

/**
 * DEPRECATED: React hook to fetch luxe communities via server action
 * This hook has been replaced with useGetAdminCommunities
 */
export const useGetLuxeCommunities = () => {
    return {
        data: [],
        isLoading: false,
        isError: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

export default useGetLuxeCommunities;
