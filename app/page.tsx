import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArtworkCard from "@/components/ArtworkCard";
import ModelLayer from "@/components/ModelLayer";
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";

// Always read fresh from the database (no static caching of artwork data)
export const dynamic = "force-dynamic";

async function getFeaturedArtworks() {
  try {
    await connectDB();
    const artworks = await Artwork.find({ featured: true }).limit(6).lean();
    return JSON.parse(JSON.stringify(artworks));
  } catch {
    return [];
  }
}

// Four pieces (with images) for the "Craft" section collage — skip the ones
// already shown in Featured above to avoid repeats.
async function getCraftArtworks() {
  try {
    await connectDB();
    const artworks = await Artwork.find({ images: { $exists: true, $ne: [] } })
      .sort({ createdAt: 1 })
      .limit(4)
      .lean();
    return JSON.parse(JSON.stringify(artworks));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedArtworks();
  const craft = await getCraftArtworks();

  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════════════════
          HERO — all 3D models as a faint background layer,
          text overlaid on top
      ══════════════════════════════════════════════════ */}
      <section className="relative bg-[#FDFAF6] min-h-screen overflow-x-hidden">

        {/* ── HERO MODEL ── full opacity ── */}
        <ModelLayer modelUrl="/api/hero-model" opacity={1} />

        {/* Soft cream vignette behind the centred text for legibility */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at center, rgba(253,250,246,0.72) 0%, rgba(253,250,246,0.35) 55%, rgba(253,250,246,0) 100%)",
          }}
        />

        {/* ── TEXT — flex-centred (reliable, unlike mx-auto) ── */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-5 sm:px-8 pt-[72px] pb-16">
          <p
            className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#C9A96E] mb-5"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            Handcrafted Arabic Calligraphy
          </p>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-light text-[#1A1A1A] mb-6 leading-[1.1]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Art{" "}
            <em className="not-italic gold-text">Woven</em>
            <br />
            in Words
          </h1>

          <div className="arabesque-divider my-6 sm:my-8 max-w-[240px] mx-auto opacity-60" />

          <p
            className="text-sm sm:text-base text-[#4A4540] max-w-xl mx-auto leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            Each piece begins with a single breath — a wish expressed through the timeless
            beauty of Arabic letters, written to last a lifetime.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="px-9 py-4 bg-[#1A1A1A] text-[#FDFAF6] text-[10px] sm:text-xs tracking-[0.25em] uppercase hover:bg-[#C9A96E] transition-colors duration-300"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Explore Collection
            </Link>
            <Link
              href="/about"
              className="px-9 py-4 border border-[#C9A96E] text-[#C9A96E] text-[10px] sm:text-xs tracking-[0.25em] uppercase hover:bg-[#C9A96E] hover:text-[#FDFAF6] transition-all duration-300"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Our Story
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="flex justify-center mt-12">
            <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#C9A96E] animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="bg-[#1A1A1A] py-3 sm:py-4 overflow-hidden">
        <div
          className="flex gap-12 sm:gap-16 whitespace-nowrap"
          style={{ animation: "marquee 20s linear infinite" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="text-[9px] sm:text-xs tracking-[0.3em] uppercase text-[#C9A96E]/60"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Arabic Calligraphy &nbsp;✦&nbsp; Handcrafted Art &nbsp;✦&nbsp; Made with Love &nbsp;✦&nbsp;
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      </div>

      {/* ── FEATURED ── */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Scene model drifting behind the section */}
        <ModelLayer modelUrl="/models/scene-2.glb" opacity={1} />
        <div className="absolute inset-0 z-[1] bg-[#FDFAF6]/25 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-16">
            <div>
              <p
                className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-2 sm:mb-3"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Featured Works
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] font-light"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Selected Pieces
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#4A4540] border-b border-[#C9A96E] pb-0.5 hover:text-[#C9A96E] transition-colors"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              View All →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {featured.map((art: {
                _id: string; title: string; price: number; images: string[];
                category: string; available: boolean; dimensions?: string; medium?: string;
              }) => (
                <ArtworkCard key={art._id} id={art._id} title={art.title} price={art.price}
                  images={art.images} category={art.category} available={art.available}
                  dimensions={art.dimensions} medium={art.medium} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {[
                { title: "بسم الله", subtitle: "In the Name of God" },
                { title: "الحمد لله", subtitle: "Praise be to God" },
                { title: "ما شاء الله", subtitle: "What God has willed" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#F5EFE4] to-[#EAE0D0] aspect-[3/4] flex items-center justify-center">
                    <div className="text-center px-6 sm:px-8">
                      <p className="text-4xl sm:text-5xl text-[#C9A96E]/50 mb-3 font-light"
                        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
                        {item.title}
                      </p>
                      <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#8A8480]"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                        {item.subtitle}
                      </p>
                    </div>
                    <div className="absolute inset-0 border border-[#E2D8CC]" />
                  </div>
                  <div className="mt-3 px-1">
                    <div className="h-4 bg-[#E2D8CC] rounded w-3/4 mb-2" />
                    <div className="h-3 bg-[#EAE0D0] rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="arabesque-divider max-w-2xl mx-auto opacity-50" />

      {/* ── CRAFT ── */}
      {/* 3-column grid: [3D model] [text] [images] */}
      <section className="relative overflow-hidden bg-[#FDFAF6]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-stretch">

            {/* ── LEFT: dedicated 3D model panel ── */}
            <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-0 bg-[#F5EFE4] border border-[#E2D8CC] overflow-hidden">
              <ModelLayer modelUrl="/models/arabic-alphabet.glb" opacity={1} />
              {/* subtle label */}
              <span
                className="absolute bottom-3 left-0 right-0 text-center text-[9px] tracking-[0.25em] uppercase text-[#C9A96E]/60 z-10"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Arabic Calligraphy
              </span>
            </div>

            {/* ── MIDDLE: text ── */}
            <div className="flex flex-col justify-center">
              <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-3"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                The Craft
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-light text-[#1A1A1A] mb-6 leading-tight"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Every stroke<br />tells a story
              </h2>
              <p className="text-sm text-[#4A4540] leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Arabic calligraphy is one of the most refined forms of art known to humankind.
                Rooted in centuries of tradition, each letter carries weight, breath, and intention.
              </p>
              <p className="text-sm text-[#4A4540] leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                ArtWithWish pieces are created using traditional tools — ensuring each work is
                a unique expression, not a reproduction.
              </p>
              <Link href="/about"
                className="inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#1A1A1A] border-b border-[#1A1A1A] pb-0.5 hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all duration-300 self-start"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Read Our Story
              </Link>
            </div>

            {/* ── RIGHT: Instagram image collage ── */}
            <div className="grid grid-cols-2 gap-3">
              {craft.length > 0
                ? craft.map((art: { _id: string; title: string; images: string[] }) => (
                    <Link
                      key={art._id}
                      href={`/artwork/${art._id}`}
                      className="relative aspect-square overflow-hidden border border-[#E2D8CC] group"
                    >
                      <Image
                        src={art.images[0]}
                        alt={art.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/30 transition-colors duration-500" />
                      <span
                        className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-[9px] tracking-[0.1em] uppercase text-[#FDFAF6] bg-gradient-to-t from-[#1A1A1A]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                      >
                        {art.title}
                      </span>
                    </Link>
                  ))
                : [
                    { char: "ب", name: "Ba" }, { char: "ن", name: "Nun" },
                    { char: "ع", name: "Ayn" }, { char: "م", name: "Meem" },
                  ].map((letter) => (
                    <div key={letter.char}
                      className="aspect-square bg-gradient-to-br from-[#F5EFE4] to-[#EAE0D0] flex flex-col items-center justify-center border border-[#E2D8CC]">
                      <span className="text-4xl sm:text-5xl text-[#C9A96E]/60"
                        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
                        {letter.char}
                      </span>
                      <span className="mt-1 text-[9px] tracking-[0.2em] uppercase text-[#8A8480]"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                        {letter.name}
                      </span>
                    </div>
                  ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ── clean centered, no model ── */}
      <section className="bg-[#1A1A1A] py-20 sm:py-28 relative overflow-hidden">
        {/* subtle tiled pattern only */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='28' fill='none' stroke='%23C9A96E' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }} />

        <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-8">
          <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#C9A96E] mb-5"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            Commission a Piece
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-[#FDFAF6] font-light mb-5 leading-tight max-w-3xl"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Your words, your language,<br />
            <em className="not-italic gold-text">your art</em>
          </h2>
          <div className="arabesque-divider w-[180px] mb-7 opacity-30 invert" />
          <p className="text-sm sm:text-base text-[#8A8480] mb-9 leading-relaxed max-w-xl"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            Have a verse, a name, or a meaningful phrase? We can turn it into a
            bespoke calligraphy piece made just for you.
          </p>
          <Link href="/contact"
            className="inline-block px-10 sm:px-14 py-4 bg-[#C9A96E] text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.3em] uppercase hover:bg-[#E8D5B0] transition-all duration-300"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            Start a Commission
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
