import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { FormField, FormItem } from "@/components/ui/form";
import {SearchFormData} from "@/features/search/types/property-search.types";

interface SizeFilterProps {
    form: UseFormReturn<SearchFormData>;
}

const SizeFilter: React.FC<SizeFilterProps> = ({ form }) => {
    return (
        <div>
            <h3 className="text-lg pb-4">Size (sq ft)</h3>
            <div className="grid grid-cols-2 gap-4">
                {/* Minimum Size Input */}
                <FormField
                    name="minSize"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <Input
                                {...field}
                                type="number"
                                placeholder="Min Size"
                                className="w-full"
                            />
                        </FormItem>
                    )}
                />

                {/* Maximum Size Input */}
                <FormField
                    name="maxSize"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <Input
                                {...field}
                                type="number"
                                placeholder="Max Size"
                                className="w-full"
                            />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};

export default SizeFilter;