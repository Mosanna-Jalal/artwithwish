import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import ArtworkForm from "@/components/admin/ArtworkForm";

async function getArtwork(id: string) {
  await connectDB();
  const artwork = await Artwork.findById(id).lean();
  return artwork ? JSON.parse(JSON.stringify(artwork)) : null;
}

export default async function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artwork = await getArtwork(id);
  if (!artwork) notFound();

  return (
    <div className="p-8">
      <div className="mb-8">
        <p
          className="text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-1"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Artworks
        </p>
        <h1
          className="text-3xl font-light text-[#FDFAF6]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Edit: {artwork.title}
        </h1>
      </div>
      <ArtworkForm initial={artwork} mode="edit" />
    </div>
  );
}
