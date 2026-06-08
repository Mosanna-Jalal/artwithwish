"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type HeadingFont = "amiri" | "aref" | "reem" | "brush";

const OPTIONS: {
  key: HeadingFont;
  name: string;
  desc: string;
  cssVar: string;
}[] = [
  { key: "brush", name: "Dancing Script", desc: "Brush script (default) — flowing, matches the logo", cssVar: "var(--font-brush), var(--font-amiri), cursive" },
  { key: "amiri", name: "Amiri", desc: "Classic Naskh serif — elegant & timeless", cssVar: "var(--font-amiri), serif" },
  { key: "aref", name: "Aref Ruqaa", desc: "Ornate Ruqʿah calligraphy — bold & artistic", cssVar: "var(--font-aref), var(--font-amiri), serif" },
  { key: "reem", name: "Reem Kufi", desc: "Geometric Kufic — modern Islamic-art feel", cssVar: "var(--font-reem), var(--font-amiri), sans-serif" },
];

export default function FontSettings({ current }: { current: HeadingFont }) {
  const router = useRouter();
  const [selected, setSelected] = useState<HeadingFont>(current);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headingFont: selected }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh(); // re-render the root layout with the new font
    }
  };

  return (
    <div className="max-w-2xl">
      <p
        className="text-xs tracking-[0.2em] uppercase text-[#8A8480] mb-1"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        Heading font
      </p>
      <p
        className="text-sm text-[#6A6460] mb-6"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        Sets the font for all headings across the site. Arabic text always falls
        back to Amiri Naskh so it stays authentic.
      </p>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const active = selected === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setSelected(opt.key)}
              className={`text-left p-5 border transition-all ${
                active
                  ? "border-[#C9A96E] bg-[#C9A96E]/10"
                  : "border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#3A3A3A]"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  {/* Live preview rendered in the actual font */}
                  <div
                    className="text-3xl sm:text-4xl text-[#FDFAF6] leading-tight"
                    style={{ fontFamily: opt.cssVar }}
                  >
                    Art with Wish <span className="text-[#C9A96E]">بسم الله</span>
                  </div>
                  <p
                    className="mt-2 text-xs text-[#8A8480]"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    <span className="text-[#C9A96E]">{opt.name}</span> — {opt.desc}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${
                    active ? "border-[#C9A96E]" : "border-[#3A3A3A]"
                  }`}
                >
                  {active && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving || selected === current}
          className="px-8 py-3 bg-[#C9A96E] text-[#1A1A1A] text-xs tracking-[0.25em] uppercase font-medium hover:bg-[#E8D5B0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          {saving ? "Saving…" : "Save Font"}
        </button>
        {saved && (
          <span
            className="text-xs text-green-400"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            ✓ Saved — applied across the site
          </span>
        )}
      </div>
    </div>
  );
}
