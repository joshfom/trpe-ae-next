'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getOffplanPaymentPlan } from '@/actions/admin/get-offplan-payment-plan-action';

/**
 * Client hook to fetch offplan payment plan data
 * @param offplanId - The ID of the offplan project
 * @returns Object with data, loading state, and error information
 */
export const useGetOffplanPaymentPlanV2 = (offplanId: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!offplanId) return;
      
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      try {
        const result = await getOffplanPaymentPlan(offplanId);
        
        if (result.success) {
          setData(result.data);
        } else {
          setIsError(true);
          setError(new Error(result.error));
          toast.error(result.error || 'An error occurred while fetching payment plan');
        }
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        toast.error('An error occurred while fetching payment plan');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [offplanId]);
  
  const refetch = async () => {
    if (!offplanId) return;
    
    setIsLoading(true);
    try {
      const result = await getOffplanPaymentPlan(offplanId);
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
