"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

const CATEGORIES = ["Calligraphy", "Bismillah", "Quran Verse", "Name Art", "Abstract", "Custom"];

interface ArtworkFormProps {
  initial?: {
    _id?: string;
    title?: string;
    description?: string;
    price?: number;
    images?: string[];
    category?: string;
    dimensions?: string;
    medium?: string;
    available?: boolean;
    featured?: boolean;
  };
  mode?: "create" | "edit";
}

export default function ArtworkForm({ initial = {}, mode = "create" }: ArtworkFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(initial.images || []);
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    price: initial.price?.toString() || "",
    category: initial.category || "Calligraphy",
    dimensions: initial.dimensions || "",
    medium: initial.medium || "",
    available: initial.available ?? true,
    featured: initial.featured ?? false,
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      acceptedFiles.forEach((f) => fd.append("files", f));
      fd.append("folder", "artwithwish/artworks");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      setImages((prev) => [...prev, ...data.urls]);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 10,
  });

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), images };
      const url = mode === "edit" ? `/api/artworks/${initial._id}` : "/api/artworks";
      const method = mode === "edit" ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      router.push("/admin/artworks");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#111] border border-[#2A2A2A] text-[#FDFAF6] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors placeholder-[#3A3A3A]";
  const labelClass =
    "block text-xs tracking-[0.15em] uppercase text-[#6A6460] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            placeholder="e.g. Bismillah in Thuluth"
          />
        </div>

        <div>
          <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Price (USD) *</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className={inputClass}
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            placeholder="e.g. 350"
          />
        </div>

        <div>
          <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Dimensions</label>
          <input
            value={form.dimensions}
            onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
            className={inputClass}
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            placeholder="e.g. 40cm × 60cm"
          />
        </div>

        <div>
          <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Medium</label>
          <input
            value={form.medium}
            onChange={(e) => setForm({ ...form, medium: e.target.value })}
            className={inputClass}
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            placeholder="e.g. Ink on Canson paper"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>Description *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${inputClass} resize-none`}
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            placeholder="Describe the artwork, its inspiration, and meaning..."
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        {[
          { key: "available", label: "Available for Purchase" },
          { key: "featured", label: "Featured on Homepage" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => setForm({ ...form, [key]: !form[key as keyof typeof form] })}
              className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center ${
                form[key as keyof typeof form] ? "bg-[#C9A96E]" : "bg-[#2A2A2A]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  form[key as keyof typeof form] ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span
              className="text-xs tracking-[0.1em] uppercase text-[#8A8480] group-hover:text-[#FDFAF6] transition-colors"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {label}
            </span>
          </label>
        ))}
      </div>

      {/* Image Upload */}
      <div>
        <label className={labelClass} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
          Images (Upload multiple)
        </label>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors duration-200 ${
            isDragActive ? "border-[#C9A96E] bg-[#C9A96E]/5" : "border-[#2A2A2A] hover:border-[#4A4540]"
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <p className="text-[#C9A96E] text-sm animate-pulse"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
              Uploading...
            </p>
          ) : (
            <div>
              <p className="text-[#6A6460] text-sm mb-1"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                {isDragActive ? "Drop images here" : "Drag images here, or click to browse"}
              </p>
              <p className="text-[#3A3A3A] text-xs"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                JPG, PNG, WebP — up to 10 images
              </p>
            </div>
          )}
        </div>

        {/* Existing images */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-3">
            {images.map((url, i) => (
              <div key={i} className="relative group aspect-square">
                <Image
                  src={url}
                  alt={`artwork ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-[#C9A96E] text-[#1A1A1A] text-[9px] text-center py-0.5 tracking-wide"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-8 py-3 bg-[#C9A96E] text-[#1A1A1A] text-xs tracking-[0.25em] uppercase font-medium hover:bg-[#E8D5B0] disabled:opacity-50 transition-colors"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          {loading ? "Saving..." : mode === "edit" ? "Update Artwork" : "Create Artwork"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 border border-[#2A2A2A] text-[#6A6460] text-xs tracking-[0.25em] uppercase hover:border-[#4A4540] hover:text-[#FDFAF6] transition-all"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
