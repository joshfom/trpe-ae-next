import React from 'react';
import {MoveRight} from "lucide-react";
import Link from "next/link";

interface HomeAboutCardProps {
    aboutCard: AboutCardType;
}
function HomeAboutCard({aboutCard}: HomeAboutCardProps) {
    return (
        <div className="relative rounded-lg sm:rounded-xl lg:rounded-2xl border-white/30 border overflow-hidden group hover:border-white/50 transition-colors">
            <div className="relative w-full h-32 sm:h-40 lg:h-[400px]">
                <img 
                    className="object-cover absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-300" 
                    src={aboutCard.image} 
                    alt={aboutCard.title}
                />
            </div>
            <div className="absolute bg-black/40 text-white backdrop-blur-lg bottom-0 left-0 right-0">
                <Link 
                    href={aboutCard.url} 
                    className="flex p-3 sm:p-4 lg:p-4 justify-between items-center hover:bg-black/20 transition-colors min-h-[44px]"
                >
                    <span className="text-sm sm:text-base lg:text-xl font-semibold">
                        {aboutCard.title}
                    </span>
                    <MoveRight size={20} className="sm:w-6 sm:h-6 lg:w-6 lg:h-6 stroke-2"/>
                </Link>
            </div>
        </div>
    );
}

export default HomeAboutCard;