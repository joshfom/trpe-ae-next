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

    useEffect(() => {
        // Use an AbortController to handle component unmounting
        const controller = new AbortController();
        
        async function fetchCommunities() {
            try {
                console.log("Client: Fetching communities for footer");
                
                const response = await client.api.communities.list.$get({
                    signal: controller.signal
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Check if we got data in the expected format
                    if (!data.communities) {
                        console.error("Client: Unexpected API response format:", data);
                        setError("Unexpected data format from API");
                        setCommunities([]);
                        return;
                    }
                    
                    // Filter communities with properties
                    const withProperties = data.communities.filter(
                        (community: Community) => (community.propertyCount || 0) > 0
                    );
                    
                    console.log(`Client: Found ${withProperties.length} communities with properties out of ${data.communities.length} total`);
                    
                    // Limit to 16 communities
                    setCommunities(withProperties.slice(0, 16));
                } else {
                    console.error("Client: Failed to fetch communities:", response.status);
                    setError(`Failed to fetch communities: ${response.status}`);
                }
            } catch (error) {
                // Only log errors if they're not from aborting the request
                if (!controller.signal.aborted) {
                    console.error("Client: Error fetching communities:", error);
                    setError("Error fetching communities");
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
    }, []); // Empty dependency array means this runs once on mount

    if (isLoading) {
        return <div className="pt-2 flex text-sm flex-col">Loading...</div>;
    }
    
    if (error) {
        console.error("Client rendering error:", error);
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