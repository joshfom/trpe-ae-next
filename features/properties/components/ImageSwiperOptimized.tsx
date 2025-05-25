'use client'

import React, { useState, useCallback, useMemo } from 'react'
import {motion, useMotionValue} from 'framer-motion'
import {ChevronLeft, ChevronRight, ImageIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import Image from "next/image";

interface ImageSwiperProps {
    images: { crmUrl: string; url?: string }[];
    propertyName?: string;
    className?: string;
    onViewGallery?: () => void;
}

const ImageSwiperOptimized = React.memo<ImageSwiperProps>(({
    images,
    className,
    propertyName,
    onViewGallery
}) => {
    const [imgIndex, setImgIndex] = useState(0);
    const dragX = useMotionValue(0);

    // Memoized values for better performance
    const hasImages = useMemo(() => images && images.length > 0, [images]);
    const currentImage = useMemo(() => images?.[imgIndex], [images, imgIndex]);
    const canGoPrevious = useMemo(() => imgIndex > 0, [imgIndex]);
    const canGoNext = useMemo(() => imgIndex < (images?.length || 0) - 1, [imgIndex, images?.length]);
    const totalImages = useMemo(() => images?.length || 0, [images?.length]);

    // Memoized callbacks
    const onDragEnd = useCallback(() => {
        const x = dragX.get();

        if (x <= -10 && canGoNext) {
            setImgIndex((prev) => prev + 1);
        } else if (x >= 10 && canGoPrevious) {
            setImgIndex((prev) => prev - 1);
        }
    }, [dragX, canGoNext, canGoPrevious]);

    const handlePrevious = useCallback(() => {
        if (canGoPrevious) {
            setImgIndex((prev) => prev - 1);
        }
    }, [canGoPrevious]);

    const handleNext = useCallback(() => {
        if (canGoNext) {
            setImgIndex((prev) => prev + 1);
        }
    }, [canGoNext]);

    const handleViewGallery = useCallback(() => {
        onViewGallery?.();
    }, [onViewGallery]);

    // Show placeholder if no images
    if (!hasImages) {
        return (
            <div className={cn(
                'relative aspect-square h-full w-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center',
                className
            )}>
                <ImageIcon className="w-16 h-16 text-gray-400" />
                <span className="sr-only">No images available</span>
            </div>
        );
    }

    return (
        <div className={cn(
            'group/hover relative aspect-square h-full w-full overflow-hidden rounded-lg',
            className
        )}>
            {/* Main Image */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x: dragX }}
                animate={{ translateX: `-${imgIndex * 100}%` }}
                onDragEnd={onDragEnd}
                className="flex h-full cursor-grab active:cursor-grabbing"
            >
                {images.map((image, idx) => (
                    <motion.div
                        key={idx}
                        className="relative min-w-full h-full"
                        animate={{ scale: imgIndex === idx ? 1 : 0.95 }}
                        transition={{ type: 'spring', mass: 3, stiffness: 400, damping: 50 }}
                    >
                        <Image
                            src={image.crmUrl || image.url || '/images/placeholder.jpg'}
                            alt={`${propertyName || 'Property'} - Image ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 67vw, 50vw"
                            loading={idx === 0 ? "eager" : "lazy"}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Navigation Arrows */}
            {totalImages > 1 && (
                <div className="pointer-events-none absolute top-1/2 z-10 flex w-full -translate-y-1/2 justify-between px-5">
                    <button
                        style={{ opacity: canGoPrevious ? 1 : 0 }}
                        aria-label="Previous Image"
                        className="pointer-events-auto h-fit w-fit rounded-full bg-black/80 p-2 opacity-0 transition-all group-hover/hover:opacity-100 hover:bg-black/90"
                        onClick={handlePrevious}
                        disabled={!canGoPrevious}
                    >
                        <span className="sr-only">Previous Image</span>
                        <ChevronLeft className="text-white" size={20} />
                    </button>
                    <button
                        style={{ opacity: canGoNext ? 1 : 0 }}
                        aria-label="Next image"
                        className="pointer-events-auto h-fit w-fit rounded-full bg-black/80 p-2 opacity-0 transition-all group-hover/hover:opacity-100 hover:bg-black/90"
                        onClick={handleNext}
                        disabled={!canGoNext}
                    >
                        <span className="sr-only">Next Image</span>
                        <ChevronRight className="text-white" size={20} />
                    </button>
                </div>
            )}

            {/* Dots Indicator */}
            {totalImages > 1 && (
                <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            className={cn(
                                "h-2 w-2 rounded-full transition-all",
                                idx === imgIndex ? "bg-white" : "bg-white/50"
                            )}
                            onClick={() => setImgIndex(idx)}
                            aria-label={`Go to image ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Image Counter */}
            {totalImages > 1 && (
                <div className="absolute top-4 right-4 z-10 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
                    {imgIndex + 1} / {totalImages}
                </div>
            )}

            {/* View Gallery Button */}
            {onViewGallery && totalImages > 1 && (
                <button
                    onClick={handleViewGallery}
                    className="absolute bottom-4 right-4 z-10 rounded-lg bg-black/70 px-3 py-2 text-sm text-white transition-all hover:bg-black/90"
                >
                    View Gallery
                </button>
            )}
        </div>
    );
});

ImageSwiperOptimized.displayName = 'ImageSwiperOptimized';

export { ImageSwiperOptimized };
