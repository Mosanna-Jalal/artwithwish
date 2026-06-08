import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import AdminOrderActions from "@/components/admin/AdminOrderActions";

async function getOrders() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(orders));
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-8">
      <div className="mb-8">
        <p
          className="text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-1"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Manage
        </p>
        <h1
          className="text-3xl font-light text-[#FDFAF6]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-16 text-center">
          <p
            className="text-[#4A4540] text-sm"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            No orders yet
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order: {
            _id: string; customerName: string; customerEmail: string;
            customerPhone?: string; artworkTitle: string; artworkPrice: number;
            message?: string; status: string; createdAt: string;
          }) => (
            <div
              key={order._id}
              className="bg-[#1A1A1A] border border-[#2A2A2A] p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-xs px-2.5 py-0.5 border ${STATUS_COLORS[order.status] || ""}`}
                      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                    >
                      {order.status}
                    </span>
                    <span
                      className="text-xs text-[#4A4540]"
                      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                    >
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p
                        className="text-xs text-[#4A4540] mb-0.5"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                      >
                        Customer
                      </p>
                      <p
                        className="text-sm text-[#FDFAF6]"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                      >
                        {order.customerName}
                      </p>
                      <p
                        className="text-xs text-[#8A8480]"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                      >
                        {order.customerEmail}
                      </p>
                      {order.customerPhone && (
                        <p
                          className="text-xs text-[#8A8480]"
                          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                        >
                          {order.customerPhone}
                        </p>
                      )}
                    </div>
                    <div>
                      <p
                        className="text-xs text-[#4A4540] mb-0.5"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                      >
                        Artwork
                      </p>
                      <p
                        className="text-sm text-[#FDFAF6]"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                      >
                        {order.artworkTitle}
                      </p>
                      <p
                        className="text-sm text-[#C9A96E]"
                        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                      >
                        ${order.artworkPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {order.message && (
                    <div className="border-l-2 border-[#2A2A2A] pl-3">
                      <p
                        className="text-xs text-[#6A6460] italic"
                        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                      >
                        "{order.message}"
                      </p>
                    </div>
                  )}
                </div>

                <AdminOrderActions id={order._id} currentStatus={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
