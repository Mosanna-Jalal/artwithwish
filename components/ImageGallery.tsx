"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  videos?: string[];
  title: string;
}

type Media = { type: "image" | "video"; url: string };

// Cloudinary video URL → still-frame thumbnail (swap extension for .jpg)
function videoPoster(url: string) {
  return url.replace(/\.(mp4|mov|webm|m4v)(\?.*)?$/i, ".jpg");
}

export default function ImageGallery({ images, videos = [], title }: ImageGalleryProps) {
  const media: Media[] = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...videos.map((url) => ({ type: "video" as const, url })),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!media.length) {
    return (
      <div className="aspect-square bg-[#F5EFE4] flex items-center justify-center border border-[#E2D8CC]">
        <p className="text-[#8A8480] text-sm tracking-wide"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
          No media available
        </p>
      </div>
    );
  }

  const active = media[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main view */}
      <div className="relative aspect-square bg-[#F5EFE4] overflow-hidden border border-[#E2D8CC]">
        {active.type === "video" ? (
          <video
            key={active.url}
            src={active.url}
            controls
            playsInline
            poster={videoPoster(active.url)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="relative w-full h-full cursor-zoom-in group"
            onClick={() => setLightboxOpen(true)}
          >
            <Image
              src={active.url}
              alt={`${title} - ${activeIndex + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute bottom-4 right-4 bg-[#FDFAF6]/80 backdrop-blur-sm px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs tracking-[0.15em] text-[#4A4540]"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Click to enlarge
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all duration-200 ${
                i === activeIndex ? "border-[#C9A96E]" : "border-transparent hover:border-[#E2D8CC]"
              }`}
            >
              <Image
                src={m.type === "video" ? videoPoster(m.url) : m.url}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              {m.type === "video" && (
                <span className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]/30">
                  <span className="text-[#FDFAF6] text-lg">▶</span>
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox (images only) */}
      {lightboxOpen && active.type === "image" && (
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
          <div className="relative max-w-4xl max-h-[85vh] w-full mx-12" onClick={(e) => e.stopPropagation()}>
            <Image
              src={active.url}
              alt={`${title} - full view`}
              width={1200}
              height={1200}
              className="object-contain w-full h-full max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
