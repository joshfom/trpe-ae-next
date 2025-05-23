"use client"
import React, { useState, use, useEffect } from 'react';
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {Form, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {toast} from "sonner";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import Link from "next/link";
import {ADMIN_BASE_PATH} from "@/lib/constants";
import SubCommunityList from "@/features/admin/community/components/SubCommunityList";
import {addSubCommunityFormSchema} from "@/lib/types/form-schema/add-sub-community-form-schema";
import { CommunityFormSchema } from '@/features/admin/community/form-schema/community-form-schema';
import { getAdminSubCommunitiesForCommunity } from "@/actions/admin/get-admin-sub-communities-action";
import { getAdminCommunity } from "@/actions/admin/get-admin-community-action";
import { addSubCommunityAction } from "@/actions/admin/add-sub-community-action";

// Define the form values type
type formValues = z.infer<typeof CommunityFormSchema>;

type CommunityOption = {
    label: string;
    value: string;
};

interface SubCommunitySettingPageProps {
    params: Promise<{
        communityId: string;
    }>
}

function SubCommunitySettingPage(props: SubCommunitySettingPageProps) {
    const params = use(props.params);
    const communityId = params.communityId;
    const [isLoading, setIsLoading] = useState(true);
    const [showAddCommunity, setAddSubCommunity] = useState(false);
    const [community, setCommunity] = useState<any>(null);
    const [subCommunities, setSubCommunities] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch data using server actions
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [communityResult, subCommunitiesResult] = await Promise.all([
                getAdminCommunity(communityId),
                getAdminSubCommunitiesForCommunity(communityId)
            ]);

            if (communityResult.success) {
                setCommunity(communityResult.data);
            } else {
                toast.error(communityResult.error || 'Failed to fetch community');
            }

            if (subCommunitiesResult.success) {
                setSubCommunities(subCommunitiesResult.data);
            } else {
                toast.error(subCommunitiesResult.error || 'Failed to fetch sub-communities');
            }
        } catch (error) {
            toast.error('An error occurred while fetching data');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, [communityId]);

    const form = useForm<formValues>({
        resolver: zodResolver(addSubCommunityFormSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            name: '',
        }
    });

    const onSubmit = async (values: formValues) => {
        setIsSubmitting(true);
        try {
            const result = await addSubCommunityAction(communityId, values);
            
            if (result.success) {
                toast.success('Sub-community added successfully');
                form.reset();
                setAddSubCommunity(false);
                
                // Refresh sub-communities list
                fetchData();
            } else {
                toast.error(result.error || 'Failed to add sub-community');
            }
        } catch (error) {
            toast.error('An error occurred while adding sub-community');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={'px-8 w-full'}>
            <div className={'w-full flex justify-between items-center'}>
                <h1 className="text-xl">
                    {
                        community?.name
                    } - Sub communities
                </h1>
                <div className={'flex items-center space-x-4'}>
                    <SubCommunityList communityId={communityId} />
                    <Button
                        onClick={() => setAddSubCommunity(true)}
                    >
                        Add New
                    </Button>
                </div>
            </div>

            <div className={'mt-6'}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">Name</TableHead>
                            <TableHead>View</TableHead>
                            <TableHead>Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            subCommunities?.map((subCommunity) => (
                                <TableRow key={subCommunity.id}>
                                    <TableCell>{subCommunity.name}</TableCell>
                                    <TableCell>
                                        <Link href={`${ADMIN_BASE_PATH}/settings/communities/${communityId}`}>
                                            View
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Button>
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>

            </div>
            <Dialog
                open={showAddCommunity}
                onOpenChange={setAddSubCommunity}
            >
                <DialogContent
                    className={'max-w-xl'}
                >
                    <DialogHeader>
                        <DialogTitle>
                            Add Sub Community for { community?.name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className={'mt-6'}>
                        <Form
                            {...form}
                        >
                            <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-8'}>

                                <FormField
                                    name={'name'}
                                    render={({field}) => (
                                        <FormItem>
                                            <Input type="text" className="mt-1 rounded-md" {...field}
                                                   placeholder={'Community name'}/>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex w-full justify-end mt-6">
                                    <Button
                                        className={'rounded-md'}
                                        loading={mutation.isPending}
                                        type={'submit'}
                                    >
                                        Add Sub Community
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

export default SubCommunitySettingPage;