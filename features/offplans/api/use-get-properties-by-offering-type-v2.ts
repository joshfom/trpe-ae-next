'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getPropertiesByOfferingTypeAction } from '@/actions/properties/get-properties-by-offering-type-action';

interface OfferingTypeQueryParams {
  lo?: string;
  maxPrice?: string;
  bed?: string;
  bathrooms?: string;
  minArea?: string;
  maxArea?: string;
  sortBy?: string;
  typeSlug?: string;
}

export const useGetPropertiesByOfferingTypeV2 = (
  offeringTypeId: string,
  queryParams?: OfferingTypeQueryParams
) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const fetchPage = useCallback(async (page: number) => {
    if (!offeringTypeId) return;
    
    const fetchingNextPage = page > 1;
    
    if (fetchingNextPage) {
      setIsFetchingNextPage(true);
    } else {
      setIsLoading(true);
      setData([]);
    }
    
    setIsError(false);
    setError(null);
    
    try {
      const result = await getPropertiesByOfferingTypeAction(offeringTypeId, page, queryParams);
      
      // Handle the result directly since it doesn't have success property
      if (fetchingNextPage) {
        setData(prevData => [...prevData, ...result.data]);
      } else {
        setData(result.data);
      }
      setCurrentPage(page);
      setHasNextPage(result.hasMore || false);
      
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      if (!fetchingNextPage) {
        toast.error('An error occurred while fetching properties');
      }
    } finally {
      if (fetchingNextPage) {
        setIsFetchingNextPage(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [offeringTypeId, queryParams]);

  useEffect(() => {
    fetchPage(1);
  }, [offeringTypeId, queryParams, fetchPage]);

  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchPage(currentPage + 1);
    }
  }, [hasNextPage, isFetchingNextPage, currentPage, fetchPage]);

  return {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};
