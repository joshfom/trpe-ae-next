"use client"
import { useState, useEffect } from 'react';

interface DashboardStats {
  properties?: number;
  communities?: number;
  insights?: number;
  developers?: number;
  offplans?: number;
  agents?: number;
}

export const useGetDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay for demonstration purposes
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // This would normally be a fetch to your API
        // const response = await fetch('/api/admin/dashboard/stats');
        // const data = await response.json();
        
        // For now, we'll just use mock data
        const mockData: DashboardStats = {
          properties: 324,
          communities: 42,
          insights: 18,
          developers: 15,
          offplans: 27,
          agents: 9
        };
        
        setStats(mockData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard stats'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
  };
};
