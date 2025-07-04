'use client'

import { useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import {ChevronLeft, ChevronRight} from "lucide-react";
import {cn} from "@/lib/utils";
import Image from "next/image";

export const ImageSwiper: React.FC<{ images: string[]; propertyName?: string; className?: string }> = ({
                                                                                    images,
                                                                                    className, propertyName
                                                                                }) => {
    const [imgIndex, setImgIndex] = useState(0)

    const dragX = useMotionValue(0)

    const onDragEnd = () => {
        const x = dragX.get()

        if (x <= -10 && imgIndex < images.length - 1) {
            setImgIndex((e) => e + 1)
        } else if (x >= 10 && imgIndex > 0) {
            setImgIndex((e) => e - 1)
        }
    }

    return (
        <div
            className={cn(
                'group/hover relative aspect-square h-full w-full overflow-hidden rounded-lg',
                className
            )}>
            <div className="pointer-events-none absolute top-1/2 z-10 flex w-full -translate-y-1/2 justify-between px-5 ">
                <button
                    style={imgIndex === 0 ? { opacity: 0 } : {}}
                    aria-label={'Previous Image'}
                    className="pointer-events-auto h-fit w-fit rounded-full bg-black/80 p-2 opacity-0 transition-all group-hover/hover:opacity-100"
                    onClick={() => {
                        if (imgIndex > 0) {
                            setImgIndex((pv) => pv - 1)
                        }
                    }}>
                    <span className="sr-only">Previous Image</span>
                    <ChevronLeft className="text-white" size={20} />
                </button>
                <button
                    style={imgIndex === images.length - 1 ? { opacity: 0 } : {}}
                    aria-label={'Next image'}
                    className="pointer-events-auto h-fit w-fit rounded-full bg-black/80 p-2  opacity-0 transition-all group-hover/hover:opacity-100"
                    onClick={() => {
                        if (imgIndex < images.length - 1) {
                            setImgIndex((pv) => pv + 1)
                        }
                    }}>
                    <span className="sr-only">Next Image</span>
                    <ChevronRight className="text-white" size={20} />
                </button>
            </div>
            <div className="pointer-events-none absolute bottom-2 z-10 flex w-full items-center justify-center">
                <div className="flex w-9 items-center justify-center rounded-md bg-black/80 p-0.5 text-xs text-white opacity-0 transition-all group-hover/hover:opacity-100">
                    <div>
                        {imgIndex + 1}/{images.length}
                    </div>
                </div>
            </div>
            <motion.div
                drag="x"
                dragConstraints={{
                    left: 0,
                    right: 0
                }}
                dragMomentum={false}
                style={{
                    x: dragX
                }}
                animate={{
                    translateX: `-${imgIndex * 100}%`
                }}
                onDragEnd={onDragEnd}
                transition={{ damping: 18, stiffness: 90, type: 'spring', duration: 0.2 }}
                className=" flex h-full cursor-grab items-center rounded-[inherit] active:cursor-grabbing">
                {images.map((src, i) => {
                    return (
                        <motion.div
                            key={i}
                            className="h-full w-full shrink-0 overflow-hidden bg-neutral-800 object-cover first:rounded-l-[inherit] last:rounded-r-[inherit]">
                            <Image
                                src={src}
                                alt={propertyName || 'Property Image'}
                                className="pointer-events-none h-full w-full object-cover"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={i === 0}
                            />
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}
