"use client"

import React, { useState, useCallback, useMemo, memo } from 'react';
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
import {TipTapEditor} from "@/components/TiptapEditor";
import { updatePropertyTypeAction } from "@/actions/admin/update-property-type-action";
import { toast } from "sonner";

interface PropertyTypeFormProps {
    propertyType?: UnitType
    onSuccess?: () => void;
}

const PropertyTypeForm = memo<PropertyTypeFormProps>(({propertyType, onSuccess}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Memoize form default values
    const defaultValues = useMemo(() => ({
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
    }), []);

    const form = useForm<PropertyTypeFormValues>({
        resolver: zodResolver(PropertyTypeFormSchema),
        defaultValues,
        values: propertyType,
    });

    // Memoize the submit handler
    const onSubmit = useCallback(async (values: PropertyTypeFormValues) => {
        if (!propertyType?.id) {
            toast.error("Property Type ID is required");
            return;
        }
        
        setIsSubmitting(true);
        try {
            const result = await updatePropertyTypeAction(propertyType.id, values);
            if (result.success) {
                toast.success("Property type updated successfully");
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                toast.error(result.error || "Failed to update property type");
            }
        } catch (error) {
            toast.error("An error occurred while updating property type");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }, [propertyType?.id, onSuccess]);

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
                        disabled={isSubmitting}
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    );
});

PropertyTypeForm.displayName = 'PropertyTypeForm';

export default PropertyTypeForm;
