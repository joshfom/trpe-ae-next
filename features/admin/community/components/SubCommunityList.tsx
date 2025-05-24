"use client"
import React from 'react';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {useForm} from "react-hook-form";
import {useGetAdminSubCommunities, SubCommunity} from '../api/use-get-admin-sub-community';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {ADMIN_BASE_PATH} from '@/lib/constants';
import Link from 'next/link';
import {useAttachSubCommunity} from '../api/use-attach-sub-community';

interface SubCommunityListProps {
    communityId: string;
}

function SubCommunityList({communityId}: SubCommunityListProps) {

    const subCommunityQuery = useGetAdminSubCommunities();
    const subCommunities = subCommunityQuery.data;
    const attachMutation = useAttachSubCommunity(communityId);

    const form = useForm({
        defaultValues: {
            name: '',
            communityId: communityId
        }
    })

    // console.log('subCommunities', subCommunities)

    const attachSubCommunity = (id : string) => {
        attachMutation.mutate({subCommunityId: id},
            {
                onError: () => {
                    console.log('error')
                },
                onSuccess: () => {
                    console.log('success')
                }
            });
    }



    return (
        <Sheet>
            <SheetTrigger className={'py-1.5 border px-4 rounded-lg'}> Add Sub Community</SheetTrigger>
            <SheetContent className={'max-w-6xl flex flex-col'}>
                <SheetHeader>
                    <SheetTitle>
                        Add Community
                    </SheetTitle>
                </SheetHeader>

                <div className={'mt-6 flex-1 overflow-y-auto'}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            
                            <TableHead className="">Name</TableHead>
                            <TableHead>View</TableHead>
                            <TableHead>Add This</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            subCommunities?.map((subCommunity: SubCommunity) => (
                                <TableRow key={subCommunity.id}>
                                    <TableCell>{subCommunity.name}</TableCell>
                                    <TableCell>
                                        <Link href={`${ADMIN_BASE_PATH}/settings/communities/${communityId}`}>
                                            View
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => attachSubCommunity(subCommunity.id)}>
                                            Attach
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>

            </div>
            </SheetContent>
        </Sheet>

    );
}

export default SubCommunityList;