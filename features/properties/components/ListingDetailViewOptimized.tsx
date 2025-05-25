'use client'
import React, { useCallback, useMemo } from 'react';
import {Button} from "@/components/ui/button";
import {Bath, Bed, MapPin, Phone, Share} from "lucide-react";
import Link from "next/link";
import "swiper/css";
import 'swiper/css/pagination';
import currencyConverter from "@/lib/currency-converter";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ShareSocial} from "react-share-social";
import {usePathname} from 'next/navigation'
import unitConverter from "@/lib/unit-converter";
import {ImageSwiperOptimized} from "@/features/properties/components/ImageSwiperOptimized";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import {Zoom} from "yet-another-react-lightbox/plugins";
import RequestCallBack from "@/features/site/components/RequestCallBack";
import {useMediaQuery} from "react-responsive";
import PropSize from '@/components/ui/icons/PropSize';
import { PropertyType } from "@/types/property";

interface ListingDetailViewProps {
    property: PropertyType
}

const ListingDetailViewOptimized = React.memo<ListingDetailViewProps>(({property}) => {
    const [viewGallery, setViewGallery] = React.useState(false);
    const pathname = usePathname();
    
    // Memoized values for better performance
    const currentUrl = useMemo(() => {
        if (typeof window !== 'undefined') {
            return window.location.href;
        }
        return '#';
    }, [pathname]);

    const isForSale = useMemo(() => 
        property?.offeringType?.slug === 'for-sale', 
        [property?.offeringType?.slug]
    );

    const propertySlugType = useMemo(() => 
        property?.type?.slug || 'residential', 
        [property?.type?.slug]
    );

    const formattedPrice = useMemo(() => 
        currencyConverter(property?.price ? parseFloat(property.price) : null), 
        [property?.price]
    );

    const formattedSize = useMemo(() => 
        unitConverter(property?.size), 
        [property?.size]
    );

    const displayBedrooms = useMemo(() => 
        property?.type?.slug !== 'commercial' && property?.bedrooms, 
        [property?.type?.slug, property?.bedrooms]
    );

    const displayBathrooms = useMemo(() => 
        property?.type?.slug !== 'commercial' && property?.bathrooms, 
        [property?.type?.slug, property?.bathrooms]
    );

    const agentLink = useMemo(() => 
        `/agents/${property?.agent?.slug}`, 
        [property?.agent?.slug]
    );

    const communityLink = useMemo(() => 
        `/communities/${property?.community?.slug}`, 
        [property?.community?.slug]
    );

    // Memoized lightbox images
    const lightboxImages = useMemo(() => 
        property?.images?.map((image: PropertyImagesType) => ({
            src: image.crmUrl,
            alt: property.title,
            title: property.title
        })) || [], 
        [property?.images, property?.title]
    );

    // Memoized callbacks
    const handleViewGallery = useCallback(() => {
        setViewGallery(true);
    }, []);

    const handleCloseGallery = useCallback(() => {
        setViewGallery(false);
    }, []);

    const lightboxPlugins = useMemo(() => [Captions, Zoom], []);

    // Lightbox configuration
    const lightboxConfig = useMemo(() => ({
        animation: { 
            fade: 500,
            swipe: 500 
        },
        zoom: {
            maxZoomPixelRatio: 1,
            zoomInMultiplier: 2,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            doubleClickMaxStops: 2,
            keyboardMoveDistance: 50,
            wheelZoomDistanceFactor: 100,
            pinchZoomDistanceFactor: 100,
            scrollToZoom: false,
        }
    }), []);

    const shareStyle = useMemo(() => ({
        root: {
            background: 'transparent',
            borderRadius: 3,
            border: 0,
            color: 'white',
            height: 'auto',
            maxWidth: '300px'
        },
        copyContainer: {
            border: '1px solid blue',
            background: 'rgb(0,0,0,0.7)'
        },
        title: {
            color: 'aquamarine',
            fontStyle: 'italic'
        }
    }), []);

    // Early return if no property
    if (!property) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-gray-500">Property not found</div>
            </div>
        );
    }

    const {
        title,
        community,
        slug,
        images,
        agent,
        price,
        size,
        bedrooms,
        bathrooms,
        description,
        referenceNumber,
        city,
        offeringType,
        type
    } = property;

    return (
        <div>
            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Image Gallery */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <ImageSwiperOptimized 
                                images={images || []} 
                                onViewGallery={handleViewGallery}
                                propertyName={title}
                            />
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                {title}
                            </h1>
                            
                            <div className="flex items-center text-gray-600 mb-4">
                                <MapPin className="w-4 h-4 mr-1" />
                                <Link 
                                    href={communityLink} 
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    {community?.name}, {city?.name}
                                </Link>
                            </div>

                            <div className="text-3xl font-bold text-green-600 mb-4">
                                {formattedPrice}
                                {!isForSale && <span className="text-lg font-normal text-gray-600">/year</span>}
                            </div>

                            <div className="flex items-center space-x-4 text-gray-700 mb-6">
                                {displayBedrooms && (
                                    <div className="flex items-center">
                                        <Bed className="w-4 h-4 mr-1" />
                                        <span>{bedrooms}</span>
                                    </div>
                                )}
                                {displayBathrooms && (
                                    <div className="flex items-center">
                                        <Bath className="w-4 h-4 mr-1" />
                                        <span>{bathrooms}</span>
                                    </div>
                                )}
                                {size && (
                                    <div className="flex items-center">
                                        <PropSize className="w-4 h-4 mr-1" />
                                        <span>{formattedSize}</span>
                                    </div>
                                )}
                            </div>

                            <div className="text-sm text-gray-600 mb-6">
                                <span className="font-semibold">Ref: </span>
                                {referenceNumber}
                            </div>
                        </div>

                        {/* Agent Info */}
                        {agent && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-3 mb-3">
                                    {agent.avatarUrl && (
                                        <img 
                                            src={agent.avatarUrl} 
                                            alt={`${agent.firstName} ${agent.lastName}`}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <Link 
                                            href={agentLink}
                                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                        >
                                            {agent.firstName} {agent.lastName}
                                        </Link>
                                        <p className="text-sm text-gray-600">Real Estate Agent</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    {agent.phone && (
                                        <a 
                                            href={`tel:${agent.phone}`}
                                            className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call Agent
                                        </a>
                                    )}
                                    
                                    <RequestCallBack 
                                        itemUrl={currentUrl}
                                        itemType="property"
                                        agentName={`${agent.firstName} ${agent.lastName}`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Share Button */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <Share className="w-4 h-4 mr-2" />
                                    Share Property
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <ShareSocial 
                                    url={currentUrl}
                                    socialTypes={['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'email']}
                                    style={shareStyle}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Property Description */}
                {description && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Property Description
                        </h2>
                        <div 
                            className="prose max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </div>
                )}
            </div>

            {/* Lightbox Gallery */}
            <Lightbox
                open={viewGallery}
                close={handleCloseGallery}
                slides={lightboxImages}
                plugins={lightboxPlugins}
                {...lightboxConfig}
            />
        </div>
    );
});

ListingDetailViewOptimized.displayName = 'ListingDetailViewOptimized';

export default ListingDetailViewOptimized;
