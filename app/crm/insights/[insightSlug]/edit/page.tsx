import React from 'react';
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {insightTable} from "@/db/schema/insight-table";
import {notFound} from "next/navigation";
import Link from "next/link";
import InsightForm from "@/features/admin/insights/components/InsightForm";
import type { InsightType } from '@/types/insights';


interface EditInsightPageProps {
    params: Promise<{
        insightSlug: string;
    }>
}

async function EditInsightPage(props: EditInsightPageProps) {
    const params = await props.params;

    const insight = await db.query.insightTable.findFirst({
        where: eq(insightTable.slug, params.insightSlug)
    }) as unknown as InsightType


    if (!insight) {
        return notFound()
    }


    return (
        <div className={'flex flex-col gap-6'}>
            <div className="flex justify-between lg:px-6 items-center h-16 w-full px-4 rounded-lg bg-white">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">Edit Insight</div>
                </div>
                <Link
                    href={'/crm/insights'}
                    className={'border px-6 py-2 hover:bg-slate-100 rounded-full '}
                >
                    Insights
                </Link>
            </div>

            <div className="bg-white lg:px-8 rounded-xl">
                <InsightForm insight={insight}/>
            </div>

        </div>
    );
}

export default EditInsightPage;