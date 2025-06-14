"use client"
import React, {useState, useCallback, useMemo, memo} from 'react';
import {Button} from "@/components/ui/button";
import {useGetAdminCities} from "@/features/admin/city/api/use-get-admin-cities";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {Form, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from 'react-hook-form';
import {AdminCityFormSchema} from "@/lib/types/form-schema/admin-city-form-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {useAddCity} from "@/features/admin/city/api/use-add-cities";


type formValues = z.infer<typeof AdminCityFormSchema>;

const CitySettingPage = memo(() => {
    const cityQuery = useGetAdminCities();
    const [showAddCity, setShowAddCity] = useState(false);
    const mutate = useAddCity();

    const cities = cityQuery.data;

    // Memoize form default values
    const defaultValues = useMemo(() => ({
        name: '',
    }), []);

    const form = useForm({
        resolver: zodResolver(AdminCityFormSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues,
    });

    // Memoize callback functions
    const onSubmit = useCallback((values: formValues) => {
        mutate.mutate(values, {
            onSuccess: () => {
                setShowAddCity(false);
                form.reset();
            }
        });
    }, [mutate, form]);

    const handleAddCityClick = useCallback(() => {
        setShowAddCity(true);
    }, []);

    const handleDialogChange = useCallback((open: boolean) => {
        setShowAddCity(open);
    }, []);



    return (
        <div className={'px-8 w-full'}>
            <div className={'w-full flex justify-between items-center'}>
                <h1 className="text-xl">
                    Cities
                </h1>                <div>
                    <Button
                        onClick={handleAddCityClick}
                    >
                        Add City
                    </Button>
                </div>
            </div>
            <div className={'mt-6'}>

            </div>
            <Dialog
                open={showAddCity}
                onOpenChange={handleDialogChange}
            >
                <DialogContent
                    className={'max-w-xl'}
                >
                    <DialogHeader>
                        <DialogTitle>
                            Add City
                        </DialogTitle>
                    </DialogHeader>

                    <div className={'mt-6'}>
                        <Form
                            {...form}
                        >
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    name={'name'}
                                    render={({field}) => (
                                        <FormItem>
                                            <Input type="text" className="mt-1 rounded-md" {...field} placeholder={'City name'}/>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex w-full justify-end mt-6">
                                    <Button
                                        className={'rounded-md'}
                                        loading={mutate.isPending}
                                        type={'submit'}
                                    >
                                        Add City
                                    </Button>
                                </div>
                            </form>
                        </Form>

                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
});

CitySettingPage.displayName = 'CitySettingPage';

export default CitySettingPage;