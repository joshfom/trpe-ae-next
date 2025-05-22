import React from 'react';
import Link from "next/link";
import InsightForm from "@/features/admin/insights/components/InsightForm";

function AdminInsightPage() {
    return (
        <div>
            <div className="flex  justify-between items-center h-16 w-full px-4 bg-white ">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">All Insights</div>
                </div>

                <div className="items-center  space-x-4">
                    <Link
                        href={'/admin/insights'}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Add Insight
                    </Link>
                </div>
            </div>

            <div>
                <InsightForm/>
            </div>

        </div>
    );
}

export default AdminInsightPage;