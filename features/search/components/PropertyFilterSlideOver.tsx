import React, { memo, useCallback } from 'react';
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
import { getFilterBadgeCount } from "@/features/search/utils/filter-utils";
import { CommunityFilterType } from "@/types/community";
import { safeGTMPush } from '@/lib/gtm-form-filter';

interface PropertyFilterSlideOverProps {
    form: UseFormReturn<SearchFormData>;
    // Original props
    showFilters?: boolean;
    setShowFilters?: (value: boolean) => void;
    filtersCount?: number;
    selectedCommunities?: CommunityFilterType[];
    setSelectedCommunities?: (communities: CommunityFilterType[]) => void;
    
    // New props for compatibility with server-action version
    open?: boolean;
    setOpen?: (value: boolean) => void;
    
    onSubmit: any;
}

const PropertyFilterSlideOver = memo<PropertyFilterSlideOverProps>((
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
    }
) => {
    // Handle both prop styles (original and server-action version)
    const isOpen = open !== undefined ? open : showFilters;
    const setIsOpen = setOpen || setShowFilters || (() => {});

    // Calculate individual filter badge counts
    const priceBadgeCount = getFilterBadgeCount('price', form, selectedCommunities);
    const bedroomBadgeCount = getFilterBadgeCount('bedrooms', form, selectedCommunities);
    const bathroomBadgeCount = getFilterBadgeCount('bathrooms', form, selectedCommunities);
    const sizeBadgeCount = getFilterBadgeCount('size', form, selectedCommunities);
    const propertyTypeBadgeCount = getFilterBadgeCount('propertyType', form, selectedCommunities);
    const furnishingBadgeCount = getFilterBadgeCount('furnishing', form, selectedCommunities);
    const statusBadgeCount = getFilterBadgeCount('status', form, selectedCommunities);

    // Component for filter badge
    const FilterBadge = ({ count }: { count: number }) => {
        if (count === 0) return null;
        return (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                {count}
            </span>
        );
    };

    // Memoized callback functions for form value setters
    const handleFurnishingReset = useCallback(() => {
        form.setValue('status', '');
    }, [form]);

    const handleFurnishingFurnished = useCallback(() => {
        form.setValue('furnishing', 'furnished');
    }, [form]);

    const handleFurnishingPartly = useCallback(() => {
        form.setValue('furnishing', 'partly-furnished');
    }, [form]);

    const handleStatusReset = useCallback(() => {
        form.setValue('status', '');
    }, [form]);

    const handleStatusReady = useCallback(() => {
        form.setValue('status', 'ready');
    }, [form]);

    const handleStatusOffPlan = useCallback(() => {
        form.setValue('status', 'off-plan');
    }, [form]);

    const handleBedAny = useCallback(() => {
        form.setValue('bed', 0);
    }, [form]);

    const handleBed1 = useCallback(() => {
        form.setValue('bed', 1);
    }, [form]);

    const handleBed2 = useCallback(() => {
        form.setValue('bed', 2);
    }, [form]);

    const handleBed3 = useCallback(() => {
        form.setValue('bed', 3);
    }, [form]);

    const handleBed4 = useCallback(() => {
        form.setValue('bed', 4);
    }, [form]);

    const handleBed5 = useCallback(() => {
        form.setValue('bed', 5);
    }, [form]);

    const handleBed6 = useCallback(() => {
        form.setValue('bed', 6);
    }, [form]);

    const handleBed7 = useCallback(() => {
        form.setValue('bed', 7);
    }, [form]);

    const handleClearFilters = useCallback(() => {
        form.reset();
        setSelectedCommunities([]);
    }, [form, setSelectedCommunities]);

    const handleSearchSubmit = useCallback(() => {
        console.log('PropertyFilterSlideOver form submitted');
        console.log('Selected communities:', selectedCommunities);
        
        const formData = form.getValues();
        
        // Track filter search submission using safe GTM push
        safeGTMPush({
            event: 'filter_search',
            search_location: 'filter_slide_over',
            search_type: formData.offerType || 'for-sale',
            search_query: formData.query || '',
            selected_communities: selectedCommunities.map(c => c.name),
            selected_communities_count: selectedCommunities.length,
            form_data: {
                unit_type: formData.unitType,
                min_price: formData.minPrice,
                max_price: formData.maxPrice,
                min_size: formData.minSize,
                max_size: formData.maxSize,
                bedrooms: formData.bed,
                bathrooms: formData.bath,
                furnishing: formData.furnishing
            },
            timestamp: new Date().toISOString()
        });
        
        form.handleSubmit(onSubmit)();
        setIsOpen(false);
    }, [form, onSubmit, setIsOpen, selectedCommunities]);

    const handleOpenFilter = useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);

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
                        More

                    </span>
                    {
                        filtersCount > 0 &&
                        <div className={'absolute -left-2 -top-2'}>
                            <div className="flex items-center bg-black text-white justify-center border-2 border-white w-6 h-6 rounded-full text-xs font-medium shadow-sm">
                                {filtersCount}
                            </div>
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
                            <h3 className="text-lg flex items-center">
                                Furnishing
                                <FilterBadge count={furnishingBadgeCount} />
                            </h3>

                            <div className="flex py-3 gap-2 lg:gap-4">
                                <button type={'button'}
                                        onClick={handleFurnishingReset}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('furnishing') === '' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    All Furnishing
                                </button>
                                <button type={'button'}
                                        onClick={handleFurnishingFurnished}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('furnishing') === 'furnished' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    Furnished
                                </button>

                                <button type={'button'}
                                        onClick={handleFurnishingPartly}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('furnishing') === 'partly-furnished' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    Partly Furnished
                                </button>
                            </div>
                        </div>


                        {/*COMPLETION STATUS*/}
                        <div>
                            <h3 className="text-lg flex items-center">
                                Completion
                                <FilterBadge count={statusBadgeCount} />
                            </h3>

                            <div className="flex py-3 gap-2 lg:gap-4">
                                <button type={'button'}
                                        onClick={handleStatusReset}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('status') === '' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    Any
                                </button>
                                <button type={'button'}
                                        onClick={handleStatusReady}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('status') === 'ready' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    Ready
                                </button>

                                <button type={'button'}
                                        onClick={handleStatusOffPlan}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('status') === 'off-plan' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    Off-plan
                                </button>
                            </div>
                        </div>

                        {/*PROPERTY SIZES*/}
                        <SizeFilter form={form} badgeCount={sizeBadgeCount} />

                        <div>
                            <h3 className="text-lg pb-4 flex items-center">
                                Unit Type
                                <FilterBadge count={propertyTypeBadgeCount} />
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

                        <PriceFilter form={form} badgeCount={priceBadgeCount} />


                        <div>
                            <h3 className="text-lg flex items-center">
                                Bedrooms
                                <FilterBadge count={bedroomBadgeCount} />
                            </h3>

                            <div className="flex py-3 gap-3 flex-wrap">
                                <button type={'button'}
                                        onClick={handleBedAny}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 0 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    Any
                                </button>
                                <button type={'button'}
                                        onClick={handleBed1}
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 1 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    1+
                                </button>

                                <button type={'button'}
                                        onClick={
                                            handleBed2
                                        }
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 2 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    2+
                                </button>

                                <button type={'button'}
                                        onClick={
                                            handleBed3
                                        }
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 3 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    3+
                                </button>

                                <button type={'button'}
                                        onClick={
                                            handleBed4
                                        }
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 4 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    4+
                                </button>

                                <button type={'button'}
                                        onClick={
                                            handleBed5
                                        }
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 5 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    5+
                                </button>
                                <button type={'button'}
                                        onClick={
                                            handleBed6
                                        }
                                        className={` px-4 lg:px-6 py-2 border rounded-full ${form.watch('bed') === 6 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    6+
                                </button>
                                <button type={'button'}
                                        onClick={
                                            handleBed7
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
                            onClick={handleClearFilters}
                            type={'button'}
                        >
                            Clear
                        </Button>
                        <Button
                            onClick={handleSearchSubmit}
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
})

PropertyFilterSlideOver.displayName = 'PropertyFilterSlideOver';

export default PropertyFilterSlideOver;