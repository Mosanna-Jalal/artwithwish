import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const folder = (formData.get("folder") as string) || "artwithwish/artworks";
  const resourceType = (formData.get("resourceType") as "image" | "raw") || "image";

  if (!files.length) return Response.json({ error: "No files provided" }, { status: 400 });

  const results = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      return uploadToCloudinary(buffer, folder, resourceType);
    })
  );

  return Response.json({ urls: results.map((r) => r.url), publicIds: results.map((r) => r.publicId) });
}
