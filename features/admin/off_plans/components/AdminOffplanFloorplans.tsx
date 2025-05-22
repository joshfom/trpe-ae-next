"use client"
import React from 'react';
import {useGetOffplanFaqs} from "@/features/admin/off_plans/api/use-get-offplan-faqs";
import {Button} from "@/components/ui/button";
import AddOffplanFaqForm from "@/features/admin/off_plans/components/AddOffplanFaqForm";

interface AdminOffplanFloorPlansProps {
    offplanId: string;
}

function AdminOffplanFloorPlans({offplanId}: AdminOffplanFloorPlansProps) {

    const amenitiesQuery = useGetOffplanFaqs(offplanId)
    const amenities = amenitiesQuery.data
    const isLoaded = amenitiesQuery.isFetched && !amenitiesQuery.isError
    const isLoading = amenitiesQuery.isLoading

    const [addingAmenity, setAddingAmenity] = React.useState(false)


    return (
        <div className={'flex flex-col gap-8 px-8'}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Floor plans</h2>
                <Button size={'sm'} variant={'outline'} onClick={() => setAddingAmenity(!addingAmenity)} className="">Add plan</Button>
            </div>

            {/*{*/}
            {/*    addingAmenity &&*/}
            {/*    <AddOffplanAmenityForm offplanId={offplanId} offplanAdded={() => setAddingAmenity(false)}/>*/}
            {/*}*/}

            <div className="bg-white p-6 rounded-lg">

            </div>
        </div>
    );
}

export default AdminOffplanFloorPlans;