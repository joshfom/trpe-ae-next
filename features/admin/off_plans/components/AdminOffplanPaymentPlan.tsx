"use client"
import React, { memo, useCallback } from 'react';
import {Button} from "@/components/ui/button";
import {useGetOffplanPaymentPlan} from "@/features/admin/off_plans/api/use-get-offplan-payment-plan";

interface AdminOffplanPaymentPlanProps {
    offplan: any;
}

function AdminOffplanPaymentPlan({offplan}: AdminOffplanPaymentPlanProps) {

    const galleryQuery = useGetOffplanPaymentPlan(offplan.id)
    const gallery = galleryQuery.data
    const isLoaded = galleryQuery.data && !galleryQuery.isError
    const isLoading = galleryQuery.isLoading

    const [addingImage, setAddingImage] = React.useState(false)

    // Memoized callback functions
    const handleToggleAddingPayment = useCallback(() => {
        setAddingImage(!addingImage);
    }, [addingImage]);


    return (
        <div className={'flex flex-col gap-6 px-8 '}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Payment Plan</h2>
                <Button size={'sm'} variant={'outline'} onClick={handleToggleAddingPayment} >Add payment</Button>
            </div>

            <div className="p-6  bg-white">


            </div>
        </div>
    );
}

const AdminOffplanPaymentPlanComponent = memo(AdminOffplanPaymentPlan);
AdminOffplanPaymentPlanComponent.displayName = 'AdminOffplanPaymentPlan';

export default AdminOffplanPaymentPlanComponent;