import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json();
  if (!url) return Response.json({ error: "No URL provided" }, { status: 400 });

  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: "artwithwish/artworks",
      resource_type: "image",
    });
    return Response.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    return Response.json(
      { error: "Failed to upload image. Make sure the URL is a direct image link." },
      { status: 400 }
    );
  }
}
