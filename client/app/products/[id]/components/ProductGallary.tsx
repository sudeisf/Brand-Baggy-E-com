"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface ProductGalleryProps {
  mainImage: string;
  images: string[];
  name: string;
}

export default function ProductGalary({
  mainImage,
  images,
  name,
}: ProductGalleryProps) {
  const galleryImages = useMemo(() => {
    const list = [mainImage, ...(images || [])].filter(Boolean);
    return Array.from(new Set(list));
  }, [mainImage, images]);

  const [selectedImage, setSelectedImage] = useState<string>(
    galleryImages[0] || ""
  );

  useEffect(() => {
    setSelectedImage(galleryImages[0] || "");
  }, [galleryImages]);

  if (!selectedImage) {
    return (
      <div className="w-full aspect-[4/5] rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
        No image available
      </div>
    );
  }

  const progressSlots = galleryImages.slice(0, 4);

  return (
    <div className="relative w-full">
      {/* Progress indicators over the image */}
      {progressSlots.length > 1 && (
        <div className="absolute top-4 left-0 right-0 z-20 flex gap-1.5 px-3 md:px-4">
          {progressSlots.map((image) => (
            <button
              key={`bar-${image}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`h-1 flex-1 rounded-full transition-colors ${
                selectedImage === image ? "bg-white" : "bg-white/40"
              }`}
              aria-label="Select product image"
            />
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-50">
        <Image
          src={selectedImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          unoptimized
          onClick={() => mainImage && setSelectedImage(mainImage)}
        />
      </div>

      {/* Overlapping thumbnails */}
      {galleryImages.length > 1 && (
        <div className="relative -mt-16 md:-mt-24 z-20 flex justify-center gap-2 px-2">
          {galleryImages.slice(0, 4).map((image) => {
            const isActive = selectedImage === image;
            return (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`
                  relative overflow-hidden rounded-lg border-2 shadow-md transition-transform
                  w-20 h-16 sm:w-28 sm:h-20 md:w-24 md:h-16 lg:w-36 lg:h-24
                  ${isActive ? "border-[#331d67] scale-105" : "border-white hover:scale-105"}
                `}
              >
                <Image
                  src={image}
                  alt={`${name} thumbnail`}
                  fill
                  sizes="150px"
                  className="object-cover"
                  unoptimized
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
