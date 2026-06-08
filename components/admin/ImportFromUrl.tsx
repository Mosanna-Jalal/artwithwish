"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Calligraphy", "Bismillah", "Quran Verse", "Name Art", "Abstract", "Custom"];

interface UploadedImage {
  url: string;
  publicId: string;
}

export default function ImportFromUrl() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Calligraphy",
    dimensions: "",
    medium: "",
    available: true,
    featured: false,
  });

  const uploadUrl = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setUploading(true);
    setUploadError("");
    try {
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setImages((prev) => [...prev, { url: data.url, publicId: data.publicId }]);
      setUrlInput("");
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i: number) => setImages((p) => p.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!form.title || !form.price || images.length === 0) return;
    setSaving(true);
    await fetch("/api/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        images: images.map((i) => i.url),
      }),
    });
    setSaving(false);
    setSaved(true);
    // Reset
    setImages([]);
    setForm({ title: "", description: "", price: "", category: "Calligraphy", dimensions: "", medium: "", available: true, featured: false });
    router.refresh();
  };

  const inputClass =
    "w-full bg-[#111] border border-[#2A2A2A] text-[#FDFAF6] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors placeholder-[#3A3A3A]";
  const labelClass =
    "block text-xs tracking-[0.15em] uppercase text-[#6A6460] mb-1.5";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-5xl">
      {/* Left: image import */}
      <div className="flex flex-col gap-5">
        <p
          className="text-xs tracking-[0.2em] uppercase text-[#8A8480]"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Step 1 — Add images from URL
        </p>

        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && uploadUrl()}
            placeholder="Paste image URL (from Instagram, etc.)"
            className="flex-1 bg-[#111] border border-[#2A2A2A] text-[#FDFAF6] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors placeholder-[#3A3A3A]"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          />
          <button
            onClick={uploadUrl}
            disabled={uploading || !urlInput.trim()}
            className="px-5 py-3 bg-[#C9A96E] text-[#1A1A1A] text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#E8D5B0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            {uploading ? "Uploading…" : "Add"}
          </button>
        </div>

        {uploadError && (
          <p
            className="text-xs text-red-400"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            {uploadError}
          </p>
        )}

        {/* Uploaded image previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square group">
                <Image
                  src={img.url}
                  alt={`uploaded ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                {i === 0 && (
                  <span
                    className="absolute bottom-0 left-0 right-0 bg-[#C9A96E] text-[#1A1A1A] text-[9px] text-center py-0.5"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="border border-dashed border-[#2A2A2A] p-8 text-center">
            <p
              className="text-sm text-[#4A4540]"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              No images yet — paste a URL above
            </p>
          </div>
        )}
      </div>

      {/* Right: artwork details */}
      <div className="flex flex-col gap-5">
        <p
          className="text-xs tracking-[0.2em] uppercase text-[#8A8480]"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Step 2 — Artwork details
        </p>

        {saved && (
          <div className="bg-green-500/10 border border-green-500/20 p-3">
            <p
              className="text-xs text-green-400"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              ✓ Artwork saved! Ready for the next one.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              placeholder="e.g. Bismillah in Thuluth" />
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Price (USD) *</label>
            <input type="number" min="0" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className={inputClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              placeholder="e.g. 350" />
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Dimensions</label>
            <input value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              className={inputClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              placeholder="e.g. 40cm × 60cm" />
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Medium</label>
            <input value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value })}
              className={inputClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              placeholder="e.g. Ink on cotton paper" />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Description</label>
            <textarea rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputClass} resize-none`}
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              placeholder="Describe the piece…" />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          {[
            { key: "available", label: "Available" },
            { key: "featured", label: "Featured on Homepage" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm({ ...form, [key]: !form[key as keyof typeof form] })}
                className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center ${form[key as keyof typeof form] ? "bg-[#C9A96E]" : "bg-[#2A2A2A]"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form[key as keyof typeof form] ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span
                className="text-xs tracking-[0.1em] uppercase text-[#8A8480]"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                {label}
              </span>
            </label>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !form.title || !form.price || images.length === 0}
          className="py-3.5 bg-[#C9A96E] text-[#1A1A1A] text-xs tracking-[0.25em] uppercase font-medium hover:bg-[#E8D5B0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          {saving ? "Saving…" : "Save Artwork"}
        </button>
      </div>
    </div>
  );
}
