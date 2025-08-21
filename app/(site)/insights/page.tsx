import React from 'react';
import InsightList from "@/features/insights/components/InsightList";
import type {Metadata} from "next";
import {notFound} from "next/navigation";

export const metadata: Metadata = {
    title: "Expert Insights and Dubai Property Market Trend - TRPE AE",
    description: "Discover expert insights and market trends in Dubai property. Stay informed with our latest articles and guides at TRPE.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/insights`,
    },
};

export default async function InsightPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Await the searchParams promise
    const resolvedSearchParams = await searchParams;
    
    // Get page number from query params, defaulting to 1 if not present
    const pageParam = resolvedSearchParams.page;
    let currentPage = pageParam && typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;
    
    // Validate that the page parameter is a valid number
    if (isNaN(currentPage) || currentPage < 1) {
        return notFound();
    }

    const insightJsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "Pros and Cons of Living in Downtown Dubai",
        "description": "Explore the advantages and disadvantages of living in the vibrant Downtown Dubai district.",
        "author": {
            "@type": "Person",
            "name": "TRPE Content Team"
        },
        "datePublished": "2024-04-15",
        "mainEntityOfPage": "https://trpe.ae/insights/pros-and-cons-of-living-in-the-downtown-dubai-community"
    }

    return (
        <div>
            <script type="application/ld+json">
                {JSON.stringify(insightJsonLd)}
            </script>
            <div className="py-12 bg-white max-w-7xl mx-auto px-4 sm:px-6 min-h-[500px]">
                <div className={'py-6 '}>
                    <h1 className={'text-3xl font-semibold'}>Insights</h1>
                </div>

                <InsightList currentPage={currentPage} />
            </div>
        </div>
    );
}