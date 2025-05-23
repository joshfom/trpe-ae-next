"use client"

import React, {useEffect, useState} from 'react';
import {Search, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import MobileSearch from "@/features/site/components/MobileSearch";
import ClickAwayListener from "@/lib/click-away-listener";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {useParams, usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import Fuse from 'fuse.js';
import {buildPropertySearchUrl, extractPathSearchParams, formatCommunityNames} from './hooks/path-search-helper';
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";
import PropertyFilterSlideOver from "@/features/search/components/PropertyFilterSlideOver";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import { getCommunitiesAction } from '@/actions/get-communities-action';
import { searchPropertiesAction } from '@/actions/properties/search-properties-action';
import { getUnitTypeAction } from '@/actions/properties/get-unit-type-action';

interface CommunityFilterType {
    slug: string;
    name: string | null;
    propertyCount: number;
    rentCount: number;
    saleCount: number;
    commercialRentCount: number;
    commercialSaleCount: number;
}

interface PropertyPageSearchFilterProps {
    offeringType: string;
    propertyType?: string;
}

function PropertyPageSearchFilter({ offeringType, propertyType }: PropertyPageSearchFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    
    // State variables
    const [isLoading, setIsLoading] = useState(false);
    const [searchInputOpen, setSearchInputOpen] = useState<boolean>(false);
    const [searchInputValue, setSearchInputValue] = useState<string>("");
    const [filteredCommunities, setFilteredCommunities] = useState<CommunityFilterType[]>([]);
    const [communities, setCommunities] = useState<CommunityFilterType[]>([]);
    const [searchingFor, setSearchingFor] = useState<string>("");
    const [unitTypes, setUnitTypes] = useState<any[]>([]);
    const [selectedUnitType, setSelectedUnitType] = useState<string>("");
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    
    // Form setup
    const form = useForm({
        defaultValues: {
            offeringType: offeringType || 'buy',
            propertyType: propertyType || 'residential',
            unitType: '',
            minPrice: '',
            maxPrice: '',
            minBed: '',
            maxBed: '',
            minSize: '',
            maxSize: '',
        }
    });

    // Load communities and unit types on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                // Fetch communities using server action
                const communityData = await getCommunitiesAction();
                setCommunities(communityData || []);
                
                // Fetch unit types using server action
                const unitTypeResult = await getUnitTypeAction();
                if (unitTypeResult && Array.isArray(unitTypeResult)) {
                    setUnitTypes(unitTypeResult);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();
    }, []);

    // Extract search parameters from path
    useEffect(() => {
        const searchParams = extractPathSearchParams(pathname, offeringType);
        setSearchingFor(searchParams.searchingFor);
        
        // Set unit type if found in path
        if (searchParams.unitType) {
            setSelectedUnitType(searchParams.unitType);
            form.setValue('unitType', searchParams.unitType);
        }
    }, [pathname, offeringType, form]);

    // Handle community search and filtering
    useEffect(() => {
        if (!communities.length) return;
        
        if (!searchInputValue.trim()) {
            setFilteredCommunities([]);
            return;
        }
        
        const fuse = new Fuse(communities, {
            keys: ['name'],
            threshold: 0.3,
        });
        
        const results = fuse.search(searchInputValue);
        setFilteredCommunities(results.map(result => result.item));
    }, [searchInputValue, communities]);

    // Form submission handler
    const onSubmit = async (values: any) => {
        const searchUrl = buildPropertySearchUrl(values, searchingFor);
        router.push(searchUrl);
    };

    return (
        <div className="w-full py-4 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <SearchPageH1Heading pathname={pathname} offeringType={offeringType}/>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-stretch">
                        <div className="md:w-1/2 relative">
                            <div 
                                className="h-full relative border rounded-md px-3 flex items-center cursor-pointer" 
                                onClick={() => setSearchInputOpen(!searchInputOpen)}
                            >
                                <Search size={18} className="mr-2" />
                                <span className="text-sm text-gray-500">
                                    {searchingFor ? formatCommunityNames(searchingFor) : "Where do you want to live?"}
                                </span>
                                {searchingFor && (
                                    <X 
                                        size={16} 
                                        className="absolute right-3" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSearchingFor("");
                                            router.push(`/${offeringType}`);
                                        }}
                                    />
                                )}
                            </div>
                            
                            {searchInputOpen && (
                                <ClickAwayListener onClickAway={() => setSearchInputOpen(false)}>
                                    <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-md z-50 mt-1">
                                        <div className="p-4">
                                            <Input
                                                placeholder="Search for communities..."
                                                value={searchInputValue}
                                                onChange={(e) => setSearchInputValue(e.target.value)}
                                                className="mb-2"
                                                autoFocus
                                            />
                                            <div className="max-h-60 overflow-y-auto">
                                                {filteredCommunities.length > 0 ? (
                                                    filteredCommunities.map((community) => (
                                                        <div 
                                                            key={community.slug}
                                                            className="py-2 px-3 hover:bg-gray-100 cursor-pointer rounded-md"
                                                            onClick={() => {
                                                                router.push(`/${offeringType}/${community.slug}`);
                                                                setSearchInputOpen(false);
                                                                setSearchInputValue("");
                                                            }}
                                                        >
                                                            {community.name}
                                                            <span className="text-xs text-gray-500 ml-2">
                                                                ({offeringType === 'rent' ? community.rentCount : community.saleCount} properties)
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    searchInputValue ? (
                                                        <div className="py-2 px-3 text-gray-500">No communities found</div>
                                                    ) : null
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </ClickAwayListener>
                            )}
                        </div>
                        
                        <div className="flex gap-2 md:w-1/2">
                            <FormField
                                control={form.control}
                                name="unitType"
                                render={({ field }) => (
                                    <FormItem className="w-full md:w-1/3">
                                        <Select 
                                            value={field.value} 
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setSelectedUnitType(value);
                                            }}
                                        >
                                            <FormControl>
                                                <SelectTrigger className={cn("h-full", !field.value && "text-muted-foreground")}>
                                                    <SelectValue placeholder="Property Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="">Any Type</SelectItem>
                                                {isLoading ? (
                                                    <div className="p-2">
                                                        <Skeleton className="h-4 w-full mb-2" />
                                                        <Skeleton className="h-4 w-full mb-2" />
                                                        <Skeleton className="h-4 w-full" />
                                                    </div>
                                                ) : (
                                                    unitTypes.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            
                            <div 
                                className="w-full md:w-1/3 flex items-center justify-center border rounded-md px-3 cursor-pointer"
                                onClick={() => setMobileFilterOpen(true)}
                            >
                                <span className="text-sm">More Filters</span>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="bg-primary text-white rounded-md px-4 flex items-center justify-center min-w-24"
                            >
                                <Search size={18} className="mr-2" />
                                Search
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
            
            {/* Mobile filters */}
            <PropertyFilterSlideOver
                open={mobileFilterOpen}
                setOpen={setMobileFilterOpen}
                form={form}
                onSubmit={onSubmit}
            />
        </div>
    );
}

export default PropertyPageSearchFilter;
