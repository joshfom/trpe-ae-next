"use client"
import React from 'react';
import {ArrowRight} from "lucide-react";
import {ImageSwiper} from "@/features/properties/components/ImageSwiper";
import {useGetFeaturedProperty} from "@/features/properties/api/use-get-featured-property";
import unitConverter from "@/lib/unit-converter";
import currencyConverter from "@/lib/currency-converter";
import Link from "next/link";

interface MenuFeaturedPropertyProps {
    offeringType: string;
}

function MenuFeaturedProperty({offeringType}: MenuFeaturedPropertyProps) {
    const [propertyImages, setPropertyImages] = React.useState<string[]>([]);
    const slug = offeringType.replace("/properties/", "");
    const {data: property, isLoading} = useGetFeaturedProperty(slug);

    React.useEffect(() => {
        if (property && property.images.length) {
            // Filter out any null values
            setPropertyImages(property.images
                .map((image: { s3Url: string | null }) => image.s3Url)
                .filter((url: string | null): url is string => url !== null)
            )
        }
    }, [property])

    return (
        <div className={'col-span-4 text-white pr-8 flex-1 flex gap-8  py-6'}>
            <div className=" relative justify-between w-full mx-auto h-96 rounded-lg p-8 ml-12">
                {
                    isLoading ? (
                        <div className={'w-full h-full flex justify-center items-center'}>
                            <svg className={'animate-pulse'} width="74" height="128" viewBox="0 0 38 64" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.131492 0L0 45.1067L19.0532 64L38 45.2123V0H0.131492ZM32.6904 33.5274H28.9962L32.4274 36.9298V44.3803L27.2243 49.546V33.397H21.708V54.3516L18.7903 57.2449L15.9789 54.4571V28.2375H27.0176V22.6496H10.9824V50.5208L5.34718 44.9329V17.7074H16.1793V12.1195H5.34718V6.46953H32.1832V12.1195H21.8082V17.7074H32.6403L32.6904 33.5274Z"
                                    fill="white"></path>
                            </svg>
                        </div>
                    ) : (
                        <div className={'space-y-4'}>
                            <div className="h-96">
                                <ImageSwiper images={propertyImages} className={''}/>
                            </div>
                            <div className={'space-y-2'}>
                                {
                                    property &&
                                    <Link href={`/properties/${property?.offeringType?.slug}/${property.slug}`}
                                          className="text-xl text-white">
                                        {property?.title}
                                    </Link>
                                }
                                <div className="flex justify-between">
                                    <p>
                                        {
                                            property && unitConverter(property?.size ? Number(property.size) : null)
                                        }
                                    </p>
                                    <p className={'text-xl '}>
                                        {
                                            property && currencyConverter(property?.price ? Number(property.price) : null)
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>

        </div>
    );
}

export default MenuFeaturedProperty;