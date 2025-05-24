'use client';

import { useState, useEffect } from 'react';
import { getAdminOffplans } from '@/actions/admin/get-admin-offplans-action';
import { toast } from 'sonner';

export const useGetAdminOffplansV2 = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const result = await getAdminOffplans();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch offplans');
      }
      
      setData(result.data);
    } catch (err) {
      setIsError(true);
      const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
      setError(errorObj);
      toast.error('An error occurred while fetching insights');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return { data, isLoading, isError, error, refetch };
}
