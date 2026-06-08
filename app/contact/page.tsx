"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <main className="pt-[72px] sm:pt-20 min-h-screen bg-[#FDFAF6]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left */}
            <div>
              <p
                className="text-xs tracking-[0.4em] uppercase text-[#C9A96E] mb-4"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Get in Touch
              </p>
              <h1
                className="text-5xl sm:text-6xl font-light text-[#1A1A1A] mb-8 leading-tight"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Let's create
                <br />
                something together
              </h1>
              <div className="arabesque-divider mb-8 max-w-sm opacity-50" />
              <p
                className="text-[#4A4540] leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Whether you're interested in an existing piece, want to commission something
                custom, or simply have a question — we'd love to hear from you.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { label: "Custom Commissions", desc: "A piece made for you, in your language" },
                  { label: "Gift Inquiries", desc: "A meaningful gift for someone you love" },
                  { label: "Corporate Orders", desc: "Art for offices, hotels, and institutions" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-2 flex-shrink-0" />
                    <div>
                      <p
                        className="text-sm font-medium text-[#1A1A1A]"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-xs text-[#8A8480]"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div>
              {sent ? (
                <div className="border border-[#C9A96E]/30 bg-[#F5EFE4] p-12 text-center">
                  <p
                    className="text-5xl text-[#C9A96E] mb-4"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    شكراً
                  </p>
                  <p
                    className="text-lg text-[#1A1A1A] mb-2 font-light"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Thank you for reaching out
                  </p>
                  <p
                    className="text-[#4A4540] text-sm"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    We'll get back to you within 1–2 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {[
                    { key: "name", label: "Full Name", type: "text", required: true },
                    { key: "email", label: "Email Address", type: "email", required: true },
                    { key: "subject", label: "Subject", type: "text", required: true },
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
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-[#E2D8CC] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A96E] placeholder-[#C8B89A] resize-none transition-colors"
                      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                      placeholder="Tell us about your vision..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="py-4 bg-[#1A1A1A] text-[#FDFAF6] text-xs tracking-[0.3em] uppercase hover:bg-[#C9A96E] disabled:opacity-50 transition-colors duration-300"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
