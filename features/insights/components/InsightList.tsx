import React, { memo } from 'react';
import Link from "next/link";
import {truncateText} from "@/lib/truncate-text";
import {db} from "@/db/drizzle";
import {desc, isNotNull, sql, and, eq} from "drizzle-orm";
import {insightTable} from "@/db/schema/insight-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";

interface InsightListProps {
    currentPage?: number;
}

// Cached function to get insights count
const getInsightsCount = unstable_cache(
    async () => {
        const totalCountResult = await db.select({ count: sql<number>`count(*)` })
            .from(insightTable)
            .where(and(
                isNotNull(insightTable.publishedAt),
                eq(insightTable.isLuxe, false)
            ));
        
        return totalCountResult[0].count;
    },
    ['insights-count'],
    {
        revalidate: 1800, // Cache for 30 minutes
        tags: ['insights', 'insights-list']
    }
);

// Cached function to get insights for a specific page
const getInsightsPage = unstable_cache(
    async (currentPage: number, pageSize: number) => {
        const offset = (currentPage - 1) * pageSize;
        
        return await db.query.insightTable.findMany({
            where: and(
                isNotNull(insightTable.publishedAt),
                eq(insightTable.isLuxe, false)
            ),
            orderBy: [desc(insightTable.publishedAt)],
            limit: pageSize,
            offset: offset
        });
    },
    ['insights-page'],
    {
        revalidate: 1800, // Cache for 30 minutes  
        tags: ['insights', 'insights-list']
    }
);

async function InsightList({ currentPage = 1 }: InsightListProps) {
    const pageSize = 9;
    
    // Get total count using cached function
    const totalCount = await getInsightsCount();
    const totalPages = Math.ceil(totalCount / pageSize);
    
    // Return 404 if the requested page is invalid (less than 1 or exceeds total pages)
    // We'll allow page 1 even if there are no results (totalPages is 0)
    if ((currentPage > 1 && currentPage > totalPages) || currentPage < 1) {
        notFound();
    }
    
    // Fetch insights for the current page using cached function
    const insights = await getInsightsPage(currentPage, pageSize);

    // Server-side pagination rendering function
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        
        const pages = [];
        pages.push(1);
        
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        
        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages - 1);
        } else if (currentPage >= totalPages - 3) {
            startPage = Math.max(2, totalPages - 4);
        }
        
        if (startPage > 2) {
            pages.push('ellipsis-start');
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        if (endPage < totalPages - 1) {
            pages.push('ellipsis-end');
        }
        
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        return (
            <nav className="flex justify-center items-center mt-8">
                <ul className="flex items-center space-x-2">
                    <li>
                        <Link
                            href={currentPage > 1 ? `/insights?page=${currentPage - 1}` : '#'}
                            className={`px-3 py-2 rounded-md hover:bg-muted inline-flex items-center ${currentPage <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="h-6 w-6" />
                            <span className="sr-only">Previous page</span>
                        </Link>
                    </li>
                    
                    {pages.map((page, index) => {
                        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                            return (
                                <li key={`ellipsis-${index}`} className="px-3 py-2">
                                    &#8230;
                                </li>
                            );
                        }
                        
                        const isActive = page === currentPage;
                        
                        return (
                            <li key={`page-${page}`}>
                                <Link
                                    href={`/insights?page=${page}`}
                                    className={`px-3 py-2 rounded-md ${
                                        isActive 
                                            ? "bg-black text-white" 
                                            : "hover:bg-muted"
                                    }`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {page}
                                </Link>
                            </li>
                        );
                    })}
                    
                    <li>
                        <Link
                            href={currentPage < totalPages ? `/insights?page=${currentPage + 1}` : '#'}
                            className={`px-3 py-2 rounded-md hover:bg-muted inline-flex items-center ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                            aria-label="Next page"
                        >
                            <ChevronRight className="h-6 w-6" />
                            <span className="sr-only">Next page</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    };

    return (
        <>
            <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {insights.map((insight) => (
                    <article key={insight.id} className="flex flex-col pb-3 items-center space-y-4">
                        <Link className={'w-full overflow-hidden rounded-xl'} href={`/insights/${insight.slug}`}>
                            <span className="sr-only">View insight</span>
                            <img
                                src={insight.coverUrl!}
                                alt={insight.title!}
                                className="h-60 w-full object-cover transition-all hover:scale-105 aspect-3/4 rounded-xl"
                                loading="lazy"
                            />
                        </Link>
                        <h2 className="mt-2 hover:underline">
                            <Link href={`/insights/${insight.slug}`}
                                title={insight.title!}
                            >
                                {truncateText(insight.title!, 42)}
                            </Link>
                        </h2>
                    </article>
                ))}
            </div>
            {renderPagination()}
        </>
    );
}

export default memo(InsightList);