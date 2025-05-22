import React from 'react';
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {insightTable} from "@/db/schema/insight-table";
import {notFound} from "next/navigation";
import Link from "next/link";
import InsightForm from "@/features/admin/insights/components/InsightForm";


interface EditInsightPageProps {
    params: Promise<{
        insightSlug: string;
    }>
}
async function EditInsightPage(props: EditInsightPageProps) {
    const params = await props.params;

    const insight = db.query.insightTable.findFirst({
        where: eq(insightTable.slug, params.insightSlug)
    }) as unknown as InsightType


    if (!insight) {
        return notFound()
    }


    return (
        <div className={'flex flex-col gap-6'}>
            <div className="flex justify-between items-center h-16 w-full px-4 bg-white">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">Edit Insight</div>
                </div>
                <Link href={'/crm/insights'}>
                    Insights
                </Link>
            </div>

            <InsightForm insight={insight} />

        </div>
    );
}

export default EditInsightPage;