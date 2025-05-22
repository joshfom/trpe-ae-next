'use client'
import React, {useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {Bath, Bed, MapPin, Phone, Share} from "lucide-react";
import Link from "next/link";
import "swiper/css";
import 'swiper/css/pagination';
import currencyConverter from "@/lib/currency-converter";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ShareSocial} from "react-share-social";
import {usePathname, useSearchParams} from 'next/navigation'
import unitConverter from "@/lib/unit-converter";
import {ImageSwiper} from "@/features/properties/components/ImageSwiper";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import {Zoom} from "yet-another-react-lightbox/plugins";
import RequestCallBack from "@/features/site/components/RequestCallBack";
import {useMediaQuery} from "react-responsive";
import PropSize from '@/components/ui/icons/PropSize';

interface ListingDetailViewProps {
    property: PropertyType
    // propertySlug: string
}

function ListingDetailView({property}: ListingDetailViewProps) {
    const [viewGallery, setViewGallery] = React.useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [animationDuration, setAnimationDuration] = React.useState(500);
    const [maxZoomPixelRatio, setMaxZoomPixelRatio] = React.useState(1);
    const [zoomInMultiplier, setZoomInMultiplier] = React.useState(2);
    const [doubleTapDelay, setDoubleTapDelay] = React.useState(300);
    const [doubleClickDelay, setDoubleClickDelay] = React.useState(300);
    const [doubleClickMaxStops, setDoubleClickMaxStops] = React.useState(2);
    const [keyboardMoveDistance, setKeyboardMoveDistance] = React.useState(50);
    const [propertySlugType, setPropertyType] = React.useState('residential');
    const [isForSale, setIsForSale] = React.useState(true);
    const [currentUrl, setCurrentUrl] = React.useState('#');
    const [wheelZoomDistanceFactor, setWheelZoomDistanceFactor] =
        React.useState(100);
    const [pinchZoomDistanceFactor, setPinchZoomDistanceFactor] =
        React.useState(100);
    const [scrollToZoom, setScrollToZoom] = React.useState(false);

    const {
        title,
        community,
        slug,
        city,
        subCommunity,
        size,
        offeringType,
        images,
        agent,
        referenceNumber,
        description,
        bedrooms,
        price, propertyType, bathrooms} = property;

    const imageUrls = images.map(image => image.s3Url);

    const [shareDirection, setShareDirection] = React.useState<'left' | 'bottom' | 'top' | 'right'>('left');

    const isMobileOrTablet = useMediaQuery({ query: '(max-width: 1024px)' });

    const whatsappLink = `https://wa.me/971505232712?text=${encodeURIComponent(
        `Hi,\n\nI would like to know more about ${bedrooms || 'a'} bedroom ${property.title || 'property'} listed on **trpe.ae**.\n\nRef: *${referenceNumber || 'N/A'}*\n\nProperty Url: https://trpe.ae/properties/${offeringType?.slug || ''}/${slug || ''}`
    )}`;

    useEffect(() => {
        //if property type contains commercial
        if (offeringType.slug?.toLowerCase().includes('commercial')) {
            setPropertyType('commercial');
        }
        //if property type contains rent
        if (offeringType.slug?.toLowerCase().includes('rent')) {
            setIsForSale(false);
        }
    }, [propertyType]);

    //@ts-ignore
    const mailtoLink = `mailto:info@trpe.ae?subject=New%20Inquiry%20for%20${encodeURIComponent(referenceNumber)}%20property%20on%20trpe.ae&body=Hi%20${encodeURIComponent(agent?.firstName)},%0A%0AI%20would%20like%20to%20know%20more%20about%20${encodeURIComponent(bedrooms)}%20bedroom%20${encodeURIComponent(title)}%20${encodeURIComponent(property?.offeringType.name)}%20listed%20on%20trpe.ae%20for%20${encodeURIComponent(currencyConverter(price))}.%0A%0ARef%3A%20${encodeURIComponent(referenceNumber)}*%0A%0AProperty%20Url%3A%20https%3A%2F%2Ftrpe.ae%2Fproperties%2F${encodeURIComponent(offeringType.slug)}%2F${encodeURIComponent(slug)}`;

    useEffect(() => {
        // Only update URL on client side
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href)
        }
    }, [pathname, searchParams])


    useEffect(() => {
        if (isMobileOrTablet) {
            setShareDirection('bottom')
        } else {
            setShareDirection('left')
        }
    }, [isMobileOrTablet]);


    return (
        <div className={'py-8 px-6 max-w-7xl mx-auto'}>


            <div className={'lg:pt-4 pb-4 px-6'}>
                <h1 className="text-xl lg:text-4xl text-center font-semibold mb-4">
                    {title}
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white py-2 px-6 rounded-2xl items-center mb-4">
                <div className="space-x-3">
                    <Link href={`/properties/${offeringType?.slug}`} className="text-gray-600 underline">
                        {
                            offeringType?.name
                        }
                    </Link>
                    <Link href={`/dubai/properties/${propertySlugType}/${isForSale ? 'for-sale' : 'for-rent'}/area-${community.slug}`} className="text-gray-600 underline">
                        {
                            community.name
                        }
                    </Link>
                    <span className="text-gray-600 underline">
                            {
                                city.name
                            }
                        </span>
                </div>

                <div>
                    <Popover>
                        <PopoverTrigger className={'inline-flex border-b group pb-1 hover:border-[#F15A29]'}>
                            <Share size={20} className={'mr-2 group-hover:text-[#F15A29]'}/>
                            <span className={'group-hover:text-[#F15A29]'}>
                    Share
                  </span>
                        </PopoverTrigger>
                        <PopoverContent
                            align={'center'}
                            side={shareDirection}
                            className={'bg-white shadow-lg border rounded-3xl max-w-[280px] overflow-hidden'}>

                            <ShareSocial
                                url={`${currentUrl}`}
                                socialTypes={['whatsapp', 'telegram', 'facebook', 'twitter', 'email', 'reddit', 'linkedin']}
                            />
                        </PopoverContent>
                    </Popover>

                </div>
            </div>


            <div className={'hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-1 rounded-lg overflow-hidden'}>
                <div className={'col-span-1 lg:col-span-2 relative h-[300px] lg:h-[604px]'}>
                    <img 
                        onClick={() => setViewGallery(true)}
                        className={'w-full rounded-lg overflow-hidden h-full object-cover absolute top-0 left-0'}
                        src={images[1]?.s3Url || '/images/defaults/property.jpg'}
                        alt="Property image"
                    />
                    <div className={'absolute bottom-4 left-4'}>

                        <div className={'pt-6'}>
                            <Button onClick={() => setViewGallery(true)} className={'bg-black/70 border-0 text-white'} variant={'outline'}>
                                View Gallery
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={'col-span-1 grid gap-1'}>
                    <div className={'relative rounded-lg overflow-hidden h-[150px] lg:h-[300px]'}>
                        <img 
                            onClick={() => setViewGallery(true)}  
                            className={'w-full object-cover h-full absolute top-0 left-0'}
                            src={images[2]?.s3Url || '/images/defaults/property.jpg'}
                            alt="Property image"
                        />
                    </div>
                    <div className={'h-[150px] lg:h-[300px] rounded-lg overflow-hidden relative'}>
                        <img 
                            onClick={() => setViewGallery(true)}  
                            className={'w-full object-cover h-full absolute top-0 left-0'}
                            src={images[3]?.s3Url || '/images/defaults/property.jpg'}
                            alt="Property image"
                        />
                    </div>
                </div>
            </div>

            <div className="lg:hidden relative">
                {
                    images.length > 0 && (
                        <div className="h-[430px]">
                            <ImageSwiper images={imageUrls}/>
                        </div>
                    )
                }
                <div className={'pt-3'}>
                    <Button onClick={() => setViewGallery(true)} className={'py-1 text-sm'} variant={'outline'}>
                        View Gallery
                    </Button>
                </div>

            </div>

            <div className={'grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8'}>

                <div className="col-span-1 lg:col-span-2">
                    <div className="bg-white p-6 rounded-2xl">
                        <div className={'flex flex-wrap gap-6'}>
                            {
                                bedrooms > 0 && (
                                    <div className={'flex items-center'}>
                                        <Bed className={'w-6 stroke-1 h-6 mr-2'}/>
                                        {bedrooms}
                                    </div>
                                )
                            } {
                            bathrooms > 0 && (
                                <div className={'flex items-center'}>
                                    <Bath className={'w-6 stroke-1 h-6 mr-2'}/>
                                    {bathrooms}
                                </div>
                            )
                        }
                            <div className={'flex items-center'}>
                                <PropSize className={' w-5 h-5 mr-2'} />
                                {
                                    unitConverter(size / 100) + ' '
                                }
                            </div>

                            <div>
                                Ref: <br className={'lg:hidden'} />
                                {
                                    ' ' + referenceNumber
                                }
                            </div>
                        </div>
                        <div className="py-4  flex items-center ">
                            <MapPin  className={'w-6 stroke-1 h-6 mr-2'}/>
                            {
                                `${subCommunity?.name && subCommunity.name + ","} ${community.name}, ${city.name}`
                            }
                        </div>
                        <div className={'space-y-3 pb-12'}>
                            <h2 className={'text-2xl font-semibold mt-6'}>
                                Description
                            </h2>
                            <div dangerouslySetInnerHTML={{__html: description}} className="py-3">

                            </div>
                        </div>
                    </div>


                    <div className="py-6 px-6 lg:pt-12">
                        <h3 className={'text-2xl'}>Popular Searches</h3>
                        <ul className={'space-y-1 flex flex-col mt-4'}>
                            <li>
                                <Link href={`/dubai/properties/${propertySlugType}/${isForSale ? 'for-sale' : 'for-rent'}/area-${community.slug}`} className={'hover:text-blue-600 hover:underline py-1'}>
                                    {
                                        `Properties ${offeringType.name}  in ${community.name}`
                                    }
                                </Link>
                            </li>
                            <li>
                                <Link href={`/dubai/properties/${propertySlugType}/${isForSale ? 'for-sale' : 'for-rent'}/property-type-apartments/area-${community.slug}`} className={'hover:text-blue-600 hover:underline py-1'}>
                                    {
                                        `Apartments ${offeringType.name}  in ${community.name}`
                                    }
                                </Link>
                            </li>
                            <li>
                                <Link href={`/dubai/properties/${propertySlugType}/${isForSale ? 'for-sale' : 'for-rent'}/property-type-townhouses/area-${community.slug}`} className={'hover:text-blue-600 hover:underline py-1'}>
                                    {
                                        `Townhouses ${offeringType.name}  in ${community.name}`
                                    }
                                </Link>
                            </li>
                            <li>
                                <Link href={`/dubai/properties/${propertySlugType}/${isForSale ? 'for-sale' : 'for-rent'}/property-type-villa/area-${community.slug}`} className={'hover:text-blue-600 hover:underline py-1'}>
                                    {
                                        `Villas ${offeringType.name}  in ${community.name}`
                                    }
                                </Link>
                            </li>
                            <li>
                                <Link href={`/dubai/properties/${propertySlugType}/${isForSale ? 'for-sale' : 'for-rent'}/property-type-penthouse/area-${community.slug}`} className={'hover:text-blue-600 hover:underline py-1'}>
                                    {
                                        `Penthouses ${offeringType.name}  in ${community.name}`
                                    }
                                </Link> </li>
                            <li>
                                <Link href={`/dubai/properties/commercial/${offeringType.slug}/property-type-offices/area-${community.slug}`} className={'hover:text-blue-600 hover:underline py-1'}>
                                    {
                                        `Offices ${offeringType.name}  in ${community.name}`
                                    }
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>
                <div className="col-span-1 relative  sm:px-4 lg:px-0">
                    <div className="lg:sticky lg:top-32 rounded-2xl p-6 space-y-8 bg-black shadow-md text-white">
                        <p className={'text-sm '}>
                            <span className='py-1 px-4 rounded-full border'>
                            {
                                offeringType.name
                            }
                            </span>
                           
                        </p>
                        <h3 className="text-2xl font-semibold mt-6">
                            {
                                currencyConverter(parseInt(price))
                            }
                        </h3>

                        <div className="flex items-center">
                            {
                                //if property agent not null
                                agent &&(
                                    <>
                                        <div className={''}>
                                            <Link href={`/our-team/${agent?.slug}`} aria-label={'agent image'}>
                                    <span className="sr-only">
                                        Agent Image
                                    </span>
                                                <img

                                                    className={' rounded-full  object-cover w-[90ox] h-[90px]'}
                                                    src={agent?.avatarUrl || '/images/defaults/agent.jpg'}
                                                    alt={property.title}/>
                                            </Link>
                                        </div>
                                        <div className={'space-y-2 ml-4'}>
                                            <Link href={`/our-team/${agent?.slug}`}
                                                  className={'text-lg font-semibold'}>
                                                {
                                                    agent?.firstName ? agent.firstName + ' ' + agent?.lastName : 'TRPE Team'
                                                }
                                            </Link>
                                            <p className={'text-sm'}>
                                                Property Consultant
                                            </p>
                                            <p className={'text-sm text-white'}>
                                                BRN: {agent?.rera}
                                            </p>
                                        </div>
                                    </>
                                )
                            }


                        </div>
                        <div className=" space-y-6">
                            <RequestCallBack
                                agentName={agent?.firstName}
                                itemUrl={currentUrl}
                                itemType={'Property'}
                            />




                            <div>
                                <p className={'text-center'}>Need immediate assistance?</p>
                                <div className="flex flex-col lg:flex-row justify-between gap-6 items-center pt-4">
                                    <div className="w-full lg:w-1/2 ">
                                        <a className={'py-2 w-full items-center justify-center rounded-full border group hover:bg-white hover:text-black inline-flex'}
                                           href={`tel:${agent?.phone}`}>
                                            <Phone size={24}
                                                   className={'stroke-1 group-hover:text-black text-white mr-2'}/>
                                            Call
                                        </a>
                                    </div>



                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>


            <Lightbox
                open={viewGallery}
                plugins={[Captions, Zoom]}
                close={() => setViewGallery(false)}
                zoom={{
                    maxZoomPixelRatio,
                    zoomInMultiplier,
                    doubleTapDelay,
                    doubleClickDelay,
                    doubleClickMaxStops,
                    keyboardMoveDistance,
                    wheelZoomDistanceFactor,
                    pinchZoomDistanceFactor,
                    scrollToZoom,
                }}
                slides={images.map(image => ({
                    src: image.s3Url,
                    title: title,
                    description: `${bedrooms} Bedrooms, ${bathrooms} Bathrooms, ${unitConverter(size)}`
                }))}
            />
        </div>
    );
}

export default ListingDetailView;