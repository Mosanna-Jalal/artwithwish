import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import Order from "@/models/Order";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const [totalArtworks, availableArtworks, totalOrders, pendingOrders, recentOrders] =
    await Promise.all([
      Artwork.countDocuments(),
      Artwork.countDocuments({ available: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);

  return Response.json({
    totalArtworks,
    availableArtworks,
    totalOrders,
    pendingOrders,
    recentOrders,
  });
}
