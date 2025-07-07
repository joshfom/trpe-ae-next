import React from 'react';
import Link from "next/link";
import AdminInsights from "@/features/admin/insights/components/AdminInsights";

function AdminInsightPage() {
    return (
        <div className={'px-6 flex flex-col space-y-8'}>
            <div className="flex bg-white rounded-2xl justify-between items-center h-16  w-full px-4  ">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">All Insights</div>
                </div>

                <div className="items-center  space-x-4">
                    <Link
                        href={'/crm/insights/create'}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Add Insight
                    </Link>
                </div>
            </div>

           <div className=" p-8 rounded-2xl bg-white">
               <AdminInsights />
           </div>

        </div>
    );
}

export default AdminInsightPage;