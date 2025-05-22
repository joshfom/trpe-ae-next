import React from 'react';
import Link from "next/link";
import AddOffPlanForm from "@/features/admin/off_plans/components/AddOffPlanForm";
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {offplanTable} from "@/db/schema/offplan-table";
import {notFound} from "next/navigation";

interface EditOffPlanProps {
    params: Promise<{
        offplanId: string;
    }>
}

async function EditOffPlan(props: EditOffPlanProps) {
    const params = await props.params;

    const offplanId = params.offplanId;

    const offplan = await db.query.offplanTable.findFirst({
        where: eq(offplanTable.id, offplanId),
    }) as unknown as ProjectType

    console.log('offplan', offplan)
    if (!offplan) {
        return notFound();
    }

    return (
        <div>
            <div className="flex  justify-between items-center h-16 w-full px-4 bg-white ">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">
                        Edit { offplan.name }  by { offplan.developer?.name }
                    </div>
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
                <AddOffPlanForm
                    offplan={offplan}
                />
            </div>

        </div>
    );
}

export default EditOffPlan;