'use client'
import React, { memo, useEffect, useCallback } from 'react';
import {Button} from "@/components/ui/button";
import {Share} from "lucide-react";
import Link from "next/link";
import "swiper/css";
import 'swiper/css/pagination';
import currencyConverter from "@/lib/currency-converter";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ShareSocial} from "react-share-social";
import {usePathname, useSearchParams} from 'next/navigation'
import {ImageSwiper} from "@/features/properties/components/ImageSwiper";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import {Zoom} from "yet-another-react-lightbox/plugins";
import {useGetOffplanFaqsV2} from "@/features/admin/page-meta/api/use-get-offplan-faqs-v2";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import OffplanContactForm from "@/features/offplans/components/OffplanContactForm";
import { TipTapEditor } from '@/components/TiptapEditor';
import {TipTapView} from "@/components/TiptapView";
import Image from "next/image";


interface ProjectDetailViewProps {
    project: ProjectType
    // projectSlug: string
}

const ProjectDetailView = memo<ProjectDetailViewProps>(({project}) => {
    const [viewGallery, setViewGallery] = React.useState(false)
    const [openDialog, setOpenDialog] = React.useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [maxZoomPixelRatio, setMaxZoomPixelRatio] = React.useState(1);
    const [zoomInMultiplier, setZoomInMultiplier] = React.useState(2);
    const [doubleTapDelay, setDoubleTapDelay] = React.useState(300);
    const [doubleClickDelay, setDoubleClickDelay] = React.useState(300);
    const [doubleClickMaxStops, setDoubleClickMaxStops] = React.useState(2);
    const [keyboardMoveDistance, setKeyboardMoveDistance] = React.useState(50);
    const [currentUrl, setCurrentUrl] = React.useState('#');

    const [dialogTitle, setDialogTitle] = React.useState('Floor Plan');

    const faqsQuery = useGetOffplanFaqsV2(project.id)
    const faqs = faqsQuery.data
    const isLoading = faqsQuery.isLoading

    const [wheelZoomDistanceFactor, setWheelZoomDistanceFactor] =
        React.useState(100);
    const [pinchZoomDistanceFactor, setPinchZoomDistanceFactor] =
        React.useState(100);
    const [scrollToZoom, setScrollToZoom] = React.useState(false);

    const imageUrls = project.images.map(image => image.url);


    //request floor plan funtion
    const requestFloorPlan = () => {
        setOpenDialog(true)
        setDialogTitle('Floor Plan')
    }


    //request brochure function
    const requestBrochure = () => {
        setOpenDialog(true)
        setDialogTitle('Brochure')
    }

    const whatsappLink = `https://wa.me/971505232712?text=${encodeURIComponent(
        `Hi,\n\nI would like to know more about ${project.name} by ${project.developer?.name || 'project'} listed on **trpe.ae**.\n\nRef: *${project.referenceNumber || 'N/A'}*\n\nProperty Url: https://trpe.ae/properties/${project.slug}/}`
    )}`;


    useEffect(() => {
        // Only update URL on client side
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href)
        }
    }, [pathname, searchParams])


    // Create JSON-LD schema
    // const projectJsonLd = {
    //     '@context': 'https://schema.org',
    //     '@type': 'RealEstateListing',
    //     '@id': `${process.env.NEXT_PUBLIC_URL}/properties/${project.offeringType?.slug}/${project.slug}`,
    //     name: project.title,
    //     description: project.description,
    //     price: project.price?.toLocaleString(),
    //     priceCurrency: 'AED',
    //     numberOfRooms: project.bedrooms + project.bathrooms,
    //     numberOfBedrooms: project.bedrooms,
    //     numberOfBathroomsTotal: project.bathrooms,
    //     address: {
    //         '@type': 'PostalAddress',
    //         streetAddress: project.subCommunity.title,
    //         addressLocality: project.city.name,
    //         addressCountry: 'AE',
    //     },
    //     image: project.images,
    //     offers: {
    //         '@type': 'Offer',
    //         price: project.price?.toLocaleString(),
    //         priceCurrency: 'AED',
    //     },
    //     agent: {
    //         '@type': 'RealEstateAgent',
    //         name: project.agent.firstName + ' ' + project.agent.lastName,
    //         email: project.agent.email,
    //         telephone: project.agent.phone
    //     }
    // }

    // Memoized callback functions
    const handleViewGallery = useCallback(() => {
        setViewGallery(true);
    }, []);

    const handleRequestFloorPlan = useCallback(() => {
        requestFloorPlan();
    }, []);

    const handleRequestBrochure = useCallback(() => {
        requestBrochure();
    }, []);

    const handleImageClick = useCallback(() => {
        setViewGallery(true);
    }, []);

    const handleCloseLightbox = useCallback(() => {
        setViewGallery(false);
    }, []);

    const handleDialogSubmissionComplete = useCallback(() => {
        setOpenDialog(false);
    }, []);


    return (
        <div className={'py-8 px-6 max-w-7xl mx-auto'}>

            {/*<script*/}
            {/*    type="application/ld+json"*/}
            {/*    dangerouslySetInnerHTML={{__html: JSON.stringify(projectJsonLd)}}*/}
            {/*/>*/}


            <div className="flex justify-between pt-6 items-center mb-4">
                <div className="space-x-3">
                    <Link href={`/off-plans/`} className="text-gray-600 underline">
                        Off Plans
                    </Link>
                    <Link href={`/developers/${project.developer?.slug}`} className="text-gray-600 underline">
                        {
                            project.developer.name
                        }
                    </Link>
                    <span className="text-gray-600 underline">
                            {
                                project.community.name
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
                            side={'left'}
                            className={'bg-white shadow-lg border rounded-3xl max-w-[280px] overflow-hidden'}>

                            <ShareSocial
                                url={`${currentUrl}`}
                                socialTypes={['whatsapp', 'telegram', 'facebook', 'twitter', 'email', 'reddit', 'linkedin']}
                            />
                        </PopoverContent>
                    </Popover>

                </div>
            </div>


            <div className={'hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-1 rounded-lg overflow-hidden'}>
                <div className={'flex flex-col justify-center items-center gap-3'}>
                    <h1 className="text-4xl ">
                        {project.name}
                    </h1>
                    By <Link href={`/developers/${project.developer.slug}`}>
                    <div className="h-32 w-full flex justify-center items-center relative">
                        <Image 
                            src={project.developer.logoUrl} 
                            alt={project.developer.name}
                            width={128}
                            height={128}
                            className="h-32 object-contain"
                        />
                    </div>
                </Link>
                </div>
                <div className={'col-span-1 relative h-[300px] lg:h-[550px]'}>
                    <div className="relative h-full w-full">
                        <Image 
                            onClick={handleImageClick} 
                            src={project.images[1].url} 
                            alt={project.name}
                            fill
                            className="object-cover rounded-3xl overflow-hidden cursor-pointer"
                        />
                    </div>
                </div>

            </div>

            <div className="lg:hidden relative">
                {
                    project.images.length > 0 && (
                        <div className="h-[430px]">
                            <ImageSwiper images={imageUrls}/>
                        </div>
                    )
                }
                <div className={'pt-3'}>
                    <Button onClick={handleViewGallery} className={'py-1 text-sm'} variant={'outline'}>
                        View Gallery
                    </Button>
                </div>

            </div>

            <div className="py-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
                <div>
                    Price from {' '} <span
                    className="font-semibold">{currencyConverter(parseInt(`${project.fromPrice}`))}</span>
                </div>
                <div>
                    Price upto {' '} <span
                    className="font-semibold">{currencyConverter(parseInt(`${project.toPrice}`))}</span>
                </div>

                <div>
                    Size from {' '} <span
                    className="font-semibold">{(parseInt(`${project.fromSize}`) / 100).toLocaleString()} sq.ft</span>
                </div>

                <div>
                    Size upto {' '} <span
                    className="font-semibold">{(parseInt(`${project.toSize}`) / 100).toLocaleString()} sq.ft</span>
                </div>

                <div className="">
                    Permit Number {' '} <span
                    className="font-semibold">{project.permitNumber}</span>
                </div>

            </div>
            <div className="col-span-1 lg:col-span-2 px-6 py-12">
                <div className={'flex items-center gap-6'}>

                </div>
                <div className={'space-y-3 pb-12'}>
                    <h3 className={'text-2xl font-semibold mt-6'}>
                        About {project.name}
                    </h3>
                    <div id={'tip-tap'} className="p-6 bg-white rounded-xl">
                        <TipTapView
                            content={project.about}
                        />
                    </div>
                </div>

                <div className="pb-12 space-y-3">
                    <h3 className="text-2xl font-semibold my-6">
                        Gallery
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {
                            project.images.slice(0, 6).map((image, index) => (
                                <div key={index} className={'relative'}>
                                    <Image 
                                        onClick={handleImageClick} 
                                        src={image.url} 
                                        alt={`${project.name} - image ${index+1}`}
                                        width={300}
                                        height={240}
                                        className="w-full h-60 rounded-lg object-cover cursor-pointer"
                                    />
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex justify-end space-x-6">
                        <Button
                            onClick={handleRequestFloorPlan}
                        >
                            Download Floor Plan
                        </Button>
                        <Button
                            onClick={handleRequestBrochure}
                        >
                            Download Brochure
                        </Button>
                        <Button onClick={handleViewGallery}
                                variant={'outline'}>
                            View Gallery
                        </Button>
                    </div>
                </div>



                <div className={'space-y-3 pb-12'}>
                    <h3 className={'text-2xl font-semibold mt-6'}>
                        Developer
                    </h3>
                    <div  dangerouslySetInnerHTML={{__html: project.developer.about}} className="p-3 rounded-2xl bg-white">

                    </div>
                </div>



                <div className={'space-y-3 pb-12'}>
                    {
                        faqs && faqs.length > 0 && (
                            <h3 className={'text-2xl font-semibold mt-6'}>
                                FAQs
                            </h3>
                        )
                    }
                    {
                        isLoading && <p>Loading...</p>
                    }

                    {
                        faqs && faqs.map((faq: { id: string; question: string; answer: string }, index: number) => (
                            <Accordion key={index} type="single" collapsible>
                                <AccordionItem value={faq.id}>
                                    <AccordionTrigger>
                                        <h4 className={' font-semibold'}>
                                            {faq.question}
                                        </h4>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {
                                            faq.answer
                                        }
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                        ))
                    }
                </div>




            </div>


            <Lightbox
                open={viewGallery}
                plugins={[Captions, Zoom]}
                close={handleCloseLightbox}
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
                slides={project.images.map(image => ({
                    src: image.url,
                    title: project.name,
                }))}
            />

            <Dialog
                open={openDialog}
                onOpenChange={setOpenDialog}
            >
                <DialogContent
                    className={'max-w-3xl bg-black text-white'}
                >
                    <DialogHeader>
                        <DialogTitle>Request {dialogTitle}</DialogTitle>
                        <DialogDescription>
                            <OffplanContactForm
                                submissionComplete={handleDialogSubmissionComplete}
                                projectName={project.name}
                                requestType={dialogTitle}
                            />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    );
})

export default ProjectDetailView;

ProjectDetailView.displayName = 'ProjectDetailView';