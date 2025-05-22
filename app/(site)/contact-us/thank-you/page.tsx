import React from 'react';
import {MapPin, MessageCircle, Phone} from "lucide-react";
import Head from 'next/head';

function ThankYouPage() {
    return (
        <div className={'bg-black'}>
            <Head>
                <script async src="https://www.googletagmanager.com/gtag/js?id=AW-11470392777"></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'AW-11470392777');
                        `,
                    }}
                />
            </Head>

            <div className="bg-black py-12 hidden lg:block"></div>

            <div className="py-12 bg-black text-white lg:py-24 max-w-7xl px-6 mx-auto flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2">
                    <h1 className="text-2xl font-semibold">
                        Thank you for contacting us!
                    </h1>
                    <p className="pt-4">
                        We have received your message and will get back to you as soon as possible.
                    </p>
                    <p className="pt-2">
                        Our team of expert professionals is a call or message away to assist you. Whether you’re looking to buy, sell, invest, or start a rewarding career, TRPE is your gateway to success.
                    </p>
                </div>

                <div className={'px-6 w-full lg:w-1/2'}>
                    <h3 className="text-2xl font-semibold">
                        Our Offices
                    </h3>

                    <div className={'space-y-3'}>
                        <h4 className="text-xl font-semibold pt-4">
                            TRPE Real Estate Dubai
                        </h4>
                        <div className="flex items-center space-x-2">
                            <MapPin size={22} className={'stroke-1'} />
                            <p className="text-sm">
                                Office 1001, Ascott Park Place, Sheikh Zayed Road, Dubai, UAE
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone size={20} className={'stroke-1'} />
                            <a href={'tel:+971 42 286 623'} className="text-sm">
                                +971 4 228 6623
                            </a>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MessageCircle size={20} className={'stroke-1'} />
                            <a href={'https://wa.me/971505232712'} className="text-sm">
                                +971 50 523 2712
                            </a>
                        </div>
                        <div className={'pt-3 flex justify-end'}>
                            <a
                                className={'bg-black rounded-3xl group bg-transparent border border-white hover:bg-white hover:text-black text-white inline-flex py-2 items-center px-6'}
                                target={'_blank'}
                                href={'https://maps.app.goo.gl/Br6ujctqhrWGxPNHA'}
                            >
                                <MapPin size={20} className={'stroke-1 group-hover:text-black text-white mr-2'} />
                                View on Map
                            </a>
                        </div>
                    </div>
                    <div className={'space-y-3 pt-6'}>
                        <h4 className="text-xl font-semibold pt-4">
                            TRPE Real Estate London
                        </h4>
                        <div className="flex items-center space-x-2">
                            <MapPin size={22} className={'stroke-1'} />
                            <p className="text-sm">
                                18 Bouverie Place, Paddington, W2 1RD, London, UK
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone size={20} className={'stroke-1'} />
                            <a href={'tel:+44 207 723 2393'} className="text-sm">
                                +44 207 723 2393
                            </a>
                        </div>

                        <div className={'pt-3 flex justify-end'}>
                            <a
                                className={'bg-black rounded-3xl group bg-transparent border border-white items-center hover:bg-white hover:text-black text-white inline-flex py-2 px-6'}
                                target={'_blank'}
                                href={'https://maps.app.goo.gl/s4K2oZAto3dE72qs6'}
                            >
                                <MapPin size={20} className={'stroke-1 group-hover:text-black text-white mr-2'} />
                                View on Map
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThankYouPage;