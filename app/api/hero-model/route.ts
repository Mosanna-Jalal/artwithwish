/**
 * Proxies hero 3D models from Google Drive so they never live in the repo.
 * Drive blocks direct client-side (CORS) fetching, so we download on the
 * server and stream from our own origin. Results are cached per-file in memory.
 *
 *   /api/hero-model            → default model (HERO_MODEL_DRIVE_ID)
 *   /api/hero-model?id=<id>    → any Drive file ID (used by the model switcher)
 */

import { NextRequest } from "next/server";

export const runtime = "nodejs";

const DEFAULT_ID =
  process.env.HERO_MODEL_DRIVE_ID || "1TI0_byD58lAY6dc87F8cCKO3623iq7DM";

const TTL = 1000 * 60 * 60 * 6; // cache 6 hours
const cache = new Map<string, { buf: ArrayBuffer; time: number }>();

async function downloadFromDrive(id: string): Promise<ArrayBuffer> {
  const base = `https://drive.usercontent.google.com/download?id=${id}&export=download`;

  let res = await fetch(base, { redirect: "follow" });
  const contentType = res.headers.get("content-type") || "";

  // Large files show a "virus scan" HTML interstitial with a confirm token.
  if (contentType.includes("text/html")) {
    const html = await res.text();
    const confirm =
      html.match(/name="confirm"\s+value="([^"]+)"/)?.[1] ||
      html.match(/confirm=([0-9A-Za-z_-]+)/)?.[1];
    const uuid = html.match(/name="uuid"\s+value="([^"]+)"/)?.[1];

    if (!confirm) throw new Error("Drive interstitial returned no confirm token");

    let confirmUrl = `${base}&confirm=${confirm}`;
    if (uuid) confirmUrl += `&uuid=${uuid}`;
    res = await fetch(confirmUrl, { redirect: "follow" });
  }

  if (!res.ok) throw new Error(`Drive responded ${res.status}`);
  return res.arrayBuffer();
}

export async function GET(req: NextRequest) {
  const requested = req.nextUrl.searchParams.get("id");
  // Only allow plausible Drive IDs to avoid SSRF / abuse
  const id =
    requested && /^[A-Za-z0-9_-]{20,60}$/.test(requested) ? requested : DEFAULT_ID;

  try {
    let entry = cache.get(id);
    if (!entry || Date.now() - entry.time > TTL) {
      const buf = await downloadFromDrive(id);
      entry = { buf, time: Date.now() };
      cache.set(id, entry);
    }

    return new Response(entry.buf, {
      headers: {
        "Content-Type": "model/gltf-binary",
        "Content-Length": String(entry.buf.byteLength),
        "Cache-Control": "public, max-age=21600, immutable",
      },
    });
  } catch (err) {
    console.error("hero-model proxy error:", err);
    return Response.json(
      { error: "Failed to load 3D model from Drive" },
      { status: 502 }
    );
  }
}
