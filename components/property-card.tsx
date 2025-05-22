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

interface PropertyCardProps {
    property: PropertyType,
    offeringType?: string
}

function PropertyCard({property, offeringType}: PropertyCardProps) {

    const size = property.size / 100
    const imageUrls = property.images.map(image => image.s3Url);
    const [showBedrooms, setShowBedrooms] = React.useState(false);
    const [showOfferingType, setShowOfferingType] = React.useState(true);

    useEffect(() => {
        if (property.bedrooms > 0 && property.offeringType) {
            if (property.offeringType.slug === 'for-sale' || property.offeringType.slug === 'for-rent') {
                setShowBedrooms(true);
            }
        }
    }, [])

    useEffect(() => {
        if (property.offeringType && offeringType && property.offeringType.slug === offeringType) {
            setShowOfferingType(false)
        }
    }, [])


    return (
        <div
            className={'rounded-xl  shadow-xs bg-white'}>
            <div className="relative">
                <div className="relative">
                    {
                        property.images.length > 0 && (
                            <div className="h-96 relative">
                                <img
                                    src={imageUrls[0]}
                                    alt={property.name || 'Property Image'}
                                    className="pointer-events-none h-full w-full object-cover rounded-xl absolute inset-0"
                                />
                            </div>
                        )
                    }
                </div>
                <div className="absolute top-2 right-2 z-10 flex space-x-3">
                    {property.type && (
                        <Link href={property.offeringType ? `/property-types/${property.type?.slug}/${property.offeringType.slug}` : "#"}
                              className="text-white rounded-full text-xs px-4 bg-[#141414] py-1">
                            {property.type.name}
                        </Link>
                    )}
                </div>
            </div>
            <div className="p-3 pt-8 border-b border-x text-slate-700 rounded-b-xl border-white/20 relative">
                <div
                    className="flex flex-col space-y-2 text-lg justify-center">
                    <Link href={property.offeringType ? `/properties/${property.offeringType.slug}/${property.slug}` : "#"}
                          className={'hover:underline'}>
                        {
                            truncateText(property.title, 35)
                        }
                    </Link>

                </div>
                <div className="py-2">
                    <Link href={property.offeringType ? `/properties/${property.offeringType.slug}/${property.slug}` : "#"}
                          className={'text-sm '}>
                        {
                            prepareExcerpt(property.description, 90)
                        }
                    </Link>
                </div>
                <div
                    className="absolute  z-20  text-white -top-4 left-4">
                    {
                        showOfferingType && property.offeringType && (
                            <Link href={property.offeringType.slug ? `/properties/${property.offeringType.slug}` : "#"}
                                  className={'rounded-full  bg-[#141414] border-b  py-1 px-3 text-center border-t border-white border-x text-white text-sm'}>
                                <span className="sr-only">Property Details</span>
                                {
                                    property.offeringType.name
                                }
                            </Link>
                        )
                    }
                </div>
                <div className="py-3 flex flex-wrap gap-4 justify-start">
                    {showBedrooms && (
                        <div className="flex justify-center items-center">
                            <Dot size={18}/>
                            {
                                property.bedrooms < 1 ? 'Studio' : (
                                    <p>
                                        Bed
                                        <span className="ml-2">
                                        {property.bedrooms}
                                         </span>
                                    </p>
                                )
                            }
                        </div>
                    )}
                    <div className="flex justify-center items-center">
                        <Dot size={18}/>
                        Bath
                        <p className="ml-2">
                            {
                                property.bathrooms
                            }
                        </p>
                    </div>

                    <div className="flex grow justify-center items-center">
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
                    className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4 items-center space-x-2 py-2 justify-between">
                    <Link
                        className={'py-1.5 px-5 rounded-full hover:bg-black hover:text-white text-sm border '}
                        href={property.offeringType ? `/properties/${property.offeringType.slug}/${property.slug}` : "#"}>
                        View Property
                    </Link>
                    <p className={'text-lg font-semibold'}>
                        {
                            currencyConverter(parseInt(property.price))
                        }
                    </p>
                </div>
            </div>

        </div>
    );
}

export default PropertyCard;