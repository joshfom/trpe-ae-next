import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {SearchFormData} from "@/features/search/types/property-search.types";

interface StatusFilterProps {
    form: UseFormReturn<SearchFormData>;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ form }) => {
    const statusOptions = [
        { value: '', label: 'Any' },
        { value: 'ready', label: 'Ready' },
        { value: 'off-plan', label: 'Off-plan' }
    ];

    return (
        <div>
            <h3 className="text-lg">Completion Status</h3>
            <div className="flex py-3 gap-2 lg:gap-4">
                {statusOptions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => form.setValue('status', option.value)}
                        className={`px-4 lg:px-6 py-2 border rounded-full ${
                            form.watch('status') === option.value ? 'bg-black text-white' : 'bg-white text-black'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StatusFilter;