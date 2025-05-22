"use client"
import React from 'react';
import AdminCommunityCard from "@/features/admin/community/components/AdminCommunityCard";
import {Skeleton} from "@/components/ui/skeleton";
import {useGetAdminOfferingTypes} from '../api/use-get-admin-offering-types';
import AdminOfferingTypeCard from "@/features/admin/offering/components/AdminOfferingTypeCard";

function AdminOfferingTypes() {

    const offeringTypeQuery = useGetAdminOfferingTypes()
    const offeringTypes = offeringTypeQuery.data as unknown as OfferingType[]
    const isLoading = offeringTypeQuery.isLoading

    return (
        <>
            <div>
                {isLoading ? (
                    <div className={'grid grid-cols-4 gap-6'}>
                        {Array.from({length: 6}).map((_, index) => (
                            <div key={index} className={'bg-white p-4 rounded-lg'}>
                                <Skeleton className={'h-20 w-full'}/>
                                <Skeleton className={'h-4 w-1/2 mt-4'}/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={'grid grid-cols-4 gap-6 p-6'}>
                        {offeringTypes.map((offeringType) => (
                            <AdminOfferingTypeCard offeringType={offeringType} key={offeringType.id}/>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminOfferingTypes;