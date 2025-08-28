import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {Facebook, Instagram, Linkedin, Youtube} from "lucide-react";

// Define Community interface to match the API response format
interface Community {
  id?: string;
  name: string | null;
  slug: string;
  shortName?: string | null;
  propertyCount?: number;
  rentCount?: number;
  saleCount?: number;
  commercialRentCount?: number;
  commercialSaleCount?: number;
}

interface SiteFooterSSRProps {
    showAbout?: boolean;
    communities?: Community[];
}

function SiteFooterSSR({showAbout = true, communities = []}: SiteFooterSSRProps) {
    const currentYear = new Date().getFullYear();
    
    return (
        <div className={'w-full bg-black border-t pb-16 lg:pb-0 border-zinc-500'}>
            <div className="max-w-7xl mx-auto text-white px-2 lg:px-0 pb-12 lg:p-6">
                <div className={'bg-black flex flex-col lg:flex-row justify-end py-12'}>
                    {/* Empty space for potential future content */}
                </div>

                <div className="bg-black text-sm lg:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* For Sale & For Rent Section */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-xl px-4">For Sale</p>
                            <div className="flex flex-col text-sm pt-2">
                                <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/properties/for-sale'}>
                                    Properties for sale in Dubai
                                </Link>
                                <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/property-types/apartments/for-sale'}>
                                    Apartments for sale in Dubai
                                </Link>
                                <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/property-types/villas/for-sale'}>
                                    Villas for sale in Dubai
                                </Link>
                                <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/property-types/townhouses/for-sale'}>
                                    Townhouse for sale in Dubai
                                </Link>
                                <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/property-types/penthouses/for-sale'}>
                                    Penthouses for sale in Dubai
                                </Link>
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-xl px-4">For Rent</p>
                            <div className="flex flex-col text-sm pt-2">
                                <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/properties/for-rent'}>
                                    Properties for rent in Dubai
                                </Link>
                                <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/property-types/apartments/for-rent'}>
                                    Apartments for rent in Dubai
                                </Link>
                                <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/property-types/villas/for-rent'}>
                                    Villas for rent in Dubai
                                </Link>
                                <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/property-types/townhouses/for-rent'}>
                                    Townhouses for rent in Dubai
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Neighbourhoods Section - Server-side communities */}
                    <div>
                        <p className="text-xl px-4">Neighbourhoods</p>
                        <div className="pt-2 flex text-sm flex-col">
                            {communities.slice(0, 16).map((community) => (
                                <Link
                                    className="px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white"
                                    key={community.slug}
                                    href={`/communities/${community.slug}`}
                                >
                                    {community.name || community.slug}
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    {/* Discover Section */}
                    <div>
                        <p className="text-xl px-4">Discover</p>
                        <div className="flex flex-col text-sm pt-2">
                            <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/join-us'}>
                                Join TRPE
                            </Link>
                            <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/insights'}>
                                Insights
                            </Link>
                            <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/off-plan'}>
                                Off-plan Projects in Dubai
                            </Link>
                            <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/developers'}>
                                Developers
                            </Link>
                        </div>
                    </div>
                    
                    {/* Company Section */}
                    <div className={'pb-8 lg:pb-0'}>
                        <p className="text-xl px-4">Company</p>
                        <div className="flex flex-col pt-2">
                            <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/about-us'}>
                                About Us
                            </Link>
                            <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/contact-us'}>
                                Contact Us
                            </Link>
                            <Link className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'} href={'/our-team'}>
                                Meet the Team
                            </Link>
                            
                            {/* Social Media Links */}
                            <div className={'flex flex-wrap items-center gap-4 mt-6 p-4'}>
                                <a
                                    target={'_blank'}
                                    aria-label={'Facebook'}
                                    title={'Facebook'}
                                    href="https://www.facebook.com/people/The-Real-Property-Experts/100088870810824/?mibextid=LQQJ4d"
                                >
                                    <span className="sr-only">Facebook</span>
                                    <Facebook size={28} className={'text-white stroke-1'}/>
                                </a>
                                <a
                                    aria-label={'LinkedIn'}
                                    title={'LinkedIn'}
                                    target={'_blank'}
                                    href="https://www.linkedin.com/company/the-real-property-experts/"
                                >
                                    <span className="sr-only">LinkedIn</span>
                                    <Linkedin size={28} className={'text-white stroke-1'}/>
                                </a>
                                <a
                                    target={'_blank'}
                                    aria-label={'YouTube'}
                                    title={'YouTube'}
                                    href="https://www.youtube.com/@Trpe_realestate"
                                >
                                    <span className="sr-only">YouTube</span>
                                    <Youtube size={32} className={'text-white stroke-1'}/>
                                </a>
                                <a 
                                    target={'_blank'}
                                    aria-label={'Instagram'}
                                    title={'Instagram'}
                                    href="https://www.instagram.com/trpe_realestate/?igshid=YmMyMTA2M2Y%3D"
                                >
                                    <span className="sr-only">Instagram</span>
                                    <Instagram size={26} className={'text-white stroke-1'}/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Copyright and Legal Links */}
            <div className="max-w-7xl mx-auto lg:p-2 text-white justify-center items-center flex-col flex gap-8">
                <div className="">
                    ©{currentYear}. TRPE Real Estate
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <Link className={'pb-1 text-center border-b'} href={'/privacy-policy'}>
                        Privacy Policy
                    </Link>
                    <Link className={'pb-1 border-b'} href={'/terms-conditions'}>
                        Terms & Conditions
                    </Link>
                    <Link className={'pb-1 border-b'} href={'/cookie-settings'}>
                        Cookie Settings
                    </Link>
                </div>
            </div>

            {/* Legal Disclaimer */}
            <div className={'sm:pb-24 lg:pb-6 text-center max-w-4xl px-6 lg:px-0 py-6 text-white mx-auto'}>
                <p className="text-xs">
                    TRPE Real Estate is a company registered in Dubai, United Arab Emirates (License No. 999314)
                    located at Office No 1001, Ascott Park Place, Sheikh Zayed Road, Dubai. We are regulated by the
                    Real Estate Regulatory Agency (RERA) under office number 28357.
                </p>
            </div>
        </div>
    );
}

export default SiteFooterSSR;
