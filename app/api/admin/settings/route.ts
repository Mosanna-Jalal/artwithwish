import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getAdminSession } from "@/lib/auth";

const ALLOWED = ["amiri", "aref", "reem", "brush"];

export async function GET() {
  try {
    await connectDB();
    const doc = await Settings.findOne({ key: "site" }).lean();
    return Response.json({ headingFont: doc?.headingFont || "brush" });
  } catch {
    return Response.json({ headingFont: "brush" });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await getAdminSession()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { headingFont } = await req.json();
    if (!ALLOWED.includes(headingFont))
      return Response.json({ error: "Invalid font" }, { status: 400 });

    await connectDB();
    await Settings.findOneAndUpdate(
      { key: "site" },
      { key: "site", headingFont },
      { upsert: true, new: true }
    );
    return Response.json({ ok: true, headingFont });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to save" },
      { status: 500 }
    );
  }
}
