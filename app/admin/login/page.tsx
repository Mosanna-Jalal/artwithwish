"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-6">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='35' fill='none' stroke='%23C9A96E' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <p
            className="text-4xl font-light text-[#C9A96E] mb-1"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            ArtWithWish
          </p>
          <p
            className="text-xs tracking-[0.3em] uppercase text-[#6A6460]"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            Admin Portal
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-[#232323] border border-[#2A2A2A] p-8 flex flex-col gap-5"
        >
          <div>
            <label
              className="block text-xs tracking-[0.2em] uppercase text-[#8A8480] mb-2"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full bg-[#1A1A1A] border border-[#333] text-[#FDFAF6] px-4 py-3 focus:outline-none focus:border-[#C9A96E] transition-colors text-sm"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            />
          </div>

          {error && (
            <p
              className="text-xs text-red-400"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="py-3.5 bg-[#C9A96E] text-[#1A1A1A] text-xs tracking-[0.25em] uppercase font-medium hover:bg-[#E8D5B0] disabled:opacity-50 transition-colors"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
