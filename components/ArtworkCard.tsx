"use client";

import Link from "next/link";
import Image from "next/image";

interface ArtworkCardProps {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  available: boolean;
  dimensions?: string;
  medium?: string;
}

export default function ArtworkCard({
  id, title, price, images, category, available, dimensions, medium,
}: ArtworkCardProps) {
  const image = images?.[0] || "/placeholder.jpg";

  return (
    <Link href={`/artwork/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-sm bg-[#F5EFE4] aspect-[3/4]">
        {/* Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/20 transition-all duration-500" />

        {/* Availability badge */}
        {!available && (
          <div className="absolute top-3 left-3 bg-[#1A1A1A]/80 text-[#C9A96E] text-[10px] tracking-[0.2em] uppercase px-3 py-1.5">
            Sold
          </div>
        )}

        {/* Category */}
        <div className="absolute top-3 right-3 bg-[#FDFAF6]/90 text-[#4A4540] text-[10px] tracking-[0.15em] uppercase px-3 py-1.5">
          {category}
        </div>

        {/* Quick info on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent px-4 py-4 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
          {dimensions && (
            <p className="text-[#E2D8CC] text-xs tracking-wide mb-1">{dimensions}</p>
          )}
          {medium && (
            <p className="text-[#C9A96E] text-xs tracking-wide">{medium}</p>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 px-1">
        <h3
          className="text-[#1A1A1A] text-xl font-light leading-snug group-hover:text-[#C9A96E] transition-colors duration-300"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {title}
        </h3>
        <p className="mt-1 text-sm text-[#4A4540] tracking-wide">
          {available ? (
            <span className="text-[#C9A96E] font-medium">
              ${price.toLocaleString()}
            </span>
          ) : (
            <span className="text-[#8A8480] line-through">${price.toLocaleString()}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
