import React from 'react';
import {Metadata} from "next";
import LuxeListings from "@/features/luxe/components/LuxeListings";
import { TipTapView } from "@/components/TiptapView";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { offeringTypeTable } from "@/db/schema/offering-type-table";
import {Spotlight} from "@/components/Spotlight";

export const metadata: Metadata = {
    title: "Luxury properties in Dubai | Find Your Next Home - TRPE AE",
    description: "Discover Dubai's luxury properties with TRPE. Expert insights, exclusive listings, and tailored services await you at Luxe.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/luxury-properties-for-sale-dubai`,
    },
};



async function LuxePropertyPage(
    props: { searchParams: Promise<{ [key: string]: string  | undefined }> }
) {
    const searchParams = await props.searchParams;
    // Fetch offering type information
    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, 'for-sale'),
    });

    const page = searchParams?.page

    return (
        <div className='bg-black'>
            
            <div className="max-w-7xl mx-auto lg:border-4  pb-12 broder-white">
                    <img src="/media/home-landing.webp" className={'mx-auto  hidden lg:block mt-32 h-full object-cover'}
                         alt=""/>
                </div>

                {/* Mobile hero image */}
                <img src="/media/magazine-home-mobile.webp" className={'mx-auto lg:hidden -mt-8 object-contain h-full w-full'} alt=""/>

                <div className="absolute  inset-0">
                    <div className="flex flex-col h-full  justify-center items-center">

                    </div>
                </div>
            


                <div className="w-full relative z-20">
                <div
                    className="h-144 lg:h-160 mx-auto w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
                    <Spotlight
                        className="-top-40 left-0 md:left-60 md:-top-20"
                        fill="white"
                    />
  {/*<Spotlight*/}
  {/*                      className="-top-40 left-0 md:left-60 md:-top-20"*/}
  {/*                      fill="white"*/}
  {/*                  />*/}

                    <div className=" p-4 max-w-7xl pt-20 pl-6 lg:pl-4 mx-auto relative z-10  w-full md:pt-0">
                        <h2 className="text-3xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                            Exclusive Properties
                        </h2>
                        <h2 className="text-3xl md:text-6xl mt-2 font-bold text-center bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                            Exceptional Communities
                        </h2>
                        <p className="mt-6 font-normal text-base text-neutral-300 max-w-3xl text-center mx-auto">
                            Luxe by TRPE is a premier real estate agency dedicated to providing exceptional service and
                            exclusive properties to discerning clients. With years of collective experience in luxury
                            real estate markets across Dubai, London and Europe, we are committed to helping you find
                            the perfect home that meets your unique needs and desires.
                        </p>
                        <p className="mt-4 font-normal text-base text-neutral-300 max-w-3xl text-center mx-auto">
                            We pride ourselves on our personalized approach, ensuring that each client receives tailored
                            advice and support throughout the entire buying or selling process. Our extensive portfolio
                            includes some of the most prestigious properties in the region, offering unmatched elegance
                            and comfort.
                        </p>

                    </div>

                </div>
            </div>



            {/* Use the server component with the search params */}
            <LuxeListings
                searchParams={searchParams}
                offeringType="for-sale"
                page={page}
            />
            
            {offeringType?.about && (
                <div className="max-w-7xl bg-white mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold mb-4">About Luxury Properties</h2>
                    <TipTapView content={offeringType.about}/>
                </div>
            )}
        </div>
    );
}

export default LuxePropertyPage;