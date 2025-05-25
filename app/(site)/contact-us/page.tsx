import React, { Suspense } from 'react';
import {MapPin, MessageCircle, Phone} from "lucide-react";
import type {Metadata} from "next";
import dynamic from "next/dynamic";

// Dynamic import for ContactForm to improve initial page load
const ContactForm = dynamic(() => import("@/features/site/components/ContactForm"), {
    loading: () => (
        <div className="bg-white rounded-lg shadow-lg p-8 animate-pulse">
            <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-24 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded w-1/4"></div>
            </div>
        </div>
    )
});

export const metadata: Metadata = {
    title: "Contact Us | Dubai Real Estate - TRPE AE",
    description: "Contact Dubai property experts for personalised guidance and support. Reach out to us today for your real estate inquiries!",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/contact-us`,
    },
};


function ContactPage() {

    const  contactJsonLD = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "TRPE Real Estate",
        "url": "https://trpe.ae/",
        "logo": "https://trpe.ae/logo.png",
        "image": "https://trpe.ae/logo.png",
        "description": "TRPE Real Estate is a leading real estate agency in Dubai. We specialize in buying, selling, and renting properties in Dubai. Our team of expert professionals is a call or message away to assist you. Whether you’re looking to buy, sell, invest, or start a rewarding career, TRPE is your gateway to success.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Office 1001, Ascott Park Place, Sheikh Zayed Road",
            "addressLocality": "Dubai",
            "addressRegion": "Dubai",
            "postalCode": "00000",
            "addressCountry": "AE"
        },
        "telephone": "+971 4 228 6623",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+971 50 523 2712",
            "contactType": "customer service"
        }
    }

    return (
        <div className={''}>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLD) }}
            />


           <div className="bg-black py-12 hidden lg:block">

           </div>

            <div className="py-12  lg:py-36 max-w-7xl px-6 mx-auto flex flex-col lg:flex-row gap-8">
                <div className="w-full bg-white p-6 lg:w-1/2 rounded-2xl">
                    <h1 className="text-2xl font-semibold">
                        Get in touch
                    </h1>
                    <p className="pt-4">
                        Ready to explore the best opportunities in Dubai’s real estate market? Contact your TRPE
                        Property Consultant today.
                    </p>
                    <p className="pt-2">
                        Our team of expert professionals is a call or message away to assist you. Whether you’re looking to buy, sell, invest, or start a rewarding career, TRPE is your gateway to success.
                    </p>
                   <ContactForm />
                </div>

                <div className={'px-6 w-full lg:w-1/2 p-6  lg:p-12'}>
                    <h3 className="text-2xl font-semibold">
                        Our Offices
                    </h3>

                    <div className={'space-y-3'}>
                        <h4 className="text-xl font-semibold pt-4">
                            TRPE Real Estate Dubai
                        </h4>
                        <div className="flex items-center space-x-2">
                            <MapPin size={22} className={'stroke-1'}/>
                            <p className="text-sm">
                                Office 1001, Ascott Park Place, Sheikh Zayed Road, Dubai, UAE
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone size={20} className={'stroke-1'}/>
                            <a href={'tel:+971 42 286 623'} className="text-sm">
                                +971 4 228 6623
                            </a>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MessageCircle size={20} className={'stroke-1'}/>
                            <a href={'https://wa.me/971505232712'} className="text-sm">
                                +971 50 523 2712
                            </a>
                        </div>
                        <div className={'pt-3 flex justify-end'}>
                            <a
                                className={'bg-slate-900 rounded-3xl group  border border-white items-center hover:bg-slate-800  text-white inline-flex py-2 px-6'}
                                target={'_blank'}
                                href={'https://maps.app.goo.gl/Br6ujctqhrWGxPNHA'}
                            >
                                <MapPin size={20} className={'stroke-1  text-white mr-2'}/>
                                View on Map
                            </a>
                        </div>
                    </div>
                    <div className={'space-y-3 pt-6'}>
                        <h4 className="text-xl font-semibold pt-4">
                            TRPE Real Estate London
                        </h4>
                        <div className="flex items-center space-x-2">
                            <MapPin size={22} className={'stroke-1'}/>
                            <p className="text-sm">
                                18 Bouverie Place, Paddington, W2 1RD, London, UK
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone size={20} className={'stroke-1'}/>
                            <a href={'tel:+44 207 723 2393'} className="text-sm">
                                +44 207 723 2393
                            </a>
                        </div>

                        <div className={'pt-3 flex justify-end'}>
                            <a
                                className={'bg-slate-900 rounded-3xl group  border border-white items-center hover:bg-slate-800  text-white inline-flex py-2 px-6'}
                               target={'_blank'}
                               href={'https://maps.app.goo.gl/s4K2oZAto3dE72qs6'}
                            >
                                <MapPin size={20} className={'stroke-1  text-white mr-2'}/>
                                View on Map
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ContactPage;