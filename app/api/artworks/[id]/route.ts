import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { getAdminSession } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await connectDB();
  const artwork = await Artwork.findById(id);
  if (!artwork) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(artwork);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const artwork = await Artwork.findByIdAndUpdate(id, body, { new: true });
  if (!artwork) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(artwork);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  await Artwork.findByIdAndDelete(id);
  return Response.json({ success: true });
}
