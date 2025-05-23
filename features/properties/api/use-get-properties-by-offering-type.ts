"use client"
// This file now provides a compatibility layer for the useInfiniteQuery pattern
// while transitioning away from React Query

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getClientPropertiesByOfferingType } from './get-client-properties-by-offering-type';

export const useGetPropertiesByOfferingType = (
    offeringTypeId: string,
    page?: number
) => {
    const params = useSearchParams();
    
    const queryParams = {
        lo: params.get('lo') || undefined,
        maxPrice: params.get('maxPrice') || undefined,
        bed: params.get('bed') || undefined,
        bathrooms: params.get('bathrooms') || undefined,
        minArea: params.get('minArea') || undefined,
        maxArea: params.get('maxArea') || undefined,
        sortBy: params.get('sortBy') || undefined,
        typeSlug: params.get('ty') || undefined,
    };
    
    const [pages, setPages] = useState<any[]>([]);
    const [pageParams, setPageParams] = useState<number[]>([1]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [hasNextPage, setHasNextPage] = useState<boolean>(true);
    
    // Load initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!offeringTypeId) {
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            try {
                const result = await getClientPropertiesByOfferingType(offeringTypeId, 1, queryParams);
                if (result) {
                    setPages([result]);
                    setHasNextPage(result.hasMore);
                }
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchInitialData();
    }, [offeringTypeId, ...Object.values(queryParams)]);
    
    // Function to fetch next page
    const fetchNextPage = useCallback(async () => {
        if (!hasNextPage || !offeringTypeId) return;
        
        const nextPageParam = pageParams[pageParams.length - 1] + 1;
        
        setIsFetching(true);
        try {
            const result = await getClientPropertiesByOfferingType(offeringTypeId, nextPageParam, queryParams);
            if (result) {
                setPages(prev => [...prev, result]);
                setPageParams(prev => [...prev, nextPageParam]);
                setHasNextPage(result.hasMore);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setIsFetching(false);
        }
    }, [offeringTypeId, hasNextPage, pageParams, ...Object.values(queryParams)]);
    
    // Function to refetch all data
    const refetch = useCallback(async () => {
        setIsLoading(true);
        setPages([]);
        setPageParams([1]);
        setHasNextPage(true);
        
        try {
            const result = await getClientPropertiesByOfferingType(offeringTypeId, 1, queryParams);
            if (result) {
                setPages([result]);
                setHasNextPage(result.hasMore);
            }
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setIsLoading(false);
        }
    }, [offeringTypeId, ...Object.values(queryParams)]);
    
    return {
        data: pages,
        isLoading,
        isFetching,
        error,
        isError: !!error,
        hasNextPage,
        fetchNextPage,
        refetch
    };
};