'use client'
import React, {useEffect} from 'react';
import {Dot} from "lucide-react";
import Link from "next/link";
import {truncateText} from "@/lib/truncate-text";
import currencyConverter from "@/lib/currency-converter";
import unitConverter from "@/lib/unit-converter";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import {ImageSwiper} from "@/features/properties/components/ImageSwiper";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import Image from "next/image";

interface LuxePropertyCardProps {
    property: PropertyType
}

function LuxePropertyCard({property}: LuxePropertyCardProps) {

    const size = property.size
    const imageUrls = property.images.map(image => image.s3Url);
    const [showBedrooms, setShowBedrooms] = React.useState(false);


    useEffect(() => {
        if (property.bedrooms > 0 && property.offeringType) {
            if (property.offeringType.slug === 'for-sale' || property.offeringType.slug === 'for-rent') {
                setShowBedrooms(true);
            }
        }
    }, [])

    console.log('offering type', property.offeringType?.slug)
    return (
        <div
            className={'rounded-xl  bg-white '}>
            <div className="relative">
                <div className="relative">
                    {
                        property.images.length > 0 && (
                            <div className="h-96 ">
                                <Image
                                    src={imageUrls[0]}
                                    alt={property.name || 'Property Image'}
                                    className="pointer-events-none h-full w-full object-cover"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        )
                    }
                </div>
                <div className="absolute top-2 right-2 z-10 rounded-xl bg-black text-white flex space-x-3">
                    {property.offeringType && (
                        <p className="rounded-full text-xs px-5 py-1">
                            {property.offeringType.name}
                        </p>
                    )}
                </div>
            </div>
            <div className="py-3 px-4 pt-8 border-b border-x rounded-b-xl text-slate-700 border-white/20 relative">
                <div
                    className="flex flex-col space-y-2 text-lg justify-center">
                    <Link href={property.offeringType ? `/properties/${property.offeringType.slug}/${property.slug}` : "#"} className={'font-semibold'}>
                        {
                            truncateText(property.title, 60)
                        }
                    </Link>

                </div>
                <div className="py-2">
                    <Link href={property.offeringType ? `/properties/${property.offeringType.slug}/${property.slug}` : "#"}
                          className={'text-sm text-slate-700'}>
                        {
                            prepareExcerpt(property.description, 90)
                        }
                    </Link>
                </div>
                <div
                    className="absolute  z-20   -top-4 left-4">
                    {property.type && (
                        <p
                            className={'rounded-full shadow-lg  bg-[#141414] border-b text-white border-slate-300 py-1 px-6 text-center  text-sm'}>
                            <span className="sr-only">Property Details</span>
                            {
                                property.type.name
                            }
                        </p>
                    )}
                </div>
                <div className="py-3 flex flex-wrap gap-4 justify-start">
                    {
                        showBedrooms && (
                            <>
                                <div className="flex justify-center items-center">
                                    <Dot size={18}/>
                                    {
                                        property.bedrooms < 1 ? 'Studio' : (
                                            <p>
                                                Bed
                                                <span className="ml-2">
                                        {
                                            property.bedrooms
                                        }
                                    </span>
                                            </p>
                                        )
                                    }
                                </div>
                                <div className="flex justify-center items-center">
                                    <Dot size={18}/>
                                    Bath
                                    <p className="ml-2">
                                        {
                                            property.bathrooms
                                        }
                                    </p>
                                </div>

                            </>
                        )
                    }
                    <div className="flex grow items-center">
                        <Dot size={18}/>
                        <span className="">
                           Size
                       </span>
                        <p className="ml-2 ">
                            {
                                unitConverter(size) + ' '
                            }
                        </p>
                    </div>
                </div>
                <div
                    className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4 items-center space-x-2 py-3 justify-between">
                    <Link
                        className={'py-1.5 px-5 rounded-full hover:bg-slate-100 text-sm border'}
                        href={property.offeringType ? `/properties/${property.offeringType.slug}/${property.slug}` : "#"}>
                        View Property
                    </Link>
                    <p className={'text-lg font-semibold'}>
                    {
                            currencyConverter(parseInt(property.price ))
                        }
                    </p>
                </div>
            </div>

        </div>
    );
}

export default LuxePropertyCard;