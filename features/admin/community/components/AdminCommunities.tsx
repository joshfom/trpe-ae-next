"use client"
import React from 'react';
import AdminCommunityCard from "@/features/admin/community/components/AdminCommunityCard";
import {Skeleton} from "@/components/ui/skeleton";
import {useGetAdminCommunities} from '../api/use-get-admin-communities';

function AdminCommunities() {

    const communitiesQuery = useGetAdminCommunities()
    const communities = communitiesQuery.data as unknown as CommunityType[]
    const isLoading = communitiesQuery.isLoading

    return (
        <>
            <div>
                {isLoading ? (
                    <div className={'grid grid-cols-4 gap-6'}>
                        {Array.from({length: 12}).map((_, index) => (
                            <div key={index} className={'bg-white p-4 rounded-lg'}>
                                <Skeleton className={'h-60 w-full'}/>
                                <Skeleton className={'h-4 w-1/2 mt-4'}/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={'grid grid-cols-4 gap-6 p-6'}>
                        {communities.map((community) => (
                            <AdminCommunityCard community={community} key={community.id}/>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminCommunities;