import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import Order from "@/models/Order";
import Link from "next/link";

async function getStats() {
  try {
    await connectDB();
    const [totalArtworks, availableArtworks, totalOrders, pendingOrders, recentOrders] =
      await Promise.all([
        Artwork.countDocuments(),
        Artwork.countDocuments({ available: true }),
        Order.countDocuments(),
        Order.countDocuments({ status: "pending" }),
        Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      ]);
    return {
      totalArtworks,
      availableArtworks,
      totalOrders,
      pendingOrders,
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
    };
  } catch {
    return { totalArtworks: 0, availableArtworks: 0, totalOrders: 0, pendingOrders: 0, recentOrders: [] };
  }
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500",
  confirmed: "bg-blue-500/10 text-blue-400",
  completed: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Total Artworks", value: stats.totalArtworks, sub: `${stats.availableArtworks} available`, href: "/admin/artworks" },
    { label: "Total Orders", value: stats.totalOrders, sub: `${stats.pendingOrders} pending`, href: "/admin/orders" },
    { label: "Sold Works", value: stats.totalArtworks - stats.availableArtworks, sub: "pieces found homes", href: "/admin/artworks" },
  ];

  return (
    <div className="p-8">
      <div className="mb-10">
        <p
          className="text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-1"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Overview
        </p>
        <h1
          className="text-3xl font-light text-[#FDFAF6]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Dashboard
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 hover:border-[#C9A96E]/40 transition-all group"
          >
            <p
              className="text-xs tracking-[0.15em] uppercase text-[#6A6460] mb-3"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {card.label}
            </p>
            <p
              className="text-5xl font-light text-[#FDFAF6] group-hover:text-[#C9A96E] transition-colors mb-2"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              {card.value}
            </p>
            <p
              className="text-xs text-[#4A4540]"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {card.sub}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-6">
          <div className="flex items-center justify-between mb-6">
            <p
              className="text-sm tracking-[0.1em] uppercase text-[#8A8480]"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Recent Orders
            </p>
            <Link
              href="/admin/orders"
              className="text-xs text-[#C9A96E] hover:opacity-70 transition-opacity"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              View all →
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p
              className="text-sm text-[#4A4540] py-8 text-center"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              No orders yet
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-[#2A2A2A]">
              {stats.recentOrders.map((order: {
                _id: string; customerName: string; artworkTitle: string;
                artworkPrice: number; status: string; createdAt: string;
              }) => (
                <div key={order._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm text-[#FDFAF6]"
                      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                    >
                      {order.customerName}
                    </p>
                    <p
                      className="text-xs text-[#4A4540]"
                      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                    >
                      {order.artworkTitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm text-[#C9A96E]"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                    >
                      ${order.artworkPrice}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 ${STATUS_COLORS[order.status] || ""}`}
                      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-6">
          <p
            className="text-sm tracking-[0.1em] uppercase text-[#8A8480] mb-6"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            Quick Actions
          </p>
          <div className="flex flex-col gap-3">
            {[
              { href: "/admin/artworks/new", label: "Add New Artwork", desc: "Upload a new calligraphy piece" },
              { href: "/admin/models", label: "Upload 3D Model", desc: "Add a .glb file for 3D display" },
              { href: "/admin/orders", label: "Manage Orders", desc: "View and update order statuses" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between p-4 border border-[#2A2A2A] hover:border-[#C9A96E]/40 hover:bg-[#1E1E1E] transition-all group"
              >
                <div>
                  <p
                    className="text-sm text-[#FDFAF6] group-hover:text-[#C9A96E] transition-colors"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    {action.label}
                  </p>
                  <p
                    className="text-xs text-[#4A4540]"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    {action.desc}
                  </p>
                </div>
                <span className="text-[#C9A96E]/40 group-hover:text-[#C9A96E] transition-colors text-xl">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
