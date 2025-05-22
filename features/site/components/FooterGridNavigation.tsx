'use client'
import React from 'react';
import Link from "next/link";

interface FooterGridNavigationProps {
    image: string,
    title: string,
    url: string,
    caption: string
}

function FooterGridNavigation({image, title, url, caption}: FooterGridNavigationProps) {
    const [isHovered, setIsHovered] = React.useState(false)


    return (
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
             className={'relative col-span-1 h-[350px] w-full rounded-3xl overflow-hidden'}>
            <img className={'z-0 w-full h-[350px] object-cover absolute inset-0'} src={image} alt={title}/>

            <div className={`absolute z-0 inset-0 ${isHovered ? 'bg-black/80' : 'bg-black/30'}`}>

            </div>

            <div className="absolute z-10 bottom-0 right-0 left-0 items-baseline bg-transparent">
                <div className={'text-white p-6 '}>
                    <h2 className={'text-2xl font-bold'}>{title}</h2>
                    {
                        isHovered &&
                        <div className="pt-4 text-sm flex flex-col gap-4">
                            <p>{caption}</p>
                            <div className={'pt-4'}>
                                <Link href={url}
                                      className={'py-2 px-5 mt-4 rounded-full border border-white text-white'}>View
                                    More</Link>
                            </div>
                        </div>
                    }
                </div>
            </div>

        </div>
    );
}

export default FooterGridNavigation;