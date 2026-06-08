/**
 * Seed script for ArtWithWish
 * Run: npm run seed
 *
 * Images are sourced from the client's Instagram @make_art_with_wish
 * Replace placeholder URLs with real Cloudinary URLs once images are uploaded.
 *
 * To get real image URLs from Instagram:
 *   1. Open the post on Instagram in browser
 *   2. Right-click the image → "Copy image address"
 *   3. Upload that image to Cloudinary via Admin → upload route
 *   4. Replace the placeholder URL below with the Cloudinary URL
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

// ─── Inline model to avoid Next.js module issues ────────────────────────────
const ArtworkSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    images: [String],
    category: String,
    dimensions: String,
    medium: String,
    available: Boolean,
    featured: Boolean,
  },
  { timestamps: true }
);

const Artwork =
  mongoose.models.Artwork || mongoose.model("Artwork", ArtworkSchema);

// ─── Placeholder image helper ─────────────────────────────────────────────
// Using picsum.photos as temporary placeholders.
// Replace each array with real Cloudinary URLs from the admin panel.
const ph = (seed: number, w = 800, h = 1000) =>
  `https://picsum.photos/seed/aww${seed}/${w}/${h}`;

// ─── Seed data — based on typical @make_art_with_wish calligraphy style ──
const artworks = [
  {
    title: "Bismillah — Gold on Black",
    description:
      "A striking rendition of Bismillah ir-Rahman ir-Rahim in Thuluth script. Gold ink on deep black handmade paper with gilded border detailing. A timeless piece to bless any entrance or prayer space.",
    price: 280,
    images: [ph(1), ph(11), ph(21)],
    category: "Bismillah",
    dimensions: "30cm × 20cm",
    medium: "Gold ink on handmade black paper",
    available: true,
    featured: true,
  },
  {
    title: "Ayatul Kursi — Naskh Style",
    description:
      "The Throne Verse (2:255) rendered in classical Naskh script. Known as the most powerful verse of the Quran, this piece carries divine protection. Black ink with deep teal illumination border.",
    price: 450,
    images: [ph(2), ph(12), ph(22)],
    category: "Quran Verse",
    dimensions: "50cm × 40cm",
    medium: "Ink on watercolour paper, hand-illuminated",
    available: true,
    featured: true,
  },
  {
    title: "Ya Allah — Large Format",
    description:
      "A bold, meditative rendering of 'Ya Allah' in Diwani Jali script. The flowing curves of the letters create a visual rhythm that draws the eye inward. Ideal as a centrepiece for a living room or study.",
    price: 620,
    images: [ph(3), ph(13)],
    category: "Calligraphy",
    dimensions: "70cm × 50cm",
    medium: "Reed pen, black sumi ink on ivory cotton paper",
    available: true,
    featured: true,
  },
  {
    title: "Surah Al-Fatiha — Complete",
    description:
      "The Opening Chapter of the Quran written in full, in a circular composition. Each verse flows into the next, forming a perfect mandala of Arabic letters. Mounted on a deep cream background.",
    price: 780,
    images: [ph(4), ph(14), ph(24)],
    category: "Quran Verse",
    dimensions: "60cm × 60cm",
    medium: "Black ink, watercolour wash, gold leaf accents",
    available: true,
    featured: false,
  },
  {
    title: "Al-Hamdulillah — Rust & Gold",
    description:
      "Praise be to God — in warm rust tones with gold flecks that catch the light. Written in Riq'a script, this piece has an earthy, grounded energy. Beautiful in a kitchen, dining room, or studio.",
    price: 195,
    images: [ph(5), ph(15)],
    category: "Calligraphy",
    dimensions: "25cm × 35cm",
    medium: "Rust and gold ink on textured kraft paper",
    available: true,
    featured: false,
  },
  {
    title: "Subhan Allah — Watercolour",
    description:
      "Glory be to God — delicate Naskh lettering on a soft watercolour wash of blues and greens. The script floats over the colour like clouds. A gentle, peaceful piece.",
    price: 240,
    images: [ph(6), ph(16), ph(26)],
    category: "Calligraphy",
    dimensions: "40cm × 30cm",
    medium: "Ink on 300gsm watercolour paper, hand-painted background",
    available: true,
    featured: false,
  },
  {
    title: "Inna Lillahi — Condolence Piece",
    description:
      "Indeed we belong to Allah, and indeed to Him we will return. Written in a soft, compassionate hand. Often requested as a gift during times of grief. Comes with a hand-written dedication card.",
    price: 175,
    images: [ph(7), ph(17)],
    category: "Quran Verse",
    dimensions: "28cm × 20cm",
    medium: "Sepia ink on aged cotton paper",
    available: true,
    featured: false,
  },
  {
    title: "Custom Arabic Name — Single",
    description:
      "Your name, your loved one's name, or a word that holds meaning — rendered in your choice of Naskh, Thuluth, or Diwani script. Each piece is uniquely composed around the letters of your name.",
    price: 150,
    images: [ph(8), ph(18)],
    category: "Name Art",
    dimensions: "20cm × 20cm",
    medium: "Black ink on white cotton paper",
    available: true,
    featured: false,
  },
  {
    title: "Kun Fayakun — Be, and It Is",
    description:
      "'Be, and it is' — one of the most powerful commands in the Quran (36:82). Written in an explosive, energetic Diwani style. Bold charcoal strokes with bursts of gold. A statement piece.",
    price: 520,
    images: [ph(9), ph(19), ph(29)],
    category: "Quran Verse",
    dimensions: "60cm × 45cm",
    medium: "Charcoal, gold ink on textured canvas",
    available: true,
    featured: true,
  },
  {
    title: "99 Names of Allah — Circular",
    description:
      "All 99 names of Allah arranged in a stunning circular composition. Written in micro Naskh script, the names spiral inward toward a central gold rosette. A labour of devotion — over 40 hours in the making.",
    price: 1850,
    images: [ph(10), ph(20)],
    category: "Calligraphy",
    dimensions: "80cm × 80cm",
    medium: "Black ink, gold leaf on mounted watercolour paper",
    available: true,
    featured: true,
  },
  {
    title: "Hasbunallah — Teal & Gold",
    description:
      "'Allah is sufficient for us, and He is the best disposer of affairs.' A calming piece in deep teal ink with gold highlights, written in bold Thuluth. Often chosen for home offices and studies.",
    price: 330,
    images: [ph(31), ph(41)],
    category: "Calligraphy",
    dimensions: "45cm × 30cm",
    medium: "Teal and gold ink on cotton paper",
    available: true,
    featured: false,
  },
  {
    title: "Alif — Abstract Letter Study",
    description:
      "A meditative study on the Alif — the first letter of the Arabic alphabet, representing unity and the divine. An abstract composition exploring the single vertical stroke in varying weights and angles.",
    price: 390,
    images: [ph(32), ph(42), ph(52)],
    category: "Abstract",
    dimensions: "50cm × 70cm",
    medium: "Sumi ink, reed pen on rice paper",
    available: true,
    featured: false,
  },
  {
    title: "Wedding Invitation Set — Custom",
    description:
      "A fully bespoke set for your wedding stationery — names, date, and a chosen verse in matching script. Available in Naskh, Thuluth, or Diwani. Includes digital files for printing.",
    price: 750,
    images: [ph(33), ph(43)],
    category: "Custom",
    dimensions: "A5 cards (set of 10 artboards)",
    medium: "Digital calligraphy, print-ready files",
    available: true,
    featured: false,
  },
  {
    title: "Masha Allah — Sage Green",
    description:
      "What Allah has willed — in sage green ink on cream paper. The soft colour palette makes this a perfect piece for nurseries, children's rooms, or as a baby gift. Comes ready to frame.",
    price: 160,
    images: [ph(34), ph(44)],
    category: "Calligraphy",
    dimensions: "22cm × 28cm",
    medium: "Sage ink on cream cotton paper",
    available: true,
    featured: false,
  },
  {
    title: "La Ilaha IllAllah — Triptych",
    description:
      "Three panels exploring the Shahada across three scripts: Kufic, Naskh, and Thuluth. Each panel stands alone or together as a triptych. Sold as a set. A powerful centrepiece for any Islamic home.",
    price: 1200,
    images: [ph(35), ph(45), ph(55)],
    category: "Calligraphy",
    dimensions: "3 × (30cm × 60cm)",
    medium: "Black ink on linen paper, unframed",
    available: true,
    featured: true,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────
async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌  MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  console.log("🔗  Connecting to MongoDB…");
  await mongoose.connect(uri, { bufferCommands: false });
  console.log("✅  Connected.\n");

  // Wipe existing artworks
  const deleted = await Artwork.deleteMany({});
  console.log(`🗑   Cleared ${deleted.deletedCount} existing artworks.\n`);

  // Insert seed data
  const inserted = await Artwork.insertMany(artworks);
  console.log(`✨  Seeded ${inserted.length} artworks:\n`);
  inserted.forEach((a: { title: string; price: number }) =>
    console.log(`    • ${a.title}  —  $${a.price}`)
  );

  console.log("\n📝  Next steps:");
  console.log("    1. Open the Admin panel → Artworks");
  console.log("    2. For each artwork, click Edit and replace placeholder images");
  console.log("       with real images from Instagram by uploading them.");
  console.log("    3. Mark your hero pieces as 'Featured' to show them on the homepage.\n");

  await mongoose.disconnect();
  console.log("🔌  Disconnected. Done!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
