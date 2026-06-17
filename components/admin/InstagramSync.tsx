"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InstagramSync() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ added: number; skipped: number; total: number; titles?: string[] } | null>(null);
  const [error, setError] = useState("");

  const sync = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: from || undefined, to: to || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      setResult(data);
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "bg-[#111] border border-[#2A2A2A] text-[#FDFAF6] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors";

  return (
    <div className="bg-[#1A1A1A] border border-[#C9A96E]/25 p-6 mb-8 max-w-2xl">
      <p
        className="text-sm text-[#C9A96E] font-medium mb-1"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        Sync new posts from @make_art_with_wish
      </p>
      <p
        className="text-xs text-[#8A8480] mb-5 leading-relaxed"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        Pulls the latest Instagram posts (all photos & videos per post) and adds
        any that aren&apos;t on the site yet. <span className="text-[#C9A96E]">Existing
        items are never touched</span> — your edits and prices are safe. Optionally
        limit to posts made within a date range.
      </p>

      <div className="flex flex-wrap items-end gap-4 mb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-[0.15em] uppercase text-[#6A6460]"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            From (optional)
          </label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-[0.15em] uppercase text-[#6A6460]"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            To (optional)
          </label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} />
        </div>
        <button
          onClick={sync}
          disabled={loading}
          className="px-7 py-2.5 bg-[#C9A96E] text-[#1A1A1A] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#E8D5B0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          {loading ? "Syncing…" : "Sync Now"}
        </button>
      </div>

      {loading && (
        <p className="text-xs text-[#8A8480]"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
          Fetching posts and uploading media to Cloudinary — this can take up to a minute…
        </p>
      )}

      {result && (
        <div className="bg-green-500/10 border border-green-500/20 p-3 mt-1">
          <p className="text-xs text-green-400"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            ✓ Added {result.added} new {result.added === 1 ? "item" : "items"},
            skipped {result.skipped} already on site (of {result.total} in range).
          </p>
          {result.titles && result.titles.length > 0 && (
            <p className="text-[11px] text-[#6A6460] mt-1.5"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
              New: {result.titles.join(", ")}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-3 mt-1">
          <p className="text-xs text-red-400"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            {error}
          </p>
          <p className="text-[11px] text-[#6A6460] mt-1"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            If Instagram blocks the server, run <code className="text-[#C9A96E]">npm run import-instagram</code> locally instead.
          </p>
        </div>
      )}
    </div>
  );
}
