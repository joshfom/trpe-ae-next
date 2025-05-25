"use client"
import React, { memo, useCallback } from 'react';
import {useGetOffplanFaqs} from "@/features/admin/off_plans/api/use-get-offplan-faqs";
import {Button} from "@/components/ui/button";
import AddOffplanFaqForm from "@/features/admin/off_plans/components/AddOffplanFaqForm";

interface AdminOffplanFloorPlansProps {
    offplanId: string;
}

function AdminOffplanFloorPlans({offplanId}: AdminOffplanFloorPlansProps) {

    const amenitiesQuery = useGetOffplanFaqs(offplanId)
    const amenities = amenitiesQuery.data
    const isLoaded = amenitiesQuery.data && !amenitiesQuery.isError
    const isLoading = amenitiesQuery.isLoading

    const [addingAmenity, setAddingAmenity] = React.useState(false)

    // Memoized callback functions
    const handleToggleAddingPlan = useCallback(() => {
        setAddingAmenity(!addingAmenity);
    }, [addingAmenity]);


    return (
        <div className={'flex flex-col gap-8 px-8'}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Floor plans</h2>
                <Button size={'sm'} variant={'outline'} onClick={handleToggleAddingPlan} className="">Add plan</Button>
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

const AdminOffplanFloorPlansComponent = memo(AdminOffplanFloorPlans);
AdminOffplanFloorPlansComponent.displayName = 'AdminOffplanFloorPlans';

export default AdminOffplanFloorPlansComponent;