"use client"

import React, {useEffect, useState, memo, useCallback, useMemo} from 'react';
import {Search, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import MobileSearch from "@/features/site/components/MobileSearch";
import ClickAwayListener from "@/lib/click-away-listener";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {useParams, usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import {getClientCommunities} from '../community/api/get-client-communities';
import Fuse from 'fuse.js';
import {buildPropertySearchUrl, extractPathSearchParams, formatCommunityNames} from './hooks/path-search-helper';
import {useGetUnitType} from "@/features/search/hooks/use-get-unit-type";
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";
import PropertyFilterSlideOver from "@/features/search/components/PropertyFilterSlideOver";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import { CommunityFilterType, toCommunityFilterType } from "@/types/community";

interface CommunityItemProps {
    community: CommunityFilterType;
    selectedCommunities: CommunityFilterType[];
    setSelectedCommunities: React.Dispatch<React.SetStateAction<CommunityFilterType[]>>;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
    index: number;
    isMobile?: boolean;
    offeringType: string;
    closeDropdown?: () => void;
}

interface SelectedCommunitiesListProps {
    selectedCommunities: CommunityFilterType[];
    setSelectedCommunities: React.Dispatch<React.SetStateAction<CommunityFilterType[]>>;
    classNames?: string;
}

interface PropertyPageSearchFilterProps {
    offeringType: string;
    propertyType?: string;
}

// Define form value types for proper type checking
interface FormValues {
    query: string;
    unitType: string;
    minPrice: string;
    maxPrice: string;
    minSize: string;
    maxSize: string;
    bed: number;
    bath: number;
    status: string;
    offerType: string;
    furnishing: string;
    sortBy: string;
    currency: string;
}

export const CommunityItem: React.FC<CommunityItemProps> = memo(({
                                                                community,
                                                                selectedCommunities,
                                                                setSelectedCommunities,
                                                                setSearchInput,
                                                                isMobile = false,
                                                                index,
                                                                offeringType,
                                                                closeDropdown
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
        isMobile && closeDropdown && closeDropdown();
    }, [selectedCommunities, community, setSelectedCommunities, setSearchInput, isMobile, closeDropdown]);

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
    },
    {
        slug: 'commercial-rent',
        label: 'Commercial'
    }
]

const SelectedCommunitiesList: React.FC<SelectedCommunitiesListProps> = memo(({
                                                                             selectedCommunities,
                                                                             setSelectedCommunities,
                                                                             classNames
                                                                         }) => {
    const handleRemoveCommunity = useCallback((communitySlug: string) => {
        setSelectedCommunities(selectedCommunities.filter((item) => item.slug !== communitySlug));
    }, [selectedCommunities, setSelectedCommunities]);

    return (
        <div
            className={`${cn('w-full rounded-full px-3 py-2 bg-white shadow-sm border mb-2 flex flex-wrap gap-4 overflow-y-auto', classNames)}`}>
            {
                selectedCommunities.map((community, index) => (
                    <button
                        type={'button'}
                        onClick={() => handleRemoveCommunity(community.slug)}
                        key={index}
                        className="flex group items-center border rounded-full hover:text-red-600 hover:border-red-600 px-4 py-1"
                    >
                        <span className="text-sm">{community.name}</span>
                        <X className="h-4 w-4 ml-2 stroke-1 group:hover-text-red-500"/>
                    </button>
                ))
            }
        </div>
    );
});

SelectedCommunitiesList.displayName = 'SelectedCommunitiesList';

function PropertyPageSearchFilter({offeringType , propertyType}: PropertyPageSearchFilterProps) {

    /**
     * State to store community data and loading state
     */
    const [communities, setCommunities] = useState<CommunityFilterType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Fetch communities on component mount
     */
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

    /**
     * Retrieves the URL parameters using the `useParams` hook.
     */
    const params = useParams();

    /**
     * Retrieves the current pathname using the `usePathname` hook.
     */
    const urlPath = usePathname();

    /**
     * Extracts search parameters from the URL path.
     */
    const searchedParams = extractPathSearchParams(urlPath);

    /**
     * Fetches the unit type based on the property type or the unit type from the search parameters.
     */
    const searchedUnitTypeQuery = useGetUnitType(propertyType || searchedParams?.unitType);

    /**
     * Extracts the unit type data from the query.
     */
    const searchedUnitType = searchedUnitTypeQuery.data?.unitType;

    /**
     * Indicates whether the unit type data is still loading.
     * @type {boolean}
     */
    const searchedUnitTypeLoading = searchedUnitTypeQuery.isLoading;

    /**
     * State variables for managing various UI states and inputs.
     */
    const [showFilters, setShowFilters] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [openMobileSearch, setOpenMobileSearch] = useState(false);
    const [selectedCommunities, setSelectedCommunities] = useState<CommunityFilterType[]>([]);
    const [searchedCommunities, setSearchedCommunities] = useState<CommunityFilterType[]>([]);
    const [searchMode, setSearchMode] = useState('for-sale');
    const [filtersCount, setFiltersCount] = useState(0);


    function parseAndFormat(input: string): string {
        return input
            .split('-') // Split the string by dashes
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(' '); // Join the words with a space
    }

    function computeHeading(
        searchedUnitType: { name: string | null } | null | undefined,
        searchMode: string,
        searchedCommunities: CommunityFilterType[]
    ): string {
        const unitTypeName = searchedUnitType?.name || 'Properties';
        const mode = searchMode === 'for-rent' ? 'For Rent' : 'For Sale';
        const location =
            searchedCommunities.length === 0
                ? 'in Dubai'
                : 'in ' + formatCommunityNames(searchedCommunities);

        return `${unitTypeName} ${parseAndFormat(offeringType || '')} ${location}`;
    }


    let heading = computeHeading(searchedUnitType, searchMode, searchedCommunities);


    /**
     * State variable for storing the filtered community results.
     * @type {CommunityFilterType[]}
     */
    const [communityResults, setCommunityResults] = useState<CommunityFilterType[]>(communities);

    /**
     * Retrieves the router instance using the `useRouter` hook.
     */
    const router = useRouter();

    const defaultUnitType = searchedParams.unitType || propertyType;

    /**
     * Initializes the form with default values and validation mode.
     */
    const form = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            query: "",         // location
            unitType: defaultUnitType || '',         // property type
            minPrice: "",    // min price
            maxPrice: "",    // max price
            minSize: "",     // min size
            maxSize: "",     // max size
            bed: 0,         // bedrooms
            bath: 0,        // bathrooms
            status: "",     // property status
            offerType: offeringType || 'for-sale', // search type (for-sale, for-rent, etc.)
            furnishing: '',
            sortBy: '',
            currency: ''
        }
    });

    /**
     * Handles form submission and navigates to the search results page.
     * @param {FormValues} data - The form data.
     */
    const onSubmit = useCallback((data: FormValues) => {
        // Create a transformed version of the data with proper types
        const transformedData = {
            ...data,
            // Convert string number fields to actual numbers when they exist
            minPrice: data.minPrice ? parseFloat(data.minPrice) : undefined,
            maxPrice: data.maxPrice ? parseFloat(data.maxPrice) : undefined,
            minSize: data.minSize ? parseFloat(data.minSize) : undefined,
            maxSize: data.maxSize ? parseFloat(data.maxSize) : undefined,
        };

        const finalUrl = buildPropertySearchUrl({
            searchType: data.offerType, // or 'sale'
            selectedCommunities: selectedCommunities,
            formData: transformedData
        });

        router.push(finalUrl);
    }, [selectedCommunities, router]);

    /**
     * Handles community search input and updates the community results.
     * @param {string} value - The search input value.
     */
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

    const handleOpenMobileSearch = useCallback(() => {
        setIsOpen(true);
    }, []);

    /**
     * Filters and sets the searched communities based on the search parameters.
     */
    const getSearchedCommunities = () => {
        let communitySlugs = searchedParams.areas || [];

        // Filter communities using community slugs if there is value
        const items = communities.filter((community) => {
            return communitySlugs.includes(community.slug);
        });

        setSearchedCommunities(items);
        setSelectedCommunities(items);
    };

    /**
     * Retrieves the label for the given offering type.
     * @param {string} offerType - The offering type slug.
     * @returns {string} - The offering type label.
     */
    const getOfferingTypeLabel = (offerType: string) => {
        const offeringType = OFFERING_TYPES.find(type => type.slug === offerType);
        return offeringType ? offeringType.label : '';
    };

    /**
     * Effect hook to handle community search when the search input changes.
     */
    useEffect(() => {
        handleCommunitySearch(searchInput);
    }, [searchInput, handleCommunitySearch]);

    /**
     * Effect hook to set the search mode based on the search type.
     */
    useEffect(() => {
        // searchtype contains rent set searchmode to for-rent
        if (offeringType.includes('rent')) {
            setSearchMode('for-rent');
        }
    }, [params, offeringType]);

    /**
     * Effect hook to get the searched communities when the loading state changes.
     */
    useEffect(() => {
        getSearchedCommunities();
    }, [isLoading]);

    /**
     * Effect hook to count the number of active filters and update the filters count state.
     */
    useEffect(() => {
        let count = 0;
        const values = form.getValues();
        for (const key in values) {
            if (key !== 'offerType' && values[key as keyof FormValues]) {
                count++;
            }
        }
        // add selected communities count
        count += selectedCommunities.length;
        setFiltersCount(count);
    }, [form, selectedCommunities]);


    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className={'mx-auto mt-6 w-full   flex flex-col items-center bg-white py-3 justify-center'}>

                    <div className="hidden lg:block w-full  ">
                        <div
                            className={' relative w-full lg:max-w-7xl items-center mx-auto '}>


                            <div className={'hidden lg:flex  rounded-full gap-6 items-center'}>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="offerType"
                                        render={({field}) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Offer type"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="for-sale">
                                                            For Sale
                                                        </SelectItem>
                                                        <SelectItem value="for-rent">
                                                            For Rent
                                                        </SelectItem>
                                                        <SelectItem value="commercial-sale">
                                                            Commercial Sale
                                                        </SelectItem>
                                                        <SelectItem value="commercial-rent">
                                                            Commercial Rent
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div>
                                    <FormField
                                        control={form.control}
                                        name="unitType"
                                        render={({field}) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Property Type"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="apartments">Apartments</SelectItem>
                                                        <SelectItem value="villas">Villas</SelectItem>
                                                        <SelectItem value="townhouses">Townhouses</SelectItem>
                                                        <SelectItem value="plots">Plots</SelectItem>
                                                        <SelectItem value="offices">Offices</SelectItem>
                                                        <SelectItem value="retail">Retail</SelectItem>
                                                        <SelectItem value="warehouses">Warehouses</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>


                                {/*COMMUNITIES INPUT */}
                                <div className="relative flex flex-1">
                                    <div className="flex grow">

                                        <Input
                                            {...form.register('query')} // Add this line
                                            onChange={(e) => {
                                                setSearchInput(e.target.value);
                                            }}
                                            onFocus={() => setShowSearchDropdown(true)}
                                            autoComplete='off'
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


                                                <div className="absolute top-10 pt-4 z-30 h-[500px]  inset-x-0 ">
                                                    {
                                                        //check if selected community list show the list
                                                        selectedCommunities.length > 0 &&
                                                        <SelectedCommunitiesList
                                                            selectedCommunities={selectedCommunities}
                                                            setSelectedCommunities={setSelectedCommunities}
                                                        />
                                                    }

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


                                    </div>


                                </div>


                                {/*FILTERS SHEET OVERLAY */}

                                <PropertyFilterSlideOver
                                    form={form}
                                    showFilters={showFilters}
                                    setShowFilters={setShowFilters}
                                    selectedCommunities={selectedCommunities}
                                    setSelectedCommunities={setSelectedCommunities}
                                    onSubmit={onSubmit}
                                    filtersCount={0}/>
                            </div>

                            {/*MOBILE SEARCH*/}

                            <div className={'lg:hidden'}>
                                <div onClick={handleOpenMobileSearch}
                                     className="flex flex-col justify-center items-center">
                                    <div className="relative w-full">
                                        <Input className={'w-full rounded-full px-8 py-3'}
                                               placeholder="Search Properties"/>
                                        <Search className={'absolute top-3 right-4 h-6 w-6 stroke-1 text-gray-700'}/>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className="lg:hidden  w-[95%]">

                        <Input
                            onFocus={() => setOpenMobileSearch(true)}
                            placeholder="Area, Property or Development"
                            className="grow rounded-3xl border w-full "/>
                    </div>

                    {/*MOBILE SEARCH*/}

                </form>
            </Form>

            <MobileSearch
                isOpen={openMobileSearch}
                selectedCommunities={selectedCommunities}
                setSelectedCommunities={setSelectedCommunities}
                setIsOpen={setOpenMobileSearch}
                form={form}
                //@ts-ignore
                onSubmit={onSubmit}
            />



        </>

    );
}

const PropertyPageSearchFilterMemo = memo(PropertyPageSearchFilter);
PropertyPageSearchFilterMemo.displayName = 'PropertyPageSearchFilter';

export default PropertyPageSearchFilterMemo;