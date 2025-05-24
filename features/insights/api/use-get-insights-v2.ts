'use client';

import { useState, useEffect } from 'react';
import { getInsight, getInsights } from '@/actions/insights/get-insights-action';

export const useGetInsightV2 = (insightSlug?: string) => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!insightSlug) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      try {
        const result = await getInsight(insightSlug);
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        // Handle the case where data might be undefined
        setData(result.data || null);
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [insightSlug]);

  const refetch = async () => {
    if (!insightSlug) return;
    
    setIsLoading(true);
    try {
      const result = await getInsight(insightSlug);
      if (result.success) {
        // Handle the case where data might be undefined
        setData(result.data || null);
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

  return { data, isLoading, isError, error, refetch };
};

export function useGetInsightsV2(page: number = 1) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      try {
        const result = await getInsights(page);
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        // Ensure we always have an array, even if data is undefined
        setData(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const result = await getInsights(page);
      if (result.success) {
        // Ensure we always have an array, even if data is undefined
        setData(Array.isArray(result.data) ? result.data : []);
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

  return { data, isLoading, isError, error, refetch };
}
