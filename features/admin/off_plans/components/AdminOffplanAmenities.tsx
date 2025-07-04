"use client"
import React, { memo, useCallback } from 'react';
import {useGetOffplanFaqs} from "@/features/admin/off_plans/api/use-get-offplan-faqs";
import {Button} from "@/components/ui/button";
import AddOffplanFaqForm from "@/features/admin/off_plans/components/AddOffplanFaqForm";

interface AdminOffplanAmenitiesProps {
    offplanId: string;
}

function AdminOffplanAmenities({offplanId}: AdminOffplanAmenitiesProps) {

    const amenitiesQuery = useGetOffplanFaqs(offplanId)
    const amenities = amenitiesQuery.data
    const isLoaded = amenitiesQuery.data && !amenitiesQuery.isError
    const isLoading = amenitiesQuery.isLoading

    const [addingAmenity, setAddingAmenity] = React.useState(false)

    // Memoized callback functions
    const handleToggleAddingAmenity = useCallback(() => {
        setAddingAmenity(!addingAmenity);
    }, [addingAmenity]);


    return (
        <div className={'flex flex-col gap-8 px-8'}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Amenities</h2>
                <Button size={'sm'} variant={'outline'} onClick={handleToggleAddingAmenity} className="">Add Amenity</Button>
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

const AdminOffplanAmenitiesComponent = memo(AdminOffplanAmenities);
AdminOffplanAmenitiesComponent.displayName = 'AdminOffplanAmenities';

export default AdminOffplanAmenitiesComponent;