import React from 'react';
import Link from "next/link";
import InsightForm from "@/features/admin/insights/components/InsightForm";

function AdminOffplansPage() {
    return (
        <div>
            <div className="flex  justify-between items-center h-16 w-full px-4 bg-white ">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">All Offplans</div>
                </div>

                <div className="items-center  space-x-4">
                    <Link
                        href={'/admin/off-plans/create'}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Add Offplan
                    </Link>
                </div>
            </div>

            <div>

            </div>

        </div>
    );
}

export default AdminOffplansPage;