"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Always solid on non-home pages
  const solid = !isHome || scrolled || menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        solid
          ? "bg-[#FDFAF6]/97 backdrop-blur-md border-b border-[#E2D8CC] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 flex items-center justify-between h-[72px] sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Art with Wish — home">
          <Image
            src="/images/header/logo-transparent.png"
            alt="Art with Wish"
            width={920}
            height={330}
            priority
            className="h-9 sm:h-11 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-10">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 relative group ${
                  pathname === href ? "text-[#C9A96E]" : "text-[#4A4540] hover:text-[#C9A96E]"
                }`}
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-[#C9A96E] transition-all duration-300 ${
                    pathname === href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] p-2 -mr-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[1.5px] bg-[#4A4540] origin-center transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`block w-5 h-[1.5px] bg-[#4A4540] transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-5 h-[1.5px] bg-[#4A4540] origin-center transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        } bg-[#FDFAF6] border-b border-[#E2D8CC]`}
      >
        <ul className="px-5 pt-1 pb-5 flex flex-col">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block py-3 text-[11px] tracking-[0.2em] uppercase transition-colors border-b border-[#F0E8DC] last:border-0 ${
                  pathname === href ? "text-[#C9A96E]" : "text-[#4A4540] hover:text-[#C9A96E]"
                }`}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
