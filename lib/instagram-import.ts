import { connectDB } from "./mongodb";
import Artwork from "@/models/Artwork";
import cloudinary from "./cloudinary";

const USERNAME = "make_art_with_wish";
const DEFAULT_PRICE = 199;

const IG_HEADERS: Record<string, string> = {
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

/* Normalized post shape used by the importer */
export interface PostInput {
  shortcode: string;
  timestamp: number; // unix seconds
  caption: string;
  images: string[];
  videoSources: { url: string; poster: string }[];
}

/* ── Normalize a web_profile_info node (the reliable recent-posts endpoint) ── */
interface IgChild {
  is_video: boolean;
  display_url: string;
  video_url?: string;
}
interface IgNode {
  shortcode: string;
  taken_at_timestamp: number;
  is_video: boolean;
  display_url: string;
  video_url?: string;
  __typename: string;
  edge_media_to_caption: { edges: { node: { text: string } }[] };
  edge_sidecar_to_children?: { edges: { node: IgChild }[] };
}

function normalizeNode(node: IgNode): PostInput {
  const images: string[] = [];
  const videoSources: { url: string; poster: string }[] = [];

  const children: IgChild[] =
    node.__typename === "GraphSidecar" && node.edge_sidecar_to_children
      ? node.edge_sidecar_to_children.edges.map((e) => e.node)
      : [{ is_video: node.is_video, display_url: node.display_url, video_url: node.video_url }];

  for (const c of children) {
    if (c.is_video && c.video_url) videoSources.push({ url: c.video_url, poster: c.display_url });
    else if (c.display_url) images.push(c.display_url);
  }

  return {
    shortcode: node.shortcode,
    timestamp: node.taken_at_timestamp,
    caption: node.edge_media_to_caption.edges[0]?.node.text || "",
    images,
    videoSources,
  };
}

/* ── Fetch recent posts via the reliable public profile endpoint ── */
export async function fetchAllPosts(): Promise<PostInput[]> {
  const res = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${USERNAME}`,
    { headers: IG_HEADERS, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Instagram responded ${res.status}`);
  const data = await res.json();
  const nodes: IgNode[] = data.data.user.edge_owner_to_timeline_media.edges.map(
    (e: { node: IgNode }) => e.node
  );
  return nodes.map(normalizeNode);
}

/* ── Caption → title / description / category ── */
function cleanText(s: string) {
  return (s || "")
    .replace(/#[\p{L}\p{N}_]+/gu, "")
    .replace(/[•·]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function deriveTitle(caption: string) {
  const firstLine =
    (caption || "").split("\n").map((l) => l.trim()).find((l) => l.length > 0) || "";
  let t = firstLine
    .replace(/#[\p{L}\p{N}_]+/gu, "")
    .replace(/[\p{Extended_Pictographic}☀-➿️]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  if (t.length > 55) t = t.slice(0, 52).trim() + "…";
  return t || "Calligraphy Piece";
}
function deriveCategory(caption: string) {
  const c = (caption || "").toLowerCase();
  if (/\b(name|couple|frame|wedding|nikah|baby ?canvas|namecanvas)\b/.test(c))
    return "Name Art";
  if (/bismillah/.test(c)) return "Bismillah";
  if (/\b(quran|qur'an|ayat|ayatul|surah|verse|kursi)\b/.test(c)) return "Quran Verse";
  return "Calligraphy";
}

async function uploadImage(url: string) {
  const r = await cloudinary.uploader.upload(url, {
    folder: "artwithwish/instagram",
    resource_type: "image",
  });
  return r.secure_url;
}
async function uploadVideo(url: string) {
  const r = await cloudinary.uploader.upload(url, {
    folder: "artwithwish/instagram",
    resource_type: "video",
  });
  return r.secure_url;
}

export interface ImportResult {
  added: number;
  skipped: number;
  total: number;
  titles: string[];
}

/**
 * Incrementally imports ALL Instagram posts.
 * - Skips posts already in the DB (by igShortcode) → manual edits are NEVER touched
 * - Optional [fromTs, toTs] (unix seconds) date-range filter
 */
export async function importNewPosts(opts: {
  fromTs?: number;
  toTs?: number;
} = {}): Promise<ImportResult> {
  await connectDB();
  const posts = await fetchAllPosts();

  const inRange = posts.filter((p) => {
    if (opts.fromTs && p.timestamp < opts.fromTs) return false;
    if (opts.toTs && p.timestamp > opts.toTs) return false;
    return true;
  });

  const existing = new Set(
    (await Artwork.find({ igShortcode: { $in: inRange.map((p) => p.shortcode) } })
      .select("igShortcode")
      .lean()
    ).map((d: { igShortcode?: string }) => d.igShortcode)
  );

  let added = 0;
  let skipped = 0;
  const titles: string[] = [];

  for (const post of inRange) {
    if (existing.has(post.shortcode)) {
      skipped++;
      continue;
    }
    if (!post.images.length && !post.videoSources.length) {
      skipped++;
      continue;
    }

    try {
      const uploadedImages: string[] = [];
      for (const img of post.images) uploadedImages.push(await uploadImage(img));

      const uploadedVideos: string[] = [];
      for (const v of post.videoSources) {
        uploadedVideos.push(await uploadVideo(v.url));
        if (!uploadedImages.length && v.poster)
          uploadedImages.push(await uploadImage(v.poster));
      }

      await Artwork.create({
        title: deriveTitle(post.caption),
        description: cleanText(post.caption) || "Handcrafted Arabic calligraphy by Mahwish.",
        price: DEFAULT_PRICE,
        images: uploadedImages,
        videos: uploadedVideos,
        category: deriveCategory(post.caption),
        medium: "Handwritten calligraphy",
        available: true,
        featured: false,
        igShortcode: post.shortcode,
        igTimestamp: new Date(post.timestamp * 1000),
      });
      added++;
      titles.push(deriveTitle(post.caption));
    } catch {
      skipped++;
    }
  }

  return { added, skipped, total: inRange.length, titles };
}
