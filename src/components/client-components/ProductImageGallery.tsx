"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

type Props = {
  images: string[];
  alt: string;
  variantImages?: string[];
};

export default function ProductImageGallery({ images, alt, variantImages }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageList, setImageList] = useState(images);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Handle variant-based image switching
  useEffect(() => {
    if (variantImages && variantImages.length > 0) {
      setImageList(variantImages);
      setSelectedIndex(0);
    } else {
      setImageList(images);
    }
  }, [variantImages, images]);

  const selectedImage = imageList[selectedIndex];

  // Swipe handler
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const delta = touchEndX.current - touchStartX.current;

    if (Math.abs(delta) > 50) {
      if (delta < 0 && selectedIndex < imageList.length - 1) {
        setSelectedIndex((prev) => prev + 1); // swipe left → next
      } else if (delta > 0 && selectedIndex > 0) {
        setSelectedIndex((prev) => prev - 1); // swipe right → previous
      }
    }
  };

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-3">
        {imageList.map((img, idx) => (
          <div
            key={img}
            onClick={() => setSelectedIndex(idx)}
            className={`border rounded overflow-hidden cursor-pointer w-[60px] h-[60px] relative ${
              selectedIndex === idx ? "ring-2 ring-primary" : ""
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${idx}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="relative w-full aspect-square rounded overflow-hidden border"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={selectedImage}
          alt={alt}
          fill
          className="object-contain transition-opacity duration-300 ease-in-out"
        />
      </div>
    </div>
  );
}
