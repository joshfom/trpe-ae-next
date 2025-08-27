import React from "react";
import SiteFooterSSR from "./site-footer-ssr";
import SiteFooterClient from "./site-footer-client";
import { getFooterCommunities } from "@/actions/get-footer-communities-action";

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

interface SiteFooterWrapperProps {
    showAbout?: boolean;
}

export default async function SiteFooterWrapper({ showAbout = true }: SiteFooterWrapperProps) {
    // Fetch communities on the server side
    let communities: Community[] = [];
    try {
        communities = await getFooterCommunities();
    } catch (error) {
        console.error('Error fetching footer communities:', error);
        // Continue with empty array, component will handle gracefully
    }

    return (
        <>
            <SiteFooterSSR showAbout={showAbout} communities={communities} />
            <SiteFooterClient />
        </>
    );
}
