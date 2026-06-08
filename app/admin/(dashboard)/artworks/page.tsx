import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import Link from "next/link";
import AdminArtworkActions from "@/components/admin/AdminArtworkActions";
import Image from "next/image";

async function getArtworks() {
  await connectDB();
  const artworks = await Artwork.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(artworks));
}

export default async function AdminArtworksPage() {
  const artworks = await getArtworks();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p
            className="text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-1"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            Manage
          </p>
          <h1
            className="text-3xl font-light text-[#FDFAF6]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Artworks
          </h1>
        </div>
        <Link
          href="/admin/artworks/new"
          className="px-6 py-3 bg-[#C9A96E] text-[#1A1A1A] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#E8D5B0] transition-colors"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          + Add Artwork
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-16 text-center">
          <p className="text-[#4A4540] text-sm mb-4"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            No artworks yet
          </p>
          <Link
            href="/admin/artworks/new"
            className="text-xs text-[#C9A96E] tracking-[0.2em] uppercase border-b border-[#C9A96E] pb-0.5"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            Add your first artwork
          </Link>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["Image", "Title", "Category", "Price", "Status", "Featured", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-4 text-xs tracking-[0.15em] uppercase text-[#4A4540]"
                      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {artworks.map((art: {
                  _id: string; title: string; price: number; images: string[];
                  category: string; available: boolean; featured: boolean;
                }) => (
                  <tr key={art._id} className="border-b border-[#222] hover:bg-[#1E1E1E] transition-colors">
                    <td className="px-4 py-3">
                      {art.images?.[0] ? (
                        <div className="relative w-12 h-12 overflow-hidden bg-[#2A2A2A]">
                          <Image src={art.images[0]} alt={art.title} fill className="object-cover" sizes="48px" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-[#2A2A2A] flex items-center justify-center">
                          <span className="text-[#4A4540] text-xs">–</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[#FDFAF6]"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                        {art.title}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#8A8480]"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                        {art.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#C9A96E]"
                        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
                        ${art.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 ${
                          art.available
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                      >
                        {art.available ? "Available" : "Sold"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs ${art.featured ? "text-[#C9A96E]" : "text-[#4A4540]"}`}
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                      >
                        {art.featured ? "✓" : "–"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AdminArtworkActions id={art._id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
