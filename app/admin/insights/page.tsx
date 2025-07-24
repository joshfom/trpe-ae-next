import React from 'react';
import Link from "next/link";
import InsightsList from "@/features/admin/insights/components/InsightsList";

function AdminInsightPage() {
    return (
        <div className={'px-6 flex flex-col space-y-8'}>
            <div className="flex bg-white rounded-2xl justify-between items-center h-16 w-full px-4">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">All Insights</div>
                </div>

                <div className="items-center space-x-4">
                    <Link
                        href={'/admin/insights/create'}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                        Add Insight
                    </Link>
                </div>
            </div>

            <div className="p-8 rounded-2xl bg-white">
                <InsightsList />
            </div>
        </div>
    );
}

export default AdminInsightPage;