"use client"
// This file now provides a compatibility layer for the useQuery pattern
// while transitioning away from React Query

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { searchClientPropertiesWithServer } from "./search-client-properties-with-server";

export const useSearchPropertiesWithDrizzle = (
    offeringType?: string,
    unitType?: string,
) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    
    const searchParams = useSearchParams();
    const pathname = usePathname();
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Convert searchParams URLSearchParams to a standard URLSearchParams object
                const searchParamsObj = new URLSearchParams();
                for (const [key, value] of searchParams.entries()) {
                    searchParamsObj.append(key, value);
                }
                
                const result = await searchClientPropertiesWithServer(
                    offeringType,
                    unitType,
                    searchParamsObj,
                    pathname
                );
                
                setData(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [offeringType, unitType, searchParams, pathname]);
    
    return {
        data,
        isLoading,
        error,
        isError: !!error,
        refetch: async () => {
            setIsLoading(true);
            try {
                // Convert searchParams URLSearchParams to a standard URLSearchParams object
                const searchParamsObj = new URLSearchParams();
                for (const [key, value] of searchParams.entries()) {
                    searchParamsObj.append(key, value);
                }
                
                const result = await searchClientPropertiesWithServer(
                    offeringType,
                    unitType,
                    searchParamsObj,
                    pathname
                );
                
                setData(result);
                setError(null);
                return result;
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
                throw err;
            } finally {
                setIsLoading(false);
            }
        }
    };
};

// Keep the old name for backward compatibility
export const useSearchPropertiesWithAlgolia = useSearchPropertiesWithDrizzle;
