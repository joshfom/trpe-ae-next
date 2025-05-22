import React from 'react';
import {db} from "@/db/drizzle";
import {offplanTable} from "@/db/schema/offplan-table";
import {eq} from "drizzle-orm";
import {notFound} from "next/navigation";
import OffplanFaqs from "@/features/admin/off_plans/components/OffplanFaqs";
import AdminOffplanGallery from "@/features/admin/off_plans/components/AdminOffplanGallery";
import AdminOffplanAmenities from "@/features/admin/off_plans/components/AdminOffplanAmenities";
import AdminOffplanFloorPlans from "@/features/admin/off_plans/components/AdminOffplanFloorplans";
import AdminOffplanDetails from "@/features/admin/off_plans/components/AdminOffplanDetails";
import AdminOffplanPaymentPlan from "@/features/admin/off_plans/components/AdminOffplanPaymentPlan";

interface ShowAdminOffplanPageProps {
    params: Promise<{
        offplanId: string;
    }>
}

async function ShowAdminOffplanPage(props: ShowAdminOffplanPageProps) {
    const params = await props.params;

    const offplan = await db.query.offplanTable.findFirst({
        where: eq(offplanTable.id, params.offplanId),
        with: {
            developer: true,
            community: true,
        }
    })

    if (!offplan) {
        return notFound()
    }

    return (
        <div className={'flex flex-col gap-8 px-12'}>

            <AdminOffplanDetails offplan={ offplan }/>

            <AdminOffplanPaymentPlan offplan={ offplan }/>

            <AdminOffplanGallery offplanId={offplan.id}/>

            <OffplanFaqs offplanId={offplan.id}/>

            <AdminOffplanFloorPlans offplanId={offplan.id}/>

            <AdminOffplanAmenities offplanId={offplan.id}/>

        </div>
    );
}

export default ShowAdminOffplanPage;