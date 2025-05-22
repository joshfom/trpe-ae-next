"use client"
import React, {useState} from 'react';
import TopNavigation from "@/components/top-navigation";
import Link from "next/link";
import {usePathname, useRouter} from 'next/navigation'
import {toast} from "sonner";
import {useCurrencyStore} from "@/hooks/use-currency-store";
import {useUnitStore} from "@/hooks/use-unit-store";
import { Phone } from 'lucide-react';

function SiteTopNavigation() {
    const [scroll, setScroll] = React.useState(0)
    const [isHomePage, setIsHomePage] = React.useState(false)
    const [active, setActive] = useState<string | null>(null);
    const {unit, setUnit} = useUnitStore();
    const {currency, setCurrency} = useCurrencyStore();


    // check if user scrolled is more than 5px
    const pathname = usePathname()

    React.useEffect(() => {
        window.addEventListener('scroll', () => {
            setScroll(window.scrollY)
        })


        if (pathname === '/') {
            setIsHomePage(true)
        }

    }, [])

   

    return (
        <>
       
<div className={`z-30 py-4 px-6  w-full lg:fixed ${scroll || !isHomePage ? 'bg-black shadow-lg' : 'bg-black lg:bg-transparent'} `}>
                <div className={'max-w-7xl px-6 mx-auto'}>
                    <div className={'max-w-7xl relative mx-auto flex justify-between items-center'}>
                        <div className={'hidden lg:flex space-x-8'}>
                            <Link href={'/'} aria-label={'TRPE Home'}>
                                <span className="sr-only">
                                    TRPE Home
                                </span>
                                <svg width="38" height="64" viewBox="0 0 38 64" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0.131492 0L0 45.1067L19.0532 64L38 45.2123V0H0.131492ZM32.6904 33.5274H28.9962L32.4274 36.9298V44.3803L27.2243 49.546V33.397H21.708V54.3516L18.7903 57.2449L15.9789 54.4571V28.2375H27.0176V22.6496H10.9824V50.5208L5.34718 44.9329V17.7074H16.1793V12.1195H5.34718V6.46953H32.1832V12.1195H21.8082V17.7074H32.6403L32.6904 33.5274Z"
                                        fill="white"></path>
                                </svg>
                            </Link>


                            <TopNavigation/>
                        </div>
                        <div className={'lg:hidden bg-black flex items-center p-2 grow justify-between'}>

                            <div className="flex-1 flex justify-center">
                                <Link className={''} href={'/'}>
                                    <img
                                        src={'/trpe-logo.webp'} alt="TRPE Logo" 
                                        width={213} height={40}
                                        style={{width: '213px', height: '40px'}}
                                    />
                                </Link>
                            </div>
                        </div>

                        <div className="hidden lg:flex space-x-6 items-center">
                           
                            <Link href={'/list-with-us'}
                                  className="py-2 hidden lg:inline-flex px-6 rounded-full border border-white text-white font-semibold hover:bg-white hover:text-black">
                                List with Us
                            </Link>
                            <Link href={'/contact-us'}
                                  aria-label={'Contact Us'}
                                  className="text-white border border-white rounded-full px-2 py-2 hover:text-black hover:bg-white">
                                <span className="hidden">Contact Us</span>
                                <Phone size={24} className='stroke-1' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
        ;
}

export default SiteTopNavigation;