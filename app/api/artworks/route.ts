import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const available = searchParams.get("available");

    const query: Record<string, unknown> = {};
    if (category && category !== "all") query.category = category;
    if (featured === "true") query.featured = true;
    if (available === "true") query.available = true;

    const artworks = await Artwork.find(query).sort({ createdAt: -1 }).lean();
    return Response.json(artworks);
  } catch (err) {
    console.error("GET /api/artworks failed:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to fetch artworks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const artwork = await Artwork.create(body);
  return Response.json(artwork, { status: 201 });
}
