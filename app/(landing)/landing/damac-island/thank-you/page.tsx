"use client"

import React, { Suspense } from 'react';
import { Globe, Phone } from "lucide-react";
import { redirect, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function DamaIslandThankYou() {
    const searchParams = useSearchParams();
    const msg = searchParams.get('msg');

    if (!msg) {
        return redirect('/landing/damac-island');
    }

    return (
        <div className="bg-black text-white">
            <header className={'max-w-7xl mx-auto'}>
                <nav className="flex flex-col lg:flex-row items-center gap-6 justify-between w-full py-4 shadow-lg px-6 lg:px-12 mx-auto">
                    <a href={'/'} className={'text-3xl font-semibold'}>
                        DAMAC ISLAND
                    </a>
                    <div className="flex items-center space-x-6">
                        <a href={'tel:+971 50 523 2712'} className={'flex space-x-2'}>
                            <Phone size={22} className={'stroke-1'} />
                            <span className={'hover:underline font-semibold'}>+971 50 523 2712</span>
                        </a>
                        <a href={'https://wa.me/971505232712?text=I%20am%20interested%20to%20know%20more%20about%20Damac%20Island%20project'} className={'flex items-center space-x-2'}>
                            <svg className={'w-7 h-7'} xmlns="http://www.w3.org/2000/svg" fill="#fff" stroke="#fff" viewBox="0 0 256 256">
                                <path d="M128 28a100.026 100.026 0 0 0-86.885 149.54l-9.005 31.516a12 12 0 0 0 14.835 14.834l31.517-9.004A100.007 100.007 0 1 0 128 28Zm0 192a91.87 91.87 0 0 1-46.952-12.867 3.995 3.995 0 0 0-3.144-.408l-33.157 9.473a4 4 0 0 1-4.944-4.945l9.472-33.156a4.001 4.001 0 0 0-.408-3.144A92.01 92.01 0 1 1 128 220Zm50.512-73.457-20.46-11.691a12.01 12.01 0 0 0-12.127.129l-13.807 8.284a44.042 44.042 0 0 1-19.382-19.383l8.284-13.807a12.01 12.01 0 0 0 .128-12.127l-11.69-20.46A10.916 10.916 0 0 0 100 72a32.008 32.008 0 0 0-32 31.88A84.001 84.001 0 0 0 151.999 188h.12A32.008 32.008 0 0 0 184 156a10.913 10.913 0 0 0-5.488-9.457ZM152.108 180H152a76 76 0 0 1-76-76.107A23.997 23.997 0 0 1 100 80a2.9 2.9 0 0 1 2.512 1.457l11.69 20.461a4.004 4.004 0 0 1-.042 4.042l-9.39 15.648a3.999 3.999 0 0 0-.218 3.699 52.041 52.041 0 0 0 26.142 26.141 3.997 3.997 0 0 0 3.699-.218l15.647-9.39a4.006 4.006 0 0 1 4.043-.043l20.46 11.692A2.897 2.897 0 0 1 176 156a23.997 23.997 0 0 1-23.892 24Z" />
                            </svg>
                        </a>
                    </div>
                </nav>
            </header>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div className={'w-full py-6'}>
                    <div className="h-[400px] max-w-7xl flex items-center mx-auto rounded-3xl overflow-hidden relative">
                        <Image 
                            src="/assets/damac-island-hero-image.webp" 
                            alt="Damac Islands" 
                            fill
                            sizes="(max-width: 1280px) 100vw, 1280px"
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
                <div className="px-6 lg:px-0 max-w-7xl min-h-[400px] mx-auto flex items-center py-12 justify-between flex-col sm:flex-row gap-8">
                    <div className="w-full -mt-8">
                        <h2 className="text-4xl text-center text-green-400">
                            Thank you for your interest in Damac Islands
                        </h2>
                        <p className="pt-2 text-center">
                            One of our agents will get in touch with you shortly.
                        </p>
                    </div>
                </div>
            </main>
            <footer className="row-start-3 pb-3 flex gap-6 pt-12 flex-wrap items-center justify-center">
                <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://trpe.ae" target="_blank" rel="noopener noreferrer">
                    <Globe size={22} className={'stroke-1'} />
                    Powered by TRPE Real Estate
                </a>
            </footer>
        </div>
    );
}

export default function DamaIslandThankYouPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DamaIslandThankYou />
        </Suspense>
    );
}