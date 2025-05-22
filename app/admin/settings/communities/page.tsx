"use client"
import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {useGetAdminCities} from "@/features/admin/city/api/use-get-admin-cities";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {Form, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {useGetAdminCommunities} from "@/features/admin/community/api/use-get-admin-communities";
import Select from "react-tailwindcss-select";
import {toast} from "sonner";
import {useAddCommunity} from "@/features/admin/community/api/use-add-community";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import Link from "next/link";
import {ADMIN_BASE_PATH} from "@/lib/constants";
import {CommunityFormSchema} from "@/features/admin/community/form-schema/community-form-schema";

// Define the form values type
type formValues = z.infer<typeof CommunityFormSchema>;

type CityOption = {
    label: string;
    value: string;
};

function CommunitySettingPage() {
    const communityQuery = useGetAdminCommunities();
    const [showAddCommunity, setAddCommunity] = useState(false);
    const [allCities, setAllCities] = useState<CityOption[]>([]);
    const cityQuery = useGetAdminCities();
    const mutation = useAddCommunity();

    const cities = cityQuery.data;
    const communities = communityQuery.data;

    useEffect(() => {
        // Format form data for react select options label -> name value -> id
        if (cities) {
            const formattedCities = cities.map((city) => {
                return {
                    label: city.name || '',
                    value: city.id
                }
            });
            setAllCities(formattedCities);
        }
    }, [cities]);

    const form = useForm<formValues>({
        resolver: zodResolver(CommunityFormSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            name: '',
        }
    });

    const onSubmit = async (values: formValues) => {
        mutation.mutate(values, {
            onError: () => {
                toast.error('An error occurred while updating community');
            },

            onSuccess: () => {
                toast.success('Community updated successfully');
                form.reset();
                setAddCommunity(false);
            }
        });

    };

    return (
        <div className={'px-8 w-full'}>
            <div className={'w-full flex justify-between items-center'}>
                <h1 className="text-xl">
                    Communities
                </h1>
                <div className={"flex "} >

                    <Button
                        onClick={() => setAddCommunity(true)}
                    >
                        Add Community
                    </Button>
                </div>
            </div>

            <div className={'mt-6'}>
                <Table>
                    <TableCaption>Communities.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">Name</TableHead>
                            <TableHead>View</TableHead>
                            <TableHead>Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            communities?.map((community) => (
                                <TableRow key={community.id}>
                                    <TableCell>{community.name}</TableCell>
                                    <TableCell>
                                        <Link href={`${ADMIN_BASE_PATH}/settings/communities/${community.id}`}>
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
                onOpenChange={setAddCommunity}
            >
                <DialogContent
                    className={'max-w-xl'}
                >
                    <DialogHeader>
                        <DialogTitle>
                            Add Community
                        </DialogTitle>
                    </DialogHeader>

                    <div className={'mt-6'}>
                        <Form
                            {...form}
                        >
                            <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-8'}>
                                <FormField
                                    name={'city'}
                                    render={({field}) => (
                                        <FormItem>
                                            <Select options={allCities}
                                                    primaryColor={'stone'}
                                                    placeholder={'Select City'}
                                                    {...field}
                                            />
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
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
                                        Add Community
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

export default CommunitySettingPage;