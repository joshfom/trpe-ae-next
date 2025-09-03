import React from 'react';
import { getFeaturedPropertyAction } from "@/actions/properties/get-featured-property-action";
import { ImageSwiper } from "@/features/properties/components/ImageSwiper";
import currencyConverter from "@/lib/currency-converter";
import Link from "next/link";

interface FeaturedPropertyServerProps {
    offeringType: string;
}

export default async function FeaturedPropertyServer({ offeringType }: FeaturedPropertyServerProps) {
    try {
        const data = await getFeaturedPropertyAction(offeringType, '1');
        const property = data && Array.isArray(data) && data.length > 0 ? data[0] : null;
        
        if (!property) {
            return (
                <div className={'col-span-4 text-white pr-8 flex-1 flex gap-8 py-6'}>
                    <div className="relative justify-between w-full mx-auto h-96 rounded-lg p-8 ml-12">
                        <div className={'w-full h-full flex justify-center items-center'}>
                            <p className="text-white/60">No featured properties available</p>
                        </div>
                    </div>
                </div>
            );
        }

        // Extract images
        const propertyImages = property.images && property.images.length > 0 
            ? property.images
                .map((image: { s3Url: string | null }) => image.s3Url)
                .filter((url: string | null): url is string => url !== null)
            : [];

        // Compute values
        const computedValues = {
            size: property?.size ? `${(Number(property.size) / 100).toLocaleString()} sq.ft` : null,
            price: currencyConverter(property?.price ? Number(property.price) : null),
            propertyUrl: `/properties/${property?.offeringType?.slug}/${property.slug}`
        };

        return (
            <div className={'col-span-4 text-white pr-8 flex-1 flex gap-8 py-6'}>
                <div className=" relative justify-between w-full mx-auto h-96 rounded-lg p-8 ml-12">
                    <div className={'space-y-4'}>
                        <div className="h-96">
                            <ImageSwiper images={propertyImages} className={''}/>
                        </div>
                        <div className={'space-y-2'}>
                            <Link href={computedValues.propertyUrl}
                                  className="text-xl text-white">
                                {property?.title}
                            </Link>
                            <div className="flex justify-between">
                                <p>
                                    {computedValues?.size}
                                </p>
                                <p className={'text-xl '}>
                                    {computedValues?.price}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching featured property:', error);
        return (
            <div className={'col-span-4 text-white pr-8 flex-1 flex gap-8 py-6'}>
                <div className="relative justify-between w-full mx-auto h-96 rounded-lg p-8 ml-12">
                    <div className={'w-full h-full flex justify-center items-center'}>
                        <p className="text-white/60">Error loading featured property</p>
                    </div>
                </div>
            </div>
        );
    }
}
