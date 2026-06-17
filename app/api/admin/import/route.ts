import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { importNewPosts } from "@/lib/instagram-import";

export const runtime = "nodejs";
export const maxDuration = 60; // media uploads can take a while

export async function POST(req: NextRequest) {
  if (!(await getAdminSession()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    // Optional date range (YYYY-MM-DD) → unix seconds
    const fromTs = body.from ? Math.floor(new Date(body.from).getTime() / 1000) : undefined;
    const toTs = body.to
      ? Math.floor(new Date(body.to + "T23:59:59").getTime() / 1000)
      : undefined;

    const result = await importNewPosts({ fromTs, toTs });
    return Response.json({ ok: true, ...result });
  } catch (err) {
    return Response.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to sync from Instagram",
      },
      { status: 502 }
    );
  }
}
