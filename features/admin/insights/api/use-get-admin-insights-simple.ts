"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
// import { getAdminInsightsSimple } from "@/actions/admin/get-admin-insights-simple";
import { getAdminInsights } from "@/actions/admin/get-admin-insights-action";

/**
 * Simple React hook to test server actions
 */
export const useGetAdminInsightsSimple = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    // Use ref to track if component is mounted
    const isMountedRef = useRef(true);

    const fetchData = async () => {
        try {
            if (!isMountedRef.current) return;
            
            setIsLoading(true);
            setIsError(false);
            setError(null);
            
            console.log('Calling getAdminInsights...');
            const result = await getAdminInsights({});
            console.log('Result received:', result);
            
            if (!isMountedRef.current) return;
            
            if (!result || typeof result !== 'object' || !('success' in result)) {
                throw new Error("Invalid response format");
            }
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch insights");
            }
            
            setData(result.data);
        } catch (err) {
            if (!isMountedRef.current) return;
            
            console.error("Fetch error:", err);
            setIsError(true);
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('Error fetching insights: ' + errorObj.message);
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
        
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return {
        data,
        isLoading,
        isError,
        error,
        refetch: fetchData
    };
}
