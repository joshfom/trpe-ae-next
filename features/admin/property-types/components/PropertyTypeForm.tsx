"use client"

import React from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    PropertyTypeFormSchema,
    PropertyTypeFormValues
} from "@/features/admin/property-types/form-schema/property-type-form-schema";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useUpdatePropertyType} from "@/features/admin/property-types/api/use-update-property-type";
import {TipTapEditor} from "@/components/TiptapEditor";

interface PropertyTypeFormProps {
    propertyType?: UnitType
    onSuccess?: () => void;
}

function PropertyTypeForm({propertyType, onSuccess}: PropertyTypeFormProps) {

    console.log('propertyType', propertyType)

    const form = useForm<PropertyTypeFormValues>({
        resolver: zodResolver(PropertyTypeFormSchema),
        defaultValues: {
            name: '',
            short_name: '',
            slug: '',
            rentH1: '',
            saleH1: '',
            rentMetaTitle: '',
            rentMetaDescription: '',
            saleMetaTitle: '',
            saleMetaDescription: '',
            saleContent: '',
            rentContent: ''
        },
        values: propertyType,
    });

    const updateMutation = useUpdatePropertyType(propertyType?.id)

    const onSubmit = async (values: PropertyTypeFormValues) => {
        await updateMutation.mutateAsync(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">

                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} value={field.value || ''}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slug"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input {...field} value={field.value || ''}
                                       disabled={ true}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4 border p-4 rounded">
                        <h3 className="font-medium">Rent Meta Information</h3>
                        
                        <FormField
                            control={form.control}
                            name="rentH1"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>H1 Heading</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="rentMetaTitle"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Meta Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rentMetaDescription"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Meta Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} value={field.value || ''}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4 border p-4 rounded">
                        <h3 className="font-medium">Sale Meta Information</h3>
                        
                        <FormField
                            control={form.control}
                            name="saleH1"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>H1 Heading</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="saleMetaTitle"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Meta Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="saleMetaDescription"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Meta Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} value={field.value || ''}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            name={'rentContent'}
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Content for rent pages</FormLabel>
                                    <TipTapEditor
                                        name="rentContent"
                                        control={form.control}
                                        defaultValue={propertyType?.rentContent}
                                    />
                                </FormItem>
                            )}/>
                    </div>
                    <div>
                        <FormField
                            name={'saleContent'}
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Content for sale pages</FormLabel>
                                    <TipTapEditor
                                        name="saleContent"
                                        control={form.control}
                                        defaultValue={field.value}
                                    />
                                </FormItem>
                            )}/>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <Button 
                        type="submit" 
                       loading={updateMutation.isPending}
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default PropertyTypeForm;
