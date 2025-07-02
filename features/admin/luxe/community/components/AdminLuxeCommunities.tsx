"use client"
import React from 'react';
import {Skeleton} from "@/components/ui/skeleton";
import {useGetLuxeCommunities} from '../api/use-get-luxe-communities';
import AdminLuxeCommunityCard from './AdminLuxeCommunityCard';

function AdminLuxeCommunities() {

    const communitiesQuery = useGetLuxeCommunities()
    const communitiesData = communitiesQuery.data
    const communities = communitiesData?.data || [] // Extract the array from the nested data structure
    const isLoading = communitiesQuery.isLoading
    const isError = communitiesQuery.isError

    // Debug logging
    console.log('AdminLuxeCommunities Debug:', {
        communitiesData,
        communities,
        isArray: Array.isArray(communities),
        type: typeof communities,
        isError,
        error: communitiesQuery.error
    })

    return (
        <>
            <div>
                {isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-600">Error loading communities: {communitiesQuery.error?.message}</p>
                    </div>
                )}
                
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
                        {Array.isArray(communities) && communities.length > 0 ? (
                            communities.map((community) => (
                                <AdminLuxeCommunityCard community={community} key={community.id}/>
                            ))
                        ) : (
                            <div className="col-span-4 text-center py-8">
                                <p className="text-gray-500">
                                    {Array.isArray(communities) ? 'No communities found' : 'Invalid data format'}
                                </p>
                                {!Array.isArray(communities) && (
                                    <p className="text-sm text-red-500 mt-2">
                                        Expected array, got: {typeof communities}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminLuxeCommunities;
