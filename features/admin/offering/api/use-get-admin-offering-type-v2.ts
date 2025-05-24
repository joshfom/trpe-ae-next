'use client';

import { useState, useEffect } from 'react';
import { getAdminOfferingType } from '@/actions/admin/get-admin-offering-type-action';
import { toast } from 'sonner';

/**
 * Client hook to get admin offering type via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetAdminOfferingTypeV2 = (offeringTypeId?: string) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    // If no ID is provided, don't fetch
    if (!offeringTypeId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const result = await getAdminOfferingType(offeringTypeId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch offering type');
      }
      
      setData(result.data);
    } catch (err) {
      setIsError(true);
      const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
      setError(errorObj);
      toast.error('An error occurred while fetching offering type');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [offeringTypeId]);

  const refetch = () => {
    return fetchData();
  };

  return { data, isLoading, isError, error, refetch };
}
