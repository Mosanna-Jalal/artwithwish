import ImportFromUrl from "@/components/admin/ImportFromUrl";

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

      {/* Instructions */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 mb-8 max-w-2xl">
        <p
          className="text-sm text-[#C9A96E] font-medium mb-3"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          How to get image URLs from Instagram
        </p>
        <ol
          className="text-sm text-[#8A8480] flex flex-col gap-2 list-decimal list-inside"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          <li>Open your Instagram post in a browser (on desktop)</li>
          <li>Right-click the image → <span className="text-[#FDFAF6]">Open image in new tab</span></li>
          <li>Copy the URL from the address bar</li>
          <li>Paste it below — it uploads to Cloudinary automatically</li>
          <li>Then fill in the artwork details and save</li>
        </ol>
      </div>

      <ImportFromUrl />
    </div>
  );
}
