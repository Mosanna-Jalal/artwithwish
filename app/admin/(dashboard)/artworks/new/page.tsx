import ArtworkForm from "@/components/admin/ArtworkForm";

export default function NewArtworkPage() {
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
          Add New Artwork
        </h1>
      </div>
      <ArtworkForm mode="create" />
    </div>
  );
}
