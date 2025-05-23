"use client"
// This file now re-exports the client-side function to maintain backward compatibility
// while transitioning away from React Query

import { useState, useEffect } from "react";
import { getClientProperty } from './get-client-property';

export const useGetProperty = (slug: string) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!slug) {
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            try {
                const result = await getClientProperty(slug);
                setData(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [slug]);
    
    return {
        data,
        isLoading,
        error,
        isError: !!error,
        refetch: async () => {
            setIsLoading(true);
            try {
                const result = await getClientProperty(slug);
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