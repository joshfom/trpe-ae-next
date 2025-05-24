'use client'
import React, {useEffect, useRef, useState} from 'react';
import {Drawer, DrawerContent} from "@/components/ui/drawer";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search, SlidersHorizontal, X} from "lucide-react";
import ClickAwayListener from "@/lib/click-away-listener";
import {useParams} from "next/navigation";
import {getClientCommunities} from '@/features/community/api/get-client-communities';
import {useGetUnitType} from '@/features/search/hooks/use-get-unit-type';
import Fuse from 'fuse.js';
import Link from 'next/link';
import {CommunityItem} from '@/features/search/PropertyPageSearchFilter';
import UnitTypeFilter from "@/features/search/components/Filters/UnitTypeFilter";
import PriceFilter from "@/features/search/PriceFilter";
import SizeFilter from "@/features/search/SizeFilter";
import FurnishingFilter from "@/features/search/components/Filters/FurnishingFilter";
import BedroomFilter from "@/features/search/components/Filters/BedroomFilter";
import { CommunityFilterType, toCommunityFilterType } from "@/types/community";

const OFFERING_TYPES = [
    {
        slug: 'for-sale',
        label: 'For Sale'
    },
    {
        slug: 'for-rent',
        label: 'For Rent'
    },
    {
        slug: 'commercial-sale',
        label: 'Commercial'
    }
]


interface MobileSearchProps {
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    propertyType?: string,
    offeringType?: string,
    setSelectedCommunities: (communities: any[]) => void,
    selectedCommunities: any[],
    form: any,
    onSubmit: void
}

function MobileSearch({
                          isOpen,
                          setIsOpen,
                          propertyType,
    form,
    onSubmit,
    selectedCommunities,
    setSelectedCommunities,
                          offeringType = 'for-sale'
                      }: MobileSearchProps) {
    const [communities, setCommunities] = useState<CommunityFilterType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch communities on component mount
    useEffect(() => {
        const fetchCommunities = async () => {
            setIsLoading(true);
            try {
                const communitiesData = await getClientCommunities();
                // Convert API data to our CommunityFilterType using the utility function
                const processedCommunities = (communitiesData || []).map(toCommunityFilterType);
                setCommunities(processedCommunities);
            } catch (error) {
                console.error('Error fetching communities:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchCommunities();
    }, []);

    const searchedUnitTypeQuery = useGetUnitType(propertyType)
    const searchedUnitType = searchedUnitTypeQuery.data?.unitType


    const [showFilters, setShowFilters] = useState(false)
    const [showSearchDropdown, setShowSearchDropdown] = useState(false)
    const [searchInput, setSearchInput] = useState("");
    const [searchType, setSearchType] = useState(offeringType)
    const [communityFirst, setCommunityFirst] = useState(true);
    const [searchedCommunities, setSearchedCommunities] = useState<CommunityFilterType[]>([]);
    const [searchMode, setSearchMode] = useState('for-sale');


    const params = useParams();

    const [communityResults, setCommunityResults] = useState<CommunityFilterType[]>(communities);


    const mainFiltersRef = useRef(null);

    const handleCommunitySearch = (value: string) => {

        if (value.length === 0) {
            setCommunityResults(communities);
            return;
        }

        const fuse = new Fuse(communities, {
            keys: ["name", "shortName"],
        });

        const results = fuse.search(value);
        const items = results.map((result) => result.item);
        setCommunityResults(items);
    };


    const getSearchedCommunities = () => {


        let communitySlugs = "";

        if (communityFirst) {
            const searchParam = Array.isArray(params.search) ? params.search.join('') : params.search;
            // communitySlugs = extractCommunitySlugFromPath(searchParam);
        }

        // Filter communities using community slugs if there is value
        const items = communities.filter(community => communitySlugs.includes(community.slug));

        setSearchedCommunities(items);
    }

    const getOfferingTypeLabel = (sType: string): string => {
        const offeringType = OFFERING_TYPES.find(type => type.slug === sType);
        return offeringType ? offeringType.label : '';
    };


    useEffect(() => {
        handleCommunitySearch(searchInput)
    }, [searchInput]);


    useEffect(() => {
        // if param search contains propertytype set community first to false
        if (params?.search) {
            // if params.search contains property type set community first to false
            if (params.search.includes('propertyType')) {
                setCommunityFirst(false);
            }
        }

        // searchtype contains rent set searchmode to for-rent
        if (searchType?.includes('rent')) {
            setSearchMode('for-rent');
        }
    }, [params, searchType]);

    useEffect(() => {
        getSearchedCommunities();
    }, [isLoading]);


    return (

        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent className={`${showFilters ? 'h-[95%]' : 'h-[55%]'}`}>
                <div className=" w-full h-full bg-white py-3">
                    <div
                        className={'relative flex flex-col gap-4 h-full w-full lg:max-w-7xl items-center mx-auto '}>


                        <div className={'flex flex-col rounded-full gap-6 items-center'}>
                            <div className={'flex space-x-4'}>
                                {
                                    OFFERING_TYPES.map((item, index) => (
                                        <button
                                            type={'button'}
                                            onClick={() => {
                                                setSearchType(item.slug)
                                                form.setValue('sType', item.slug)
                                            }}
                                            className={`py-1 px-3 lg:py-1.5 lg:px-4 text-sm border lg:text-base rounded-full ${searchType === item.slug ? 'bg-black text-white border border-black' : 'bg-white text-black'}`}
                                            key={index}
                                        >
                                            {item.label}
                                        </button>
                                    ))
                                }
                            </div>

                            <div className="relative flex w-full">
                                <div className="flex grow">

                                    <Input
                                        onChange={(e) => {
                                            setSearchInput(e.target.value);
                                        }}
                                        onFocus={() => setShowSearchDropdown(true)}
                                        autoComplete='off'
                                        autoFocus={true}
                                        value={searchInput}
                                        placeholder="Community or building"
                                        className="rounded-full py-3 pl-6 focus-visible:ring-0"
                                    />
                                    {
                                        showSearchDropdown &&
                                        <ClickAwayListener onClickAway={() => setShowSearchDropdown(false)}>

                                            {
                                                communityResults.length === 0 && searchInput.length > 2 &&
                                                <div
                                                    className="absolute top-10 pt-4  z-20 h-[500px] inset-x-0 px-4">
                                                    <div
                                                        className="w-full rounded-2xl h-full bg-white flex flex-col  py-4 overflow-y-auto">
                                                        <div
                                                            className="flex flex-col justify-center items-center gap-8 h-full">
                                                            <p className="text-gray-500">No results found</p>
                                                            <p>
                                                                View all {' '}
                                                                <Link
                                                                    href={`/properties/${form.watch('sType')}`}
                                                                    className={'underline font-semibold'}
                                                                >
                                                                    {getOfferingTypeLabel(form.watch('sType'))}
                                                                </Link>

                                                                {' '} properties
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }


                                            <div className="absolute top-10 pt-4 z-30 h-[500px]  inset-x-0 ">

                                                {
                                                    communityResults.length > 0 &&
                                                    <div
                                                        className="w-full rounded-2xl h-full bg-white flex border shadow-sm flex-col  py-4 overflow-y-auto">
                                                        {
                                                            //check if search result have record show dropdown
                                                            communityResults.map((community, index) => (
                                                                <CommunityItem
                                                                    key={index}
                                                                    community={community}
                                                                    selectedCommunities={selectedCommunities}
                                                                    //@ts-ignore
                                                                    setSelectedCommunities={setSelectedCommunities}
                                                                    setSearchInput={setSearchInput}
                                                                    index={index}
                                                                    isMobile={true}
                                                                    offeringType={form.watch('sType')}
                                                                    closeDropdown={() => setShowSearchDropdown(false)}
                                                                />
                                                            ))
                                                        }
                                                    </div>
                                                }
                                            </div>

                                        </ClickAwayListener>
                                    }


                                </div>


                            </div>



                        </div>


                        {/*FILTERS SECTION*/}

                        {
                            showFilters && (
                                <div className="flex-1 border-y divide-y w-full flex flex-col p-2 px-4 overflow-y-auto">
                                    <div className={'py-3'}>
                                       <FurnishingFilter form={form}/>
                                    </div>
                                    <div className={'py-3'}>
                                       <UnitTypeFilter form={form}/>
                                    </div>

                                    <div className="w-full py-3 gap-3 flex-wrap">
                                        <PriceFilter form={form}/>
                                    </div>

                                    <div className="w-full py-3 gap-3 flex-wrap">
                                        <SizeFilter form={form}/>
                                    </div>
                                    <div className="w-full py-3 gap-3 flex-wrap">
                                        <SizeFilter form={form}/>
                                    </div>
                                    <div className="w-full py-3 gap-3 flex-wrap">
                                        <BedroomFilter form={form}/>
                                    </div>
                                </div>
                            )
                        }


                        <div className="flex flex-col  space-x-4 items-center w-[90%]">
                            {
                                //check if selected community list show the list
                                selectedCommunities?.length > 0 &&
                                <div
                                    className="w-full px-3 py-2 bg-white flex flex-wrap gap-4">
                                    {
                                        selectedCommunities?.map((community, index) => (
                                            <button
                                                type={'button'}
                                                onClick={() => {
                                                    setSelectedCommunities(selectedCommunities.filter((item) => item.slug !== community.slug))
                                                }}
                                                key={index}
                                                className="flex group items-center border roudned-full hover:text-red-600 hover:border-red-600 px-4 py-1 rounded-full"
                                            >
                                                                        <span
                                                                            className="text-sm">{community.name}</span>
                                                <X className="h-4 w-4 ml-2 stroke-1 group:hover-text-red-500"/>
                                            </button>
                                        ))
                                    }
                                </div>
                            }
                            <div className="flex justify-between items-center pb-4 w-full">

                                <div className={'flex items-center '}>
                                    <button
                                        type={'button'}
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={'flex '}>
                                        <SlidersHorizontal className="h-5 w-5 text-black stroke-1 mr-2"/>
                                        {
                                            showFilters ? 'Hide' : 'Filters'
                                        }
                                    </button>
                                </div>

                                <div className={'w-2/3'}>
                                    <Button
                                        type={'submit'}
                                        onClick={() =>  form.handleSubmit(onSubmit)()}
                                        className={' bg-black text-white py-3 px-8 w-full '}>
                                        <Search className="h-5 w-5 text-white stroke-1 mr-2"/>
                                        Search
                                    </Button>
                                </div>


                            </div>


                        </div>

                    </div>
                </div>
            </DrawerContent>
        </Drawer>

    );
}

export default MobileSearch;