"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    sizes?: string;
    blurDataURL?: string;
}

export function ProgressiveImage({
    src,
    alt,
    width,
    height,
    fill = false,
    className,
    priority = false,
    sizes,
    blurDataURL
}: ProgressiveImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    // Generate a tiny blur placeholder if none provided
    const defaultBlurData = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='none' style='filter: url(%23b);' href='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='/%3E%3C/svg%3E";

    const imageProps = {
        alt,
        className: cn(
            "transition-all duration-700",
            isLoading ? "blur-lg scale-105" : "blur-0 scale-100",
            className
        ),
        onLoad: () => setIsLoading(false),
        placeholder: "blur" as const,
        blurDataURL: blurDataURL || defaultBlurData,
        priority,
        sizes
    };

    if (fill) {
        return (
            <Image
                src={src}
                fill
                alt={alt}
                {...imageProps}
            />
        );
    }

    if (width && height) {
        return (
            <Image
                src={src}
                width={width}
                height={height}
                alt={alt}
                {...imageProps}
            />
        );
    }

    // Fallback: use fill if no dimensions provided
    return (
        <Image
            src={src}
            fill
            alt={alt}
            {...imageProps}
        />
    );
}
