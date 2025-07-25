"use client"

import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getClientCommunities } from '../community/api/get-client-communities';
import Fuse from 'fuse.js';
import { buildPropertySearchUrl, extractPathSearchParams, formatCommunityNames } from './hooks/path-search-helper';
import { useGetUnitType } from "@/features/search/hooks/use-get-unit-type";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import { CommunityFilterType, toCommunityFilterType } from "@/types/community";
import ClickAwayListener from "@/lib/click-away-listener";
import dynamic from 'next/dynamic';
import { trackSearchFormSubmit } from "@/lib/gtm-events";

// Lazy load heavy components
const PropertyFilterSlideOver = dynamic(
    () => import("@/features/search/components/PropertyFilterSlideOver"),
    { ssr: false, loading: () => <div className="animate-pulse w-8 h-8 bg-gray-200 rounded" /> }
);

const MobileSearch = dynamic(
    () => import("@/features/site/components/MobileSearch"),
    { ssr: false, loading: () => <div className="animate-pulse w-full h-12 bg-gray-200 rounded" /> }
);

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

// Memoized CommunityItem component
export const CommunityItem = memo<CommunityItemProps>(({
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
    }, [community, offeringType]);

    const isDisabled = useMemo(() => 
        selectedCommunities.some((item) => item.slug === community.slug) || propertyCount === 0,
        [selectedCommunities, community.slug, propertyCount]
    );

    const handleClick = useCallback(() => {
        setSelectedCommunities(prev => [...prev, community]);
        setSearchInput('');
        if (isMobile && closeDropdown) {
            closeDropdown();
        }
    }, [setSelectedCommunities, community, setSearchInput, isMobile, closeDropdown]);

    return (
        <button
            type="button"
            disabled={isDisabled}
            onClick={handleClick}
            className="flex hover:bg-slate-50 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <div className="flex w-full justify-between items-center">
                <span className="text-sm text-start">{community.name}</span>
                <span className="text-xs text-gray-500">({propertyCount})</span>
            </div>
        </button>
    );
});

// Memoized SelectedCommunitiesList component
const SelectedCommunitiesList = memo<SelectedCommunitiesListProps>(({ 
    selectedCommunities, 
    setSelectedCommunities, 
    classNames = "" 
}) => {
    const handleRemoveCommunity = useCallback((communitySlug: string) => {
        setSelectedCommunities(prev => prev.filter(item => item.slug !== communitySlug));
    }, [setSelectedCommunities]);

    if (selectedCommunities.length === 0) return null;

    return (
        <div className={cn("flex flex-wrap gap-2 mt-2", classNames)}>
            {selectedCommunities.map((community) => (
                <div
                    key={community.slug}
                    className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                    <span>{community.name}</span>
                    <button
                        type="button"
                        onClick={() => handleRemoveCommunity(community.slug)}
                        className="ml-1 hover:text-red-600"
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
        </div>
    );
});

// Add display names for debugging
CommunityItem.displayName = 'CommunityItem';
SelectedCommunitiesList.displayName = 'SelectedCommunitiesList';

function PropertyPageSearchFilter({ offeringType, propertyType }: PropertyPageSearchFilterProps) {
    // State management - grouped and memoized where possible
    const [searchInput, setSearchInput] = useState('');
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCommunities, setSelectedCommunities] = useState<CommunityFilterType[]>([]);
    const [communities, setCommunities] = useState<CommunityFilterType[]>([]);
    const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);

    // Router and path hooks
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams() as { [key: string]: string };

    // Get unit types with error handling
    const { data: unitTypesData, isLoading: isLoadingUnitTypes } = useGetUnitType();
    const unitTypes = unitTypesData || [];

    // Extract path search params - memoized to prevent unnecessary recalculations
    const pathSearchParams = useMemo(() => 
        extractPathSearchParams(pathname), 
        [pathname]
    );

    // Form initialization with proper defaults
    const form = useForm<FormValues>({
        defaultValues: useMemo(() => ({
            query: pathSearchParams.query || '',
            unitType: pathSearchParams.unitType || '',
            minPrice: pathSearchParams.minPrice?.toString() || '',
            maxPrice: pathSearchParams.maxPrice?.toString() || '',
            minSize: pathSearchParams.minSize?.toString() || '',
            maxSize: pathSearchParams.maxSize?.toString() || '',
            bed: pathSearchParams.bed || 0,
            bath: pathSearchParams.bath || 0,
            status: pathSearchParams.status || '',
            offerType: pathSearchParams.offerType || '',
            furnishing: pathSearchParams.furnishing || '',
            sortBy: pathSearchParams.sortBy || '',
            currency: pathSearchParams.currency || ''
        }), [pathSearchParams])
    });

    // Debounced search function
    const debouncedSearch = useMemo(() => {
        let timeoutId: NodeJS.Timeout;
        return (searchTerm: string) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setSearchInput(searchTerm);
            }, 300);
        };
    }, []);

    // Memoized Fuse instance for search
    const fuse = useMemo(() => {
        if (communities.length === 0) return null;
        return new Fuse(communities, {
            keys: ['name'],
            threshold: 0.3,
            includeScore: true,
        });
    }, [communities]);

    // Filtered communities based on search
    const filteredCommunities = useMemo(() => {
        if (!searchInput || !fuse) return communities.slice(0, 10);
        
        const results = fuse.search(searchInput);
        return results.map(result => result.item).slice(0, 10);
    }, [searchInput, fuse, communities]);

    // Memoized callbacks
    const handleDropdownToggle = useCallback(() => {
        setIsDropdownOpen(prev => !prev);
    }, []);

    const handleDropdownClose = useCallback(() => {
        setIsDropdownOpen(false);
        setSearchInput('');
    }, []);

    const handleFormSubmit = useCallback((data: FormValues) => {
        // Track the search form submission with GTM
        trackSearchFormSubmit({
            form_id: "property-search-form",
            form_name: "Property Search Form",
            form_destination: window.location.origin,
            form_length: Object.keys(data).filter(key => data[key as keyof FormValues]).length,
            search_term: data.query || "",
            filters: {
                communities: selectedCommunities.map(c => c.name),
                minPrice: data.minPrice,
                maxPrice: data.maxPrice,
                minSize: data.minSize,
                maxSize: data.maxSize,
                bedrooms: data.bed,
                bathrooms: data.bath,
                unitType: data.unitType,
                offerType: data.offerType
            },
            send_to: "AW-11470392777"
        });

        const url = buildPropertySearchUrl({
            searchType: data.offerType || offeringType || 'for-sale',
            selectedCommunities,
            formData: {
                ...data,
                // Convert string numbers back to numbers for the URL builder
                minPrice: data.minPrice ? parseFloat(data.minPrice) : undefined,
                maxPrice: data.maxPrice ? parseFloat(data.maxPrice) : undefined,
                minSize: data.minSize ? parseFloat(data.minSize) : undefined,
                maxSize: data.maxSize ? parseFloat(data.maxSize) : undefined
            }
        });
        router.push(url);
    }, [selectedCommunities, offeringType, router]);

    // Load communities on mount
    useEffect(() => {
        const loadCommunities = async () => {
            setIsLoadingCommunities(true);
            try {
                const response = await getClientCommunities();
                const mappedCommunities = (response || []).map(toCommunityFilterType);
                setCommunities(mappedCommunities);
            } catch (error) {
                console.error('Failed to load communities:', error);
            } finally {
                setIsLoadingCommunities(false);
            }
        };

        loadCommunities();
    }, []);

    // Initialize selected communities from path
    useEffect(() => {
        if (pathSearchParams.communityNames && communities.length > 0) {
            const communityNames = pathSearchParams.communityNames.split(',');
            const matchedCommunities = communities.filter(community =>
                communityNames.some(name => 
                    community.slug === name || (community.name && community.name.toLowerCase() === name.toLowerCase())
                )
            );
            setSelectedCommunities(matchedCommunities);
        }
    }, [pathSearchParams.communityNames, communities]);

    if (isLoadingUnitTypes || isLoadingCommunities) {
        return (
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                            {/* Desktop Search Bar */}
                            <div className="hidden lg:flex items-center space-x-4">
                                {/* Location/Community Search */}
                                <div className="flex-1 relative">
                                    <ClickAwayListener onClickAway={handleDropdownClose}>
                                        <div className="relative">
                                            <div
                                                onClick={handleDropdownToggle}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white"
                                            >
                                                {selectedCommunities.length > 0 ? (
                                                    <span className="text-sm">
                                                        {formatCommunityNames(selectedCommunities)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">Location</span>
                                                )}
                                            </div>
                                            
                                            {isDropdownOpen && (
                                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-80 overflow-hidden">
                                                    <div className="p-3 border-b">
                                                        <Input
                                                            placeholder="Search communities..."
                                                            value={searchInput}
                                                            onChange={(e) => debouncedSearch(e.target.value)}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto">
                                                        {filteredCommunities.map((community, index) => (
                                                            <CommunityItem
                                                                key={community.slug}
                                                                community={community}
                                                                selectedCommunities={selectedCommunities}
                                                                setSelectedCommunities={setSelectedCommunities}
                                                                setSearchInput={setSearchInput}
                                                                index={index}
                                                                offeringType={offeringType}
                                                                closeDropdown={handleDropdownClose}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </ClickAwayListener>
                                    <SelectedCommunitiesList
                                        selectedCommunities={selectedCommunities}
                                        setSelectedCommunities={setSelectedCommunities}
                                    />
                                </div>

                                {/* Property Type Select */}
                                <FormField
                                    control={form.control}
                                    name="unitType"
                                    render={({ field }) => (
                                        <FormItem className="min-w-[150px]">
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Property Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="all">All Types</SelectItem>
                                                    {unitTypes.map((type: { name: string; slug: string }) => (
                                                        <SelectItem key={type.slug} value={type.slug}>
                                                            {type.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                {/* Price Range */}
                                <div className="flex space-x-2 min-w-[200px]">
                                    <FormField
                                        control={form.control}
                                        name="minPrice"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Min Price"
                                                        {...field}
                                                        type="number"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maxPrice"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Max Price"
                                                        {...field}
                                                        type="number"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Advanced Filters */}
                                <PropertyFilterSlideOver
                                    form={form}
                                    selectedCommunities={selectedCommunities}
                                    setSelectedCommunities={setSelectedCommunities}
                                    onSubmit={handleFormSubmit}
                                />

                                {/* Search Button */}
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Search size={20} />
                                </button>
                            </div>

                            {/* Mobile Search Button */}
                            <div className="lg:hidden">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileSearchOpen(true)}
                                    className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-lg"
                                >
                                    <Search size={20} />
                                    <span>Search Properties</span>
                                </button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>

            {/* Mobile Search Modal */}
            <MobileSearch
                isOpen={isMobileSearchOpen}
                setIsOpen={setIsMobileSearchOpen}
                setSelectedCommunities={setSelectedCommunities}
                selectedCommunities={selectedCommunities}
                form={form}
                onSubmit={handleFormSubmit}
                offeringType={offeringType}
                propertyType={propertyType}
            />
        </>
    );
}

export default memo(PropertyPageSearchFilter);
