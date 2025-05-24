'use client';

import { useState, useEffect } from 'react';
import { getSimilarInsights } from '@/actions/insights/get-similar-insights-action';

/**
 * Client hook to fetch similar insights data
 * @param insightId - The ID of the insight to find similar insights for
 * @returns Object with data, loading state, and error information
 */
export const useGetSimilarInsightsV2 = (insightId?: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!insightId) return;
      
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      try {
        const result = await getSimilarInsights(insightId);
        
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
    
    fetchData();
  }, [insightId]);
  
  return {
    data,
    isLoading,
    isError,
    error
  };
};
