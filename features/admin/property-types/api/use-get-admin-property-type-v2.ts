'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getAdminPropertyType } from '@/actions/admin/get-admin-property-type-action';

/**
 * Client hook to fetch admin property type data
 * @param propertyTypeId - The ID of the property type to fetch
 * @returns Object with data, loading state, and error information
 */
export const useGetAdminPropertyTypeV2 = (propertyTypeId?: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!propertyTypeId) return;
      
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      try {
        const result = await getAdminPropertyType(propertyTypeId);
        
        if (result.success) {
          setData(result.data);
        } else {
          setIsError(true);
          setError(new Error(result.error));
          toast.error(result.error || 'An error occurred while fetching property type');
        }
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        toast.error('An error occurred while fetching property type');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [propertyTypeId]);
  
  const refetch = async () => {
    if (!propertyTypeId) return;
    
    setIsLoading(true);
    try {
      const result = await getAdminPropertyType(propertyTypeId);
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
