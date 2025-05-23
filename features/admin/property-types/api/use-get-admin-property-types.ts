"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminPropertyTypes } from "@/actions/admin/get-admin-property-types-action";

/**
 * React hook to fetch admin property types via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetAdminPropertyTypes = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const result = await getAdminPropertyTypes();
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch property types");
            }
            
            setData(result.data);
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('An error occurred while fetching Property Type');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);
    
    return {
        data,
        isLoading,
        error,
        refetch: fetchData
    };
}