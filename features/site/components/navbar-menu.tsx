"use client";
import React from "react";
import {motion} from "framer-motion";
import Link from "next/link";

const transition = {
    type: "spring",
    mass: 0.5,
    damping: 14,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001,
};

export const MenuItem = React.memo(({
                             setActive,
                             active,
                             item,
                             slug,
                             children,
                         }: {
    setActive: (slug: string) => void;
    active: string | null;
    slug: string;
    item: string | React.ReactNode;
    children?: React.ReactNode;
}) => {
    // Use useCallback for the event handler to prevent unnecessary re-renders
    const handleMouseEnter = React.useCallback(() => {
        setActive(slug);
    }, [setActive, slug]);
    
    return (
        <div onMouseEnter={handleMouseEnter} className="relative ">
            <motion.div
                transition={{duration: 0.8}}
                className="cursor-pointer text-white hover:opacity-[0.9] dark:text-white"
            >
                {item}
            </motion.div>
            {active !== null && (
                <motion.div
                    initial={{opacity: 0, scale: 0.85, y: 10}}
                    animate={{opacity: 1, scale: 1, y: 0}}
                    transition={transition}
                >
                    {active === slug && (
                        <div className="absolute pt-6 left-0 transform -translate-x-0 z-[99999]">
                            <motion.div
                                transition={transition}
                                layoutId="active" // layoutId ensures smooth animation
                                className="bg-stone-900 dark:bg-black backdrop-blur-xs rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
                            >
                                <motion.div
                                    layout // layout ensures smooth animation
                                    className="w-max h-full p-4"
                                >
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
});

export const Menu = ({
                         setActive,
                         children,
                     }: {
    setActive: (item: string | null) => void;
    children: React.ReactNode;
}) => {
    return (
        <nav
            onMouseLeave={() => setActive(null)} // resets the state
            className="relative mx-auto  text-white boder border-transparent dark:bg-black dark:border-white/[0.2] shadow-input flex justify-betwen items-center space-x-4 pr-4 py-2 "
        >
            {children}
        </nav>
    );
};

export const HoveredLink = ({children, ...rest}: any) => {
    return (
        <Link
            {...rest}
            className="text-neutral-700 dark:text-neutral-200 hover:text-black "
        >
            {children}
        </Link>
    );
};
