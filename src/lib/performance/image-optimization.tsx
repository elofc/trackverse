"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Optimized Image component with loading states and blur placeholder
type OptimizedImageProps = Omit<ImageProps, "onLoad" | "onError"> & {
  fallbackSrc?: string;
  showSkeleton?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
};

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/images/placeholder.png",
  showSkeleton = true,
  aspectRatio = "auto",
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  return (
    <div className={cn("relative overflow-hidden", aspectClasses[aspectRatio], className)}>
      {showSkeleton && isLoading && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}

// Avatar with fallback initials
type AvatarImageProps = {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
};

export function AvatarImage({ src, alt, size = 40, className }: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  const initials = alt
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold",
          className
        )}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-full object-cover", className)}
      onError={() => setHasError(true)}
    />
  );
}

// Responsive image with srcset
type ResponsiveImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function ResponsiveImage({
  src,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className,
  priority = false,
}: ResponsiveImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}

// Blur hash placeholder generator (simplified)
export function generateBlurDataURL(width: number, height: number): string {
  const shimmer = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#27272a"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${Buffer.from(shimmer).toString("base64")}`;
}

// Image preloader utility
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Preload multiple images
export async function preloadImages(srcs: string[]): Promise<void> {
  await Promise.all(srcs.map(preloadImage));
}
