"use client"

import React, {useEffect, useState, memo, useCallback, useMemo} from 'react';
import {Button} from "@/components/ui/button";
import {PlusIcon, Search, SlidersHorizontal, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import MobileSearch from "@/features/site/components/MobileSearch";
import ClickAwayListener from "@/lib/click-away-listener";
import {Form} from "@/components/ui/form";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {getClientCommunities} from '../community/api/get-client-communities';
import Fuse from 'fuse.js';
import {buildPropertySearchUrl} from './hooks/path-search-helper';
import PropertyFilterSlideOver from "@/features/search/components/PropertyFilterSlideOver";
import { CommunityFilterType } from '@/types/community';
import { pushToDataLayer } from '@/lib/gtm';
import { safeGTMPush } from '@/lib/gtm-form-filter';

interface CommunityItemProps {
    community: CommunityFilterType;
    selectedCommunities: CommunityFilterType[];
    setSelectedCommunities: React.Dispatch<React.SetStateAction<CommunityFilterType[]>>;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
    index: number;
    offeringType: string;
}

interface MainSearchProps {
    mode?: 'rental' | 'sale' | 'general' | 'off-plan';
}

const CommunityItem: React.FC<CommunityItemProps> = memo(({
                                                         community,
                                                         selectedCommunities,
                                                         setSelectedCommunities,
                                                         setSearchInput,
                                                         index,
                                                         offeringType
                                                     }) => {
    const propertyCount = useMemo(() => {
        switch (offeringType) {
            case 'for-rent':
                return community.rentCount;
            case 'for-sale':
                return community.saleCount;
            case 'general':
                return community.propertyCount;
            case 'commercial-rent':
                return community.commercialRentCount;
            case 'commercial-sale':
                return community.commercialSaleCount;
            default:
                return community.propertyCount;
        }
    }, [offeringType, community]);

    const handleCommunityClick = useCallback(() => {
        setSelectedCommunities([...selectedCommunities, community]);
        setSearchInput('');
        
        // Track community selection in GTM
        pushToDataLayer({
            event: 'search_community_selected',
            community_name: community.name,
            community_slug: community.slug,
            search_location: 'homepage',
            offering_type: offeringType,
            timestamp: new Date().toISOString()
        });
    }, [selectedCommunities, community, setSelectedCommunities, setSearchInput, offeringType]);

    const isDisabled = useMemo(() => 
        selectedCommunities.some((item) => item.slug === community.slug || propertyCount === 0),
        [selectedCommunities, community.slug, propertyCount]
    );

    return (
        <button
            type="button"
            disabled={isDisabled}
            onClick={handleCommunityClick}
            key={index}
            className="flex hover:bg-slate-50 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <div className="grow flex gap-3">
                <h3 className="">{community.name}</h3>
                <p>({propertyCount})</p>
            </div>
        </button>
    );
});

CommunityItem.displayName = 'CommunityItem';


function MainSearch({mode = 'general'}: MainSearchProps) {
    // Add logging to track main search component usage
    useEffect(() => {
        console.log('MainSearch component mounted on homepage with mode:', mode);
        console.trace('MainSearch homepage component trace');
        
        // Push to GTM data layer
        pushToDataLayer({
            event: 'search_component_loaded',
            component_type: 'main_search',
            page_location: 'homepage',
            search_mode: mode,
            timestamp: new Date().toISOString()
        });
    }, [mode]);

    const [communities, setCommunities] = useState<CommunityFilterType[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch communities on component mount
    useEffect(() => {
        const fetchCommunities = async () => {
            setIsLoading(true)
            try {
                const communitiesData = await getClientCommunities()
                // Transform the data to ensure it matches CommunityFilterType
                const typedCommunities: CommunityFilterType[] = (communitiesData || []).map(community => ({
                    id: community.slug || '',  // Use slug as id if not present
                    slug: community.slug,
                    name: community.name,
                    shortName: community.shortName || null,
                    propertyCount: community.propertyCount || 0,
                    rentCount: community.rentCount || 0,
                    saleCount: community.saleCount || 0,
                    commercialRentCount: community.commercialRentCount || 0,
                    commercialSaleCount: community.commercialSaleCount || 0
                }));
                setCommunities(typedCommunities)
            } catch (error) {
                console.error('Error fetching communities:', error)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchCommunities()
    }, [])

    const [showSearchDropdown, setShowSearchDropdown] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [searchInput, setSearchInput] = useState("");
    const [searchType, setSearchType] = useState("for-sale")
    const [openMobileSearch, setOpenMobileSearch] = useState(false)
    const [selectedCommunities, setSelectedCommunities] = useState<CommunityFilterType[]>([]);

    const [communityResults, setCommunityResults] = useState<CommunityFilterType[]>([]);


    const offeringTypes = [
        {
            slug: 'for-sale',
            label: 'For Sale'
        },
        {
            slug: 'for-rent',
            label: 'For Rent'
        },
        {
            slug: 'commercial',
            label: 'Commercial'
        }
    ]

    const priceFilter = [
        {
            value: 400000,
            label: '400,000'
        },
        {
            value: 450000,
            label: '450,000'
        },
        {
            value: 500000,
            label: '500,000'
        },
        {
            value: 600000,
            label: '600,000'
        },
        {
            value: 650000,
            label: '650,000'
        },
        {
            value: 700000,
            label: '700,000'
        },
        {
            value: 850000,
            label: '850,000'
        },
        {
            value: 900000,
            label: '900,000'
        },
        {
            value: 950000,
            label: '950,000'
        },
        {
            value: 1000000,
            label: '1,000,000'
        },
        {
            value: 1500000,
            label: '1,500,000'
        },
        {
            value: 2000000,
            label: '2,000,000'
        },
        {
            value: 2500000,
            label: '2,500,000'
        },
        {
            value: 3000000,
            label: '3,000,000'
        },
        {
            value: 400000,
            label: '4,000,000'
        },
    ]

    const sizeFilter = [
        {
            value: 1000,
            label: '1,000 Sqft'
        },
        {
            value: 2000,
            label: '2,000 Sqft'
        },
        {
            value: 3000,
            label: '3,000 Sqft'
        },
        {
            value: 4000,
            label: '4,000 Sqft'
        },
        {
            value: 5000,
            label: '5,000 Sqft'
        },
        {
            value: 6000,
            label: '6,000 Sqft'
        },
        {
            value: 7000,
            label: '7,000 Sqft'
        },
        {
            value: 8000,
            label: '8,000 Sqft'
        },
        {
            value: 9000,
            label: '9,000 Sqft'
        },
        {
            value: 10000,
            label: '10,000 Sqft'
        },
    ]

    const router = useRouter()

    const [searchResults, setSearchResults] = useState<any[]>([])


    const form = useForm({
        mode: "onChange",
        defaultValues: {
            query: "",         // location
            unitType:  '',         // property type
            minPrice: "",    // min price
            maxPrice: "",    // max price
            minSize: "",     // min size
            maxSize: "",     // max size
            bed: 0,         // bedrooms
            bath: 0,        // bathrooms
            status: "",     // property status
            offerType: searchType, // search type (for-sale, for-rent, etc.)
            furnishing: '',
            sortBy: '',
            currency: ''
        }
    });

    const onSubmit = useCallback((data: any, event?: React.FormEvent) => {
        console.log('MainSearch form submitted from homepage with data:', data);
        console.log('Search mode:', mode, 'Search type:', searchType);
        console.log('Selected communities:', selectedCommunities);
        console.trace('Homepage search submission trace');
        
        // Prevent any default form submission behavior
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            (event.nativeEvent as Event).stopImmediatePropagation?.();
        }
        
        // Push our specific search event to GTM data layer using safe method
        safeGTMPush({
            event: 'main_search',
            search_location: 'homepage',
            search_mode: mode,
            search_type: searchType,
            search_query: data.query || '',
            selected_communities: selectedCommunities.map(c => c.name),
            selected_communities_count: selectedCommunities.length,
            form_data: {
                unit_type: data.unitType,
                min_price: data.minPrice,
                max_price: data.maxPrice,
                min_size: data.minSize,
                max_size: data.maxSize,
                bedrooms: data.bed,
                bathrooms: data.bath,
                furnishing: data.furnishing
            },
            timestamp: new Date().toISOString()
        });
        
        const finalUrl = buildPropertySearchUrl({
            searchType: searchType, // or 'sale'
            selectedCommunities: selectedCommunities,
            formData: data
        });
        
        console.log('Navigating to:', finalUrl);
        router.push(finalUrl);
    }, [searchType, selectedCommunities, router, mode]);

    const handleFormValueChange = useCallback((value: any, fieldName: string): void => {
        //@ts-ignore
        form.setValue(fieldName, value);
    }, [form]);

    const handleCommunitySearch = useCallback((value: string) => {
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
    }, [communities]);

    const handleOfferingTypeClick = useCallback((slug: string) => {
        setSearchType(slug);
        form.setValue('offerType', slug);
        
        // Track offering type selection in GTM
        pushToDataLayer({
            event: 'search_filter_changed',
            filter_type: 'offering_type',
            filter_value: slug,
            search_location: 'homepage',
            search_mode: mode,
            timestamp: new Date().toISOString()
        });
    }, [form, mode]);

    const handleRemoveCommunity = useCallback((communitySlug: string) => {
        const removedCommunity = selectedCommunities.find(c => c.slug === communitySlug);
        setSelectedCommunities(prev => prev.filter((item) => item.slug !== communitySlug));
        
        // Track community removal in GTM
        if (removedCommunity) {
            pushToDataLayer({
                event: 'search_community_removed',
                community_name: removedCommunity.name,
                community_slug: removedCommunity.slug,
                search_location: 'homepage',
                search_mode: mode,
                timestamp: new Date().toISOString()
            });
        }
    }, [selectedCommunities, mode]);

    const handleShowSearchDropdown = useCallback(() => {
        setShowSearchDropdown(true);
        
        // Track search dropdown opening
        pushToDataLayer({
            event: 'search_dropdown_opened',
            search_location: 'homepage',
            search_mode: mode,
            timestamp: new Date().toISOString()
        });
    }, [mode]);

    const handleOpenMobileSearch = useCallback(() => {
        setIsOpen(true);
        
        // Track mobile search opening
        pushToDataLayer({
            event: 'mobile_search_opened',
            search_location: 'homepage',
            search_mode: mode,
            timestamp: new Date().toISOString()
        });
    }, [mode]);


    const getOfferingTypeLabel = (unitType: string) => {
        const offeringType = offeringTypes.find(type => type.slug === unitType);
        return offeringType ? offeringType.label : '';
    };


    useEffect(() => {
        handleCommunitySearch(searchInput)
    }, [searchInput, handleCommunitySearch]);

    return (
        <Form {...form}>
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    (e.nativeEvent as Event).stopImmediatePropagation?.();
                    form.handleSubmit((data) => onSubmit(data, e))(e);
                }}
                id='main-search-form'
                className={'max-w-7xl mx-auto mt-6 w-full py-4 px-6 flex flex-col items-center justify-center'}
                {...(typeof window !== 'undefined' && { 'data-gtm-disabled': 'true' })}
                suppressHydrationWarning={true}>
                {
                    mode === 'general' &&
                    <div
                        className={'w-full lg:w-[60%] mx-auto flex lg:flex-row items-center gap-4 text-white justify-center pb-5'}>

                        {
                            offeringTypes.map((item, index) => (
                                <button
                                    type={'button'}
                                    onClick={() => handleOfferingTypeClick(item.slug)}
                                    className={`py-1 px-3 lg:py-1.5 lg:px-4 text-sm lg:text-base rounded-full ${searchType === item.slug ? 'bg-black text-white border border-white' : 'bg-white text-black'}`}
                                    key={index}
                                >
                                    {item.label}
                                </button>
                            ))
                        }

                        {/*<button*/}
                        {/*    type={'button'}*/}
                        {/*    onClick={() => {*/}
                        {/*        setSearchType('off-plan')*/}
                        {/*        form.setValue('searchType', 'off-plan')*/}
                        {/*    }}*/}
                        {/*    className={`py-1.5 px-4 rounded-full ${searchType === 'off-plan' ? 'bg-black text-white border border-white' : 'bg-white text-black'}`}*/}
                        {/*>*/}
                        {/*    Offplan*/}
                        {/*</button>*/}
                    </div>
                }
                <div
                    className={'hidden lg:block relative w-full lg:w-[70%] mx-auto '}>

                    <div className={'hidden lg:flex p-3 bg-white lg:pl-8 rounded-full gap-6 items-center'}>

                        <div className="w-full grow relative">
                            <div className="flex flex-col">
                                <div className="text-gray-700 px-3 text-sm">
                                    Search
                                </div>
                                <Input
                                    {...form.register('query')} // Add this line
                                    onChange={(e) => {
                                        setSearchInput(e.target.value);
                                        
                                        // Track search input changes in GTM
                                        if (e.target.value.length > 0) {
                                            pushToDataLayer({
                                                event: 'search_input_changed',
                                                search_query_length: e.target.value.length,
                                                search_location: 'homepage',
                                                search_mode: mode,
                                                component: 'interactive_search',
                                                timestamp: new Date().toISOString()
                                            });
                                        }
                                    }}
                                    onFocus={(e) => {
                                        setShowSearchDropdown(true);
                                        
                                        // Prevent GTM form_start event
                                        e.stopPropagation();
                                        (e.nativeEvent as Event).stopImmediatePropagation?.();
                                        
                                        // Track search input focus
                                        pushToDataLayer({
                                            event: 'search_input_focused',
                                            search_location: 'homepage',
                                            search_mode: mode,
                                            component: 'interactive_search',
                                            timestamp: new Date().toISOString()
                                        });
                                    }}
                                    autoComplete='off'
                                    value={searchInput}
                                    placeholder="Area, Property or Development"
                                    className="grow border-t-0 border-l-0 py-1 -mt-1 border-r-0 rounded-none focus-visible:ring-0 focus-visible:outline-none focus:ring-0 focus:outline-none border-white bg-transparent"
                                    suppressHydrationWarning={true}
                                />
                            </div>

                        </div>

                        {
                            showSearchDropdown &&
                            <ClickAwayListener onClickAway={() => setShowSearchDropdown(false)}>

                                {
                                    communityResults.length === 0 && searchInput.length > 2 &&
                                    <div className="absolute top-16 pt-4  h-[500px] inset-x-0 px-4">
                                        <div
                                            className="w-full rounded-2xl h-full bg-white flex flex-col  py-4 overflow-y-auto">
                                            <div className="flex flex-col justify-center items-center gap-8 h-full">
                                                <p className="text-gray-500">No results found</p>
                                                <p>
                                                    View all {' '}
                                                    <Link
                                                        href={`/properties/${form.watch('offerType')}`}
                                                        className={'underline font-semibold'}
                                                    >
                                                        {getOfferingTypeLabel(form.watch('offerType'))}
                                                    </Link>

                                                    {' '} properties
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                }


                                <div className="absolute top-16 pt-4  h-[500px]  inset-x-0 px-4">
                                    {
                                        //check if selected community list show the list
                                        selectedCommunities.length > 0 &&
                                        <div
                                            className="w-full rounded-full px-3 py-2 bg-white mb-2 flex flex-wrap gap-4 overflow-y-auto">
                                            {
                                                selectedCommunities.map((community, index) => (
                                                    <button
                                                        type={'button'}
                                                        onClick={() => handleRemoveCommunity(community.slug)}
                                                        key={index}
                                                        className="flex group items-center border roudned-full hover:text-red-600 hover:border-red-600 px-4 py-1 rounded-full"
                                                    >
                                                        <span className="text-sm">{community.name}</span>
                                                        <X className="h-4 w-4 ml-2 stroke-1 group:hover-text-red-500"/>
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    }
                                    {
                                        communityResults.length > 0 &&
                                        <div
                                            className="w-full rounded-2xl h-full bg-white flex flex-col  py-4 overflow-y-auto">
                                            {
                                                //check if search result have record show dropdown
                                                communityResults.map((community, index) => (
                                                    <CommunityItem
                                                        key={index}
                                                        community={community}
                                                        selectedCommunities={selectedCommunities}
                                                        setSelectedCommunities={setSelectedCommunities}
                                                        setSearchInput={setSearchInput}
                                                        index={index}
                                                        offeringType={form.watch('offerType')}
                                                    />
                                                ))
                                            }
                                        </div>
                                    }
                                </div>

                            </ClickAwayListener>
                        }

                        <div className="flex flex-col lg:flex-row space-x-4 items-center">

                            {
                                selectedCommunities.length > 0 &&
                                <button
                                    type={'button'}
                                    onClick={handleShowSearchDropdown}
                                    className="flex items-center justify-center border px-3 rounded-full  py-1">
                                    <PlusIcon className="w-4 h-4 mr-1 stroke-1"/> {selectedCommunities.length}
                                </button>
                            }

                            {/*<button type={'button'} onClick={() => setShowFilters(!showFilters)} className={'flex '}>*/}
                            {/*    <SlidersHorizontal className="h-5 w-5 text-black stroke-1 mr-2"/>*/}
                            {/*    Filters*/}
                            {/*</button>*/}

                            <Button
                                type={'submit'}
                                className={'bg-black text-white py-3 w-40 '}>
                                <Search className="h-5 w-5 text-white stroke-1 mr-2"/>
                                Search
                            </Button>

                        </div>
                    </div>

                    {/*MOBILE SEARCH*/}

                    <div className={'lg:hidden'}>
                        <div onClick={handleOpenMobileSearch} className="flex flex-col justify-center items-center">
                            <div className="relative w-full">
                                <Input 
                                    className={'w-full rounded-full px-8 py-3'} 
                                    placeholder="Search Properties"
                                    onFocus={(e) => {
                                        e.stopPropagation();
                                        (e.nativeEvent as Event).stopImmediatePropagation?.();
                                    }}
                                    suppressHydrationWarning={true}
                                />
                                <Search className={'absolute top-3 right-4 h-6 w-6 stroke-1 text-gray-700'}/>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="lg:hidden w-[95%]">

                    <Input
                        onFocus={(e) => {
                            setOpenMobileSearch(true);
                            // Prevent GTM form tracking
                            e.stopPropagation();
                            (e.nativeEvent as Event).stopImmediatePropagation?.();
                        }}
                        placeholder="Area, Property or Development"
                        className="grow rounded-3xl border w-full "
                        suppressHydrationWarning={true}
                    />
                </div>

                {/*<PropertyFilterSlideOver*/}
                {/*    form={form}*/}
                {/*    isOpen={showFilters}*/}
                {/*    setIsOpen={setShowFilters}*/}
                {/*    selectedCommunities={selectedCommunities}*/}
                {/*    setSelectedCommunities={setSelectedCommunities}*/}
                {/*    onSubmit={onSubmit}*/}
                {/*/>*/}

                {/*MOBILE SEARCH*/}
                <MobileSearch
                    isOpen={openMobileSearch}
                    form={form}
                    selectedCommunities={selectedCommunities}
                    setSelectedCommunities={setSelectedCommunities}
                    setIsOpen={setOpenMobileSearch}
                    onSubmit={onSubmit}
                />
            </form>
        </Form>
    );
}

const MainSearchMemo = memo(MainSearch);
MainSearchMemo.displayName = 'MainSearch';

export default MainSearchMemo;