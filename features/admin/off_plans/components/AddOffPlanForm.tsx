"use client"
import React, {useEffect, useState, memo, useCallback, useMemo} from 'react';
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {OffplanFormSchema} from "@/lib/types/form-schema/offplan-form-schema";
import {zodResolver} from '@hookform/resolvers/zod';
import {useAddOffplan} from "@/features/admin/off_plans/api/use-add-offplan";
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from "@/lib/utils";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {useGetAdminDeveloper} from "@/features/admin/developers/api/use-get-admin-developer";
import {useRouter} from "next/navigation";
import {useGetAdminCommunities} from "@/features/admin/community/api/use-get-admin-communities";
import {TipTapEditor} from "@/components/TiptapEditor";
import {useUpdateOffplan} from "@/features/admin/off_plans/api/use-update-offplan";


type formValues = z.infer<typeof OffplanFormSchema>

interface AddOffPlanFormProps {
    offplan?: ProjectType
}


const AddOffPlanForm = memo<AddOffPlanFormProps>(({offplan}) => {
    const [showDeveloper, setShowDeveloper] = useState(false)
    const [showCommunity, setShowCommunity] = useState(false)
    const communityQuery = useGetAdminCommunities()
    const developerQuery = useGetAdminDeveloper()
    const [isEditing, setIsEditing] = useState(false)

    const router = useRouter()

    const communities = communityQuery.data as unknown as CommunityType[]
    const developers = developerQuery.data  as unknown as DeveloperType[]

    const mutation = useAddOffplan()
    const updateOffplanMutation = useUpdateOffplan(offplan?.id)

    // Memoize form default values
    const defaultValues = useMemo(() => ({
        name: offplan?.name || '',
        about: offplan?.about || '',
        floors: offplan?.floors || null,
        fromPrice: offplan?.fromPrice || null,
        toPrice: offplan?.toPrice || null,
        developerId: offplan?.developerId || '',
        paymentTitle: offplan?.paymentTitle || '',
        communityId: offplan?.communityId || '',
        longitude: offplan?.longitude || '',
        latitude: offplan?.latitude || '',
        fromSize: offplan?.fromSize || null,
        toSize: offplan?.toSize || null,
        serviceCharge: offplan?.serviceCharge || null,
        permitNumber: offplan?.permitNumber || '',
    }), [offplan]);

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(OffplanFormSchema),
        defaultValues,
    });

    // Memoize callback functions
    const onSubmit = useCallback((values: formValues) => {
        if(isEditing){
            updateOffplanMutation.mutate(values)
        }else{
            mutation.mutate(values)
        }
    }, [isEditing, updateOffplanMutation, mutation]);

    const handleDeveloperToggle = useCallback(() => {
        setShowDeveloper(prev => !prev);
    }, []);

    const handleCommunityToggle = useCallback(() => {
        setShowCommunity(prev => !prev);
    }, []);


    useEffect(() => {
        if(offplan){
            setIsEditing(true)
        }
    }, [offplan]);


    return (
        <Form {...form}>

            <form onSubmit={
                form.handleSubmit(onSubmit)
            } className={'p-6 lg:max-w-5xl mx-auto lg:pt-24 space-y-6'}>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                        name={'name'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    {...field}
                                    placeholder={'Project Name'}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name={'permitNumber'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Permit Number</FormLabel>
                                <Input
                                    {...field}
                                    placeholder={'Permit number'}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                        name={'developerId'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem className={'flex flex-col'}>
                                <FormLabel>Developer</FormLabel>
                                <Popover
                                    open={showDeveloper}
                                    onOpenChange={setShowDeveloper}
                                >
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? developers?.find(
                                                        (developer) => developer.id === field.value
                                                    )?.name
                                                    : "Select developer"}
                                                <ChevronsUpDown className="opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search developers..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>No developer found.</CommandEmpty>
                                                <CommandGroup>
                                                    {developers?.map((developer) => (
                                                        <CommandItem
                                                            value={developer.id}
                                                            key={developer.id}
                                                            onSelect={() => {
                                                                form.setValue("developerId", developer.id)
                                                                setShowDeveloper(false)
                                                            }}
                                                        >
                                                            {developer.name}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    developer.id === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name={'communityId'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem className={'flex flex-col'}>
                                <FormLabel>Community</FormLabel>
                                <Popover
                                    open={showCommunity}
                                    onOpenChange={setShowCommunity}
                                >
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? communities?.find(
                                                        (community) => community.id === field.value
                                                    )?.name
                                                    : "Select community"}
                                                <ChevronsUpDown className="opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search communities..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>No community found.</CommandEmpty>
                                                <CommandGroup>
                                                    {communities?.map((community) => (
                                                        <CommandItem
                                                            value={community.id}
                                                            key={community.id}
                                                            onSelect={() => {
                                                                form.setValue("communityId", community.id)
                                                                console.log(community)
                                                                setShowCommunity(false)
                                                            }}
                                                        >
                                                            {community.name}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    community.id === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                        name={'fromPrice'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Starting Price</FormLabel>
                                <Input
                                    {...field}
                                    type={'number'}
                                    value={field.value ? Number(field.value) : ''}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    placeholder={'From Price'}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name={'toPrice'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>To Price</FormLabel>
                                <Input
                                    {...field}
                                    type={'number'}
                                    placeholder={'Maximum price'}
                                    value={field.value ? Number(field.value) : ''}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                        name={'serviceCharge'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Service Charge</FormLabel>
                                <Input
                                    {...field}
                                    type={'number'}
                                    value={field.value ? Number(field.value) : ''}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    placeholder={'Service charge fee'}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name={'paymentTitle'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Payment Title</FormLabel>
                                <Input
                                    {...field}
                                    placeholder={'Post handover payment plan'}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />


                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                        name={'fromSize'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Starting size</FormLabel>
                                <Input
                                    {...field}
                                    type={'number'}
                                    placeholder={'From size'}
                                    value={field.value ? Number(field.value) : ''}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name={'toSize'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>To Size</FormLabel>
                                <Input
                                    {...field}
                                    value={field.value ? Number(field.value) : ''}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    type={'number'}
                                    placeholder={'Maximum size'}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                        name={'longitude'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Longitude</FormLabel>
                                <Input
                                    {...field}
                                    placeholder={'Longitude'} className={'input'}
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name={'latitude'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>latitude</FormLabel>
                                <Input
                                    {...field}
                                    placeholder={'Latitude'}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        name={'about'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description </FormLabel>
                                <TipTapEditor
                                    name="about"
                                    control={form.control}
                                />
                                <FormMessage/>
                            </FormItem>
                        )}/>
                </div>


                <div className="flex justify-end pt-8 items-center space-x-4">
                    <Button
                        type={'submit'}
                        loading={mutation.isPending}
                        className={'btn btn-primary w-40'}>
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
});

AddOffPlanForm.displayName = 'AddOffPlanForm';

export default AddOffPlanForm;