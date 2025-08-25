'use client'

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {client} from "@/lib/hono";

// Define Community interface to match the API response format
interface Community {
  id?: string;
  name: string | null;
  slug: string;
  shortName?: string | null;
  propertyCount?: number;
  rentCount?: number;
  saleCount?: number;
  commercialRentCount?: number;
  commercialSaleCount?: number;
}

export default function FooterCommunitiesClient() {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted before making API calls
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Only run on client side after mounting
        if (!mounted || typeof window === 'undefined') {
            return;
        }

        // Use an AbortController to handle component unmounting
        const controller = new AbortController();
        
        async function fetchCommunities() {
            try {
                // Add a small delay to ensure the component is fully mounted
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Create a longer timeout specifically for this request
                const timeoutController = new AbortController();
                const timeoutId = setTimeout(() => timeoutController.abort(), 30000); // 30 seconds timeout
                
                const response = await client.api.communities.list.$get({
                    signal: timeoutController.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Check if we got data in the expected format
                    if (!data || !data.communities) {
                        console.warn("FooterCommunitiesClient: Unexpected API response format:", data);
                        setCommunities([]);
                        setError("Invalid response format");
                        return;
                    }
                    
                    // Filter communities with properties
                    const withProperties = data.communities.filter(
                        (community: Community) => (community.propertyCount || 0) > 0
                    );
                    
                    // Limit to 16 communities
                    setCommunities(withProperties.slice(0, 16));
                    setError(null);
                } else {
                    const errorMsg = `Failed to fetch communities: ${response.status}`;
                    console.warn(`FooterCommunitiesClient: ${errorMsg}`);
                    setCommunities([]);
                    setError(errorMsg);
                }
            } catch (error: any) {
                // Only log errors if they're not from aborting the request
                if (!controller.signal.aborted && error.name !== 'AbortError') {
                    console.warn("FooterCommunitiesClient: Error fetching communities:", error);
                    setError(error.message || 'Failed to fetch communities');
                    setCommunities([]);
                } else if (error.name === 'AbortError') {
                    // Handle timeout gracefully
                    console.warn("FooterCommunitiesClient: Request timed out, showing fallback");
                    setCommunities([]);
                    setError(null); // Don't show error for timeout
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        fetchCommunities();
        
        // Cleanup function to abort fetch if component unmounts
        return () => {
            controller.abort();
        };
    }, [mounted]); // Depend on mounted state

    // Don't render anything during SSR
    if (!mounted) {
        return <div className="pt-2 flex text-sm flex-col">Loading...</div>;
    }

    if (isLoading) {
        return <div className="pt-2 flex text-sm flex-col">Loading...</div>;
    }
    
    if (error) {
        console.warn("FooterCommunitiesClient rendering error:", error);
        return null; // Don't show error to users, just render nothing
    }

    if (!communities || communities.length === 0) {
        return null;
    }
    
    return (
        <div className="pt-2 flex text-sm flex-col">
            {communities.map((community) => (
                <Link
                    className={
                        "px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white"
                    }
                    key={community.slug}
                    href={`/communities/${community.slug}`}
                >
                    {community.name || community.slug}
                </Link>
            ))}
        </div>
    );
}