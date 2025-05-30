'use client'
import React, {useState, useCallback, useMemo, memo} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {Facebook, Home, Instagram, Linkedin, MenuIcon, Search, Youtube} from "lucide-react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import dynamic from 'next/dynamic';
import {toast} from "sonner";
import {useUnitStore} from "@/hooks/use-unit-store";
import {useCurrencyStore} from "@/hooks/use-currency-store";
import {usePathname, useRouter} from "next/navigation";
import {Drawer, DrawerContent} from "@/components/ui/drawer";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";

// Use dynamic import with SSR enabled for better performance where possible
const MobileSearch = dynamic(
    () => import("@/features/site/components/MobileSearch"), 
    { 
        ssr: false, // Keep false for client-only interactions
        loading: () => <div className="p-4 animate-pulse bg-gray-100 rounded" aria-label="Loading search...">Loading search...</div> 
    }
);

const FooterCommunitiesClient = dynamic(
    () => import("@/features/site/components/FooterCommunitiesClient"), 
    { 
        ssr: true, // Enable SSR for footer communities
        loading: () => <div className="animate-pulse bg-gray-100 h-20 rounded" aria-label="Loading communities..." />
    }
);

interface SiteFooterProps {
    showAbout?: boolean;
}

function SiteFooter({showAbout = true}: SiteFooterProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [openSearch, setOpenSearch] = useState(false)
    const [openLocation, setOpenLocation] = useState(false)
    const {unit, setUnit} = useUnitStore();
    const {currency, setCurrency} = useCurrencyStore();
    const [active, setActive] = useState<string | null>(null);

    // Memoize the current year to avoid recalculation on every render
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    const pathname = usePathname()
    const router = useRouter();

    // Memoize callback functions to prevent recreation on each render
    const changeUnitType = useCallback((unitType: string) => {
        setUnit(unitType as 'sqf' | 'sqm')
        router.refresh()
        toast.success(`Unit type changed to ${unitType.toUpperCase()}`)
    }, [setUnit, router]);

    const changeCurrency = useCallback((currency: string) => {
        setCurrency(currency as 'AED' | 'GBP' | 'EUR' | 'USD')
        toast.success(`Currency changed to ${currency}`)
        router.refresh()
    }, [setCurrency, router]);

    const handleOpenSearch = useCallback(() => {
        setOpenSearch(true);
    }, []);

    const handleOpenLocation = useCallback(() => {
        setOpenLocation(true);
    }, []);

    const handleOpenMenu = useCallback(() => {
        setIsMenuOpen(true);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    const handleChangeUnitSqm = useCallback(() => {
        changeUnitType('sqm');
    }, [changeUnitType]);

    const handleChangeUnitSqf = useCallback(() => {
        changeUnitType('sqf');
    }, [changeUnitType]);

    const handleChangeCurrencyGBP = useCallback(() => {
        changeCurrency('GBP');
        setIsMenuOpen(false);
    }, [changeCurrency]);

    const handleChangeCurrencyEUR = useCallback(() => {
        changeCurrency('EUR');
        setIsMenuOpen(false);
    }, [changeCurrency]);

    const handleChangeCurrencyUSD = useCallback(() => {
        changeCurrency('USD');
        setIsMenuOpen(false);
    }, [changeCurrency]);

    const handleChangeCurrencyAED = useCallback(() => {
        changeCurrency('AED');
        setIsMenuOpen(false);
    }, [changeCurrency]);

    const handleChangeUnitSqmAndClose = useCallback(() => {
        changeUnitType('sqm');
        setIsMenuOpen(false);
    }, [changeUnitType]);

    const handleChangeUnitSqfAndClose = useCallback(() => {
        changeUnitType('sqf');
        setIsMenuOpen(false);
    }, [changeUnitType]);


    return (
        <div className={'w-full bg-black border-t pb-16 lg:pb-0 border-zinc-500'}>

            <div className={''}>
                <div className="max-w-7xl mx-auto text-white px-2 lg:px-0 pb-12 lg:p-6">

                    <div className={'bg-black flex flex-col lg:flex-row justify-end py-12'}>

                    </div>


                    <div
                        className=" bg-black text-sm lg:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-6">
                            <div>
                                <p className="text-xl px-4">
                                    For Sale
                                </p>
                                <div className="flex flex-col text-sm pt-2">
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/properties/for-sale'}>Properties for sale in Dubai </Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/apartments/for-sale'}>Apartments for sale in
                                        Dubai </Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/villas/for-sale'}>Villas for sale in Dubai </Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/townhouses/for-sale'}>
                                        Townhouse for sale in Dubai
                                    </Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/penthouses/for-sale'}>
                                        Penthouses for sale in Dubai
                                    </Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/offices/commercial-sale'}>
                                        Offices for sale in Dubai
                                    </Link>


                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/retails/commercial-sale'}>
                                        Retails for sale in Dubai
                                    </Link>


                                </div>
                            </div>
                            <div>
                                <p className="text-xl px-4">
                                    For Rent
                                </p>
                                <div className="flex flex-col text-sm pt-2">
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/properties/for-rent'}>
                                        Properties for rent in Dubai
                                    </Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/apartments/for-rent'}>
                                        Apartments for rent in Dubai
                                    </Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/villas/for-rent'}>
                                        Villas for rent in Dubai
                                    </Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/townhouses/for-rent'}>
                                        Townhouses for rent in Dubai
                                    </Link>

                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/offices/commercial-sale'}>
                                        Offices for rent in Dubai
                                    </Link>

                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/retails/commercial-rent'}>
                                        Retails for rent in Dubai
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-xl px-4">
                                Neighbourhoods
                            </p>
                            <FooterCommunitiesClient/>
                        </div>
                        <div>
                            <div>
                                <p className="text-xl px-4">
                                    Discover
                                </p>
                                <div className="flex flex-col text-sm pt-2">
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/join-us'}>Join TRPE</Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/insights'}>Insights</Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/off-plan'}>Off-plan Projects in Dubai</Link>

                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/properties/for-sale'}>Properties for sale in Dubai </Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/apartments/for-sale'}>Apartments for sale in
                                        Dubai </Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/villas/for-sale'}>Villas for sale in Dubai </Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/property-types/townhouses/for-rent'}>Townhouses for sale in
                                        Dubai </Link>
                                    <Link
                                        className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                        href={'/developers'}>Developers </Link>
                                </div>
                            </div>

                        </div>
                        <div className={'pb-8 lg:pb-0'}>
                            <p className="text-xl px-4">
                                Company
                            </p>
                            <div className="flex flex-col pt-2">
                                <p></p>
                                <Link
                                    className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                    href={'/about-us'}>
                                    About Us
                                </Link>
                                <Link
                                    className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                    href={'/contact-us'}>
                                    Contact Us
                                </Link>
                                <Link
                                    className={'px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white'}
                                    href={'/our-team'}>Meet the Team</Link>
                                <div className={'flex flex-col flex-wrap items-center gap-4 mt-6 p-4'}>
                                    <p className="text-white">
                                        Sign up to our newsletter to get the latest real estate news and to stay up to
                                        date
                                        with
                                        TRPE.
                                    </p>
                                    <div className={'pt-4 w-full space-y-4'}>
                                        <Input placeholder="Enter your email address" type="email"
                                               className="w-full rounded-3xl border border-white bg-transparent text-white "/>
                                        <Button
                                            className={'w-full bg-black hover:bg-white text-white hover:text-black border border-white'}>Subscribe</Button>
                                    </div>
                                </div>
                                <div className={'flex flex-wrap items-center gap-4 mt-6 p-4'}>
                                    <a
                                        target={'_blank'}
                                        aria-label={'Facebook'}
                                        title={'Facebook'}
                                        href="https://www.facebook.com/people/The-Real-Property-Experts/100088870810824/?mibextid=LQQJ4d">
                                        <span className="sr-only">
                                            Facebook
                                        </span>
                                        <Facebook size={28} className={'text-white stroke-1'}/>
                                    </a>
                                    <a
                                        aria-label={'LinkedIn'}
                                        title={'LinkedIn'}
                                        target={'_blank'}
                                        href="https://www.linkedin.com/company/the-real-property-experts/">
                                        <span className="sr-only">
                                            LinkedIn
                                        </span>
                                        <Linkedin size={28} className={'text-white stroke-1'}/>
                                    </a>
                                    <a
                                        target={'_blank'}
                                        aria-label={'LinkedIn'}
                                        title={'LinkedIn'}
                                        href="https://www.youtube.com/@Trpe_realestate">
                                        <span className="sr-only">
                                            YouTube
                                        </span>
                                        <Youtube size={32} className={'text-white stroke-1'}/>
                                    </a>
                                    <a target={'_blank'}
                                       aria-label={'Instagram'}
                                       title={'instagram'}
                                       href="https://www.instagram.com/trpe_realestate/?igshid=YmMyMTA2M2Y%3D">
                                        <span className="sr-only">
                                            Instagram
                                        </span>
                                        <Instagram size={26} className={'text-white stroke-1'}/>
                                    </a>
                                    <a target={'_blank'}
                                       aria-label={'Instagram'}
                                       title={'Tiktok'}
                                       href="https://www.tiktok.com/@trpe_realestate">
                                        <span className="sr-only">
                                            Tiktok
                                        </span>
                                        <svg className={'h-7 w-7'} viewBox="0 0 192 192"
                                             xmlns="http://www.w3.org/2000/svg" fill="none"
                                             stroke="#ffffff">
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round"
                                               strokeLinejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path stroke="#ffffff" strokeLinecap="round" strokeWidth="12"
                                                      d="M108 132a38.004 38.004 0 0 1-23.458 35.107 37.995 37.995 0 0 1-41.412-8.237 37.996 37.996 0 0 1-8.237-41.412A38.001 38.001 0 0 1 70 94"></path>
                                                <path stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"
                                                      strokeWidth="12" d="M108 132V22c0 18 24 50 52 50"></path>
                                            </g>
                                        </svg>
                                    </a>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto lg:p-2 text-white justify-center items-center flex-col flex  gap-8 ">
                    <div className="">
                        ©{currentYear}. TRPE Real Estate
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <Link className={'pb-1 text-center border-b'} href={'/privacy-policy'}>Privacy Policy</Link>
                        <Link className={'pb-1 border-b'} href={'/terms-conditions'}>Terms & Conditions</Link>
                    </div>
                </div>

                <div className={'sm:pb-24 lg:pb-6 text-center max-w-4xl px-6 lg:px-0 py-6 text-white mx-auto'}>
                    <p className="text-xs">
                        TRPE Real Estate is a company registered in Dubai, United Arab Emirates (License No. 999314)
                        located at Office No 1001, Ascott Park Place, Sheikh Zayed Road, Dubai. We are regulated by the
                        Real Estate Regulatory Agency (RERA) under office number 28357.
                    </p>
                </div>
            </div>


            {/*Floating menu*/}

            <div className={'fixed right-0 top-1/2 '}>
                <div
                    className="hidden lg:flex flex-col py-4 bg-black border-l rounded-l-2xl border-y items-center text-white px-2 space-y-4">
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <span
                                className={'flex items-center'}
                            >
                            {/*    <span className={'text-white text-sm mr-1.5'}>*/}
                                {/*    Dubai*/}
                                {/*</span>*/}

                                <svg className={'w-5 h-5  rounded-full'} xmlSpace="preserve"
                                     viewBox="0 0 473.68 473.68">
                                                <circle cx="236.85" cy="236.849" r="236.83" style={{fill: "#fff"}}/>
                                                <path
                                                    d="M460.143 157.873H314.218c6.339 50.593 6.376 106.339.123 156.995h146.113a236.303 236.303 0 0 0 13.219-78.026c.004-27.703-4.794-54.269-13.53-78.969z"
                                                    style={{fill: "#efecec"}}/>
                                                <path
                                                    d="M314.218 157.873H460.14a1.618 1.618 0 0 0-.075-.206C429.756 72.2 351.785 9.319 258.105.972c36.256 19.872 46.846 82.832 56.113 156.901z"
                                                    style={{fill: "#429945"}}/>
                                                <path
                                                    d="M258.113 472.697c93.848-8.362 171.927-71.46 202.12-157.156.079-.228.146-.453.228-.673H314.345c-9.196 74.47-19.831 137.874-56.232 157.829z"
                                                    style={{fill: "#0b0b0b"}}/>
                                                <path
                                                    d="M0 236.841c0 27.348 4.697 53.588 13.219 78.026h313.313c6.26-50.66 6.215-106.402-.116-156.995H13.534C4.798 182.573 0 209.139 0 236.841z"
                                                    style={{fill: "#efefef"}}/>
                                                <path
                                                    d="M13.608 157.668a3.348 3.348 0 0 1-.075.206h312.883C317.142 83.804 294.36 20.845 258.109.973c-7.012-.621-14.102-.972-21.274-.972C133.806 0 46.191 65.801 13.608 157.668z"
                                                    style={{fill: "#49a948"}}/>
                                                <path
                                                    d="M326.532 314.867H13.219c.079.221.153.445.228.673C45.9 407.642 133.641 473.676 236.835 473.676c7.173 0 14.263-.352 21.274-.98 36.405-19.954 59.227-83.358 68.423-157.829z"
                                                    style={{fill: "#151515"}}/>
                                                <path
                                                    d="M0 236.841c0 98.586 60.263 183.086 145.952 218.735V18.099C60.263 53.741 0 138.241 0 236.841z"
                                                    style={{fill: "#e73b36"}}/>
                                            </svg>

                                        </span>
                        </HoverCardTrigger>
                        <HoverCardContent className={'w-40 py-1.5 px-1'} side={"left"}>
                            <div className={'flex '}>
                                <a className={'inline-flex items-center px-3 py-2'}
                                   href="https://trpe.co.uk"
                                   target="_blank">
                                    <span className="mr-1">
                                        <svg className={'w-5 h-5 mr-2'}
                                             xmlns="http://www.w3.org/2000/svg"
                                             xmlSpace="preserve"
                                             viewBox="0 0 473.68 473.68">
                                                                      <path
                                                                          d="M41.712 102.641c-15.273 22.168-26.88 47.059-33.918 73.812h107.734l-73.816-73.812zM170.511 9.48a235.987 235.987 0 0 0-74.814 37.168l74.814 74.814V9.48zM101.261 430.982a235.633 235.633 0 0 0 69.25 33.211v-102.45l-69.25 69.239zM10.512 306.771c7.831 25.366 19.831 48.899 35.167 69.833l69.833-69.833h-105z"
                                                                          style={{fill: "#29337a"}}/>
                                                                      <path
                                                                          d="M45.619 97.144a241.902 241.902 0 0 0-3.908 5.501l73.816 73.812H7.793c-1.746 6.645-3.171 13.418-4.345 20.284h141.776L45.619 97.144zM95.767 427.074c1.802 1.343 3.654 2.621 5.493 3.908l69.25-69.242v102.45c6.653 1.945 13.41 3.624 20.284 4.974V332.05l-95.027 95.024zM5.25 286.487c1.47 6.873 3.205 13.642 5.258 20.284h105.001l-69.833 69.833a238.435 238.435 0 0 0 25.168 29.12L190.08 286.487H5.25zM170.511 9.48v111.982l-74.815-74.81c-10.314 7.67-19.955 16.185-28.888 25.403l123.983 123.983V4.506c-6.87 1.358-13.627 3.041-20.28 4.974z"
                                                                          style={{fill: "#fff"}}/>
                                                                      <path
                                                                          d="m170.511 306.056-.711.715h.711zM190.084 286.487h.71v-.714zM281.229 196.737h-.684v.688zM171.21 176.457l-.699-.703v.703zM190.794 196.037v.7h.7z"
                                                                          style={{fill: "#d32030"}}/>
                                                                      <path
                                                                          d="M300.825 411.764v53.091a235.482 235.482 0 0 0 70.211-32.897l-57.526-57.526c-4.597 16.151-6.279 24.501-12.685 37.332zM313.812 108.471l62.799-62.799a235.938 235.938 0 0 0-75.787-36.854v54.538c7.386 14.79 8.007 26.028 12.988 45.115zM427.029 377.984c15.815-21.275 28.141-45.29 36.147-71.213h-107.36l71.213 71.213zM465.887 176.457c-7.188-27.318-19.143-52.676-34.898-75.192l-75.2 75.192h110.098z"
                                                                          style={{fill: "#252f6c"}}/>
                                                                      <path
                                                                          d="m327.638 290.5 16.275 16.275 77.903 77.903c1.769-2.214 3.526-4.42 5.217-6.69l-71.213-71.213h107.36c2.046-6.638 3.784-13.41 5.25-20.284H329.16c-.228 2.876-1.249 1.152-1.522 4.009zM311.352 120.348l70.607-70.615a245.581 245.581 0 0 0-5.348-4.061l-62.799 62.799c.651 2.483-3.066 9.334-2.46 11.877zM300.825 58.992V8.814a236.39 236.39 0 0 0-20.284-4.727v24.476c7.547 8.182 14.312 18.459 20.284 30.429zM326.041 196.737h144.195c-1.171-6.866-2.599-13.635-4.345-20.284H355.793l75.2-75.192a238.044 238.044 0 0 0-24.584-29.696l-84.702 84.694c2.281 15.363 3.302 24.285 4.334 40.478zM310.088 371.002l60.952 60.959c10.138-6.982 19.685-14.753 28.593-23.189l-80.173-80.177c-2.559 14.828-5.595 29.15-9.372 42.407zM280.545 442.301v27.28a233.85 233.85 0 0 0 20.284-4.727v-53.091c-5.976 11.975-12.741 22.367-20.284 30.538z"
                                                                          style={{fill: "#e7e7e7"}}/>
                                                                      <path
                                                                          d="m321.707 156.259 84.694-84.694a236.803 236.803 0 0 0-24.446-21.832l-66.55 66.561c2.958 12.363 4.301 26.514 6.302 39.965z"
                                                                          style={{fill: "#d71f28"}}/>
                                                                      <path
                                                                          d="M225.019.292zM236.836 473.68c-3.938 0-7.872-.108-11.81-.299 3.916.198 7.85.299 11.81.299zM236.836 473.68c14.943 0 29.535-1.447 43.708-4.099v-27.28c-12.441 13.485-26.995 31.379-43.708 31.379z"
                                                                          style={{fill: "#d32030"}}/>
                                                                      <path
                                                                          d="M470.232 196.737H327.911c1.885 29.704 1.657 60.249-.681 89.75h141.2a237.59 237.59 0 0 0 5.25-49.643c0-13.68-1.219-27.06-3.448-40.107zM327.638 290.5c-1.316 13.994-5.901 24.898-8.182 38.099l80.173 80.173a239.086 239.086 0 0 0 22.183-24.094l-77.9-77.907-16.274-16.271z"
                                                                          style={{fill: "#d71f28"}}/>
                                                                      <path
                                                                          d="M280.545 30.324V4.091C266.376 1.447 251.784 0 236.836 0c16.713 0 31.267 16.843 43.709 30.324z"
                                                                          style={{fill: "#d32030"}}/>
                                                                      <path
                                                                          d="M300.825 422.007c6.406-12.834 11.899-27.609 16.499-43.757l-16.499-16.499v60.256zM319.377 102.906c-4.989-19.087-11.166-36.439-18.552-51.229v69.773l18.552-18.544z"
                                                                          style={{fill: "#29337a"}}/>
                                                                      <path
                                                                          d="M332.234 295.092c.269-2.857.512-5.725.744-8.605h-9.349l8.605 8.605zM300.825 121.451V51.674c-5.976-11.97-12.737-22.254-20.284-30.429v129.906l40.735-40.735a457.616 457.616 0 0 0-1.9-7.517l-18.551 18.552zM281.229 196.737h52.429c-1.028-16.192-2.666-32.123-4.944-47.482l-47.485 47.482zM280.545 452.432c7.547-8.182 14.308-18.459 20.284-30.429v-60.256l16.499 16.499c3.784-13.264 6.959-27.434 9.525-42.261l-46.307-46.304-.001 162.751z"
                                                                          style={{fill: "#fff"}}/>
                                                                      <path
                                                                          d="M280.545 452.432V289.681l46.304 46.307c2.277-13.205 4.069-26.899 5.381-40.896l-8.605-8.605h9.349c2.337-29.502 2.565-60.047.681-89.75h-52.429l47.482-47.482c-2.001-13.455-4.476-26.469-7.434-38.836l-40.728 40.735V21.248C268.103 7.763 253.549 0 236.836 0c-3.938 0-7.872.101-11.817.292a238.416 238.416 0 0 0-34.225 4.215v191.531L66.808 72.055a239.134 239.134 0 0 0-21.189 25.089l79.313 79.313 20.291 20.284H3.448C1.227 209.784 0 223.164 0 236.844c0 17.034 1.84 33.626 5.25 49.643h184.834L70.847 405.724a238.535 238.535 0 0 0 24.921 21.349l95.023-95.023v137.116a238.638 238.638 0 0 0 34.232 4.215c3.938.191 7.872.299 11.81.299 16.716 0 31.27-7.763 43.712-21.248z"
                                                                          style={{fill: "#e51d35"}}/>
                                                                    </svg>

                                                              </span>
                                    London
                                </a>
                            </div>
                        </HoverCardContent>
                    </HoverCard>

                    <HoverCard>
                        <HoverCardTrigger asChild>
                         <span
                             className={'text-sm'}
                         >
                             {unit.toUpperCase()}
                         </span>
                        </HoverCardTrigger>
                        <HoverCardContent side={"left"}>
                            <div className={'flex border-transparent hover:border-white py-2 '}>
                                <button
                                    type={'button'}
                                    onClick={handleChangeUnitSqm}
                                    className={''}>
                                    SQM
                                </button>
                            </div>
                            <div className={'flex border-transparent hover:border-white py-2 '}>
                                <button
                                    type={'button'}
                                    onClick={handleChangeUnitSqf}
                                    className={''}>
                                    SQF
                                </button>
                            </div>
                        </HoverCardContent>
                    </HoverCard>


                    <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className={'text-sm'}>
                                        {currency}
                                    </span>
                        </HoverCardTrigger>
                        <HoverCardContent side={"left"}>
                            <div className={''}>

                                <div className={'flex border-b border-transparent hover:border-white py-2 '}>
                                    <button
                                        onClick={() => changeCurrency('GBP')}
                                        className={'inline-flex py-1'}
                                    >
                                                          <span className="mr-1">

                                                          </span>
                                        GBP
                                    </button>
                                </div>
                                <div className={'flex border-b border-transparent hover:border-white py-2 '}>
                                    <button
                                        className={'inline-flex'}
                                        onClick={() => changeCurrency('EUR')}
                                    >
                                                <span className="mr-1">

                                                </span>
                                        EUR
                                    </button>
                                </div>
                                <div className={'flex border-b border-transparent hover:border-white py-2 '}>
                                    <button className={'inline-flex'}
                                            onClick={() => changeCurrency('USD')}
                                    >
                                                <span className="mr-1">

                                                </span>
                                        USD
                                    </button>
                                </div>
                                <div className={'flex border-b border-transparent hover:border-white py-2 '}>
                                    <button
                                        className={'inline-flex'}
                                        onClick={() => changeCurrency('AED')}
                                    >
                                                <span className="mr-1">
                                                </span>
                                        AED
                                    </button>
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </div>

            </div>


            {/*MOBILE FOOTER*/}
            <div className="lg:hidden z-20 fixed bottom-0 left-0 right-0">
                <div className={'flex bg-black px-6 pb-3 pt-1.5 border-t border-slate-400 justify-between'}>
                    <Link className={'inline-flex flex-col justify-center items-center'} href={'/'}>
                        <Home size={26} className={' stroke-1 text-white'}/>
                        <span className="text-xs text-white mt-1">
                            Home
                        </span>
                    </Link>


                    <button onClick={handleOpenSearch}
                            className={'inline-flex flex-col justify-center items-center'}>
                        <Search size={26} className={' stroke-1 text-white'}/>
                        <span className="text-xs text-white mt-1">
                            Search
                        </span>
                    </button>

                    <button onClick={handleOpenLocation}
                            className={'inline-flex flex-col justify-center items-center'}>
                        <svg className={'w-6 h-6 border rounded-full border-white'} xmlSpace="preserve"
                             viewBox="0 0 473.68 473.68">
                            <circle cx="236.85" cy="236.849" r="236.83" style={{fill: "#fff"}}/>
                            <path
                                d="M460.143 157.873H314.218c6.339 50.593 6.376 106.339.123 156.995h146.113a236.303 236.303 0 0 0 13.219-78.026c.004-27.703-4.794-54.269-13.53-78.969z"
                                style={{fill: "#efecec"}}/>
                            <path
                                d="M314.218 157.873H460.14a1.618 1.618 0 0 0-.075-.206C429.756 72.2 351.785 9.319 258.105.972c36.256 19.872 46.846 82.832 56.113 156.901z"
                                style={{fill: "#429945"}}/>
                            <path
                                d="M258.113 472.697c93.848-8.362 171.927-71.46 202.12-157.156.079-.228.146-.453.228-.673H314.345c-9.196 74.47-19.831 137.874-56.232 157.829z"
                                style={{fill: "#0b0b0b"}}/>
                            <path
                                d="M0 236.841c0 27.348 4.697 53.588 13.219 78.026h313.313c6.26-50.66 6.215-106.402-.116-156.995H13.534C4.798 182.573 0 209.139 0 236.841z"
                                style={{fill: "#efefef"}}/>
                            <path
                                d="M13.608 157.668a3.348 3.348 0 0 1-.075.206h312.883C317.142 83.804 294.36 20.845 258.109.973c-7.012-.621-14.102-.972-21.274-.972C133.806 0 46.191 65.801 13.608 157.668z"
                                style={{fill: "#49a948"}}/>
                            <path
                                d="M326.532 314.867H13.219c.079.221.153.445.228.673C45.9 407.642 133.641 473.676 236.835 473.676c7.173 0 14.263-.352 21.274-.98 36.405-19.954 59.227-83.358 68.423-157.829z"
                                style={{fill: "#151515"}}/>
                            <path
                                d="M0 236.841c0 98.586 60.263 183.086 145.952 218.735V18.099C60.263 53.741 0 138.241 0 236.841z"
                                style={{fill: "#e73b36"}}/>
                        </svg>
                        <span className="text-xs text-white mt-1">
                        Dubai
                        </span>
                    </button>

                    <button onClick={handleOpenMenu}
                            className={'inline-flex flex-col justify-center items-center'}>
                        <MenuIcon size={26} className={' stroke-1 text-white'}/>
                        <span className="text-xs text-white mt-1">
                            Menu
                        </span>
                    </button>
                </div>
            </div>


            <div className="hidden lg:block">
                <Sheet
                    open={isMenuOpen}
                    onOpenChange={setIsMenuOpen}
                >
                    <SheetContent
                        onClick={handleCloseMenu}
                        side={'left'} className="w-[90%] flex flex-col bg-white"
                    >
                        <SheetHeader>
                            <SheetTitle>
                                <div className="py-3 flex justify-center bg-black">
                                    <Link className={'-mr-8'} href={'/'}>
                                        <span className="sr-only">TRPE Logo</span>
                                        <Image
                                            src="/trpe-logo.webp"
                                            alt="TRPE Logo" 
                                            width={213}
                                            height={40}
                                            priority
                                        />
                                    </Link>
                                </div>
                            </SheetTitle>
                        </SheetHeader>
                        <SheetDescription
                            className={'flex flex-1 overflow-y-auto px-6 py-4 flex-col justify-start gap-3'}>

                            <Link className={'text-lg'} href={'/properties/for-sale'}>For Sale</Link>
                            <div className="pl-6 flex flex-col gap-3">
                                <Link className={'text-base '} href={'/properties/for-sale'}>All Properties</Link>
                                <Link className={'text-base '} href={'/property-types/apartments/for-sale'}>Apartments
                                    for Sale</Link>
                                <Link className={'text-base '} href={'/property-types/villas/for-sale'}>Villas for
                                    sale</Link>
                                <Link className={'text-base '} href={'/property-types/townhouses/for-sale'}>Townhouses
                                    for sale</Link>
                                <Link className={'text-base '} href={'/property-types/penthouses/for-sale'}>Penthouses
                                    for sale</Link>
                                <Link className={'text-base '} href={'/property-types/offices/commercial-sale'}>Offices
                                    for sale</Link>
                                <Link className={'text-base '} href={'/selling-property-process'}>Selling Process</Link>
                                <Link className={'text-base '}
                                      href={'/selling-property-process'}>Buying Process</Link>
                            </div>
                            <Link className={'text-lg '} href={'/properties/for-rent'}>For Rent</Link>
                            <div className="pl-6 flex flex-col gap-3">
                                <Link className={'text-base '} href={'/properties/for-rent'}>All Properties</Link>
                                <Link className={'text-base '} href={'/property-types/apartments/for-rent'}>Apartments
                                    for Rent</Link>
                                <Link className={'text-base '} href={'/property-types/villas/for-rent'}>Villas for
                                    rent</Link>
                                <Link className={'text-base '} href={'/property-types/townhouses/for-rent'}>Townhouses
                                    for rent</Link>
                                <Link className={'text-base '} href={'/property-types/penthouses/for-rent'}>Penthouses
                                    for Rent</Link>
                                <Link className={' text-base'} href={'/renting-property-process'}>For Landlords</Link>
                                <Link className={' text-base'} href={'/renting-property-process/#for-tenants'}>For
                                    Tenants</Link>
                            </div>
                            <Link className={'text-lg '} href={'/communities'}>Communities</Link>
                            <Link className={'text-lg '} href={'/off-plan'}>New Projects</Link>
                            <Link className={'text-lg '} href={'/luxury-properties-for-sale-dubai'}>Luxe by TRPE</Link>
                            <Link className={'text-lg '} href={'/insights'}>Insights</Link>
                            <Link className={'text-lg '} href={'/about-us'}>About Us</Link>
                            <Link className={'text-lg '} href={'/contact-us'}>Contact Us</Link>
                        </SheetDescription>
                    </SheetContent>
                </Sheet>

                {/*<MobileSearch isOpen={openSearch} setIsOpen={setOpenSearch}/>*/}
            </div>
            <div className="hidden lg:block">
                <Drawer open={openLocation} onOpenChange={setOpenLocation}>
                    <DrawerContent className={'h-[60%] px-12'}>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className={'text-center w-full'}>
                                    Dubai
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className={'flex justify-center px-4'}>
                                        <a className={'inline-flex items-center px-3 py-2'} href="https://trpe.co.uk"
                                           target="_blank">
                                          <span className="mr-1">
                                           <svg className={'w-5 h-5 mr-2'} xmlns="http://www.w3.org/2000/svg"
                                                xmlSpace="preserve" viewBox="0 0 473.68 473.68">
                                                                                                      <path
                                                                                                          d="M41.712 102.641c-15.273 22.168-26.88 47.059-33.918 73.812h107.734l-73.816-73.812zM170.511 9.48a235.987 235.987 0 0 0-74.814 37.168l74.814 74.814V9.48zM101.261 430.982a235.633 235.633 0 0 0 69.25 33.211v-102.45l-69.25 69.239zM10.512 306.771c7.831 25.366 19.831 48.899 35.167 69.833l69.833-69.833h-105z"
                                                                                                          style={{fill: "#29337a"}}/>
                                                                                                      <path
                                                                                                          d="M45.619 97.144a241.902 241.902 0 0 0-3.908 5.501l73.816 73.812H7.793c-1.746 6.645-3.171 13.418-4.345 20.284h141.776L45.619 97.144zM95.767 427.074c1.802 1.343 3.654 2.621 5.493 3.908l69.25-69.242v102.45c6.653 1.945 13.41 3.624 20.284 4.974V332.05l-95.027 95.024zM5.25 286.487c1.47 6.873 3.205 13.642 5.258 20.284h105.001l-69.833 69.833a238.435 238.435 0 0 0 25.168 29.12L190.08 286.487H5.25zM170.511 9.48v111.982l-74.815-74.81c-10.314 7.67-19.955 16.185-28.888 25.403l123.983 123.983V4.506c-6.87 1.358-13.627 3.041-20.28 4.974z"
                                                                                                          style={{fill: "#fff"}}/>
                                                                                                      <path
                                                                                                          d="m170.511 306.056-.711.715h.711zM190.084 286.487h.71v-.714zM281.229 196.737h-.684v.688zM171.21 176.457l-.699-.703v.703zM190.794 196.037v.7h.7z"
                                                                                                          style={{fill: "#d32030"}}/>
                                                                                                      <path
                                                                                                          d="M300.825 411.764v53.091a235.482 235.482 0 0 0 70.211-32.897l-57.526-57.526c-4.597 16.151-6.279 24.501-12.685 37.332zM313.812 108.471l62.799-62.799a235.938 235.938 0 0 0-75.787-36.854v54.538c7.386 14.79 8.007 26.028 12.988 45.115zM427.029 377.984c15.815-21.275 28.141-45.29 36.147-71.213h-107.36l71.213 71.213zM465.887 176.457c-7.188-27.318-19.143-52.676-34.898-75.192l-75.2 75.192h110.098z"
                                                                                                          style={{fill: "#252f6c"}}/>
                                                                                                      <path
                                                                                                          d="m327.638 290.5 16.275 16.275 77.903 77.903c1.769-2.214 3.526-4.42 5.217-6.69l-71.213-71.213h107.36c2.046-6.638 3.784-13.41 5.25-20.284H329.16c-.228 2.876-1.249 1.152-1.522 4.009zM311.352 120.348l70.607-70.615a245.581 245.581 0 0 0-5.348-4.061l-62.799 62.799c.651 2.483-3.066 9.334-2.46 11.877zM300.825 58.992V8.814a236.39 236.39 0 0 0-20.284-4.727v24.476c7.547 8.182 14.312 18.459 20.284 30.429zM326.041 196.737h144.195c-1.171-6.866-2.599-13.635-4.345-20.284H355.793l75.2-75.192a238.044 238.044 0 0 0-24.584-29.696l-84.702 84.694c2.281 15.363 3.302 24.285 4.334 40.478zM310.088 371.002l60.952 60.959c10.138-6.982 19.685-14.753 28.593-23.189l-80.173-80.177c-2.559 14.828-5.595 29.15-9.372 42.407zM280.545 442.301v27.28a233.85 233.85 0 0 0 20.284-4.727v-53.091c-5.976 11.975-12.741 22.367-20.284 30.538z"
                                                                                                          style={{fill: "#e7e7e7"}}/>
                                                                                                      <path
                                                                                                          d="m321.707 156.259 84.694-84.694a236.803 236.803 0 0 0-24.446-21.832l-66.55 66.561c2.958 12.363 4.301 26.514 6.302 39.965z"
                                                                                                          style={{fill: "#d71f28"}}/>
                                                                                                      <path
                                                                                                          d="M225.019.292zM236.836 473.68c-3.938 0-7.872-.108-11.81-.299 3.916.198 7.85.299 11.81.299zM236.836 473.68c14.943 0 29.535-1.447 43.708-4.099v-27.28c-12.441 13.485-26.995 31.379-43.708 31.379z"
                                                                                                          style={{fill: "#d32030"}}/>
                                                                                                      <path
                                                                                                          d="M470.232 196.737H327.911c1.885 29.704 1.657 60.249-.681 89.75h141.2a237.59 237.59 0 0 0 5.25-49.643c0-13.68-1.219-27.06-3.448-40.107zM327.638 290.5c-1.316 13.994-5.901 24.898-8.182 38.099l80.173 80.173a239.086 239.086 0 0 0 22.183-24.094l-77.9-77.907-16.274-16.271z"
                                                                                                          style={{fill: "#d71f28"}}/>
                                                                                                      <path
                                                                                                          d="M280.545 30.324V4.091C266.376 1.447 251.784 0 236.836 0c16.713 0 31.267 16.843 43.709 30.324z"
                                                                                                          style={{fill: "#d32030"}}/>
                                                                                                      <path
                                                                                                          d="M300.825 422.007c6.406-12.834 11.899-27.609 16.499-43.757l-16.499-16.499v60.256zM319.377 102.906c-4.989-19.087-11.166-36.439-18.552-51.229v69.773l18.552-18.544z"
                                                                                                          style={{fill: "#29337a"}}/>
                                                                                                      <path
                                                                                                          d="M332.234 295.092c.269-2.857.512-5.725.744-8.605h-9.349l8.605 8.605zM300.825 121.451V51.674c-5.976-11.97-12.737-22.254-20.284-30.429v129.906l40.735-40.735a457.616 457.616 0 0 0-1.9-7.517l-18.551 18.552zM281.229 196.737h52.429c-1.028-16.192-2.666-32.123-4.944-47.482l-47.485 47.482zM280.545 452.432c7.547-8.182 14.308-18.459 20.284-30.429v-60.256l16.499 16.499c3.784-13.264 6.959-27.434 9.525-42.261l-46.307-46.304-.001 162.751z"
                                                                                                          style={{fill: "#fff"}}/>
                                                                                                      <path
                                                                                                          d="M280.545 452.432V289.681l46.304 46.307c2.277-13.205 4.069-26.899 5.381-40.896l-8.605-8.605h9.349c2.337-29.502 2.565-60.047.681-89.75h-52.429l47.482-47.482c-2.001-13.455-4.476-26.469-7.434-38.836l-40.728 40.735V21.248C268.103 7.763 253.549 0 236.836 0c-3.938 0-7.872.101-11.817.292a238.416 238.416 0 0 0-34.225 4.215v191.531L66.808 72.055a239.134 239.134 0 0 0-21.189 25.089l79.313 79.313 20.291 20.284H3.448C1.227 209.784 0 223.164 0 236.844c0 17.034 1.84 33.626 5.25 49.643h184.834L70.847 405.724a238.535 238.535 0 0 0 24.921 21.349l95.023-95.023v137.116a238.638 238.638 0 0 0 34.232 4.215c3.938.191 7.872.299 11.81.299 16.716 0 31.27-7.763 43.712-21.248z"
                                                                                                          style={{fill: "#e51d35"}}/>
                                                                                                    </svg>
                                          </span>
                                            London
                                        </a>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                                <AccordionTrigger>{currency}</AccordionTrigger>
                                <AccordionContent>
                                    <div className={'flex justify-center py-2'}>
                                        <button onClick={handleChangeCurrencyGBP} className={'inline-flex py-1'}>
                                            <span className="mr-1"></span>
                                            GBP
                                        </button>
                                    </div>

                                    <div className={'flex py-2 justify-center'}>
                                        <button className={'inline-flex'}
                                                onClick={handleChangeCurrencyEUR}
                                        >
                                            <span className="mr-1">

                                            </span>
                                            EUR
                                        </button>
                                    </div>
                                    <div className={'flex py-2 justify-center'}>
                                        <button className={'inline-flex'}
                                                onClick={handleChangeCurrencyUSD}
                                        >
                                            <span className="mr-1">

                                            </span>
                                            USD
                                        </button>
                                    </div>
                                    <div className={'flex py-2 justify-center'}>
                                        <button className={'inline-flex'}
                                                onClick={handleChangeCurrencyAED}
                                        >
                                            <span className="mr-1">

                                            </span>
                                            AED
                                        </button>
                                    </div>

                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                                <AccordionTrigger>{unit.toUpperCase()}</AccordionTrigger>
                                <AccordionContent>
                                    <div className={'flex flex-col px-8  py-2 space-y-4'}>
                                        <button onClick={handleChangeUnitSqmAndClose} className={''}>
                                            SQM
                                        </button>
                                        <button onClick={handleChangeUnitSqfAndClose} className={''}>
                                            SQF
                                        </button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </DrawerContent>
                </Drawer>
            </div>

        </div>
    )
}

// Memoize the entire component to prevent unnecessary re-renders
const SiteFooterMemo = memo(SiteFooter);
SiteFooterMemo.displayName = 'SiteFooter';

export default SiteFooterMemo;