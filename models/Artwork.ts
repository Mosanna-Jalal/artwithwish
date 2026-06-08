import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArtwork extends Document {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  dimensions?: string;
  medium?: string;
  available: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArtworkSchema = new Schema<IArtwork>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    category: { type: String, required: true, default: "Calligraphy" },
    dimensions: { type: String },
    medium: { type: String },
    available: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Artwork: Model<IArtwork> =
  mongoose.models.Artwork || mongoose.model<IArtwork>("Artwork", ArtworkSchema);

export default Artwork;
