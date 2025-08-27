"use client"
// This file now re-exports the client-side function to maintain backward compatibility
// while transitioning away from React Query

import { useState, useEffect } from "react";
import { getClientFeaturedProperty } from './get-client-featured-property';

export const useGetFeaturedProperty = (offeringTypeId: string, limit: string = '1') => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!offeringTypeId) {
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            try {
                const result = await getClientFeaturedProperty(offeringTypeId, limit);
                setData(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [offeringTypeId, limit]);
    
    return {
        data,
        isLoading,
        error,
        isError: !!error,
        refetch: async () => {
            setIsLoading(true);
            try {
                const result = await getClientFeaturedProperty(offeringTypeId, limit);
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