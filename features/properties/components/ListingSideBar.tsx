import React from 'react';
import {Checkbox} from "@/components/ui/checkbox";

function ListingSideBar() {
    return (
        <div className={'rounded-3xl overflow-hidden border border-gray-500 bg-gray-900 divide-y'}>
            <div className="px-6 py-4">
                <h3 className="text-2xl font-semibold text-white">
                    Filters
                </h3>
            </div>
            <div className={'space-y-4 border-t border-gray-500 p-6'}>
                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="all"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="all"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            All
                        </label>

                    </div>
                </div>

                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="apartments"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="apartments"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Apartments
                        </label>

                    </div>
                </div>

                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="villa"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="villa"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Villa
                        </label>

                    </div>
                </div>

                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="office"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="office"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Commercial
                        </label>

                    </div>
                </div>
                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="townhosue"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="townhosue"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Townhouse
                        </label>

                    </div>
                </div>

                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="penthouse"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="penthouse"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Penthouse
                        </label>

                    </div>
                </div>
            </div>

            <div className={'space-y-4 border-t border-gray-500 p-6'}>
                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="all"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="all"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            All
                        </label>

                    </div>
                </div>

                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="studio"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="studio"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Studio
                        </label>

                    </div>
                </div>

                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="1bedroom"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="1bedroom"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            1 Bedroom
                        </label>

                    </div>
                </div>

                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="2bedrooms"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="2bedrooms"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            2 Bedrooms
                        </label>

                    </div>
                </div>
                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="3bedrooms"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="3bedrooms"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            3 Bedrooms
                        </label>

                    </div>
                </div>

                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="4bedrooms"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="4bedrooms"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            4 Bedrooms
                        </label>

                    </div>
                </div>

                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="5bedrooms"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="5bedrooms"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            5+ Bedrooms
                        </label>

                    </div>
                </div>
            </div>

            <div className={'space-y-4 border-t border-gray-500 p-6'}>
                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="all"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="all"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            All
                        </label>

                    </div>
                </div>

                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="furnished"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="furnished"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Furnished
                        </label>

                    </div>
                </div>

                <div className="items-top flex items-center space-x-4">
                    <Checkbox className={'border border-white rounded-full'} id="unfurnished"/>
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="unfurnished"
                            className=" font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Unfurnished
                        </label>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default ListingSideBar;