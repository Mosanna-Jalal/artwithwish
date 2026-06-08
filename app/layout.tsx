import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Amiri, Aref_Ruqaa, Reem_Kufi, Dancing_Script, Inter } from "next/font/google";
import "./globals.css";
import { getHeadingFont, FONT_STACKS } from "@/lib/settings";

// ── Heading font candidates (all loaded; admin picks which one is active) ──
// Amiri also serves as the Arabic fallback for the non-Arabic options.
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic", "latin"], variable: "--font-amiri", display: "swap" });
const arefRuqaa = Aref_Ruqaa({ weight: ["400", "700"], subsets: ["arabic", "latin"], variable: "--font-aref", display: "swap" });
const reemKufi = Reem_Kufi({ subsets: ["arabic", "latin"], variable: "--font-reem", display: "swap" });
const dancingScript = Dancing_Script({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-brush", display: "swap" });

// Body / UI labels
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Art with Wish — Arabic Calligraphy Art",
  description:
    "Discover handcrafted Arabic calligraphy artworks. Elegant pieces for your home, office, or as a meaningful gift.",
  keywords: ["arabic calligraphy", "islamic art", "handmade art", "calligraphy for sale"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headingFont = await getHeadingFont();
  // Map the admin choice onto the --font-cormorant variable that every
  // component already uses for headings.
  const headingStack = FONT_STACKS[headingFont] ?? FONT_STACKS.brush;

  return (
    <html
      lang="en"
      className={`${amiri.variable} ${arefRuqaa.variable} ${reemKufi.variable} ${dancingScript.variable} ${inter.variable}`}
      style={{ "--font-cormorant": headingStack } as CSSProperties}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
