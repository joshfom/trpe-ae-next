import React from 'react';
import {Checkbox} from "@/components/ui/checkbox";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

interface MainFiltersProps {
    handleFormValueChange: (value: any, fieldName: string) => void;
    setValue: (field: string, value: any) => void;
    getValues: (field: string) => any;
}

function MainFilters({handleFormValueChange, setValue, getValues}: MainFiltersProps) {

    const [minPrice, setMinPrice] = React.useState<number | null>(null);
    const [maxPrice, setMaxPrice] = React.useState<number | null>(null);
    const [bedrooms, setBedrooms] = React.useState<number | null>(null);
    const [minSize, setMinSize] = React.useState<number>();
    const [maxSize, setMaxSize] = React.useState<number>();
    const [completion, setCompletion] = React.useState<string>('any');

    // Example default values, assuming the form's defaultValues are set up correctly
    React.useEffect(() => {
        setMinPrice(getValues('minPrice'));
        setMaxPrice(getValues('maxPrice'));
        setBedrooms(getValues('bedrooms'));
        setMinSize(getValues('minSize'));
        setMaxSize(getValues('maxSize'));
        setCompletion(getValues('completion'));
    }, [getValues]);


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


    const handlePriceChange = (value: number, type: 'min' | 'max') => {
        if (type === 'min') {
            if (maxPrice !== null && value > maxPrice) {
                return;
            }
            setMinPrice(value);
            setValue('minPrice', value);
        }

        if (type === 'max') {
            if (minPrice !== null && value < minPrice) {
                return;
            }
            setMaxPrice(value);
            setValue('maxPrice', value);
        }
    };


    return (
        <div
            className={'block lg:absolute space-y-4 top-16 p-4 lg:p-6 right-0 left-0  h-[400px] mt-4 rounded-2xl bg-white shadow-lg overflow-y-auto'}>
            <div>
                <h3 className="text-lg font-semibold">
                    Type
                </h3>
                <div className="grid grid-cols-2 gap-4 py-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="Villa"
                            checked={getValues('villa')}
                            value={getValues('villa')}
                            onChange={(e) => handleFormValueChange((e.target as HTMLInputElement).checked, 'villa')}
                        />
                        <label
                            htmlFor="villa"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Villa
                        </label>
                    </div>


                    <div className="flex items-center space-x-2">
                        <Checkbox id="penthouse"/>
                        <label
                            htmlFor="penthouse"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Penthouse
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="townhouse"/>
                        <label
                            htmlFor="townhouse"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Townhouse
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="apartments"/>
                        <label
                            htmlFor="apartments"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Apartment
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="plots"/>
                        <label
                            htmlFor="plots"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Plots
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold">
                    Price
                </h3>

                <div className="grid grid-cols-2 gap-3 lg:gap-8 py-3">
                    <div>
                        <Select
                            value={minPrice ? minPrice.toString() : ''}
                            onValueChange={(value) => handlePriceChange(parseInt(value), 'min')}
                        >
                            <SelectTrigger className="w-full">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Min. Price</span>
                                    <SelectValue placeholder="Any"/>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    priceFilter.map((item, index) => (
                                        <SelectItem
                                            key={index}
                                            onClick={() => handlePriceChange(item.value, 'min')}
                                            disabled={maxPrice !== null && item.value > maxPrice}
                                            value={`${item.value}`}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Select
                            value={maxPrice ? maxPrice.toString() : ''}
                            onValueChange={(value) => handlePriceChange(parseInt(value), 'max')}
                        >
                            <SelectTrigger type={'button'} className="w-full">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Max. Price</span>
                                    <SelectValue placeholder="Any"/>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    priceFilter.map((item, index) => (
                                        <SelectItem
                                            key={index}
                                            disabled={minPrice !== null && item.value < minPrice}
                                            value={`${item.value}`}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold">
                    Completion
                </h3>

                <div className="flex py-3 gap-2 lg:gap-4">
                    <button
                        onClick={() => {
                            setCompletion('any')
                            handleFormValueChange('any', 'completion');
                        }}
                        className={` px-4 lg:px-6 py-2 border rounded-full ${completion === 'any' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        Any
                    </button>
                    <button
                        onClick={() => {
                            setCompletion('ready')
                            handleFormValueChange('ready', 'completion');
                        }}
                        className={` px-4 lg:px-6 py-2 border rounded-full ${completion === 'ready' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        Ready
                    </button>

                    <button
                        onClick={() => {
                            setCompletion('off-plan')
                            handleFormValueChange('off-plan', 'completion');
                        }}
                        className={` px-4 lg:px-6 py-2 border rounded-full ${completion === 'off-plan' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        Off-plan
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold">
                    Bedrooms
                </h3>

                <div className="flex py-3 gap-3 flex-wrap">
                    <button
                        onClick={() => {
                            setBedrooms(0)
                            handleFormValueChange(0, 'bedrooms');
                        }}
                        className={` px-4 lg:px-6 py-2 border rounded-full ${bedrooms === 0 ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                        Any
                    </button>
                    <button
                        onClick={() => {
                            setBedrooms(1)
                            handleFormValueChange(1, 'bedrooms');
                        }}
                        className={` px-4 lg:px-6 py-2 border rounded-full ${bedrooms === 1 ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                        1+
                    </button>

                    <button
                        onClick={
                            () => {
                                setBedrooms(2)
                                handleFormValueChange(2, 'bedrooms');
                            }
                        }
                        className={` px-4 lg:px-6 py-2 border rounded-full ${bedrooms === 2 ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                        2+
                    </button>

                    <button
                        onClick={
                            () => {
                                setBedrooms(3)
                                handleFormValueChange(3, 'bedrooms');
                            }
                        }
                        className={` px-4 lg:px-6 py-2 border rounded-full ${bedrooms === 3 ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                        3+
                    </button>

                    <button
                        onClick={
                            () => {
                                setBedrooms(4)
                                handleFormValueChange(4, 'bedrooms');
                            }
                        }
                        className={` px-4 lg:px-6 py-2 border rounded-full ${bedrooms === 4 ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                        4+
                    </button>

                    <button
                        onClick={
                            () => {
                                setBedrooms(5)
                                handleFormValueChange(5, 'bedrooms');
                            }
                        }
                        className={` px-4 lg:px-6 py-2 border rounded-full ${bedrooms === 5 ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                        5+
                    </button>
                    <button
                        onClick={
                            () => {
                                setBedrooms(6)
                                handleFormValueChange(6, 'bedrooms');
                            }
                        }
                        className={` px-4 lg:px-6 py-2 border rounded-full ${bedrooms === 6 ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                        6+
                    </button>
                    <button
                        onClick={
                            () => {
                                setBedrooms(7)
                                handleFormValueChange(7, 'bedrooms');
                            }
                        }
                        className={` px-4 lg:px-6 py-2 border rounded-full ${bedrooms === 7 ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                        7+
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold">
                    Size
                </h3>

                <div className="grid grid-cols-2 gap-3 lg:gap-8 py-3">
                    <div>
                        <Select
                            onValueChange={(value) => {
                                setMinSize(parseInt(value))
                                handleFormValueChange(value, 'minSize');
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Min. Size</span>
                                    <SelectValue placeholder="Any"/>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    sizeFilter.map((item) => (
                                        <SelectItem
                                            key={item.value * 2}
                                            value={`${item.value}`}
                                            disabled={minSize !== undefined && item.value > minSize}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))
                                }

                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Select
                            onValueChange={(value) => {
                                setMaxSize(parseInt(value))
                                handleFormValueChange(value, 'maxSize');
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Max. Size</span>
                                    <SelectValue placeholder="Any"/>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    sizeFilter.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={`${item.value}`}
                                            disabled={maxSize !== undefined && item.value < maxSize}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))
                                }

                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainFilters;