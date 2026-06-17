/**
 * Imports ALL posts from the public Instagram @make_art_with_wish.
 * - Paginates the full feed (every post, not just the latest 12)
 * - Uploads every photo & video per post to Cloudinary
 * - INCREMENTAL: skips posts already on the site (manual edits are never touched)
 *
 * Run:  npm run import-instagram
 * Reset baseline: IG_FRESH=1 npm run import-instagram
 * Date range:     IG_FROM=2025-01-01 IG_TO=2025-12-31 npm run import-instagram
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const USERNAME = "make_art_with_wish";
const DEFAULT_PRICE = 199;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ArtworkSchema = new mongoose.Schema(
  {
    title: String, description: String, price: Number, images: [String],
    videos: { type: [String], default: [] },
    category: String, dimensions: String, medium: String,
    available: Boolean, featured: Boolean,
    igShortcode: { type: String, unique: true, sparse: true, index: true },
    igTimestamp: Date,
  },
  { timestamps: true }
);
const Artwork = mongoose.models.Artwork || mongoose.model("Artwork", ArtworkSchema);

const IG_HEADERS = {
  "x-ig-app-id": "936619743392459",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: `https://www.instagram.com/${USERNAME}/`,
  "X-Requested-With": "XMLHttpRequest",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty",
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function getUserId() {
  const res = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${USERNAME}`,
    { headers: IG_HEADERS }
  );
  if (!res.ok) throw new Error(`profile lookup ${res.status}`);
  const data = await res.json();
  return data.data.user.id;
}

const bestImage = (m) => m?.image_versions2?.candidates?.[0]?.url || null;

function normalize(item) {
  const images = [];
  const videoSources = [];
  const children = item.media_type === 8 && item.carousel_media ? item.carousel_media : [item];
  for (const c of children) {
    if (c.media_type === 2 && c.video_versions?.[0]?.url) {
      videoSources.push({ url: c.video_versions[0].url, poster: bestImage(c) || "" });
    } else {
      const img = bestImage(c);
      if (img) images.push(img);
    }
  }
  return {
    shortcode: item.code,
    timestamp: item.taken_at,
    caption: item.caption?.text || "",
    images,
    videoSources,
  };
}

async function fetchAllPosts() {
  const userId = await getUserId();
  const all = [];
  let maxId;
  let guard = 0;
  do {
    const url =
      `https://www.instagram.com/api/v1/feed/user/${userId}/?count=33` +
      (maxId ? `&max_id=${encodeURIComponent(maxId)}` : "");
    const res = await fetch(url, { headers: IG_HEADERS });
    if (!res.ok) {
      if (all.length) break;
      throw new Error(`feed ${res.status}`);
    }
    const j = await res.json();
    for (const item of j.items || []) all.push(normalize(item));
    process.stdout.write(`  …fetched ${all.length} posts\r`);
    maxId = j.more_available ? j.next_max_id : undefined;
    guard++;
    if (maxId) await delay(600);
  } while (maxId && guard < 20);
  console.log(`\n   Total posts fetched: ${all.length}`);
  return all;
}

function cleanText(s) {
  return (s || "").replace(/#[\p{L}\p{N}_]+/gu, "").replace(/[•·]+/g, " ").replace(/\s+/g, " ").trim();
}
function deriveTitle(caption) {
  const firstLine = (caption || "").split("\n").map((l) => l.trim()).find((l) => l.length > 0) || "";
  let t = firstLine.replace(/#[\p{L}\p{N}_]+/gu, "").replace(/[\p{Extended_Pictographic}☀-➿️]/gu, "").replace(/\s+/g, " ").trim();
  if (t.length > 55) t = t.slice(0, 52).trim() + "…";
  return t || "Calligraphy Piece";
}
function deriveCategory(caption) {
  const c = (caption || "").toLowerCase();
  if (/\b(name|couple|frame|wedding|nikah|baby ?canvas|namecanvas)\b/.test(c)) return "Name Art";
  if (/bismillah/.test(c)) return "Bismillah";
  if (/\b(quran|qur'an|ayat|ayatul|surah|verse|kursi)\b/.test(c)) return "Quran Verse";
  return "Calligraphy";
}
async function upload(url, resourceType) {
  const r = await cloudinary.uploader.upload(url, { folder: "artwithwish/instagram", resource_type: resourceType });
  return r.secure_url;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in .env.local");

  const fromTs = process.env.IG_FROM ? Math.floor(new Date(process.env.IG_FROM).getTime() / 1000) : null;
  const toTs = process.env.IG_TO ? Math.floor(new Date(process.env.IG_TO + "T23:59:59").getTime() / 1000) : null;

  console.log(`📸  Fetching all posts from @${USERNAME} …`);
  const posts = await fetchAllPosts();
  const inRange = posts.filter((p) => {
    if (fromTs && p.timestamp < fromTs) return false;
    if (toTs && p.timestamp > toTs) return false;
    return true;
  });
  console.log(`   ${inRange.length} in range\n`);

  console.log("🔗  Connecting to MongoDB …");
  await mongoose.connect(uri, { bufferCommands: false });

  if (process.env.IG_FRESH === "1") {
    const cleared = await Artwork.deleteMany({});
    console.log(`🗑   IG_FRESH: cleared ${cleared.deletedCount} artworks\n`);
  }

  const existingDocs = await Artwork.find({ igShortcode: { $in: inRange.map((p) => p.shortcode) } }).select("igShortcode").lean();
  const existing = new Set(existingDocs.map((d) => d.igShortcode));
  console.log(`↺  ${existing.size} already on site — skipping (edits safe)\n`);

  let added = 0, skipped = 0;
  for (const post of inRange) {
    if (existing.has(post.shortcode)) { skipped++; continue; }
    if (!post.images.length && !post.videoSources.length) { skipped++; continue; }
    const title = deriveTitle(post.caption);
    process.stdout.write(`✦ ${title}  (${post.images.length} img, ${post.videoSources.length} vid) … `);
    try {
      const images = [];
      for (const u of post.images) images.push(await upload(u, "image"));
      const videos = [];
      for (const v of post.videoSources) {
        videos.push(await upload(v.url, "video"));
        if (!images.length && v.poster) images.push(await upload(v.poster, "image"));
      }
      await Artwork.create({
        title,
        description: cleanText(post.caption) || "Handcrafted Arabic calligraphy by Mahwish.",
        price: DEFAULT_PRICE,
        images, videos,
        category: deriveCategory(post.caption),
        medium: "Handwritten calligraphy",
        available: true, featured: false,
        igShortcode: post.shortcode,
        igTimestamp: new Date(post.timestamp * 1000),
      });
      added++;
      console.log("done");
    } catch (e) {
      skipped++;
      console.log("FAILED:", e.message);
    }
  }

  console.log(`\n✨  Added ${added} new, skipped ${skipped} (of ${inRange.length}).`);
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
