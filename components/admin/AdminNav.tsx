"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/artworks", label: "Artworks", icon: "◻" },
  { href: "/admin/import", label: "Import from URL", icon: "⇩" },
  { href: "/admin/orders", label: "Orders", icon: "◈" },
  { href: "/admin/models", label: "3D Models", icon: "◉" },
  { href: "/admin/settings", label: "Settings", icon: "✦" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-[#2A2A2A]">
        <p
          className="text-2xl font-light text-[#C9A96E]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          ArtWithWish
        </p>
        <p
          className="text-xs tracking-[0.2em] uppercase text-[#4A4540] mt-0.5"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Admin
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                active
                  ? "bg-[#C9A96E]/10 text-[#C9A96E] border-l-2 border-[#C9A96E]"
                  : "text-[#6A6460] hover:text-[#FDFAF6] hover:bg-[#2A2A2A] border-l-2 border-transparent"
              }`}
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 border-t border-[#2A2A2A] pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-sm text-[#6A6460] hover:text-[#FDFAF6] hover:bg-[#2A2A2A] transition-all"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          <span className="text-base">↗</span>
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#6A6460] hover:text-red-400 hover:bg-[#2A2A2A] transition-all text-left"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          <span className="text-base">⇤</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
