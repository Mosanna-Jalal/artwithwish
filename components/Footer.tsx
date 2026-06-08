import Link from "next/link";
import Image from "next/image";

const IG_URL = "https://www.instagram.com/make_art_with_wish/";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#8A8480]">
      <div className="arabesque-divider opacity-30 invert" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-14 sm:py-16">

        {/* ── 4 equal columns, each centred ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 text-center">

          {/* 1 — Brand */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-center gap-3">
            <Image
              src="/images/header/logo-transparent.png"
              alt="Art with Wish"
              width={920}
              height={361}
              className="h-10 w-auto object-contain"
            />
            <p
              className="text-[9px] tracking-[0.3em] uppercase text-[#6A6460]"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Arabic Calligraphy Art
            </p>
            <p
              className="text-xs leading-relaxed text-[#6A6460] max-w-[200px]"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Each piece is a journey through Arabic letters — crafted with patience
              and a wish for beauty.
            </p>
          </div>

          {/* 2 — Navigate */}
          <div className="flex flex-col items-center">
            <p
              className="text-[10px] tracking-[0.25em] uppercase text-[#C9A96E] mb-5"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Navigate
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[#6A6460] hover:text-[#C9A96E] transition-colors"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3 — The Studio */}
          <div className="flex flex-col items-center">
            <p
              className="text-[10px] tracking-[0.25em] uppercase text-[#C9A96E] mb-5"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              The Studio
            </p>
            <ul
              className="flex flex-col gap-3 text-sm text-[#6A6460]"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              <li>Custom commissions</li>
              <li>Made-to-order pieces</li>
              <li>Worldwide shipping</li>
              <li>
                <Link href="/about" className="hover:text-[#C9A96E] transition-colors">
                  Our story
                </Link>
              </li>
            </ul>
          </div>

          {/* 4 — Connect */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-center">
            <p
              className="text-[10px] tracking-[0.25em] uppercase text-[#C9A96E] mb-5"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Connect
            </p>
            <div
              className="flex flex-col items-center gap-3 text-sm text-[#6A6460]"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#C9A96E] transition-colors"
              >
                <span className="text-[#C9A96E] text-base">⧉</span>
                @make_art_with_wish
              </a>
              <Link href="/contact" className="hover:text-[#C9A96E] transition-colors">
                Send an inquiry
              </Link>
              <Link
                href="/shop"
                className="mt-1 px-5 py-2.5 border border-[#C9A96E]/40 text-[#C9A96E] text-[10px] tracking-[0.2em] uppercase hover:bg-[#C9A96E] hover:text-[#1A1A1A] transition-all duration-300"
              >
                Explore the shop
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-7 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-[10px] text-[#4A4540]"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            © {new Date().getFullYear()} Art with Wish. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#4A4540] hover:text-[#C9A96E] transition-colors tracking-wide"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Instagram
            </a>
            <Link
              href="/admin"
              className="text-[10px] text-[#3A3A3A] hover:text-[#C9A96E] transition-colors tracking-wide"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
