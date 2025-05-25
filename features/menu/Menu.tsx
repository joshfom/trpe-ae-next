'use client';
import React, { memo, useCallback } from 'react';
import Link from "next/link";
import {MoveRight} from "lucide-react";
import MenuFeaturedProperty from "@/features/site/components/MenuFeaturedProperty";

interface MenuProps {
    menuItem: {
        title: string;
        href: string;
        children: Array<Record<string, string>> | null;
    }
}

const TrpeMenu = memo(({ menuItem}: MenuProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const hasChildren = menuItem.children && menuItem.children.length > 0;

    // Memoize event handlers
    const handleMouseEnter = useCallback(() => setIsOpen(true), []);
    const handleMouseLeave = useCallback(() => setIsOpen(false), []);
    const handleLinkClick = useCallback(() => setIsOpen(false), []);

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={'text-slate-200 pt-4 hover:text-white'}
        >
           <Link href={menuItem.href} className="px-2 cursor-pointer">
                {
                    menuItem.title
                }
           </Link>

            {
                menuItem.children && isOpen ? (
                    <div className={'absolute z-30 top-16 left-0 bg-slate-900 rounded-lg h-[600px] overflow-hidden w-full'}>
                        <div className="grid grid-cols-6 ">
                           <div className="col-span-2 flex h-full pl-6  justify-between py-6 flex-col">
                               <div>
                                   <Link
                                       onClick={handleLinkClick}
                                       className={'py-4 px-4 flex items-center text-lg   border-b border-transparent hover:border-white'}
                                       href={`${menuItem.href}`}
                                   >
                                       All Property Types
                                       <MoveRight className={'text-white w-6 h-6 ml-4'}/>
                                   </Link>
                                   <Link
                                       onClick={handleLinkClick}
                                       className={'py-4 px-4 flex items-center text-lg   border-b border-transparent hover:border-white'}
                                       href={`${menuItem.href}?ty=apartments`}
                                   >
                                       Apartments {menuItem.title}
                                       <MoveRight className={'text-white w-6 h-6 ml-4'}/>
                                   </Link>

                                   <Link
                                       onClick={handleLinkClick}
                                       className={'py-4 px-4 flex items-center text-lg  border-b border-transparent hover:border-white'}
                                       href={`${menuItem.href}?ty=villa`}
                                   >
                                       Villas {menuItem.title}
                                       <MoveRight className={'text-white w-6 h-6 ml-4'}/>
                                   </Link>
                               </div>
                               <div>
                                   {
                                       menuItem.children.map((child, index) => (
                                           <Link
                                               onClick={handleLinkClick}
                                               className={'py-4 px-4 flex items-center text-lg border-b border-transparent hover:border-white'}
                                               key={index}
                                               href={child.href}
                                               title={child.title}
                                           >
                                               {child.title}
                                               <MoveRight className={'text-white w-6 h-6 ml-4'}/>
                                           </Link>
                                       ))
                                   }
                               </div>
                           </div>
                           <MenuFeaturedProperty offeringType={menuItem.href} />
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
});

TrpeMenu.displayName = 'TrpeMenu';

export default TrpeMenu;