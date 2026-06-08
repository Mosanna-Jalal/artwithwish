"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images?.length) {
    return (
      <div className="aspect-square bg-[#F5EFE4] flex items-center justify-center border border-[#E2D8CC]">
        <p className="text-[#8A8480] text-sm tracking-wide"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
          No images available
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative aspect-square bg-[#F5EFE4] overflow-hidden cursor-zoom-in group"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={images[activeIndex]}
          alt={`${title} - image ${activeIndex + 1}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/5 transition-all duration-300" />
        <div className="absolute bottom-4 right-4 bg-[#FDFAF6]/80 backdrop-blur-sm px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs tracking-[0.15em] text-[#4A4540]"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            Click to enlarge
          </p>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all duration-200 ${
                i === activeIndex
                  ? "border-[#C9A96E]"
                  : "border-transparent hover:border-[#E2D8CC]"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#1A1A1A]/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-[#FDFAF6] text-3xl leading-none hover:text-[#C9A96E] transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>

          {/* Prev/Next */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-6 text-[#FDFAF6] text-2xl hover:text-[#C9A96E] transition-colors p-3"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i - 1 + images.length) % images.length);
                }}
              >
                ‹
              </button>
              <button
                className="absolute right-16 text-[#FDFAF6] text-2xl hover:text-[#C9A96E] transition-colors p-3"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i + 1) % images.length);
                }}
              >
                ›
              </button>
            </>
          )}

          <div
            className="relative max-w-4xl max-h-[85vh] w-full mx-12"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} - full view`}
              width={1200}
              height={1200}
              className="object-contain w-full h-full max-h-[85vh]"
            />
          </div>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-[#8A8480] tracking-[0.2em]"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
  );
}
