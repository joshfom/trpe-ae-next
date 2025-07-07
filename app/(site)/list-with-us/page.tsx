import React from 'react';

import ListPropertyForm from "@/features/properties/components/ListPropertyForm";
import {DollarSign, File, Globe, Hotel} from "lucide-react";
import type {Metadata} from "next";


export const metadata: Metadata = {
    title: "List with us, Properties for Sale in Dubai | Buy, Sell or Rent Property in Dubai",
    description: "List your property with us, Find your next home or investment in Dubai. Browse the latest Dubai property for sale or rent.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/list-with-us`,
    },
};

function ListWithUsPage() {
    return (
        <div className={''}>
            <div className="bg-black py-12 hidden lg:block">

            </div>
            <div className="py-12 lg:py-24 max-w-7xl px-6 mx-auto flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2 flex p-6 bg-white rounded-2xl flex-col ">
                    <div className="pb-12"><h1 className="text-4xl font-semibold pt-4">
                        Sell or Rent Out Your Property
                    </h1>
                    </div>
                    <h2 className="text-3xl">
                        Why list with TRPE?
                    </h2>
                    <p className="pt-4">
                        You should list your property with TRPE because we offer unmatched expertise and comprehensive
                        services. Our team provides expert market analysis, targeted marketing strategies, and thorough
                        tenant screening to ensure quick and reliable rentals. We handle all aspects of the rental
                        process, from advertising to lease management, ensuring compliance with local regulations. With
                        TRPE, you’ll benefit from higher occupancy rates, optimized rental income, and a hassle-free
                        experience, making property management seamless and efficient.
                    </p>
                </div>

                <div className={'px-6 w-full lg:w-1/2'}>
                    <div className="relative rounded-3xl overflow-hidden">
                        <img className={'h-[500px] w-full object-cover'}
                             src="/images/list-with-us.png" alt="List with TRPE"
                        />
                    </div>
                </div>
            </div>

            <div className="py-12 mx-auto max-w-7xl p-6 space-y-4">
                <h2 className={'text-3xl'}>How does it work?</h2>
                <p>Start the effortless journey of listing your property with us, step by step.</p>
                <div className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className={'grid grid-cols-1 gap-12'}>
                        <div className={'flex flex-col items-start gap-4 px-6 border rounded-3xl py-4'}>
                            <div>
                                <Hotel size={40} className={'stroke-1 mr-3'}/>
                            </div>
                            <div>
                                <h3 className="text-lg"> Valuation Visit</h3>
                                <p>
                                    Property valuation within 24 hours, backed by data-driven analysis.
                                </p>
                            </div>
                        </div>

                        <div
                            className={'flex flex-col items-start gap-4 px-6 border border-slate-100 rounded-3xl py-4'}>
                            <div>
                                <File size={40} className={'stroke-1 mr-3'}/>
                            </div>
                            <div>
                                <h3 className="text-lg"> Paper Signing</h3>
                                <p>
                                    Homeowner’s consent to property listing; all essential papers are executed and
                                    submitted for listing.
                                </p>
                            </div>
                        </div>

                        <div className={'flex flex-col items-start gap-4 px-6 border rounded-3xl py-4'}>
                            <div>
                                <Globe size={40} className={'stroke-1 mr-3'}/>
                            </div>
                            <div>
                                <h3 className="text-lg">Global Reach</h3>
                                <p>
                                    Now sit back while our marketing team lists your property on top Dubai property
                                    portals.
                                </p>
                            </div>
                        </div>


                        <div className={'flex flex-col items-start gap-4 px-6 border rounded-3xl py-4'}>
                            <div>
                                <DollarSign size={40} className={'stroke-1 mr-3'}/>
                            </div>
                            <div>
                                <h3 className="text-lg">Return on Investments</h3>
                                <p>
                                    Experience the convenience of receiving your investment returns from the comfort of your home.
                                </p>
                            </div>
                        </div>

                    </div>
                    <ListPropertyForm/>
                </div>
            </div>
        </div>
    );
}

export default ListWithUsPage;