"use client"
// This file now provides a compatibility layer for the useQuery pattern
// while transitioning away from React Query

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { searchClientProperties } from './search-client-properties';
import { extractPathSearchParams } from "@/features/search/hooks/path-search-helper";

interface SearchParams {
    page?: number;
    limit?: number;
    // Add other parameters as needed
    [key: string]: any;
}

export const useSearchProperties = (offerType?: string, searchParams?: SearchParams) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    
    const pathName = usePathname();
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await searchClientProperties(offerType, searchParams, pathName);
                setData(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [offerType, pathName, JSON.stringify(searchParams)]);
    
    return {
        data,
        isLoading,
        error,
        isError: !!error,
        refetch: async () => {
            setIsLoading(true);
            try {
                const result = await searchClientProperties(offerType, searchParams, pathName);
                setData(result);
                setError(null);
                return result;
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
                throw err;
            } finally {
                setIsLoading(false);
            }
        }
    };
};
