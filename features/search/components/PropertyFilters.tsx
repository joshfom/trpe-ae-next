"use client"

import React, { memo, useCallback, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

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

interface PropertyFiltersProps {
    form: UseFormReturn<FormValues>;
    offeringType: string;
}

const PropertyFilters = memo<PropertyFiltersProps>(({ form, offeringType }) => {
    // Memoize price options based on offering type
    const priceOptions = useMemo(() => {
        const isRent = offeringType.includes('rent');
        const baseOptions = isRent 
            ? [
                { value: "10000", label: "AED 10,000" },
                { value: "25000", label: "AED 25,000" },
                { value: "50000", label: "AED 50,000" },
                { value: "75000", label: "AED 75,000" },
                { value: "100000", label: "AED 100,000" },
                { value: "150000", label: "AED 150,000" },
                { value: "200000", label: "AED 200,000" },
                { value: "300000", label: "AED 300,000" },
                { value: "500000", label: "AED 500,000" },
            ]
            : [
                { value: "500000", label: "AED 500,000" },
                { value: "1000000", label: "AED 1,000,000" },
                { value: "2000000", label: "AED 2,000,000" },
                { value: "3000000", label: "AED 3,000,000" },
                { value: "5000000", label: "AED 5,000,000" },
                { value: "10000000", label: "AED 10,000,000" },
                { value: "15000000", label: "AED 15,000,000" },
                { value: "20000000", label: "AED 20,000,000" },
                { value: "50000000", label: "AED 50,000,000" },
            ];
        return baseOptions;
    }, [offeringType]);

    const bedroomOptions = useMemo(() => [
        { value: "0", label: "Studio" },
        { value: "1", label: "1 Bed" },
        { value: "2", label: "2 Beds" },
        { value: "3", label: "3 Beds" },
        { value: "4", label: "4 Beds" },
        { value: "5", label: "5+ Beds" },
    ], []);

    const bathroomOptions = useMemo(() => [
        { value: "1", label: "1 Bath" },
        { value: "2", label: "2 Baths" },
        { value: "3", label: "3 Baths" },
        { value: "4", label: "4 Baths" },
        { value: "5", label: "5+ Baths" },
    ], []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Min Price" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {priceOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Max Price" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {priceOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="bed"
                render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={field.onChange} value={field.value?.toString()}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Bedrooms" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {bedroomOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="bath"
                render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={field.onChange} value={field.value?.toString()}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Bathrooms" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {bathroomOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />
        </div>
    );
});

PropertyFilters.displayName = 'PropertyFilters';

export default PropertyFilters;
