"use client"
import React, {useState, memo} from 'react';
import Link from "next/link";
import {Menu, MenuItem} from "@/features/site/components/navbar-menu-optimized";
import {ArrowRight} from "lucide-react";
import MenuFeaturedProperty from "@/features/site/components/MenuFeaturedProperty";
import TextBorderAnimation from "@/features/site/components/TextBorderAnimation";

function TopNavigation() {
    const [active, setActive] = useState<string | null>(null);


    return (
        <>
            <div className={' hidden lg:flex text-white px-3'}>
                <Menu
                    setActive={setActive}
                >
                    <MenuItem
                        setActive={setActive}
                        active={active}
                        item={
                            <TextBorderAnimation text="Sale"/>
                        }
                        slug={'for-sale'}
                    >
                        <div className="grid grid-cols-6 h-[570px] ">
                            <div className="col-span-2 flex h-full pl-6 text-white  justify-between py-6 flex-col">
                                <div className={'flex-1 space-y-2'}>

                                    <Link
                                        href={`/properties/for-sale`}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                            All Property Types
                                        </span>
                                    </Link>
                                    <Link
                                        href={`dubai/properties/residential/for-sale/property-type-apartments`}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                            Apartments for Sale
                                        </span>
                                    </Link>

                                    <Link
                                        href={`dubai/properties/residential/for-sale/property-type-villas`}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                            Villas for Sale
                                        </span>
                                    </Link>
                                    <Link
                                        href={`dubai/properties/residential/for-sale/property-type-townhouses`}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                            Townhouses for Sale
                                        </span>
                                    </Link>
                                    <Link
                                        href={`dubai/properties/commercial/for-sale/property-type-offices`}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                            Offices for Sale
                                        </span>
                                    </Link>
                                    <Link
                                        href={`dubai/properties/commercial/for-sale/property-type-retails`}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                            Retails for Sale
                                        </span>
                                    </Link>

                                </div>
                                <div className={'text-white'}>

                                    <Link
                                        href={`/selling-property-process`}
                                        title={'Selling Process'}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                          Selling Process
                                        </span>
                                    </Link>
                                    <Link
                                        href={`/buying-property-process`}
                                        title={'Selling Process'}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                          Buying Process
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            <MenuFeaturedProperty offeringType={'for-sale'}/>
                        </div>
                    </MenuItem>
                    <MenuItem
                        setActive={setActive}
                        active={active}
                        slug={'for-rent'}
                        item={
                            <TextBorderAnimation text="Rent"/>
                        }
                    >
                        <div className="grid grid-cols-6 h-[570px] ">
                            <div className="col-span-2 flex h-full pl-6 text-white  justify-between py-6 flex-col">
                                <div className={'flex-1 space-y-2'}>

                                    <Link
                                        href={`/properties/for-rent`}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                            All Property Types
                                        </span>
                                    </Link>
                                    <Link
                                        href={`/dubai/properties/residential/for-rent/property-type-apartments`}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                                Apartments for Rent
                                        </span>
                                    </Link>

                                    <Link
                                        href={`/dubai/properties/residential/for-rent/property-type-villas`}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                            Villas for Rent
                                        </span>
                                    </Link>

                                    <Link
                                        href={`/dubai/properties/residential/for-rent/property-type-townhouses`}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                            Townhouses for Rent
                                        </span>
                                    </Link>

                                    <Link
                                        href={`/dubai/properties/commercial/for-rent/property-type-offices`}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                            Offices for Rent
                                        </span>
                                    </Link>

                                    <Link
                                        href={`/dubai/properties/commercial/for-rent/property-type-retails`}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                            Retails for Rent
                                        </span>
                                    </Link>

                                </div>
                                <div className={'text-white'}>

                                    <Link
                                        href={`/renting-property-process/#for-landlords`}
                                        title={'Renting process for landlords'}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                          For Landlords
                                        </span>
                                    </Link>

                                    <Link
                                        href={`/renting-property-process/#for-tenants`}
                                        title={'Renting Process for tenants'}
                                        className="group flex items-center gap-2">
                                        <ArrowRight
                                            className="stroke-1 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out hover:z-20 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100 md:size-10"/>

                                        <span
                                            className="z-10 -translate-x-6 text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-slate-300 dark:text-white md:-translate-x-12 md:text-lg md:group-hover:translate-x-0">
                                          For Tenants
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            <MenuFeaturedProperty offeringType={'for-rent'}/>
                        </div>
                    </MenuItem>
                </Menu>
                <div className="flex space-x-6 items-center">
                    <Link href={'/communities'}>
                        <TextBorderAnimation text="Communities"/>
                    </Link>
                    <Link href={'/off-plan'}>
                        <TextBorderAnimation text="New Projects"/>
                    </Link>
                    <Link href={'/insights'}>
                        <TextBorderAnimation text="Insights"/>
                    </Link>
                    <Link href={'/luxury-properties-for-sale-dubai'}>
                        <TextBorderAnimation text="Luxe by TRPE"/>
                    </Link>

                </div>

            </div>

        </>
    );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(TopNavigation);