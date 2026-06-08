"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminArtworkActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this artwork? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/artworks/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/admin/artworks/${id}/edit`}
        className="text-xs text-[#8A8480] hover:text-[#C9A96E] transition-colors"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs text-[#8A8480] hover:text-red-400 transition-colors disabled:opacity-50"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {deleting ? "..." : "Delete"}
      </button>
    </div>
  );
}
