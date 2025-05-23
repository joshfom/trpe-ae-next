"use client"
// This file now provides a compatibility layer for the useQuery pattern
// while transitioning away from React Query

import { useState, useEffect } from "react";
import { getClientFaqList } from './get-client-faq-list';

export const useGetFaqList = (targetId: string, target: string) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!targetId) {
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            try {
                const result = await getClientFaqList(targetId, target);
                setData(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [targetId, target]);
    
    return {
        data,
        isLoading,
        error,
        isError: !!error,
        refetch: async () => {
            setIsLoading(true);
            try {
                const result = await getClientFaqList(targetId, target);
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