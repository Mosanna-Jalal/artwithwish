import { connectDB } from "./mongodb";
import Settings, { HeadingFont } from "@/models/Settings";

const DEFAULT_FONT: HeadingFont = "brush";

export async function getHeadingFont(): Promise<HeadingFont> {
  try {
    await connectDB();
    const doc = await Settings.findOne({ key: "site" }).lean();
    return (doc?.headingFont as HeadingFont) || DEFAULT_FONT;
  } catch {
    return DEFAULT_FONT;
  }
}

// Font stacks per choice. Non-Arabic fonts list Amiri as a fallback so Arabic
// glyphs (بسم الله, letter cards) still render in proper Naskh.
export const FONT_STACKS: Record<HeadingFont, string> = {
  amiri: "var(--font-amiri), Georgia, serif",
  aref: "var(--font-aref), var(--font-amiri), Georgia, serif",
  reem: "var(--font-reem), var(--font-amiri), system-ui, sans-serif",
  brush: "var(--font-brush), var(--font-amiri), Georgia, serif",
};

export const FONT_LABELS: Record<HeadingFont, string> = {
  amiri: "Amiri — classic Naskh serif",
  aref: "Aref Ruqaa — ornate calligraphy",
  reem: "Reem Kufi — geometric Islamic",
  brush: "Dancing Script — brush (default)",
};
