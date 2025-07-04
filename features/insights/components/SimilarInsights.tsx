
import React, {Suspense} from 'react';
import {Skeleton} from "@/components/ui/skeleton";
import Link from "next/link";
import {truncateText} from "@/lib/truncate-text";
import {useGetSimilarInsightsV2} from "@/features/insights/api/use-get-similar-insights-v2";
import { db } from '@/db/drizzle';
import { desc, eq, and, isNotNull } from 'drizzle-orm';
import { insightTable } from '@/db/schema-index';

interface SimilarInsightsProps {
    insightId: string
}

async function SimilarInsights({insightId}: SimilarInsightsProps) {

    const insights = await db.query.insightTable.findMany({
        where: and(
            isNotNull(insightTable.publishedAt),
            eq(insightTable.isLuxe, false)
        ),
        orderBy: [desc(insightTable.createdAt)],
        limit: 3
    });

    return (
        <div className={'py-6 max-w-7xl mx-auto pt-12 lg:pt-24 '}>
            <h3 className="text-2xl font-semibold pb-6">
                Similar Insights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Suspense fallback={
                    Array.from({length: 8}).map((_, index) => (
                        <div key={index} className="space-y-4">
                            <Skeleton className="h-40 w-full rounded-xl bg-slate-400/20 "/>
                            <div className={'flex justify-center'}>
                                <Skeleton className="h-4 w-2/3 bg-slate-400/20"/>
                            </div>
                        </div>
                    ))
                }>
                    {
                        insights?.map((insight) => (
                            <div key={insight.id} className="flex flex-col pb-3 items-center space-y-4">
                                <Link className={'w-full overflow-hidden rounded-xl'}
                                      href={`/insights/${insight.slug}`}>
                                    <span className="sr-only">View insight</span>
                                    <img
                                        src={insight.coverUrl!}
                                        alt={insight.title!}
                                        className=" h-60 w-full object-cover transition-all hover:scale-105 aspect-3/4 rounded-xl "
                                    />
                                </Link>
                                <h2 className="mt-2  hover:underline">
                                    <Link
                                        href={`/insights/${insight.slug}`}
                                        title={insight.title!}
                                    >
                                        {truncateText(insight.title!, 42)}
                                    </Link>
                                </h2>
                            </div>
                        ))
                    }
                </Suspense>

            </div>

        </div>
    );
}

export default SimilarInsights;