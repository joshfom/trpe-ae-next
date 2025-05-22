import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {SearchFormData} from "@/features/search/types/property-search.types";

interface PriceFilterProps {
    form: UseFormReturn<SearchFormData>;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ form }) => {

    return (
        <div>
            <h3 className="text-sm lg:text-lg pb-4">Price Range</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">


                {/* Min Price Input */}
              <div className={'w-full'}>
                  <FormField
                      name="minPrice"
                      control={form.control}
                      render={({ field }) => (
                          <FormItem>
                              <Input
                                  {...field}
                                  type="number"
                                  placeholder="Min Price"
                                  className="w-full"
                              />
                          </FormItem>
                      )}
                  />
              </div>

                {/* Max Price Input */}
              <div className={'w-full'}>
                  <FormField
                      name="maxPrice"
                      control={form.control}
                      render={({ field }) => (
                          <FormItem>
                              <Input
                                  {...field}
                                  type="number"
                                  placeholder="Max Price"
                                  className="w-full"
                              />
                          </FormItem>
                      )}
                  />
              </div>
            </div>
        </div>
    );
};

export default PriceFilter;