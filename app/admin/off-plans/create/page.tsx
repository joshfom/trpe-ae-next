import React from 'react';
import Link from "next/link";
import AddOffPlanForm from "@/features/admin/off_plans/components/AddOffPlanForm";

function AdminCreateOffplanPage() {
    return (
        <div>
            <div className="flex  justify-between items-center h-16 w-full px-4 bg-white ">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">All Offplan</div>
                </div>

                <div className="items-center  space-x-4">
                    <Link
                        href={'/admin/off-plans'}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Offplan List
                    </Link>
                </div>
            </div>

            <div>
                <AddOffPlanForm/>
            </div>

        </div>
    );
}

export default AdminCreateOffplanPage;