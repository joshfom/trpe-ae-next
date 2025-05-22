"use client"
import React from 'react';
import {useGetAdminDeveloper} from "@/features/admin/developers/api/use-get-admin-developer";
import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";
import Image from "next/image";

function AllAdminDevelopers() {

    const developerQuery = useGetAdminDeveloper()
    const developers = developerQuery.data as unknown as DeveloperType[]
    const isLoading = developerQuery.isLoading

    return (
        <div className={'py-12 px-6'}>


            <div className="mt-12">
                {isLoading ? (
                    <div className={'grid grid-cols-1 gap-6 lg:grid-cols-4'}>
                        {
                            Array.from({length: 8}).map((_, index) => (
                                <div key={index} className="flex justify-between flex-col items-center">
                                    <Skeleton className={'h-52 bg-stone-200 w-full'}  />
                                    <div className="p-3 mt-2 flex  w-full justify-between ">
                                        <Skeleton className="w-40 h-3 bg-stone-200 rounded-lg"/>
                                        <Skeleton className=" w-16 h-4 bg-stone-200 rounded-lg"/>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                ) : (
                    <div className={'grid grid-cols-1 gap-6 lg:grid-cols-4'}>
                        {developers?.map((developer) => (
                            <div key={developer.id} className="flex justify-between flex-col items-center">
                                <div className="h-16 w-full flex items-center justify-center relative">
                                    <Image 
                                        src={developer.logoUrl} 
                                        alt={developer.name || "Developer logo"} 
                                        width={64}
                                        height={64}
                                        className="object-contain h-16"
                                    />
                                </div>
                                <div className="p-3 flex w-full justify-between ">
                                    <h3 className="font-semibold">
                                        {developer.name}
                                    </h3>
                                    <div>
                                        <Link href={`/admin/developers/${developer.slug}/edit`} className="text-sm py-2 px-4 rounded-2xl bg-black text-white">
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllAdminDevelopers;