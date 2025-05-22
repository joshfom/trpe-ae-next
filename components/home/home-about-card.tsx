import React from 'react';
import {MoveRight} from "lucide-react";
import Link from "next/link";

interface HomeAboutCardProps {
    aboutCard: AboutCardType;
}
function HomeAboutCard({aboutCard}: HomeAboutCardProps) {
    return (
        <div className={'relative rounded-2xl border-white/30 border overflow-hidden'}>
            <div className="relative w-full h-48 lg:h-[400px]">
                <img 
                    className={'object-cover absolute inset-0 w-full h-full'} 
                    src={aboutCard.image} 
                    alt={aboutCard.title}
                />
            </div>
            <div className="absolute bg-black/40 text-white backdrop-blur-lg bottom-0 left-0 right-0">
                <Link href={aboutCard.url} className="flex p-2 lg:p-4 justify-between items-center">
                    <span className="text-lg lg:text-xl font-semibold">
                        {
                            aboutCard.title
                        }
                    </span>
                    <MoveRight size={24} className={'stroke-2'}/>
                </Link>
            </div>
        </div>
    );
}

export default HomeAboutCard;