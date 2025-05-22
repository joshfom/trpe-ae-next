"use client"
import React, {useCallback} from 'react';
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {useGetAdminPropertyTypes} from "@/features/admin/property-types/api/use-get-admin-property-types";
import {useRouter} from "next/navigation";

function AdminPropertyTypes() {
    const router = useRouter();
    
    const propertyTypeQuery = useGetAdminPropertyTypes()
    const propertyTypes = propertyTypeQuery?.data
    const isLoading = propertyTypeQuery.isLoading

    const handleEditClick = useCallback((propertyType: UnitType) => {
        router.push(`/admin/property-types/${propertyType.id}`);
    }, [router]);

    if (isLoading) return (
        <div className="flex justify-center items-center p-8">
            {
                Array.from({length: 6}).map((_, index) => (
                    <div key={index}>
                        <Skeleton className={'h-12 w-32 rounded-lg'}/>
                    </div>
                ))
            }
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-end mb-6">
                <Button 
                    onClick={() => router.push('/admin/property-types/create')}
                >
                    Create Property Type
                </Button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Short Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Slug
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {propertyTypes?.map((propertyType: any) => (
                        <tr key={propertyType.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{propertyType.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{propertyType.short_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{propertyType.slug}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Button
                                    variant="outline"
                                    onClick={() => handleEditClick(propertyType)}
                                >
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPropertyTypes;
