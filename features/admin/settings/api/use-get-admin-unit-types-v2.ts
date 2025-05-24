'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getAdminUnitTypes } from '@/actions/admin/get-admin-unit-types-action';

/**
 * Client hook to fetch admin unit types data
 * @returns Object with data, loading state, and error information
 */
export const useGetAdminUnitTypesV2 = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      try {
        const result = await getAdminUnitTypes();
        
        if (result.success) {
          setData(result.data);
        } else {
          setIsError(true);
          setError(new Error(result.error));
          toast.error(result.error || 'An error occurred while fetching unit types');
        }
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        toast.error('An error occurred while fetching unit types');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const refetch = async () => {
    setIsLoading(true);
    try {
      const result = await getAdminUnitTypes();
      if (result.success) {
        setData(result.data);
      } else {
        setIsError(true);
        setError(new Error(result.error));
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    data,
    isLoading,
    isError,
    error,
    refetch
  };
};
