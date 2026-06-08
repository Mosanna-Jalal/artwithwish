import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return Response.json(orders);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const order = await Order.create(body);
  return Response.json(order, { status: 201 });
}
