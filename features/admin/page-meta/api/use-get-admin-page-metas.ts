"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminPageMetas } from "@/actions/admin/get-admin-page-metas-action";

/**
 * React hook to fetch admin page metas via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetAdminPageMetas = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const result = await getAdminPageMetas();
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch page metas");
            }
            
            setData(result.data);
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('An error occurred while fetching page metas');
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