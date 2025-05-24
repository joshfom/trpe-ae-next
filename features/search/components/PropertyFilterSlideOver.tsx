import React from 'react';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Search, SlidersVertical} from "lucide-react";
import SizeFilter from "@/features/search/SizeFilter";
import {FormField} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import PriceFilter from "@/features/search/PriceFilter";
import {UseFormReturn} from "react-hook-form";
import {SearchFormData} from "@/features/search/types/property-search.types";
import SelectedCommunitiesList from "@/features/search/components/communities/SelectedCommunitiesList";

interface PropertyFilterSlideOverProps {
    form: UseFormReturn<SearchFormData>;
    // Original props
    showFilters?: boolean;
    setShowFilters?: (value: boolean) => void;
    filtersCount?: number;
    selectedCommunities?: any[];
    setSelectedCommunities?: (communities: any[]) => void;
    
    // New props for compatibility with server-action version
    open?: boolean;
    setOpen?: (value: boolean) => void;
    
    onSubmit: any;
}

function PropertyFilterSlideOver(
    {
        form,
        showFilters,
        setShowFilters,
        filtersCount = 0,
        selectedCommunities = [],
        setSelectedCommunities = () => {},
        open,
        setOpen,
        onSubmit
    }: PropertyFilterSlideOverProps
) {
    // Handle both prop styles (original and server-action version)
    const isOpen = open !== undefined ? open : showFilters;
    const setIsOpen = setOpen || setShowFilters || (() => {});
    return (
        <div className="flex pl-8 lg:pl-16 space-x-6 items-center">


            <Sheet
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <SheetTrigger
                    className={'relative'}
                >
                    <span

                        className={'flex items-center'}
                    >
                         <SlidersVertical className="h-6 w-6  stroke-1 mr-2"/>
                        Moreœ

                    </span>
                    {
                        filtersCount > 0 &&
                        <div className={'absolute -right-4 -top-4'}>
                            <button
                                type={'button'}
                                onClick={() => setIsOpen(true)}
                                className="flex items-center bg-black text-white justify-center border px-3 rounded-full  py-1">
                                {
                                    filtersCount
                                }
                            </button>
                        </div>
                    }
                </SheetTrigger>
                <SheetContent className="w-[80%] sm:w-[30%] h-screen flex flex-col">
                    <SheetHeader className={'px-6 py-4 border-b'}>
                        <SheetTitle className={'font-semibold text-2xl'}>More
                            filters</SheetTitle>

                    </SheetHeader>
                    <SheetDescription
                        className={'px-6 py-4 flex-1 overflow-y-auto flex flex-col gap-6'}
                    >

                        {
                            //check if selected community list show the list
                            selectedCommunities.length > 0 &&
                            <div className="">
                                <h3 className="text-lg pb-2">
                                    Selected Communities
                                </h3>
                                <SelectedCommunitiesList
                                    classNames={'shadow-none border-0 px-0 py-0 '}
                                    selectedCommunities={selectedCommunities}
                                    //@ts-ignore
                                    setSelectedCommunities={setSelectedCommunities}
                                />
                            </div>
                        }

                        {/*FURNISHING */}
                        <div>
                            <h3 className="text-lg ">
                                Furnishing
                            </h3>

                            <div className="flex py-3 gap-2 lg:gap-4">
                                <button type={'button'}
                                        onClick={() => {
                                            form.setValue('status', '')
                                        }}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('furnishing') === '' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    All Furnishing
                                </button>
                                <button type={'button'}
                                        onClick={() => {
                                            form.setValue('furnishing', 'furnished')
                                        }}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('furnishing') === 'furnished' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    Furnished
                                </button>

                                <button type={'button'}
                                        onClick={() => {
                                            form.setValue('furnishing', 'partly-furnished')
                                        }}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('furnishing') === 'partly-furnished' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    Partly Furnished
                                </button>
                            </div>
                        </div>


                        {/*COMPLETION STATUS*/}
                        <div>
                            <h3 className="text-lg ">
                                Completion
                            </h3>

                            <div className="flex py-3 gap-2 lg:gap-4">
                                <button type={'button'}
                                        onClick={() => {
                                            form.setValue('status', '')
                                        }}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('status') === '' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    Any
                                </button>
                                <button type={'button'}
                                        onClick={() => {
                                            form.setValue('status', 'ready')
                                        }}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('status') === 'ready' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    Ready
                                </button>

                                <button type={'button'}
                                        onClick={() => {
                                            form.setValue('status', 'off-plan')
                                        }}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('status') === 'off-plan' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    Off-plan
                                </button>
                            </div>
                        </div>

                        {/*PROPERTY SIZES*/}
                        <SizeFilter form={form}/>

                        <div>
                            <h3 className="text-lg pb-4">
                                Unit Type
                            </h3>
                            <FormField
                                name={'unitType'}
                                control={form.control}
                                render={({field}) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <div className="flex flex-col">
                                                <SelectValue placeholder="Any"/>
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value="apartments">Apartments</SelectItem>
                                            <SelectItem value="villas">Villas</SelectItem>
                                            <SelectItem
                                                value="townhouses">Townhouses</SelectItem>
                                            <SelectItem value="plots">Plots</SelectItem>
                                            <SelectItem value="offices">Offices</SelectItem>
                                            <SelectItem value="retail">Retail</SelectItem>
                                            <SelectItem
                                                value="warehouses">Warehouses</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <PriceFilter form={form}/>


                        <div>
                            <h3 className="text-lg ">
                                Bedrooms
                            </h3>

                            <div className="flex py-3 gap-3 flex-wrap">
                                <button type={'button'}
                                        onClick={() => {
                                            form.setValue('bed', 0)
                                        }}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 0 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    Any
                                </button>
                                <button type={'button'}
                                        onClick={() => {
                                            form.setValue('bed', 1)
                                        }}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 1 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    1+
                                </button>

                                <button type={'button'}
                                        onClick={
                                            () => {
                                                form.setValue('bed', 2)
                                            }
                                        }
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 2 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    2+
                                </button>

                                <button type={'button'}
                                        onClick={
                                            () => {
                                                form.setValue('bed', 3)
                                            }
                                        }
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 3 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    3+
                                </button>

                                <button type={'button'}
                                        onClick={
                                            () => {
                                                form.setValue('bed', 4)
                                            }
                                        }
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 4 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    4+
                                </button>

                                <button type={'button'}
                                        onClick={
                                            () => {
                                                form.setValue('bed', 5)
                                            }
                                        }
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 5 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    5+
                                </button>
                                <button type={'button'}
                                        onClick={
                                            () => {
                                                form.setValue('bed', 6)
                                            }
                                        }
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 6 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    6+
                                </button>
                                <button type={'button'}
                                        onClick={
                                            () => {
                                                form.setValue('bed', 7)
                                            }
                                        }
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 7 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    7+
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg pb-4">
                                Sort By
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    name={'sortBy'}
                                    control={form.control}
                                    render={({field}) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <div className="flex flex-col">
                                                    <SelectValue placeholder="Any"/>
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value="relevant">Relevant</SelectItem>
                                                <SelectItem value="price_low">Price
                                                    (low)</SelectItem>
                                                <SelectItem value="price_high">Price
                                                    (high)</SelectItem>
                                                <SelectItem value="beds_least">Beds
                                                    (least)</SelectItem>
                                                <SelectItem value="beds_most">Beds
                                                    (most)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>


                    </SheetDescription>
                    <SheetDescription
                        className={'flex justify-between  py-4 pb-8 px-6 items-center'}>
                        <Button
                            variant={'destructive'}
                            onClick={() => {
                                form.reset();
                                setSelectedCommunities([]);
                            }}
                            type={'button'}
                        >
                            Clear
                        </Button>
                        <Button
                            onClick={() => {
                                form.handleSubmit(onSubmit)();
                                setIsOpen(false);
                            }}
                            className={' bg-black text-white py-3 px-8 '}>
                            <Search className="h-5 w-5 text-white stroke-1 mr-2"/>
                            Search
                        </Button>
                    </SheetDescription>
                </SheetContent>
            </Sheet>


            <Button
                type={'submit'}
                className={' bg-black text-white py-3 px-8 '}>
                <Search className="h-5 w-5 text-white stroke-1 mr-2"/>
                Search
            </Button>

        </div>
    );
}

export default PropertyFilterSlideOver;