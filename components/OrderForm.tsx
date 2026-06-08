"use client";

import { useState } from "react";

interface OrderFormProps {
  artworkId: string;
  artworkTitle: string;
  artworkPrice: number;
}

export default function OrderForm({ artworkId, artworkTitle, artworkPrice }: OrderFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId,
          artworkTitle,
          artworkPrice,
          ...form,
        }),
      });
      setSuccess(true);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="border border-[#C9A96E]/30 bg-[#F5EFE4] p-8 text-center">
        <p
          className="text-3xl text-[#C9A96E] mb-3"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          شكراً
        </p>
        <p
          className="text-[#4A4540] text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Your inquiry has been received. We will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-4 bg-[#1A1A1A] text-[#FDFAF6] text-xs tracking-[0.3em] uppercase hover:bg-[#C9A96E] transition-colors duration-300"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Inquire to Purchase — ${artworkPrice.toLocaleString()}
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-[#E2D8CC] p-6">
          <div className="flex items-center justify-between mb-2">
            <p
              className="text-sm tracking-[0.15em] uppercase text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Purchase Inquiry
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[#8A8480] hover:text-[#1A1A1A] text-lg leading-none"
            >
              ✕
            </button>
          </div>

          <div className="bg-[#F5EFE4] px-4 py-3">
            <p className="text-xs text-[#8A8480]" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
              {artworkTitle}
            </p>
            <p className="text-lg text-[#C9A96E]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
              ${artworkPrice.toLocaleString()}
            </p>
          </div>

          {[
            { key: "customerName", label: "Full Name", type: "text", required: true },
            { key: "customerEmail", label: "Email Address", type: "email", required: true },
            { key: "customerPhone", label: "Phone (Optional)", type: "tel", required: false },
          ].map(({ key, label, type, required }) => (
            <div key={key}>
              <label
                className="block text-xs tracking-[0.15em] uppercase text-[#4A4540] mb-1.5"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                {label}
              </label>
              <input
                type={type}
                required={required}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-[#E2D8CC] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A96E] placeholder-[#C8B89A] transition-colors"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              />
            </div>
          ))}

          <div>
            <label
              className="block text-xs tracking-[0.15em] uppercase text-[#4A4540] mb-1.5"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Message (Optional)
            </label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Any special requests or questions..."
              className="w-full border border-[#E2D8CC] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A96E] placeholder-[#C8B89A] resize-none transition-colors"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-4 bg-[#1A1A1A] text-[#FDFAF6] text-xs tracking-[0.3em] uppercase hover:bg-[#C9A96E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            {loading ? "Sending..." : "Submit Inquiry"}
          </button>
        </form>
      )}
    </div>
  );
}
