import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import OrderForm from "@/components/OrderForm";
import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import Link from "next/link";

// Always read fresh from the database
export const dynamic = "force-dynamic";

async function getArtwork(id: string) {
  try {
    await connectDB();
    const artwork = await Artwork.findById(id).lean();
    if (!artwork) return null;
    return JSON.parse(JSON.stringify(artwork));
  } catch {
    return null;
  }
}

export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artwork = await getArtwork(id);
  if (!artwork) notFound();

  return (
    <>
      <Navbar />

      <main className="pt-[72px] sm:pt-20 min-h-screen bg-[#FDFAF6]">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 pt-8 sm:pt-10 pb-0">
          <nav
            className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#8A8480]"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            <Link href="/" className="hover:text-[#C9A96E] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#C9A96E] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#4A4540]">{artwork.title}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <ImageGallery images={artwork.images} title={artwork.title} />

          {/* Details */}
          <div className="flex flex-col">
            {/* Category */}
            <p
              className="text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-4"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {artwork.category}
            </p>

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl font-light text-[#1A1A1A] mb-4 leading-tight"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              {artwork.title}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              {artwork.available ? (
                <p
                  className="text-3xl font-light text-[#C9A96E]"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  ${artwork.price.toLocaleString()}
                </p>
              ) : (
                <p
                  className="text-2xl font-light text-[#8A8480] line-through"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  ${artwork.price.toLocaleString()}
                </p>
              )}
              {!artwork.available && (
                <span
                  className="text-xs tracking-[0.2em] uppercase px-3 py-1 bg-[#1A1A1A]/10 text-[#4A4540]"
                  style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                >
                  Sold
                </span>
              )}
            </div>

            <div className="arabesque-divider my-6 opacity-40" />

            {/* Description */}
            <p
              className="text-[#4A4540] leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {artwork.description}
            </p>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {artwork.dimensions && (
                <div>
                  <p
                    className="text-xs tracking-[0.2em] uppercase text-[#8A8480] mb-1"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    Dimensions
                  </p>
                  <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                    {artwork.dimensions}
                  </p>
                </div>
              )}
              {artwork.medium && (
                <div>
                  <p
                    className="text-xs tracking-[0.2em] uppercase text-[#8A8480] mb-1"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    Medium
                  </p>
                  <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                    {artwork.medium}
                  </p>
                </div>
              )}
            </div>

            {/* Order form or sold notice */}
            {artwork.available ? (
              <OrderForm
                artworkId={artwork._id}
                artworkTitle={artwork.title}
                artworkPrice={artwork.price}
              />
            ) : (
              <div className="border border-[#E2D8CC] p-6 text-center">
                <p
                  className="text-[#4A4540] text-sm mb-4"
                  style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                >
                  This piece has found its home. Interested in a similar commission?
                </p>
                <Link
                  href="/contact"
                  className="inline-block px-8 py-3 border border-[#C9A96E] text-[#C9A96E] text-xs tracking-[0.2em] uppercase hover:bg-[#C9A96E] hover:text-[#FDFAF6] transition-all duration-300"
                  style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                >
                  Request Commission
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
