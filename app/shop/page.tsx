"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArtworkCard from "@/components/ArtworkCard";

const CATEGORIES = ["All", "Calligraphy", "Bismillah", "Quran Verse", "Name Art", "Abstract", "Custom"];

interface Artwork {
  _id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  available: boolean;
  dimensions?: string;
  medium?: string;
}

export default function ShopPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "All") params.set("category", activeCategory);
        const res = await fetch(`/api/artworks?${params}`);
        const data = await res.json();
        setArtworks(data);
      } catch {
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, [activeCategory]);

  const sorted = [...artworks].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="pt-[calc(72px+3rem)] sm:pt-[calc(80px+3.5rem)] pb-12 sm:pb-16 px-5 sm:px-8 lg:px-16 bg-[#FDFAF6] relative overflow-hidden">
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%23C9A96E' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23C9A96E' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='15' fill='none' stroke='%23C9A96E' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
          }}
        />
        <div className="max-w-7xl mx-auto">
          <p
            className="text-xs tracking-[0.4em] uppercase text-[#C9A96E] mb-3"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            Our Collection
          </p>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-light text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            The Shop
          </h1>
          <div className="arabesque-divider mt-6 max-w-sm opacity-50" />
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[72px] sm:top-20 z-40 bg-[#FDFAF6]/95 backdrop-blur-sm border-b border-[#E2D8CC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-xs tracking-[0.15em] uppercase transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-[#1A1A1A] text-[#FDFAF6] border-[#1A1A1A]"
                    : "bg-transparent text-[#4A4540] border-[#E2D8CC] hover:border-[#C9A96E] hover:text-[#C9A96E]"
                }`}
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs tracking-wide text-[#4A4540] bg-transparent border border-[#E2D8CC] px-3 py-1.5 focus:outline-none focus:border-[#C9A96E] cursor-pointer"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-10 sm:py-16 min-h-[60vh]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#E2D8CC] aspect-[3/4] rounded-sm" />
                <div className="mt-4 h-5 bg-[#E2D8CC] rounded w-3/4" />
                <div className="mt-2 h-4 bg-[#EAE0D0] rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p
              className="text-6xl text-[#C9A96E]/30 mb-6"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              فارغ
            </p>
            <p
              className="text-[#8A8480] text-sm tracking-wide"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              No artworks found in this category
            </p>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-6 text-xs tracking-[0.2em] uppercase text-[#C9A96E] border-b border-[#C9A96E] pb-0.5 hover:opacity-70 transition-opacity"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              View All Works
            </button>
          </div>
        ) : (
          <>
            <p
              className="text-xs text-[#8A8480] tracking-wide mb-8"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {sorted.length} {sorted.length === 1 ? "work" : "works"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sorted.map((art) => (
                <ArtworkCard
                  key={art._id}
                  id={art._id}
                  title={art.title}
                  price={art.price}
                  images={art.images}
                  category={art.category}
                  available={art.available}
                  dimensions={art.dimensions}
                  medium={art.medium}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
