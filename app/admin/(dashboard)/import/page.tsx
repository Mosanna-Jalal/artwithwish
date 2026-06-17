import ImportFromUrl from "@/components/admin/ImportFromUrl";
import InstagramSync from "@/components/admin/InstagramSync";

export default function ImportPage() {
  return (
    <div className="p-5 sm:p-8">
      <div className="mb-8">
        <p
          className="text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-1"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Tools
        </p>
        <h1
          className="text-3xl font-light text-[#FDFAF6]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Import from Instagram
        </h1>
      </div>

      {/* One-click incremental sync */}
      <InstagramSync />

      {/* Manual single-image import */}
      <div className="border-t border-[#2A2A2A] pt-8">
        <p
          className="text-sm text-[#C9A96E] font-medium mb-1"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Or add one piece manually from an image URL
        </p>
        <p
          className="text-xs text-[#8A8480] mb-5"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Open a post → right-click the image → &quot;Open image in new tab&quot; → paste the URL below.
        </p>
        <ImportFromUrl />
      </div>
    </div>
  );
}
