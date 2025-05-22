"use client"
import {HTMLAttributes, useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import WaveReveal from "@/components/wave-reveal";
import Link from "next/link";

interface ImageProps extends HTMLAttributes<HTMLDivElement> {
    item: CommunityType;
    index: number;
    activeItem: number;
}

interface ExpandableProps {
    list: CommunityType[];
    autoPlay?: boolean;
    className?: string;
}

const List = ({item, className, index, activeItem, ...props}: ImageProps) => {
    return (
        <div
            className={cn(
                "relative flex h-full w-20 min-w-10 cursor-pointer overflow-hidden rounded-md transition-all delay-0 duration-300 ease-in-out",
                {
                    "grow": index === activeItem,
                },
                className,
            )}
            {...props}
        >
            <Link href={`/communities/${item.slug}`} className="relative h-full w-full">
                <img
                    src={item.image}
                    alt={item.name}
                    className={cn("object-cover absolute inset-0 w-full h-full", {
                        // "blur-[1px]": index !== activeItem,
                    })}
                />
            </Link>
            {index === activeItem && (
                <div className="absolute bottom-4 left-4 min-w-fit text-white md:bottom-8 md:left-8">
                    <Link href={`/communities/${item.slug}`}>
                        <WaveReveal
                            duration="1000ms"
                            className="items-start justify-start text-xl sm:text-2xl md:text-4xl"
                            text={item.name}
                            direction="up"
                        />
                    </Link>
                </div>
            )}
        </div>
    );
};


export default function Expandable({list, autoPlay = true, className}: ExpandableProps) {
    const [activeItem, setActiveItem] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (!autoPlay) {
            return;
        }

        const interval = setInterval(() => {
            if (!isHovering) {
                setActiveItem((prev) => (prev + 1) % list.length);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [autoPlay, list.length, isHovering]);

    return (
        <div className={cn("flex h-[500px] w-full gap-1", className)}>
            {list.map((item, index) => (
                <List
                    key={item.name}
                    item={item}
                    index={index}
                    activeItem={activeItem}
                    onMouseEnter={() => {
                        setActiveItem(index);
                        setIsHovering(true);
                    }}
                    onMouseLeave={() => {
                        setIsHovering(false);
                    }}
                />
            ))}
        </div>
    );
}
