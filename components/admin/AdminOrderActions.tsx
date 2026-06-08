"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminOrderActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setSaving(true);
    setStatus(newStatus);
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSaving(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this order?")) return;
    setDeleting(true);
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="flex flex-col items-end gap-3">
      <select
        value={status}
        onChange={(e) => updateStatus(e.target.value)}
        disabled={saving}
        className="bg-[#111] border border-[#2A2A2A] text-[#FDFAF6] text-xs px-3 py-2 focus:outline-none focus:border-[#C9A96E] cursor-pointer disabled:opacity-50"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs text-[#4A4540] hover:text-red-400 transition-colors disabled:opacity-50"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
