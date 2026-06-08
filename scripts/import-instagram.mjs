/**
 * Imports artworks from the public Instagram @make_art_with_wish.
 * - Pulls the latest posts via Instagram's public web-profile API
 * - Uploads every image to Cloudinary (Instagram CDN URLs expire, so we mirror them)
 * - Derives a title/description/category from each caption
 * - Replaces the placeholder seed data with these real artworks
 *
 * Run: npm run import-instagram
 *
 * Note: the public endpoint returns ~12 recent posts. Re-run later to refresh.
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const USERNAME = "make_art_with_wish";
const DEFAULT_PRICE = 199; // placeholder — update real prices in the admin panel

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ArtworkSchema = new mongoose.Schema(
  {
    title: String, description: String, price: Number, images: [String],
    category: String, dimensions: String, medium: String,
    available: Boolean, featured: Boolean,
  },
  { timestamps: true }
);
const Artwork = mongoose.models.Artwork || mongoose.model("Artwork", ArtworkSchema);

// ── Caption → title / description / category ──────────────────────────────
function cleanText(s) {
  return (s || "")
    .replace(/#[\p{L}\p{N}_]+/gu, "")        // strip hashtags
    .replace(/[•·]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function deriveTitle(caption) {
  const firstLine =
    (caption || "").split("\n").map((l) => l.trim()).find((l) => l.length > 0) || "";
  // remove leading sparkles/emojis and hashtags
  let t = firstLine
    .replace(/#[\p{L}\p{N}_]+/gu, "")
    .replace(/[\p{Extended_Pictographic}☀-➿️]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  if (t.length > 55) t = t.slice(0, 52).trim() + "…";
  return t || "Calligraphy Piece";
}

function deriveCategory(caption) {
  const c = (caption || "").toLowerCase();
  if (/\b(name|couple|frame|wedding|nikah|baby ?canvas|namecanvas)\b/.test(c) ||
      /[A-Z][a-z]+ ?❤️ ?[A-Z][a-z]+/.test(caption || ""))
    return "Name Art";
  if (/bismillah/.test(c)) return "Bismillah";
  if (/\b(quran|qur'an|ayat|ayatul|surah|verse|kursi)\b/.test(c)) return "Quran Verse";
  return "Calligraphy";
}

// ── Instagram fetch ────────────────────────────────────────────────────────
// Instagram blocks bare server-side fetches, so we read a JSON file fetched
// via curl (see the npm script). Falls back to a direct fetch if no file.
async function fetchPosts() {
  const file = resolve(process.cwd(), "scripts", "ig-data.json");
  let data;
  if (existsSync(file)) {
    data = JSON.parse(readFileSync(file, "utf8"));
  } else {
    const res = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${USERNAME}`,
      {
        headers: {
          "x-ig-app-id": "936619743392459",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36",
        },
      }
    );
    if (!res.ok) throw new Error(`Instagram API responded ${res.status}`);
    data = await res.json();
  }
  return data.data.user.edge_owner_to_timeline_media.edges.map((e) => e.node);
}

function postImageUrls(node) {
  if (node.is_video) return []; // skip videos
  if (node.__typename === "GraphSidecar" && node.edge_sidecar_to_children) {
    return node.edge_sidecar_to_children.edges
      .filter((c) => !c.node.is_video)
      .map((c) => c.node.display_url);
  }
  return node.display_url ? [node.display_url] : [];
}

async function uploadToCloudinary(url) {
  const r = await cloudinary.uploader.upload(url, {
    folder: "artwithwish/instagram",
    resource_type: "image",
  });
  return r.secure_url;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in .env.local");

  console.log(`📸  Fetching @${USERNAME} …`);
  const posts = await fetchPosts();
  const imagePosts = posts.filter((p) => !p.is_video && postImageUrls(p).length);
  console.log(`   Found ${posts.length} posts, ${imagePosts.length} usable image posts\n`);

  console.log("🔗  Connecting to MongoDB …");
  await mongoose.connect(uri, { bufferCommands: false });

  const cleared = await Artwork.deleteMany({});
  console.log(`🗑   Cleared ${cleared.deletedCount} existing artworks\n`);

  let made = 0;
  for (let i = 0; i < imagePosts.length; i++) {
    const node = imagePosts[i];
    const caption = node.edge_media_to_caption.edges[0]?.node.text || "";
    const urls = postImageUrls(node);
    const title = deriveTitle(caption);

    process.stdout.write(`✦ ${title}  (${urls.length} img) … `);
    try {
      const images = [];
      for (const u of urls) images.push(await uploadToCloudinary(u));

      await Artwork.create({
        title,
        description: cleanText(caption) || "Handcrafted Arabic calligraphy by Mahwish.",
        price: DEFAULT_PRICE,
        images,
        category: deriveCategory(caption),
        medium: "Handwritten calligraphy",
        available: true,
        featured: i < 6, // first 6 featured on the homepage
      });
      made++;
      console.log("done");
    } catch (e) {
      console.log("FAILED:", e.message);
    }
  }

  console.log(`\n✨  Imported ${made} artworks from Instagram.`);
  console.log("📝  Prices default to $" + DEFAULT_PRICE + " — set real prices in Admin → Artworks.\n");
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
