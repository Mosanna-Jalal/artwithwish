import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  artworkId: mongoose.Types.ObjectId;
  artworkTitle: string;
  artworkPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    artworkId: { type: Schema.Types.ObjectId, ref: "Artwork", required: true },
    artworkTitle: { type: String, required: true },
    artworkPrice: { type: Number, required: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    customerPhone: { type: String, trim: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
